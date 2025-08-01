import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';

// Configuration
import { logger } from './config/logger';
import { connectRedis } from './config/redis';
import { setupJobQueues } from './config/queues';

// Routes
import codeGenerationRoutes from './routes/codeGeneration';
import assetCreationRoutes from './routes/assetCreation';
import contentValidationRoutes from './routes/contentValidation';
import musicGenerationRoutes from './routes/musicGeneration';
import dialogueGenerationRoutes from './routes/dialogueGeneration';
import gameOptimizationRoutes from './routes/gameOptimization';
import legalAnalysisRoutes from './routes/legalAnalysis';

// Middleware
import { errorHandler } from './middleware/errorHandler';
import { validateApiKey } from './middleware/auth';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
  }
});

const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.BACKEND_URL || 'http://localhost:3001'
  ],
  credentials: true
}));

// Rate limiting for AI services
const aiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute for AI services
  message: {
    error: 'Too many AI requests, please wait before trying again.',
    code: 'AI_RATE_LIMIT_EXCEEDED'
  }
});

app.use('/api/ai', aiRateLimit);

// General middleware
app.use(compression());
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API key validation for all AI routes
app.use('/api/ai', validateApiKey);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'GameCraft AI Services',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// AI Service Routes
app.use('/api/ai/code', codeGenerationRoutes);
app.use('/api/ai/assets', assetCreationRoutes);
app.use('/api/ai/validation', contentValidationRoutes);
app.use('/api/ai/music', musicGenerationRoutes);
app.use('/api/ai/dialogue', dialogueGenerationRoutes);
app.use('/api/ai/optimization', gameOptimizationRoutes);
app.use('/api/ai/legal', legalAnalysisRoutes);

// Socket.IO for real-time AI progress updates
io.on('connection', (socket) => {
  logger.info(`AI Client connected: ${socket.id}`);

  socket.on('join-project', (projectId: string) => {
    socket.join(`ai-project-${projectId}`);
    logger.info(`AI Client ${socket.id} joined project ${projectId}`);
  });

  socket.on('ai-request', (data) => {
    logger.info(`AI Request from ${socket.id}:`, data.type);
    // Process AI request and emit progress updates
    socket.to(`ai-project-${data.projectId}`).emit('ai-progress', {
      requestId: data.requestId,
      status: 'processing',
      progress: 0,
      message: 'Starting AI processing...'
    });
  });

  socket.on('disconnect', () => {
    logger.info(`AI Client disconnected: ${socket.id}`);
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'AI Service endpoint not found',
    path: req.originalUrl,
    availableServices: [
      '/api/ai/code - Code generation services',
      '/api/ai/assets - Asset creation services',
      '/api/ai/validation - Content validation services',
      '/api/ai/music - Music generation services',
      '/api/ai/dialogue - Dialogue generation services',
      '/api/ai/optimization - Game optimization services',
      '/api/ai/legal - Legal analysis services'
    ]
  });
});

// Error handling
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing AI services server');
  server.close(() => {
    logger.info('AI services server closed');
    process.exit(0);
  });
});

// Initialize services and start server
async function startServer() {
  try {
    // Connect to Redis
    await connectRedis();
    logger.info('AI Services: Redis connected successfully');

    // Setup job queues for background processing
    await setupJobQueues();
    logger.info('AI Services: Job queues initialized');

    // Start server
    server.listen(PORT, () => {
      logger.info(`🤖 GameCraft AI Services running on port ${PORT}`);
      logger.info(`🧠 Available AI Services:`);
      logger.info(`   • Code Generation (Python, JavaScript, C#, Lua)`);
      logger.info(`   • Asset Creation (Characters, Environments, UI)`);
      logger.info(`   • Content Validation (Legal, Copyright, Safety)`);
      logger.info(`   • Music Generation (Soundtracks, SFX)`);
      logger.info(`   • Dialogue Generation (Characters, NPCs)`);
      logger.info(`   • Game Optimization (Performance, Mobile)`);
      logger.info(`   • Legal Analysis (Patents, Trademarks)`);
    });

  } catch (error) {
    logger.error('Failed to start AI services server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception in AI Services:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection in AI Services:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();

export { app, io };