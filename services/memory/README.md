# Twinning Memory Service

**OMAC Integration - AI Memory Coordination Layer with Semantic Search**

*Unified semantic memory across all Twinning services with pgvector-powered search and MCP orchestration*

## Overview

The **Twinning Memory Service** integrates **OMAC** (Online Memory Access Coordinator) into the Twinning ecosystem, providing:

- **Semantic Search**: pgvector-powered similarity search across all data
- **Cross-Service Memory**: Unified memory layer for Intelligence, Social, and Core services
- **MCP Orchestration**: Coordination of Apple, Notion, GitHub, and RSS servers
- **Ethical AI Integration**: SPELWork framework for all memory operations
- **Data Sovereignty**: Self-hosted memory with privacy-first design

## Quick Start

### Development Setup

```bash
cd services/memory
pip install -r requirements.txt
cp .env.example .env
# Configure your environment variables
python memory_api.py
```

### Production Deployment

```bash
# With Docker
docker build -t twinning-memory .
docker run -p 3003:3003 twinning-memory

# Or with Python directly
pip install -r requirements.txt
gunicorn -w 4 -b 0.0.0.0:3003 memory_api:app
```

### Health Check

```bash
curl http://localhost:3003/health
```

## Architecture

### Core Components

```
Memory Service (OMAC)/
├── 🧠 Semantic Search        # pgvector-powered similarity search
├── 💾 Memory Storage         # Unified data storage and retrieval
├── 🔗 MCP Orchestration      # Apple, Notion, GitHub, RSS coordination
├── 🔄 Cross-Service Coord    # Intelligence & Social service integration
├── 🛡️ Ethics Integration     # SPELWork ethical framework
└── 📊 Memory Analytics       # Usage patterns and insights
```

### Key Features

#### Semantic Search
- **Vector Embeddings**: Sentence transformers for semantic understanding
- **pgvector Database**: High-performance similarity search
- **Multi-Source**: Search across Notion, GitHub, RSS, and service data
- **Configurable Similarity**: Adjustable threshold for result relevance

#### Memory Coordination
- **Cross-Service Memory**: Shared memory layer across all Twinning services  
- **Intelligence Integration**: Store and retrieve contact intelligence results
- **Social Integration**: Remember content patterns and user preferences
- **Temporal Organization**: Time-based memory organization and retrieval

#### MCP Orchestration
- **Multi-Server Coordination**: Synchronize data across all MCP servers
- **Unified Interface**: Single API for all external data sources
- **Health Monitoring**: Track MCP server connectivity and performance
- **Fallback Handling**: Graceful degradation when servers unavailable

## API Endpoints

### Memory Operations

```bash
# Semantic search
POST /api/memory/search
{
  "query": "AI collaboration patterns",
  "limit": 10,
  "threshold": 0.7
}

# Store memory
POST /api/memory/store
{
  "content": "Important insight about user preferences",
  "source": "intelligence-service",
  "metadata": {
    "type": "user-insight",
    "tags": ["preferences", "ai", "automation"]
  }
}

# Cross-service coordination
POST /api/memory/coordinate
{
  "services": ["intelligence", "social"],
  "operation": "sync"
}
```

### MCP Orchestration

```bash
# Orchestrate MCP servers
POST /api/mcp/orchestrate
{
  "servers": ["notion", "github", "apple", "rss"],
  "operation": "sync"
}

# Individual server operations would typically go through the MCP servers directly
# but can be coordinated through the memory service for unified workflows
```

### Health and Status

```bash
# Basic health
GET /health

# Service status
GET /api/status

# Memory statistics
GET /api/memory/stats
```

## Configuration

### Environment Variables

