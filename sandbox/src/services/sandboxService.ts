import Docker from 'dockerode';
import { VM } from 'vm2';
import ivm from 'isolated-vm';
import { Worker } from 'worker_threads';
import { spawn } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import * as temp from 'temp';
import { logger } from '../config/logger';
import { 
  ExecutionRequest, 
  ExecutionResult, 
  SandboxEnvironment, 
  SecurityLevel,
  ExecutionLimits,
  SupportedLanguage 
} from '../types/sandbox';

export class SandboxService {
  private docker: Docker;
  private activeContainers: Map<string, any> = new Map();
  private activeWorkers: Map<string, Worker> = new Map();
  private executionQueue: Map<string, any> = new Map();

  constructor() {
    this.docker = new Docker();
    this.initializeDockerImages();
    this.setupCleanupTimer();
  }

  async executeCode(request: ExecutionRequest): Promise<ExecutionResult> {
    const executionId = uuidv4();
    const startTime = Date.now();

    try {
      logger.info('Starting code execution', {
        executionId,
        language: request.language,
        securityLevel: request.securityLevel || 'high'
      });

      // Validate and sanitize request
      await this.validateRequest(request);

      // Choose execution method based on security level
      let result: ExecutionResult;

      switch (request.securityLevel || 'high') {
        case 'maximum':
          result = await this.executeInDocker(request, executionId);
          break;
        case 'high':
          result = await this.executeInIsolatedVM(request, executionId);
          break;
        case 'medium':
          result = await this.executeInVM2(request, executionId);
          break;
        case 'low':
          result = await this.executeInWorker(request, executionId);
          break;
        default:
          throw new Error('Invalid security level');
      }

      const duration = Date.now() - startTime;
      result.metadata.duration = duration;
      result.metadata.executionId = executionId;

      logger.info('Code execution completed', {
        executionId,
        duration,
        success: result.success
      });

      return result;

    } catch (error) {
      logger.error('Code execution failed', {
        executionId,
        error: error.message,
        stack: error.stack
      });

      return {
        success: false,
        output: '',
        error: error.message,
        metadata: {
          executionId,
          duration: Date.now() - startTime,
          language: request.language,
          securityLevel: request.securityLevel || 'high',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  private async executeInDocker(request: ExecutionRequest, executionId: string): Promise<ExecutionResult> {
    const containerName = `gamecrfat-sandbox-${executionId}`;
    let container: any = null;

    try {
      // Create temporary directory for code
      const tempDir = temp.mkdirSync('gamecrfat-execution');
      const codePath = path.join(tempDir, this.getCodeFileName(request.language));
      
      // Write code to file
      await fs.writeFile(codePath, request.code);

      // Select appropriate Docker image
      const imageName = this.getDockerImage(request.language);

      // Create container with security restrictions
      container = await this.docker.createContainer({
        Image: imageName,
        name: containerName,
        WorkingDir: '/sandbox',
        Cmd: this.getExecutionCommand(request.language, 'main' + this.getFileExtension(request.language)),
        Env: this.getEnvironmentVariables(request),
        HostConfig: {
          Memory: request.limits?.memory || 128 * 1024 * 1024, // 128MB default
          CpuQuota: request.limits?.cpu || 50000, // 50% CPU
          NetworkMode: 'none', // No network access
          ReadonlyRootfs: true,
          SecurityOpt: ['no-new-privileges'],
          Ulimits: [
            { Name: 'nofile', Soft: 64, Hard: 64 },
            { Name: 'nproc', Soft: 16, Hard: 16 }
          ],
          Binds: [`${tempDir}:/sandbox:ro`]
        },
        AttachStdout: true,
        AttachStderr: true
      });

      this.activeContainers.set(executionId, container);

      // Start container
      await container.start();

      // Set execution timeout
      const timeout = request.limits?.timeout || 10000; // 10 seconds default
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Execution timeout')), timeout);
      });

      // Get execution output
      const stream = await container.attach({
        stream: true,
        stdout: true,
        stderr: true
      });

      const outputPromise = this.streamToString(stream);

      // Race between execution and timeout
      const output = await Promise.race([outputPromise, timeoutPromise]);

      // Wait for container to finish
      await container.wait();

      // Get container stats
      const stats = await container.stats({ stream: false });

      // Cleanup
      await container.remove();
      this.activeContainers.delete(executionId);
      await fs.remove(tempDir);

      return {
        success: true,
        output: output as string,
        error: '',
        metadata: {
          executionId,
          language: request.language,
          securityLevel: 'maximum',
          timestamp: new Date().toISOString(),
          resourceUsage: {
            memory: stats.memory_stats?.usage || 0,
            cpu: stats.cpu_stats?.cpu_usage?.total_usage || 0
          }
        }
      };

    } catch (error) {
      // Cleanup on error
      if (container) {
        try {
          await container.kill();
          await container.remove();
        } catch (cleanupError) {
          logger.error('Container cleanup failed', { executionId, error: cleanupError.message });
        }
      }
      this.activeContainers.delete(executionId);
      throw error;
    }
  }

  private async executeInIsolatedVM(request: ExecutionRequest, executionId: string): Promise<ExecutionResult> {
    const isolate = new ivm.Isolate({ 
      memoryLimit: request.limits?.memory || 128,
      inspector: false 
    });

    try {
      const context = await isolate.createContext();
      const jail = context.global;

      // Set up restricted environment
      await jail.set('log', function(...args: any[]) {
        console.log(...args);
      });

      // Add game-specific APIs if needed
      if (request.gameAPIs) {
        await this.setupGameAPIs(jail, request.gameAPIs);
      }

      // Compile and run code
      const script = await isolate.compileScript(request.code);
      
      const timeout = request.limits?.timeout || 10000;
      const result = await script.run(context, { timeout });

      return {
        success: true,
        output: String(result),
        error: '',
        metadata: {
          executionId,
          language: request.language,
          securityLevel: 'high',
          timestamp: new Date().toISOString(),
          resourceUsage: {
            memory: isolate.getHeapStatistics().used_heap_size,
            cpu: 0 // Not available in isolated-vm
          }
        }
      };

    } catch (error) {
      return {
        success: false,
        output: '',
        error: error.message,
        metadata: {
          executionId,
          language: request.language,
          securityLevel: 'high',
          timestamp: new Date().toISOString()
        }
      };
    } finally {
      isolate.dispose();
    }
  }

  private async executeInVM2(request: ExecutionRequest, executionId: string): Promise<ExecutionResult> {
    try {
      const vm = new VM({
        timeout: request.limits?.timeout || 10000,
        sandbox: {
          console: {
            log: (...args: any[]) => console.log(...args)
          },
          // Add restricted game APIs
          ...(request.gameAPIs ? this.createRestrictedGameAPIs(request.gameAPIs) : {})
        },
        eval: false,
        wasm: false,
        fixAsync: true
      });

      const result = vm.run(request.code);

      return {
        success: true,
        output: String(result),
        error: '',
        metadata: {
          executionId,
          language: request.language,
          securityLevel: 'medium',
          timestamp: new Date().toISOString(),
          resourceUsage: {
            memory: process.memoryUsage().heapUsed,
            cpu: 0
          }
        }
      };

    } catch (error) {
      return {
        success: false,
        output: '',
        error: error.message,
        metadata: {
          executionId,
          language: request.language,
          securityLevel: 'medium',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  private async executeInWorker(request: ExecutionRequest, executionId: string): Promise<ExecutionResult> {
    return new Promise((resolve) => {
      const workerData = {
        code: request.code,
        language: request.language,
        limits: request.limits,
        gameAPIs: request.gameAPIs
      };

      const worker = new Worker(path.join(__dirname, '../workers/codeWorker.js'), {
        workerData
      });

      this.activeWorkers.set(executionId, worker);

      const timeout = request.limits?.timeout || 10000;
      const timeoutId = setTimeout(() => {
        worker.terminate();
        this.activeWorkers.delete(executionId);
        resolve({
          success: false,
          output: '',
          error: 'Execution timeout',
          metadata: {
            executionId,
            language: request.language,
            securityLevel: 'low',
            timestamp: new Date().toISOString()
          }
        });
      }, timeout);

      worker.on('message', (result) => {
        clearTimeout(timeoutId);
        this.activeWorkers.delete(executionId);
        resolve({
          ...result,
          metadata: {
            executionId,
            language: request.language,
            securityLevel: 'low',
            timestamp: new Date().toISOString(),
            ...result.metadata
          }
        });
      });

      worker.on('error', (error) => {
        clearTimeout(timeoutId);
        this.activeWorkers.delete(executionId);
        resolve({
          success: false,
          output: '',
          error: error.message,
          metadata: {
            executionId,
            language: request.language,
            securityLevel: 'low',
            timestamp: new Date().toISOString()
          }
        });
      });
    });
  }

  private async validateRequest(request: ExecutionRequest): Promise<void> {
    // Check code length
    if (request.code.length > 100000) { // 100KB limit
      throw new Error('Code size exceeds maximum limit');
    }

    // Check for malicious patterns
    const dangerousPatterns = [
      /require\s*\(\s*['"]fs['"]/, // File system access
      /require\s*\(\s*['"]child_process['"]/, // Process spawning
      /require\s*\(\s*['"]net['"]/, // Network access
      /eval\s*\(/, // Dynamic code evaluation
      /Function\s*\(/, // Function constructor
      /import\s+.*\s+from/, // ES6 imports (some restrictions)
      /process\./, // Process object access
      /global\./, // Global object access
      /__dirname|__filename/, // File path access
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(request.code)) {
        logger.security('Dangerous code pattern detected', {
          pattern: pattern.toString(),
          code: request.code.substring(0, 200) + '...'
        });
        throw new Error('Code contains potentially dangerous patterns');
      }
    }

    // Language-specific validation
    await this.validateLanguageSpecific(request);
  }

  private async validateLanguageSpecific(request: ExecutionRequest): Promise<void> {
    switch (request.language) {
      case 'javascript':
        // Additional JavaScript-specific validation
        break;
      case 'python':
        // Python-specific validation
        const pythonDangerous = [
          /import\s+os/, /import\s+sys/, /import\s+subprocess/,
          /__import__/, /exec\s*\(/, /compile\s*\(/
        ];
        for (const pattern of pythonDangerous) {
          if (pattern.test(request.code)) {
            throw new Error('Python code contains dangerous imports or functions');
          }
        }
        break;
      // Add more language-specific validations
    }
  }

  private getDockerImage(language: SupportedLanguage): string {
    const images = {
      javascript: 'gamecrfat/sandbox-node:latest',
      python: 'gamecrfat/sandbox-python:latest',
      lua: 'gamecrfat/sandbox-lua:latest',
      csharp: 'gamecrfat/sandbox-dotnet:latest'
    };
    return images[language] || 'gamecrfat/sandbox-node:latest';
  }

  private getCodeFileName(language: SupportedLanguage): string {
    const extensions = {
      javascript: 'main.js',
      python: 'main.py',
      lua: 'main.lua',
      csharp: 'Program.cs'
    };
    return extensions[language] || 'main.txt';
  }

  private getFileExtension(language: SupportedLanguage): string {
    const extensions = {
      javascript: '.js',
      python: '.py',
      lua: '.lua',
      csharp: '.cs'
    };
    return extensions[language] || '.txt';
  }

  private getExecutionCommand(language: SupportedLanguage, filename: string): string[] {
    const commands = {
      javascript: ['node', filename],
      python: ['python3', filename],
      lua: ['lua', filename],
      csharp: ['dotnet', 'run']
    };
    return commands[language] || ['cat', filename];
  }

  private getEnvironmentVariables(request: ExecutionRequest): string[] {
    const baseEnv = [
      'NODE_ENV=sandbox',
      'PYTHONPATH=/sandbox',
      'HOME=/tmp'
    ];

    if (request.environment?.variables) {
      Object.entries(request.environment.variables).forEach(([key, value]) => {
        // Sanitize environment variables
        if (this.isValidEnvVar(key, value)) {
          baseEnv.push(`${key}=${value}`);
        }
      });
    }

    return baseEnv;
  }

  private isValidEnvVar(key: string, value: string): boolean {
    // Prevent sensitive environment variable injection
    const forbidden = ['PATH', 'LD_LIBRARY_PATH', 'NODE_PATH', 'PYTHONPATH'];
    return !forbidden.includes(key) && 
           typeof value === 'string' && 
           value.length < 1000;
  }

  private async setupGameAPIs(jail: any, gameAPIs: string[]): Promise<void> {
    // Add safe game APIs to the isolated context
    for (const api of gameAPIs) {
      switch (api) {
        case 'canvas':
          await jail.set('createCanvas', this.createSafeCanvasAPI());
          break;
        case 'audio':
          await jail.set('createAudio', this.createSafeAudioAPI());
          break;
        // Add more game APIs as needed
      }
    }
  }

  private createRestrictedGameAPIs(gameAPIs: string[]): any {
    const apis: any = {};
    
    for (const api of gameAPIs) {
      switch (api) {
        case 'canvas':
          apis.createCanvas = this.createSafeCanvasAPI();
          break;
        case 'audio':
          apis.createAudio = this.createSafeAudioAPI();
          break;
      }
    }
    
    return apis;
  }

  private createSafeCanvasAPI(): Function {
    return function(width: number = 800, height: number = 600) {
      // Return a safe canvas-like object with limited functionality
      return {
        width: Math.min(width, 1920),
        height: Math.min(height, 1080),
        getContext: () => ({
          fillRect: () => {},
          strokeRect: () => {},
          clearRect: () => {},
          // Add more safe canvas methods
        })
      };
    };
  }

  private createSafeAudioAPI(): Function {
    return function() {
      // Return a safe audio-like object with limited functionality
      return {
        createOscillator: () => ({
          frequency: { value: 440 },
          start: () => {},
          stop: () => {},
          connect: () => {}
        }),
        createGain: () => ({
          gain: { value: 1 },
          connect: () => {}
        })
      };
    };
  }

  private async streamToString(stream: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      
      stream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });
      
      stream.on('end', () => {
        const output = Buffer.concat(chunks).toString('utf8');
        resolve(output);
      });
      
      stream.on('error', (error: Error) => {
        reject(error);
      });
    });
  }

  private async initializeDockerImages(): Promise<void> {
    try {
      // Check if required Docker images exist, build them if needed
      const requiredImages = [
        'gamecrfat/sandbox-node:latest',
        'gamecrfat/sandbox-python:latest',
        'gamecrfat/sandbox-lua:latest',
        'gamecrfat/sandbox-dotnet:latest'
      ];

      for (const image of requiredImages) {
        try {
          await this.docker.getImage(image).inspect();
          logger.info(`Docker image ${image} is available`);
        } catch (error) {
          logger.warn(`Docker image ${image} not found, will be built on demand`);
        }
      }
    } catch (error) {
      logger.error('Failed to initialize Docker images', error);
    }
  }

  private setupCleanupTimer(): void {
    // Clean up abandoned containers and workers every 5 minutes
    setInterval(() => {
      this.cleanupResources();
    }, 5 * 60 * 1000);
  }

  private async cleanupResources(): Promise<void> {
    // Cleanup abandoned containers
    for (const [executionId, container] of this.activeContainers) {
      try {
        const info = await container.inspect();
        if (!info.State.Running) {
          await container.remove();
          this.activeContainers.delete(executionId);
        }
      } catch (error) {
        this.activeContainers.delete(executionId);
      }
    }

    // Cleanup abandoned workers
    for (const [executionId, worker] of this.activeWorkers) {
      try {
        await worker.terminate();
        this.activeWorkers.delete(executionId);
      } catch (error) {
        this.activeWorkers.delete(executionId);
      }
    }

    logger.info('Resource cleanup completed', {
      activeContainers: this.activeContainers.size,
      activeWorkers: this.activeWorkers.size
    });
  }

  async getExecutionStatus(executionId: string): Promise<any> {
    return {
      id: executionId,
      containerActive: this.activeContainers.has(executionId),
      workerActive: this.activeWorkers.has(executionId),
      queuedExecution: this.executionQueue.has(executionId)
    };
  }

  async terminateExecution(executionId: string): Promise<boolean> {
    let terminated = false;

    // Terminate container if exists
    if (this.activeContainers.has(executionId)) {
      try {
        const container = this.activeContainers.get(executionId);
        await container.kill();
        await container.remove();
        this.activeContainers.delete(executionId);
        terminated = true;
      } catch (error) {
        logger.error('Failed to terminate container', { executionId, error });
      }
    }

    // Terminate worker if exists
    if (this.activeWorkers.has(executionId)) {
      try {
        const worker = this.activeWorkers.get(executionId);
        await worker.terminate();
        this.activeWorkers.delete(executionId);
        terminated = true;
      } catch (error) {
        logger.error('Failed to terminate worker', { executionId, error });
      }
    }

    return terminated;
  }
}

export default SandboxService;