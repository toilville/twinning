# Twinning Intelligence Service

**Rockford Integration - Data Pipeline and Contact Intelligence Platform**

*Comprehensive intelligence platform integrated with SPELWork ethical AI framework and Twinning ecosystem*

## Overview

The **Twinning Intelligence Service** integrates the proven **Rockford** platform (64.3 contacts/sec processing) into the Twinning ecosystem, providing:

- **Contact Intelligence**: High-performance contact sync, deduplication, and enrichment
- **Email Intelligence**: Email processing and status tracking  
- **Data Enrichment**: Multi-source data enhancement (web, LinkedIn, job boards)
- **Pipeline Orchestration**: Workflow coordination and automation
- **Ethical AI Integration**: SPELWork framework for all AI operations
- **MCP Coordination**: Apple, Notion, GitHub server integration

## Quick Start

### Development Setup

```bash
cd services/intelligence
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### Production Deployment

```bash
# Build and start
npm run build
npm start

# Or with Docker
docker build -t twinning-intelligence .
docker run -p 3002:3002 twinning-intelligence
```

### Health Check

```bash
curl http://localhost:3002/health
```

## Architecture

### Core Modules

```
Intelligence Service/
├── 📊 Contact Intelligence    # 64.3 contacts/sec processing
├── 📧 Email Intelligence      # Email analysis and status tracking
├── 🔍 Data Enrichment         # Multi-source data enhancement
├── 🔄 Pipeline Orchestration  # Workflow automation
├── 🧠 Ethics Integration       # SPELWork ethical framework
└── 🔗 MCP Integration         # Apple, Notion, GitHub coordination
```

### Key Features

#### Contact Intelligence
- **High Performance**: Maintains 64.3 contacts/sec processing rate
- **Smart Deduplication**: Intelligent duplicate detection and removal
- **Apple Mail Integration**: Direct email contact extraction
- **Notion Sync**: Bidirectional contact synchronization
- **Ethical Processing**: SPELWork evaluation for all contact operations

#### Email Intelligence
- **Content Analysis**: Email parsing and sentiment analysis
- **Status Tracking**: Change detection and monitoring
- **Contact Extraction**: Automatic contact discovery from emails
- **MCP Integration**: Apple Mail server coordination

#### Data Enrichment
- **Multi-Source**: Web scraping, LinkedIn, job board intelligence
- **Configurable Sources**: User-selectable enrichment providers  
- **Rate Limiting**: Respectful API usage with built-in limits
- **Quality Scoring**: Confidence metrics for enriched data

## API Endpoints

### Contact Intelligence

```bash
# Contact sync
POST /api/contact-intelligence/sync
{
  "contacts": [...],
  "options": { "dryRun": false, "includeResults": true }
}

# Contact deduplication
POST /api/contact-intelligence/dedupe
{
  "contacts": [...],
  "options": { "dryRun": false, "includeDuplicates": true }
}

# Contact enrichment
POST /api/contact-intelligence/enrich
{
  "contacts": [...],
  "enrichment_sources": ["web", "linkedin"]
}

# Test connectivity
GET /api/contact-intelligence/test

# Service status
GET /api/contact-intelligence/status
```

### Email Intelligence

```bash
# Email processing
POST /api/email-intelligence/process
{
  "emails": [...],
  "options": { "extract_contacts": true, "track_status": true }
}

# Service status
GET /api/email-intelligence/status
```

### Data Enrichment

```bash
# Data enrichment
POST /api/data-enrichment/enrich
{
  "data": [...],
  "sources": ["web", "linkedin", "github"]
}

# Service status
GET /api/data-enrichment/status
```

### Pipeline Orchestration

```bash
# Orchestrate workflow
POST /api/pipeline/orchestrate
{
  "operations": ["contact_sync", "enrich", "dedupe"],
  "data": [...],
  "options": { "sequential": true, "error_handling": "continue" }
}

# Pipeline status
GET /api/pipeline/status
```

### Health and Monitoring

```bash
# Basic health
GET /health

# Detailed health
GET /health/detailed

# Liveness probe
GET /health/live

# Readiness probe
GET /health/ready

# Service info
GET /api/info

# Ethics status
GET /api/ethics/status
```

## Configuration

### Environment Variables

```bash
# Service Configuration
NODE_ENV=development
PORT=3002
SERVICE_NAME=intelligence
LOG_LEVEL=info

# Twinning Integration
TWINNING_CORE_URL=http://localhost:3000
TWINNING_API_KEY=your-api-key

# Notion Integration
NOTION_API_TOKEN=your-token
NOTION_CONTACTS_DATABASE_ID=your-database-id

# Apple Mail (macOS only)
APPLE_MAIL_ENABLED=true
APPLE_MAIL_ACCOUNT=your-account

# MCP Servers
MCP_SERVERS_ENABLED=true
MCP_APPLE_SERVER_URL=http://localhost:3100
MCP_NOTION_SERVER_URL=http://localhost:3101
MCP_GITHUB_SERVER_URL=http://localhost:3102

# AI Providers
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your-key
OPENAI_API_KEY=your-key
LOCAL_LLM_URL=http://localhost:11434

# SPELWork Ethics
ETHICS_ENABLED=true
ETHICS_TRUST_THRESHOLD=0.7
ETHICS_BIAS_DETECTION=true