```bash
# Service Configuration
FLASK_ENV=development
PORT=3003
SERVICE_NAME=memory
LOG_LEVEL=info

# Twinning Integration
TWINNING_CORE_URL=http://localhost:3000
INTELLIGENCE_SERVICE_URL=http://localhost:3002
SOCIAL_SERVICE_URL=http://localhost:3001

# Database Configuration
DATABASE_URL=postgresql://user:pass@localhost:5432/twinning_memory
PGVECTOR_ENABLED=true
VECTOR_DIMENSIONS=384

# Redis Caching
REDIS_URL=redis://localhost:6379/0
REDIS_ENABLED=true

# AI Configuration
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your-key
EMBEDDING_MODEL=all-MiniLM-L6-v2
SIMILARITY_THRESHOLD=0.7

# MCP Servers
MCP_SERVERS_ENABLED=true
MCP_APPLE_SERVER_URL=http://localhost:3100
MCP_NOTION_SERVER_URL=http://localhost:3101
MCP_GITHUB_SERVER_URL=http://localhost:3102
MCP_RSS_SERVER_URL=http://localhost:3103

# SPELWork Ethics
ETHICS_ENABLED=true
ETHICS_TRUST_THRESHOLD=0.7
ETHICS_BIAS_DETECTION=true

# Memory Configuration
SEMANTIC_SEARCH_ENABLED=true
MAX_MEMORY_ITEMS=100000
MEMORY_RETENTION_DAYS=365
```

## Integration with Twinning Ecosystem

### Cross-Service Memory

The memory service acts as a central memory layer for all Twinning services:

```python
# Intelligence service storing contact insights
POST /api/memory/store
{
  "content": "Contact processing revealed 150 high-value prospects",
  "source": "intelligence-service", 
  "metadata": {
    "type": "intelligence-insight",
    "contact_count": 150,
    "processing_date": "2025-01-15"
  }
}

# Social service retrieving relevant context
POST /api/memory/search
{
  "query": "high-value prospects for social engagement",
  "limit": 5,
  "threshold": 0.8
}
```

### SPELWork Ethical Framework

All memory operations are evaluated through the ethical framework:

```python
# Ethical evaluation for memory storage
wish = WishDefinition(
    objective="Store content in semantic memory",
    context={
        'content_length': len(content),
        'source': source,
        'contains_pii': contains_personal_info
    },
    domain='ai-memory-coordination',
    user_identity=user_id,
    safeguards=['bias-detection', 'human-override', 'privacy-protection']
)

evaluation = ethics.evaluate_wish(wish)

if evaluation.ethically_sound:
    # Proceed with memory storage
    store_in_vector_db(content, embeddings)
else:
    # Block operation and log reasoning
    logger.warning("Memory storage blocked", reasoning=evaluation.reasoning)
```

### MCP Server Orchestration

Coordinates data flow across multiple MCP servers:

```python
# Synchronize data across all sources
coordination_result = await orchestrate_mcp_servers([
    'notion',  # Notion database content
    'github',  # Project and repository data  
    'apple',   # Apple Mail and Contacts
    'rss'      # RSS feed content
], operation='sync')

# Store aggregated data in semantic memory
for result in coordination_result.results:
    if result.status == 'success':
        await store_memory(
            content=result.data,
            source=result.server,
            metadata={'sync_timestamp': result.timestamp}
        )
```

## Database Setup

