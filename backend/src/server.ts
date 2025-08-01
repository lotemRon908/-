import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
import passport from 'passport';

import { errorHandler } from './middleware/errorHandler';
import { logger } from './config/logger';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { setupPassport } from './config/passport';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import gameRoutes from './routes/games';
import projectRoutes from './routes/projects';
import assetRoutes from './routes/assets';
import aiRoutes from './routes/ai';
import legalRoutes from './routes/legal';
import publishingRoutes from './routes/publishing';
import adminRoutes from './routes/admin';
import analyticsRoutes from './routes/analytics';
import marketplaceRoutes from './routes/marketplace';

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

const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'https://gamecrfat-pro-ultimate.com'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Code']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Compression
app.use(compression());

// Logging
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Passport middleware
app.use(passport.initialize());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API versioning
const apiV1 = '/api/v1';

// Routes
app.use(`${apiV1}/auth`, authRoutes);
app.use(`${apiV1}/users`, userRoutes);
app.use(`${apiV1}/games`, gameRoutes);
app.use(`${apiV1}/projects`, projectRoutes);
app.use(`${apiV1}/assets`, assetRoutes);
app.use(`${apiV1}/ai`, aiRoutes);
app.use(`${apiV1}/legal`, legalRoutes);
app.use(`${apiV1}/publishing`, publishingRoutes);
app.use(`${apiV1}/admin`, adminRoutes);
app.use(`${apiV1}/analytics`, analyticsRoutes);
app.use(`${apiV1}/marketplace`, marketplaceRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use(errorHandler);

// Socket.IO for real-time features
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  // Join game development room
  socket.on('join-project', (projectId: string) => {
    socket.join(`project-${projectId}`);
    logger.info(`User ${socket.id} joined project ${projectId}`);
  });

  // Real-time collaboration
  socket.on('project-update', (data) => {
    socket.to(`project-${data.projectId}`).emit('project-updated', data);
  });

  // Code execution updates
  socket.on('code-execution', (data) => {
    socket.to(`project-${data.projectId}`).emit('code-result', data);
  });

  // AI generation updates
  socket.on('ai-generation', (data) => {
    socket.to(`project-${data.projectId}`).emit('ai-result', data);
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Connect to database
    await connectDatabase();
    logger.info('Database connected successfully');

    // Connect to Redis
    await connectRedis();
    logger.info('Redis connected successfully');

    // Setup Passport strategies
    setupPassport();
    logger.info('Passport configured successfully');

    // Start server
    server.listen(PORT, () => {
      logger.info(`🎮 GameCraft Pro Ultimate Backend Server running on port ${PORT}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
      logger.info(`🚀 Admin Code: ${process.env.ADMIN_CODE || 'lotemronkaplan21'}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();

export { app, io };