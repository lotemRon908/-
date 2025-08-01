const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');
const userRoutes = require('./routes/users');
const aiRoutes = require('./routes/ai');
const assetRoutes = require('./routes/assets');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const exportRoutes = require('./routes/export');
const marketplaceRoutes = require('./routes/marketplace');

// Import middleware
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Create Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
  }
});

// Environment variables
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gamecraft-pro';

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: 500 // begin adding 500ms of delay per request above 50
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  logger.info('Connected to MongoDB');
})
.catch((error) => {
  logger.error('MongoDB connection error:', error);
  process.exit(1);
});

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: NODE_ENV === 'production' ? true : false,
}));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File upload middleware
app.use(fileUpload({
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  useTempFiles: true,
  tempFileDir: '/tmp/',
  createParentPath: true,
}));

// Compression
app.use(compression());

// Logging
if (NODE_ENV === 'development') {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Rate limiting
app.use('/api', limiter);
app.use('/api', speedLimiter);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'gamecraft-pro-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGODB_URI,
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    secure: NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', authMiddleware.requireAuth, gameRoutes);
app.use('/api/users', authMiddleware.requireAuth, userRoutes);
app.use('/api/ai', authMiddleware.requireAuth, aiRoutes);
app.use('/api/assets', authMiddleware.requireAuth, assetRoutes);
app.use('/api/admin', authMiddleware.requireAuth, authMiddleware.requireAdmin, adminRoutes);
app.use('/api/analytics', authMiddleware.requireAuth, analyticsRoutes);
app.use('/api/export', authMiddleware.requireAuth, exportRoutes);
app.use('/api/marketplace', authMiddleware.requireAuth, marketplaceRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: process.env.npm_package_version || '10.0.0'
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  // Join user to their personal room
  socket.on('join-user-room', (userId) => {
    socket.join(`user:${userId}`);
    logger.info(`User ${userId} joined personal room`);
  });

  // Join game editor room
  socket.on('join-game-room', (gameId) => {
    socket.join(`game:${gameId}`);
    socket.to(`game:${gameId}`).emit('user-joined-game', socket.id);
    logger.info(`User joined game room: ${gameId}`);
  });

  // Handle real-time game editing
  socket.on('game-update', (data) => {
    socket.to(`game:${data.gameId}`).emit('game-updated', data);
  });

  // Handle AI requests
  socket.on('ai-request', async (data) => {
    try {
      // Process AI request here
      socket.emit('ai-response', { success: true, data: 'AI response' });
    } catch (error) {
      socket.emit('ai-response', { success: false, error: error.message });
    }
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Serve static files in production
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 GameCraft Pro Ultimate Server running on port ${PORT}`);
  logger.info(`📱 Environment: ${NODE_ENV}`);
  logger.info(`🔗 API URL: http://localhost:${PORT}/api`);
  
  if (NODE_ENV === 'development') {
    logger.info(`🎮 Admin Access Code: lotemronkaplan21`);
  }
});

module.exports = app;