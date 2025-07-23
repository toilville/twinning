import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';

const router = Router();

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  service: string;
  version: string;
  uptime: number;
  checks: {
    [key: string]: {
      status: 'pass' | 'fail';
      message?: string;
      timestamp: string;
    };
  };
}

// Basic health check endpoint
router.get('/', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    
    // Perform health checks
    const checks = await performHealthChecks();
    
    // Determine overall health status
    const hasFailures = Object.values(checks).some(check => check.status === 'fail');
    const status: HealthStatus['status'] = hasFailures ? 'degraded' : 'healthy';
    
    const healthStatus: HealthStatus = {
      status,
      timestamp: new Date().toISOString(),
      service: 'intelligence',
      version: '1.0.0',
      uptime: process.uptime(),
      checks
    };

    const responseTime = Date.now() - startTime;
    
    // Log health check
    logger.info('Health check completed', {
      status,
      response_time: `${responseTime}ms`,
      checks_passed: Object.values(checks).filter(c => c.status === 'pass').length,
      checks_failed: Object.values(checks).filter(c => c.status === 'fail').length
    });

    // Return appropriate status code
    const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;
    res.status(statusCode).json(healthStatus);

  } catch (error) {
    logger.error('Health check failed', { error });
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'intelligence',
      version: '1.0.0',
      uptime: process.uptime(),
      error: error instanceof Error ? error.message : 'Unknown error',
      checks: {}
    });
  }
});

// Detailed health check endpoint
router.get('/detailed', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    
    // Perform comprehensive health checks
    const checks = await performDetailedHealthChecks();
    
    const hasFailures = Object.values(checks).some(check => check.status === 'fail');
    const status: HealthStatus['status'] = hasFailures ? 'degraded' : 'healthy';
    
    const healthStatus = {
      status,
      timestamp: new Date().toISOString(),
      service: 'intelligence',
      version: '1.0.0',
      uptime: process.uptime(),
      environment: config.app.nodeEnv,
      configuration: {
        ethics_enabled: config.ethics.enabled,
        mcp_enabled: config.mcp.enabled,
        apple_mail_enabled: config.appleMail.enabled,
        ai_provider: config.ai.provider
      },
      performance: {
        contact_processing_rate_limit: config.performance.contactProcessingRateLimit,
        batch_size: config.performance.batchSize,
        max_concurrent_operations: config.performance.maxConcurrentOperations
      },
      checks
    };

    const responseTime = Date.now() - startTime;
    
    logger.info('Detailed health check completed', {
      status,
      response_time: `${responseTime}ms`
    });

    const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;
    res.status(statusCode).json(healthStatus);

  } catch (error) {
    logger.error('Detailed health check failed', { error });
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'intelligence',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Liveness probe (simple check that service is running)
router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    service: 'intelligence'
  });
});

// Readiness probe (check if service is ready to handle requests)
router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Check critical dependencies
    const criticalChecks = await performCriticalHealthChecks();
    
    const isReady = Object.values(criticalChecks).every(check => check.status === 'pass');
    
    if (isReady) {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString(),
        service: 'intelligence',
        checks: criticalChecks
      });
    } else {
      res.status(503).json({
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        service: 'intelligence',
        checks: criticalChecks
      });
    }

  } catch (error) {
    logger.error('Readiness check failed', { error });
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      service: 'intelligence',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

async function performHealthChecks() {
  const checks: HealthStatus['checks'] = {};
  const timestamp = new Date().toISOString();

  // Memory usage check
  const memUsage = process.memoryUsage();
  const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  checks.memory = {
    status: memUsageMB < 500 ? 'pass' : 'fail', // Fail if using more than 500MB
    message: `Heap used: ${memUsageMB}MB`,
    timestamp
  };

  // Process uptime check
  checks.uptime = {
    status: process.uptime() > 0 ? 'pass' : 'fail',
    message: `Uptime: ${Math.round(process.uptime())}s`,
    timestamp
  };

  // Configuration check
  checks.configuration = {
    status: 'pass',
    message: 'Configuration loaded successfully',
    timestamp
  };

  return checks;
}

async function performDetailedHealthChecks() {
  const checks = await performHealthChecks();
  const timestamp = new Date().toISOString();

  // File system check (log directory)
  try {
    const fs = require('fs');
    const logDir = './logs';
    const canWrite = fs.existsSync(logDir);
    
    checks.filesystem = {
      status: canWrite ? 'pass' : 'fail',
      message: canWrite ? 'Log directory accessible' : 'Cannot access log directory',
      timestamp
    };
  } catch (error) {
    checks.filesystem = {
      status: 'fail',
      message: `Filesystem check failed: ${error}`,
      timestamp
    };
  }

  // Ethics framework check
  checks.ethics_framework = {
    status: config.ethics.enabled ? 'pass' : 'pass', // Pass even if disabled
    message: config.ethics.enabled ? 'Ethics framework enabled' : 'Ethics framework disabled',
    timestamp
  };

  // MCP integration check
  checks.mcp_integration = {
    status: config.mcp.enabled ? 'pass' : 'pass', // Pass even if disabled
    message: config.mcp.enabled ? 'MCP integration enabled' : 'MCP integration disabled',
    timestamp
  };

  return checks;
}

async function performCriticalHealthChecks() {
  const checks: HealthStatus['checks'] = {};
  const timestamp = new Date().toISOString();

  // Critical memory check (higher threshold)
  const memUsage = process.memoryUsage();
  const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  checks.critical_memory = {
    status: memUsageMB < 1000 ? 'pass' : 'fail', // Critical if over 1GB
    message: `Heap used: ${memUsageMB}MB`,
    timestamp
  };

  // Process responsiveness check
  checks.responsiveness = {
    status: 'pass',
    message: 'Service responding to requests',
    timestamp
  };

  return checks;
}

export { router as healthRouter };
