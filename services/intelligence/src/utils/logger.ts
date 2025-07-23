import winston from 'winston';
import { config } from '../config.js';

// Define log levels and colors
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(logColors);

// Create custom format for structured logging
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, service, ...meta } = info;
    
    let logMessage = `${timestamp} [${level}]`;
    
    if (service) {
      logMessage += ` [${service}]`;
    }
    
    logMessage += `: ${message}`;
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      logMessage += ` ${JSON.stringify(meta)}`;
    }
    
    return logMessage;
  })
);

// Create console transport
const consoleTransport = new winston.transports.Console({
  format: logFormat,
  level: config.development.debugMode ? 'debug' : config.app.logLevel,
});

// Create file transport for production
const fileTransports = [];
if (config.app.nodeEnv === 'production') {
  fileTransports.push(
    new winston.transports.File({
      filename: './logs/intelligence-error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: './logs/intelligence-combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );
}

// Create logger instance
export const logger = winston.createLogger({
  level: config.development.debugMode ? 'debug' : config.app.logLevel,
  levels: logLevels,
  transports: [consoleTransport, ...fileTransports],
  exitOnError: false,
});

// Add default metadata for intelligence service
logger.defaultMeta = {
  service: 'intelligence',
  version: '1.0.0'
};

// Helper functions for structured logging
export const loggers = {
  contact: logger.child({ module: 'contact-intelligence' }),
  email: logger.child({ module: 'email-intelligence' }),
  enrichment: logger.child({ module: 'data-enrichment' }),
  pipeline: logger.child({ module: 'pipeline-orchestration' }),
  ethics: logger.child({ module: 'ethics-framework' }),
  mcp: logger.child({ module: 'mcp-integration' }),
  api: logger.child({ module: 'api' }),
  health: logger.child({ module: 'health' })
};

// Request logging middleware helper
export function createRequestLogger() {
  return (req: any, res: any, next: any) => {
    const start = Date.now();
    
    // Log request
    logger.http('Incoming request', {
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });

    // Log response when finished
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.http('Request completed', {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`
      });
    });

    next();
  };
}

// Performance logging helper
export function logPerformance(operation: string, startTime: number, metadata?: any) {
  const duration = Date.now() - startTime;
  logger.info(`Performance: ${operation} completed`, {
    operation,
    duration: `${duration}ms`,
    ...metadata
  });
}

// Error logging helper with context
export function logError(error: Error, context?: any) {
  logger.error('Error occurred', {
    message: error.message,
    stack: error.stack,
    ...context
  });
}

// Success logging helper
export function logSuccess(operation: string, metadata?: any) {
  logger.info(`Success: ${operation}`, metadata);
}

// Warning logging helper
export function logWarning(message: string, metadata?: any) {
  logger.warn(message, metadata);
}

// Debug logging helper (only shows in debug mode)
export function logDebug(message: string, metadata?: any) {
  if (config.development.debugMode) {
    logger.debug(message, metadata);
  }
}

// Ensure log directory exists
try {
  const fs = require('fs');
  const path = require('path');
  const logDir = './logs';
  
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
} catch (error) {
  console.warn('Could not create logs directory:', error);
}

export default logger;
