import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config.js';
import { logger } from './utils/logger.js';
import { TwinningEthicalFramework } from './ethics-integration.js';
import { MCPIntegration } from './mcp-integration.js';
import { healthRouter } from './routes/health.js';
import { contactIntelligenceRouter } from './routes/contact-intelligence.js';
import { emailIntelligenceRouter } from './routes/email-intelligence.js';
import { dataEnrichmentRouter } from './routes/data-enrichment.js';
import { pipelineRouter } from './routes/pipeline.js';

/**
 * Twinning Intelligence Service
 * 
 * Comprehensive data pipeline and intelligence platform integrated with:
 * - SPELWork ethical AI framework
 * - MCP server ecosystem (Apple, Notion, GitHub)
 * - Contact intelligence (64.3/sec processing rate)
 * - Email intelligence and status tracking
 * - Data enrichment and pipeline orchestration
 */
class IntelligenceService {
  private app: express.Application;
  private ethicalFramework: TwinningEthicalFramework;
  private mcpIntegration: MCPIntegration;

  constructor() {
    this.app = express();
    this.ethicalFramework = new TwinningEthicalFramework();
    this.mcpIntegration = new MCPIntegration();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: config.security.corsOrigins,
      credentials: true,
      optionsSuccessStatus: 200
    }));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`, {
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        service: 'intelligence'
      });
      next();
    });
  }

  private setupRoutes(): void {
    // Health and monitoring
    this.app.use('/health', healthRouter);
    
    // Core intelligence modules
    this.app.use('/api/contact-intelligence', contactIntelligenceRouter);
    this.app.use('/api/email-intelligence', emailIntelligenceRouter);
    this.app.use('/api/data-enrichment', dataEnrichmentRouter);
    this.app.use('/api/pipeline', pipelineRouter);

    // Service info
    this.app.get('/api/info', (req, res) => {
      res.json({
        service: 'intelligence',
        version: '1.0.0',
        capabilities: [
          'contact-intelligence',
          'email-intelligence', 
          'data-enrichment',
          'pipeline-orchestration'
        ],
        integrations: {
          ethical_framework: this.ethicalFramework.isEnabled(),
          mcp_servers: this.mcpIntegration.getConnectedServers(),
          ai_providers: config.ai.enabledProviders
        },
        performance: {
          contact_processing_rate: `${config.performance.contactProcessingRateLimit}/sec`,
          batch_size: config.performance.batchSize,
          max_concurrent: config.performance.maxConcurrentOperations
        }
      });
    });

    // Ethics endpoint for service coordination
    this.app.get('/api/ethics/status', (req, res) => {
      res.json({
        enabled: this.ethicalFramework.isEnabled(),
        trust_threshold: config.ethics.trustThreshold,
        bias_detection: config.ethics.biasDetection,
        human_review_required: config.ethics.requireHumanReview
      });
    });
  }

  private setupErrorHandling(): void {
    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Endpoint not found',
        service: 'intelligence',
        available_endpoints: [
          '/health',
          '/api/info',
          '/api/contact-intelligence',
          '/api/email-intelligence',
          '/api/data-enrichment',
          '/api/pipeline'
        ]
      });
    });

    // Global error handler
    this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('Unhandled error in intelligence service', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
      });

      res.status(500).json({
        error: 'Internal server error',
        service: 'intelligence',
        message: config.app.nodeEnv === 'development' ? err.message : 'Something went wrong'
      });
    });
  }

  public async start(): Promise<void> {
    try {
      // Initialize ethical framework
      await this.ethicalFramework.initialize();
      logger.info('SPELWork ethical framework initialized');

      // Initialize MCP integration
      if (config.mcp.enabled) {
        await this.mcpIntegration.initialize();
        logger.info('MCP server integration initialized');
      }

      // Start HTTP server
      this.app.listen(config.app.port, () => {
        logger.info(`Intelligence service started on port ${config.app.port}`, {
          service: 'intelligence',
          version: '1.0.0',
          environment: config.app.nodeEnv,
          ethical_framework: this.ethicalFramework.isEnabled(),
          mcp_integration: config.mcp.enabled,
          endpoints: [
            `http://localhost:${config.app.port}/health`,
            `http://localhost:${config.app.port}/api/info`,
            `http://localhost:${config.app.port}/api/contact-intelligence`,
            `http://localhost:${config.app.port}/api/email-intelligence`,
            `http://localhost:${config.app.port}/api/data-enrichment`,
            `http://localhost:${config.app.port}/api/pipeline`
          ]
        });
      });

      // Graceful shutdown handling
      process.on('SIGTERM', () => this.shutdown());
      process.on('SIGINT', () => this.shutdown());

    } catch (error) {
      logger.error('Failed to start intelligence service', { error });
      process.exit(1);
    }
  }

  private async shutdown(): Promise<void> {
    logger.info('Shutting down intelligence service...');
    
    try {
      // Cleanup MCP connections
      if (this.mcpIntegration) {
        await this.mcpIntegration.cleanup();
      }

      // Cleanup ethical framework
      if (this.ethicalFramework) {
        await this.ethicalFramework.cleanup();
      }

      logger.info('Intelligence service shut down successfully');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown', { error });
      process.exit(1);
    }
  }
}

// Start the service
const intelligenceService = new IntelligenceService();
intelligenceService.start().catch((error) => {
  logger.error('Failed to start intelligence service', { error });
  process.exit(1);
});

export { IntelligenceService };