# Performance
CONTACT_PROCESSING_RATE_LIMIT=65
BATCH_SIZE=100
MAX_CONCURRENT_OPERATIONS=10
```

## Integration with Twinning Ecosystem

### SPELWork Ethical Framework

All AI operations are evaluated through the SPELWork ethical framework:

```typescript
// Example: Ethical contact processing
const wish = createContactIntelligenceWish(
  'sync_contacts',
  contactData,
  userId
);

const result = await ethicalFramework.processWithEthics(
  wish,
  () => processContacts(contactData)
);

if (result.success) {
  // Process completed with ethical approval
  console.log('Contacts processed:', result.output);
} else {
  // Process blocked by ethical evaluation
  console.log('Blocked:', result.ethical_validation.reasoning);
}
```

### MCP Server Coordination

Coordinates with MCP servers for data operations:

```typescript
// Apple Mail integration
const emails = await mcpIntegration.callAppleServer('extract_emails', {
  account: 'primary',
  since: lastSyncDate
});

// Notion synchronization
const syncResult = await mcpIntegration.callNotionServer('sync_contacts', {
  contacts: processedContacts,
  database_id: NOTION_CONTACTS_DATABASE_ID
});
```

### Cross-Service Communication

Integrates with other Twinning services:

```bash
# Memory service coordination
POST http://localhost:3003/api/memory/store
{
  "content": "Contact intelligence results",
  "source": "intelligence-service",
  "metadata": { "contact_count": 150 }
}

# Social service integration
POST http://localhost:3001/api/process
{
  "content": "Enriched contact data for social posting",
  "platforms": ["bluesky"],
  "intelligence_source": true
}
```

## Performance & Monitoring

### Key Metrics

- **Contact Processing Rate**: 64.3 contacts/sec (maintained from Rockford)
- **API Response Time**: < 200ms average
- **Success Rate**: > 99%
- **Memory Usage**: < 500MB under normal load
- **Ethical Evaluation**: < 50ms per operation

### Monitoring Endpoints

```bash
# Prometheus metrics
GET /metrics

# Health status
GET /health/detailed

# Service performance
GET /api/info
```

## Development

### Scripts

```bash
# Development
npm run dev              # Start with hot reload
npm run build            # Build TypeScript
npm run start            # Start production

# Contact Intelligence
npm run contact:sync     # Run contact sync
npm run contact:dedupe   # Run deduplication
npm run contact:test     # Test connectivity

# Other Operations
npm run email:intelligence  # Email processing
npm run data:enrich        # Data enrichment
npm run pipeline:status    # Pipeline status

# Testing & Health
npm run test            # Run tests
npm run health          # Health check
npm run test:ethics     # Test ethical framework
```

### Development Structure

```
src/
├── index.ts                 # Main service entry
├── config.ts               # Configuration management
├── ethics-integration.ts   # SPELWork integration
├── mcp-integration.ts      # MCP server coordination
├── utils/
│   └── logger.ts          # Structured logging
└── routes/
    ├── health.ts          # Health endpoints
    ├── contact-intelligence.ts  # Contact operations
    ├── email-intelligence.ts    # Email operations
    ├── data-enrichment.ts      # Enrichment operations
    └── pipeline.ts            # Pipeline orchestration
```

## Docker Deployment

### Build Image

```bash
docker build -t twinning-intelligence .
```

### Run Container

```bash
docker run -d \
  --name twinning-intelligence \
  -p 3002:3002 \
  -e NODE_ENV=production \
  -e NOTION_API_TOKEN=your-token \
  -e ANTHROPIC_API_KEY=your-key \
  --restart unless-stopped \
  twinning-intelligence
```

### Health Check

```bash
docker exec twinning-intelligence curl -f http://localhost:3002/health
```

## Troubleshooting

### Common Issues

1. **MCP Server Connection Failed**
   - Check MCP server URLs in environment
   - Verify MCP servers are running
   - Check network connectivity

2. **Contact Sync Performance**
   - Monitor `CONTACT_PROCESSING_RATE_LIMIT`
   - Check memory usage and batch size
   - Verify Notion API rate limits

3. **Ethical Framework Issues**
   - Check SPELWork dependency availability
   - Verify `ETHICS_ENABLED` configuration
   - Review ethical evaluation logs

### Debug Commands

```bash
# Check service health
curl http://localhost:3002/health/detailed

# Test contact intelligence
curl -X GET http://localhost:3002/api/contact-intelligence/test

# Check MCP integration
curl http://localhost:3002/api/info

# Test ethical framework
npm run test:ethics
```

## Contributing

### Adding New Intelligence Modules

1. Create module in `src/modules/`
2. Add route handler in `src/routes/`
3. Update main service registration
4. Add ethical evaluation integration
5. Update documentation and tests

### Integration Guidelines

- All AI operations must use SPELWork ethical framework
- MCP operations should be coordinated through the integration layer
- Follow structured logging patterns
- Include comprehensive health checks
- Maintain backwards compatibility with Rockford performance

## Support

For intelligence service questions:

- **Service Issues**: Create issues in the Twinning repository
- **Performance Questions**: Review the detailed health endpoint
- **Integration Help**: Check MCP integration documentation
- **Ethical Framework**: Refer to SPELWork documentation

---

**Part of the Twinning Ecosystem - AI-Human Collaboration with Data Sovereignty**

*Maintains the proven 64.3 contacts/sec performance of Rockford while adding ethical AI evaluation and ecosystem integration*
