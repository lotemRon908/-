import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../config/logger';
import { CodeGenerationRequest, CodeGenerationResponse, GameFramework, ProgrammingLanguage } from '../types/codeGeneration';
import { analyzeCode, optimizeCode, validateSyntax } from '../utils/codeAnalysis';
import { generateGameTemplate } from '../utils/gameTemplates';

class CodeGenerationService {
  private openai: OpenAI;
  private anthropic: Anthropic;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }

  async generateGameCode(request: CodeGenerationRequest): Promise<CodeGenerationResponse> {
    try {
      logger.info('Starting code generation', { 
        language: request.language,
        framework: request.framework,
        gameType: request.gameType 
      });

      const startTime = Date.now();

      // Generate base template
      const template = await this.generateBaseTemplate(request);
      
      // Generate specific components
      const components = await this.generateGameComponents(request);
      
      // Generate utility functions
      const utilities = await this.generateUtilities(request);
      
      // Generate game logic
      const gameLogic = await this.generateGameLogic(request);
      
      // Generate AI behavior (if needed)
      const aiLogic = request.features?.includes('ai') 
        ? await this.generateAILogic(request) 
        : null;

      // Combine all code parts
      const fullCode = this.combineCodeParts({
        template,
        components,
        utilities,
        gameLogic,
        aiLogic
      });

      // Optimize and validate code
      const optimizedCode = await optimizeCode(fullCode, request.language);
      const validationResult = await validateSyntax(optimizedCode, request.language);

      const endTime = Date.now();
      const duration = endTime - startTime;

      logger.info('Code generation completed', { 
        duration,
        codeLength: optimizedCode.length,
        isValid: validationResult.isValid
      });

      return {
        success: true,
        code: optimizedCode,
        language: request.language,
        framework: request.framework,
        metadata: {
          generatedAt: new Date().toISOString(),
          duration,
          codeLength: optimizedCode.length,
          linesOfCode: optimizedCode.split('\n').length,
          complexity: await this.calculateComplexity(optimizedCode),
          validation: validationResult,
          features: request.features || [],
          aiModel: 'gpt-4-turbo-preview'
        },
        files: this.generateProjectFiles(optimizedCode, request),
        documentation: await this.generateDocumentation(optimizedCode, request)
      };

    } catch (error) {
      logger.error('Code generation failed:', error);
      throw new Error(`Code generation failed: ${error.message}`);
    }
  }

  private async generateBaseTemplate(request: CodeGenerationRequest): Promise<string> {
    const prompt = this.buildTemplatePrompt(request);
    
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are an expert game developer. Generate clean, well-structured, and optimized game code templates."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('Template generation failed:', error);
      return generateGameTemplate(request.gameType, request.language, request.framework);
    }
  }

  private async generateGameComponents(request: CodeGenerationRequest): Promise<string> {
    const prompt = `Generate game components for a ${request.gameType} game in ${request.language} using ${request.framework}.

Requirements:
- Create Player class/component
- Create Game Object system
- Create Input handling
- Create Physics system (if needed)
- Create Audio system
- Create UI components
- Follow ${request.framework} best practices
- Include proper error handling
- Add performance optimizations

Game Description: ${request.description}
Target Platform: ${request.platform || 'web'}
Features: ${request.features?.join(', ') || 'basic gameplay'}`;

    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 4000,
        temperature: 0.2,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      });

      return response.content[0].type === 'text' ? response.content[0].text : '';
    } catch (error) {
      logger.error('Component generation failed:', error);
      return this.generateFallbackComponents(request);
    }
  }

  private async generateGameLogic(request: CodeGenerationRequest): Promise<string> {
    const prompt = `Generate the core game logic for a ${request.gameType} game.

Description: ${request.description}
Language: ${request.language}
Framework: ${request.framework}

Required game logic:
- Game initialization
- Main game loop
- Win/lose conditions
- Score system
- Level progression
- Save/load functionality
- Pause/resume functionality
- Game state management

Make it modular, well-commented, and efficient.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are an expert game logic programmer. Write efficient, bug-free game logic code."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 3000
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('Game logic generation failed:', error);
      return this.generateFallbackGameLogic(request);
    }
  }

  private async generateAILogic(request: CodeGenerationRequest): Promise<string> {
    const prompt = `Generate AI behavior system for a ${request.gameType} game.

Requirements:
- NPC AI behavior
- Enemy AI patterns
- Pathfinding (if applicable)
- Decision making system
- Adaptive difficulty
- State machines for AI entities

Language: ${request.language}
Framework: ${request.framework}
Game Description: ${request.description}`;

    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 3000,
        temperature: 0.3,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      });

      return response.content[0].type === 'text' ? response.content[0].text : '';
    } catch (error) {
      logger.error('AI logic generation failed:', error);
      return this.generateFallbackAILogic(request);
    }
  }

  private async generateUtilities(request: CodeGenerationRequest): Promise<string> {
    const commonUtilities = [
      'Math utilities (vector math, collision detection)',
      'String utilities',
      'Array/Collection utilities',
      'Event system',
      'Resource loader',
      'Debug utilities',
      'Performance monitoring',
      'Local storage helpers'
    ];

    const prompt = `Generate utility functions for a ${request.gameType} game in ${request.language}.

Include these utilities:
${commonUtilities.map(util => `- ${util}`).join('\n')}

Framework: ${request.framework}
Platform: ${request.platform || 'web'}

Make them reusable, well-documented, and optimized.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a utilities library developer. Create efficient, reusable utility functions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 3000
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('Utilities generation failed:', error);
      return this.generateFallbackUtilities(request);
    }
  }

  private buildTemplatePrompt(request: CodeGenerationRequest): string {
    return `Create a complete game template for a ${request.gameType} game.

Requirements:
- Language: ${request.language}
- Framework: ${request.framework}
- Platform: ${request.platform || 'web'}
- Description: ${request.description}
- Features: ${request.features?.join(', ') || 'basic gameplay'}

Template should include:
1. Project structure
2. Main entry point
3. Game initialization
4. Asset loading system
5. Basic game loop
6. Event handling setup
7. Configuration system
8. Error handling
9. Performance monitoring hooks
10. Build configuration

Follow industry best practices and make it production-ready.`;
  }

  private combineCodeParts(parts: {
    template: string;
    components: string;
    utilities: string;
    gameLogic: string;
    aiLogic: string | null;
  }): string {
    const sections = [
      '// Generated by GameCraft Pro Ultimate AI',
      '// This code is automatically generated and optimized',
      '',
      '// =================== MAIN TEMPLATE ===================',
      parts.template,
      '',
      '// =================== GAME COMPONENTS ===================',
      parts.components,
      '',
      '// =================== UTILITY FUNCTIONS ===================',
      parts.utilities,
      '',
      '// =================== GAME LOGIC ===================',
      parts.gameLogic
    ];

    if (parts.aiLogic) {
      sections.push('', '// =================== AI LOGIC ===================', parts.aiLogic);
    }

    return sections.join('\n');
  }

  private generateProjectFiles(code: string, request: CodeGenerationRequest): any[] {
    const files = [];
    
    // Main game file
    files.push({
      name: this.getMainFileName(request.language),
      content: code,
      type: 'main'
    });

    // Configuration file
    files.push({
      name: 'config.json',
      content: JSON.stringify(this.generateConfig(request), null, 2),
      type: 'config'
    });

    // Package/Project file
    if (request.language === 'javascript') {
      files.push({
        name: 'package.json',
        content: JSON.stringify(this.generatePackageJson(request), null, 2),
        type: 'package'
      });
    }

    // README file
    files.push({
      name: 'README.md',
      content: this.generateREADME(request),
      type: 'documentation'
    });

    return files;
  }

  private async generateDocumentation(code: string, request: CodeGenerationRequest): Promise<string> {
    const prompt = `Generate comprehensive documentation for this game code:

\`\`\`${request.language}
${code.substring(0, 2000)}...
\`\`\`

Include:
1. Game overview
2. How to run/build
3. Code structure explanation
4. API documentation
5. Configuration options
6. Troubleshooting guide
7. Development tips

Format in Markdown.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a technical writer creating clear, comprehensive game development documentation."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('Documentation generation failed:', error);
      return this.generateFallbackDocumentation(request);
    }
  }

  private async calculateComplexity(code: string): Promise<number> {
    // Simple complexity calculation based on various metrics
    const lines = code.split('\n').length;
    const functions = (code.match(/function|def|class/g) || []).length;
    const conditionals = (code.match(/if|else|switch|case|while|for/g) || []).length;
    const complexity = Math.round((lines * 0.1) + (functions * 2) + (conditionals * 1.5));
    return Math.min(complexity, 100); // Cap at 100
  }

  // Fallback methods for when AI services fail
  private generateFallbackComponents(request: CodeGenerationRequest): string {
    return generateGameTemplate(request.gameType, request.language, request.framework);
  }

  private generateFallbackGameLogic(request: CodeGenerationRequest): string {
    return `// Basic game logic for ${request.gameType}\n// TODO: Implement specific game mechanics`;
  }

  private generateFallbackAILogic(request: CodeGenerationRequest): string {
    return `// AI logic for ${request.gameType}\n// TODO: Implement AI behavior`;
  }

  private generateFallbackUtilities(request: CodeGenerationRequest): string {
    return `// Utility functions for ${request.language}\n// TODO: Implement utility functions`;
  }

  private generateFallbackDocumentation(request: CodeGenerationRequest): string {
    return `# ${request.gameType} Game\n\nGenerated by GameCraft Pro Ultimate\n\n## Setup\n\nTODO: Add setup instructions`;
  }

  private getMainFileName(language: ProgrammingLanguage): string {
    const extensions = {
      javascript: 'main.js',
      typescript: 'main.ts',
      python: 'main.py',
      csharp: 'Program.cs',
      lua: 'main.lua'
    };
    return extensions[language] || 'main.txt';
  }

  private generateConfig(request: CodeGenerationRequest): any {
    return {
      gameTitle: request.description.split(' ').slice(0, 3).join(' '),
      language: request.language,
      framework: request.framework,
      platform: request.platform,
      features: request.features,
      generatedAt: new Date().toISOString()
    };
  }

  private generatePackageJson(request: CodeGenerationRequest): any {
    return {
      name: request.description.toLowerCase().replace(/\s+/g, '-'),
      version: "1.0.0",
      description: request.description,
      main: this.getMainFileName(request.language),
      scripts: {
        start: "node main.js",
        dev: "nodemon main.js"
      },
      dependencies: {},
      devDependencies: {}
    };
  }

  private generateREADME(request: CodeGenerationRequest): string {
    return `# ${request.description}

A ${request.gameType} game generated by GameCraft Pro Ultimate.

## Features
${(request.features || []).map(feature => `- ${feature}`).join('\n')}

## Technology Stack
- Language: ${request.language}
- Framework: ${request.framework}
- Platform: ${request.platform || 'web'}

## Getting Started

1. Install dependencies
2. Run the game
3. Enjoy!

Generated with ❤️ by GameCraft Pro Ultimate AI`;
  }
}

export default CodeGenerationService;