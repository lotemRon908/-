import winston from 'winston';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
winston.addColors(colors);

// Create format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Create format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.json(),
);

// Define which transports the logger must use
const transports = [
  // Console transport
  new winston.transports.Console({
    format: consoleFormat,
  }),
  
  // File transport for errors
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'error.log'),
    level: 'error',
    format: fileFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'combined.log'),
    format: fileFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  transports,
  exitOnError: false,
});

// Enhanced logging methods
const enhancedLogger = {
  error: (message: string, meta?: any) => {
    logger.error(message, meta);
  },
  
  warn: (message: string, meta?: any) => {
    logger.warn(message, meta);
  },
  
  info: (message: string, meta?: any) => {
    logger.info(message, meta);
  },
  
  http: (message: string, meta?: any) => {
    logger.http(message, meta);
  },
  
  debug: (message: string, meta?: any) => {
    logger.debug(message, meta);
  },
  
  // Security logging
  security: (event: string, details: any) => {
    logger.warn(`SECURITY: ${event}`, {
      type: 'security',
      timestamp: new Date().toISOString(),
      ...details
    });
  },
  
  // User activity logging
  userActivity: (userId: string, action: string, details?: any) => {
    logger.info(`USER_ACTIVITY: ${action}`, {
      type: 'user_activity',
      userId,
      action,
      timestamp: new Date().toISOString(),
      ...details
    });
  },
  
  // Game development logging
  gameActivity: (projectId: string, action: string, details?: any) => {
    logger.info(`GAME_ACTIVITY: ${action}`, {
      type: 'game_activity',
      projectId,
      action,
      timestamp: new Date().toISOString(),
      ...details
    });
  },
  
  // AI service logging
  aiActivity: (service: string, action: string, details?: any) => {
    logger.info(`AI_ACTIVITY: ${service} - ${action}`, {
      type: 'ai_activity',
      service,
      action,
      timestamp: new Date().toISOString(),
      ...details
    });
  },
  
  // Legal compliance logging
  legalActivity: (type: string, details: any) => {
    logger.info(`LEGAL_ACTIVITY: ${type}`, {
      type: 'legal_activity',
      legalType: type,
      timestamp: new Date().toISOString(),
      ...details
    });
  },
  
  // Performance logging
  performance: (operation: string, duration: number, details?: any) => {
    logger.info(`PERFORMANCE: ${operation} took ${duration}ms`, {
      type: 'performance',
      operation,
      duration,
      timestamp: new Date().toISOString(),
      ...details
    });
  },
  
  // API request logging
  apiRequest: (method: string, url: string, statusCode: number, duration: number, userId?: string) => {
    logger.http(`${method} ${url} ${statusCode} - ${duration}ms`, {
      type: 'api_request',
      method,
      url,
      statusCode,
      duration,
      userId,
      timestamp: new Date().toISOString()
    });
  }
};

export { enhancedLogger as logger };