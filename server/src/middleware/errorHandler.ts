import { Request, Response, NextFunction } from 'express';
import { logger } from '../index';

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: any;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error('Error Handler:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'המשאב לא נמצא';
    error = { name: 'CastError', message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    const message = field === 'email' ? 'כתובת המייל כבר קיימת במערכת' : 
                   field === 'username' ? 'שם המשתמש כבר תפוס' : 
                   'ערך כבר קיים במערכת';
    error = { name: 'DuplicateFieldError', message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors).map((val: any) => val.message).join(', ');
    error = { name: 'ValidationError', message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'טוקן לא תקין';
    error = { name: 'JsonWebTokenError', message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'טוקן פג תוקף';
    error = { name: 'TokenExpiredError', message, statusCode: 401 };
  }

  // File upload errors
  if (err.message && err.message.includes('File too large')) {
    const message = 'הקובץ גדול מדי';
    error = { name: 'FileTooLargeError', message, statusCode: 413 };
  }

  // Rate limit errors
  if (err.message && err.message.includes('Too many requests')) {
    const message = 'יותר מדי בקשות, נסה שוב מאוחר יותר';
    error = { name: 'RateLimitError', message, statusCode: 429 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'שגיאת שרת פנימית',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: error 
    })
  });
};

export default errorHandler;