### PostgreSQL with pgvector

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create memories table
CREATE TABLE memories (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(384),
    source VARCHAR(50) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for similarity search
CREATE INDEX ON memories USING ivfflat (embedding vector_cosine_ops);

-- Create source index
CREATE INDEX ON memories (source);

-- Create metadata index
CREATE INDEX ON memories USING gin (metadata);
```

### Redis Caching

```bash
# Redis configuration for caching embeddings and frequent queries
redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
```

## Performance & Monitoring

### Key Metrics

- **Search Response Time**: < 100ms for semantic search
- **Storage Throughput**: 1000+ memories/minute
- **MCP Coordination**: < 5 second multi-server sync
- **Memory Usage**: < 1GB for 100K stored memories
- **Cache Hit Rate**: > 80% for repeated queries

### Monitoring

```bash
# Memory service health
curl http://localhost:3003/health

# Detailed status
curl http://localhost:3003/api/status

# Performance metrics (if Prometheus enabled)
curl http://localhost:3003/metrics
```

## Development

### Local Development Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Set up PostgreSQL with pgvector
docker run -d \
  --name postgres-pgvector \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=twinning_memory \
  -p 5432:5432 \
  pgvector/pgvector:pg16

# Set up Redis
docker run -d \
  --name redis-cache \
  -p 6379:6379 \
  redis:alpine

# Run the service
cp .env.example .env
# Configure your environment variables
python memory_api.py
```

### Testing Semantic Search

```python
# Test script
import requests

# Store test memory
response = requests.post('http://localhost:3003/api/memory/store', json={
    'content': 'AI collaboration improves productivity through human-AI partnership',
    'source': 'test',
    'metadata': {'category': 'ai-insights'}
})

# Search for related content
response = requests.post('http://localhost:3003/api/memory/search', json={
    'query': 'artificial intelligence productivity',
    'limit': 5
})

print(response.json())
```

## Docker Deployment

### Build and Run

```bash
# Build image
docker build -t twinning-memory .

# Run with environment variables
docker run -d \
  --name twinning-memory \
  -p 3003:3003 \
  -e DATABASE_URL=postgresql://user:pass@db:5432/twinning_memory \
  -e REDIS_URL=redis://redis:6379/0 \
  -e ANTHROPIC_API_KEY=your-key \
  --restart unless-stopped \
  twinning-memory
```

### Docker Compose Integration

```yaml
version: '3.8'
services:
  memory:
    build: ./services/memory
    ports:
      - "3003:3003"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/twinning_memory
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - postgres
      - redis

  postgres:
    image: pgvector/pgvector:pg16
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=twinning_memory
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data
```

## OMAC Philosophy

The memory service embodies the **#ProleVibeSummer** principle: **"Let the algorithms toil while the humans vibe"** by:

### Data Sovereignty
- **Your Memory, Your Rules**: All semantic search happens on your infrastructure
- **No Platform Lock-in**: Export/import freedom with open standards
- **Privacy by Design**: AI processing occurs entirely within your control

### Human-Controlled Automation
- **Transparent Decisions**: See why the system suggests what it does
- **Override Everything**: Human choices always trump algorithmic suggestions  
- **Iterative Learning**: System improves based on your actual preferences

### AI Amplification
- **Semantic Understanding**: AI helps you find connections you might miss
- **Pattern Recognition**: Identifies trends across your personal and business data
- **Context Preservation**: Remembers important details across services and time

## Use Cases

### Personal Knowledge Management
- **Research Notes**: Store and find insights across projects
- **Contact Intelligence**: Remember important details about people
- **Project Memory**: Maintain context across long-term initiatives

### Business Operations
- **Customer Insights**: Aggregate intelligence from multiple touchpoints
- **Process Memory**: Learn from past decisions and outcomes
- **Team Knowledge**: Shared memory layer for collaborative intelligence

### Creative Work
- **Inspiration Archive**: Store and find creative references
- **Idea Evolution**: Track how concepts develop over time
- **Cross-Pollination**: Find unexpected connections between projects

## Troubleshooting

### Common Issues

1. **pgvector Extension Not Found**
   ```bash
   # Install pgvector in your PostgreSQL instance
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

2. **Slow Semantic Search**
   - Check vector index: `CREATE INDEX ON memories USING ivfflat (embedding vector_cosine_ops);`
   - Monitor embedding cache hit rate
   - Consider adjusting similarity threshold

3. **MCP Server Connection Issues**
   - Verify MCP server URLs and connectivity
   - Check MCP server health endpoints
   - Review orchestration logs

4. **High Memory Usage**
   - Monitor embedding cache size
   - Adjust Redis memory limits
   - Consider pagination for large result sets

### Debug Commands

```bash
# Check service health
curl http://localhost:3003/health

# Test semantic search
curl -X POST http://localhost:3003/api/memory/search \
  -H "Content-Type: application/json" \
  -d '{"query": "test search", "limit": 5}'

# Check MCP orchestration
curl -X POST http://localhost:3003/api/mcp/orchestrate \
  -H "Content-Type: application/json" \
  -d '{"servers": ["notion"], "operation": "status"}'

# Monitor logs
docker logs twinning-memory -f
```

## Contributing

### Adding New Memory Types

1. Define memory schema in database
2. Add processing logic in `memory_api.py`
3. Update embedding generation for new content types
4. Add ethical evaluation for new memory types
5. Update documentation and tests

### Integration Guidelines

- All memory operations must use SPELWork ethical framework
- Maintain backwards compatibility with existing memory APIs
- Follow structured logging patterns for debugging
- Include comprehensive health checks
- Preserve user privacy and data sovereignty

## Support

For memory service questions:

- **Memory Issues**: Create issues in the Twinning repository
- **Performance Questions**: Review the service status endpoint
- **Integration Help**: Check cross-service coordination documentation  
- **Ethical Framework**: Refer to SPELWork documentation

---

**Part of the Twinning Ecosystem - AI-Human Collaboration with Data Sovereignty**

*"Your memory, amplified by AI, controlled by you" - The OMAC principle in action*
