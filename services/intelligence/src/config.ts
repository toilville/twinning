import { config as dotenvConfig } from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenvConfig();

// Configuration schema with validation
const configSchema = z.object({
  app: z.object({
    nodeEnv: z.string().default('development'),
    port: z.number().default(3002),
    serviceName: z.string().default('intelligence'),
    logLevel: z.string().default('info')
  }),
  
  twinning: z.object({
    coreUrl: z.string().default('http://localhost:3000'),
    apiKey: z.string().optional()
  }),

  notion: z.object({
    apiToken: z.string().optional(),
    contactsDatabaseId: z.string().optional(),
    peopleDatabaseId: z.string().optional()
  }),

  appleMail: z.object({
    enabled: z.boolean().default(true),
    account: z.string().optional()
  }),

  mcp: z.object({
    enabled: z.boolean().default(true),
    appleServerUrl: z.string().default('http://localhost:3100'),
    notionServerUrl: z.string().default('http://localhost:3101'),
    githubServerUrl: z.string().default('http://localhost:3102')
  }),

  ai: z.object({
    provider: z.string().default('anthropic'),
    anthropicApiKey: z.string().optional(),
    openaiApiKey: z.string().optional(),
    localLlmUrl: z.string().default('http://localhost:11434'),
    enabledProviders: z.array(z.string()).default(['anthropic'])
  }),

  ethics: z.object({
    enabled: z.boolean().default(true),
    trustThreshold: z.number().min(0).max(1).default(0.7),
    requireHumanReview: z.boolean().default(false),
    biasDetection: z.boolean().default(true)
  }),

  performance: z.object({
    contactProcessingRateLimit: z.number().default(65),
    batchSize: z.number().default(100),
    maxConcurrentOperations: z.number().default(10)
  }),

  storage: z.object({
    dataPath: z.string().default('./data'),
    backupEnabled: z.boolean().default(true),
    backupRetentionDays: z.number().default(30)
  }),

  monitoring: z.object({
    healthCheckInterval: z.number().default(30000),
    metricsEnabled: z.boolean().default(true),
    prometheusMetricsPath: z.string().default('/metrics')
  }),

  security: z.object({
    corsOrigins: z.array(z.string()).default(['http://localhost:3000']),
    apiRateLimit: z.number().default(100),
    apiRateLimitWindow: z.number().default(900000)
  }),

  development: z.object({
    debugMode: z.boolean().default(false),
    verboseLogging: z.boolean().default(false),
    dryRunMode: z.boolean().default(false)
  })
});

// Parse and validate configuration
function createConfig() {
  const rawConfig = {
    app: {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: parseInt(process.env.PORT || '3002', 10),
      serviceName: process.env.SERVICE_NAME || 'intelligence',
      logLevel: process.env.LOG_LEVEL || 'info'
    },
    
    twinning: {
      coreUrl: process.env.TWINNING_CORE_URL || 'http://localhost:3000',
      apiKey: process.env.TWINNING_API_KEY
    },

    notion: {
      apiToken: process.env.NOTION_API_TOKEN,
      contactsDatabaseId: process.env.NOTION_CONTACTS_DATABASE_ID,
      peopleDatabaseId: process.env.NOTION_PEOPLE_DATABASE_ID
    },

    appleMail: {
      enabled: process.env.APPLE_MAIL_ENABLED === 'true',
      account: process.env.APPLE_MAIL_ACCOUNT
    },

    mcp: {
      enabled: process.env.MCP_SERVERS_ENABLED !== 'false',
      appleServerUrl: process.env.MCP_APPLE_SERVER_URL || 'http://localhost:3100',
      notionServerUrl: process.env.MCP_NOTION_SERVER_URL || 'http://localhost:3101',
      githubServerUrl: process.env.MCP_GITHUB_SERVER_URL || 'http://localhost:3102'
    },

    ai: {
      provider: process.env.AI_PROVIDER || 'anthropic',
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      openaiApiKey: process.env.OPENAI_API_KEY,
      localLlmUrl: process.env.LOCAL_LLM_URL || 'http://localhost:11434',
      enabledProviders: process.env.AI_PROVIDER ? [process.env.AI_PROVIDER] : ['anthropic']
    },

    ethics: {
      enabled: process.env.ETHICS_ENABLED !== 'false',
      trustThreshold: parseFloat(process.env.ETHICS_TRUST_THRESHOLD || '0.7'),
      requireHumanReview: process.env.ETHICS_REQUIRE_HUMAN_REVIEW === 'true',
      biasDetection: process.env.ETHICS_BIAS_DETECTION !== 'false'
    },

    performance: {
      contactProcessingRateLimit: parseInt(process.env.CONTACT_PROCESSING_RATE_LIMIT || '65', 10),
      batchSize: parseInt(process.env.BATCH_SIZE || '100', 10),
      maxConcurrentOperations: parseInt(process.env.MAX_CONCURRENT_OPERATIONS || '10', 10)
    },

    storage: {
      dataPath: process.env.DATA_STORAGE_PATH || './data',
      backupEnabled: process.env.BACKUP_ENABLED !== 'false',
      backupRetentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10)
    },

    monitoring: {
      healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000', 10),
      metricsEnabled: process.env.METRICS_ENABLED !== 'false',
      prometheusMetricsPath: process.env.PROMETHEUS_METRICS_PATH || '/metrics'
    },

    security: {
      corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],
      apiRateLimit: parseInt(process.env.API_RATE_LIMIT || '100', 10),
      apiRateLimitWindow: parseInt(process.env.API_RATE_LIMIT_WINDOW || '900000', 10)
    },

    development: {
      debugMode: process.env.DEBUG_MODE === 'true',
      verboseLogging: process.env.VERBOSE_LOGGING === 'true',
      dryRunMode: process.env.DRY_RUN_MODE === 'true'
    }
  };

  // Validate configuration
  try {
    return configSchema.parse(rawConfig);
  } catch (error) {
    console.error('Configuration validation failed:', error);
    throw new Error('Invalid configuration');
  }
}

export const config = createConfig();

// Configuration utilities
export function isDevelopment(): boolean {
  return config.app.nodeEnv === 'development';
}

export function isProduction(): boolean {
  return config.app.nodeEnv === 'production';
}

export function validateRequiredConfig(): void {
  const issues: string[] = [];

  // Check for required configuration based on enabled features
  if (config.mcp.enabled) {
    // MCP servers should be accessible
    console.log('MCP integration enabled - checking server connectivity...');
  }

  if (config.notion.apiToken && !config.notion.contactsDatabaseId) {
    issues.push('NOTION_CONTACTS_DATABASE_ID is required when NOTION_API_TOKEN is provided');
  }

  if (config.ai.provider === 'anthropic' && !config.ai.anthropicApiKey) {
    console.warn('Anthropic API key not provided - AI features will be limited');
  }

  if (config.ai.provider === 'openai' && !config.ai.openaiApiKey) {
    console.warn('OpenAI API key not provided - AI features will be limited');
  }

  if (issues.length > 0) {
    throw new Error(`Configuration issues:\n${issues.join('\n')}`);
  }
}

export type Config = z.infer<typeof configSchema>;
