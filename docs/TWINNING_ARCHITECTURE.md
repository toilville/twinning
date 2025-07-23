# Twinning Architecture

**AI-Human Collaboration Platform with Complete Data Sovereignty**

Twinning is a self-hosted AI infrastructure platform that provides production-ready services for intelligence processing, semantic memory, social automation, and comprehensive MCP ecosystem coordination.

## Current Platform Architecture (Phase 0.5) ✅ DEPLOYED

### Microservices Infrastructure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Twinning Platform                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Intelligence│  │   Memory    │  │   Social    │  │    Core     │        │
│  │ Service     │  │  Service    │  │  Service    │  │  Service    │        │
│  │ (Rockford)  │  │  (OMAC)     │  │ (Scuttle)   │  │             │        │
│  │ Port 3002   │  │ Port 3003   │  │ Port 8080   │  │ Port 3000   │        │
│  │ TypeScript  │  │ Python      │  │ Python      │  │ Node.js     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────────────────────┤
│                        Cross-Service Coordination                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ PostgreSQL  │  │    Redis    │  │ Prometheus  │  │   Grafana   │        │
│  │ + pgvector  │  │   Cache     │  │  Metrics    │  │ Dashboards  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────────────────────┤
│                           MCP Ecosystem                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Apple MCP  │  │ GitHub MCP  │  │ Notion MCP  │  │   RSS MCP   │        │
│  │   Server    │  │   Server    │  │   Server    │  │   Server    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────────────────────┤
│                         SPELWork Ethical Framework                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Service Capabilities

**Intelligence Service (Rockford Integration)**
- **Performance**: 64.3 contacts/sec processing rate
- **Capabilities**: Contact intelligence, email processing, data enrichment, pipeline orchestration
- **Technology**: TypeScript/Node.js with Express framework
- **Integration**: Apple Mail, Notion databases, ethical AI evaluation

**Memory Service (OMAC Integration)** 
- **Performance**: Sub-100ms semantic search across 100K+ memories
- **Capabilities**: pgvector-powered similarity search, cross-service memory coordination
- **Technology**: Python/Flask with PostgreSQL + pgvector extension
- **Integration**: Unified memory layer for all Twinning services

**Social Service (Scuttle)**
- **Performance**: Multi-platform posting with rate limiting
- **Capabilities**: AI-powered content generation, Bluesky/LinkedIn/WordPress integration
- **Technology**: Python/Flask with multi-provider AI support
- **Integration**: Anthropic Claude, OpenAI, MCP server coordination

**Core Service**
- **Performance**: Health monitoring and service orchestration
- **Capabilities**: Cross-service coordination, health checks, API gateway
- **Technology**: Node.js with Docker Compose orchestration
- **Integration**: Unified service management and monitoring

## MCP (Model Context Protocol) Ecosystem

### Active MCP Servers ✅ DEPLOYED

**Apple MCP Server** (`github.com/Dhravya/apple-mcp`)
- **📅 Calendar**: Create, search, and manage events across all calendars
- **📝 Notes**: Create, search, and read Apple Notes content
- **👥 Contacts**: Search contacts for communication workflows  
- **📧 Mail**: Send emails, search content, manage unread messages
- **✅ Reminders**: Create, search, and manage tasks with due dates
- **💬 Messages**: Send and read messages through Apple Messages
- **🗺️ Maps**: Location search, directions, favorites, and guides
- **🌐 Web Search**: DuckDuckGo-powered web searches

**GitHub MCP Server** (`github.com/github/github-mcp-server`)
- Repository management and code collaboration
- Issue tracking and project management
- Pull request workflows and code reviews
- Release management and deployment tracking
- Team coordination and development workflows

**Notion MCP Server** (`@notionhq/notion-mcp-server`)
- Knowledge management and documentation systems
- Database queries and content management
- Team coordination and project tracking
- Structured data organization and retrieval

### Planned Twinning-Specific MCP Servers

**Twinning Filesystem MCP**: Local data access and organization
**Twinning Analytics MCP**: Business intelligence and metrics access  
**Twinning Health MCP**: Personal health data integration
**Twinning Creative MCP**: Creative project and output analytics

### MCP Architecture Benefits

- **Unified AI Interface**: Single protocol for all external integrations
- **Data Sovereignty**: Local processing with secure API boundaries
- **Modular Architecture**: Add/remove capabilities without core system changes
- **Cross-Service Coordination**: Shared MCP access across Intelligence, Memory, and Social services
- **Ethical AI Integration**: All MCP operations evaluated through SPELWork framework
- **Performance Optimization**: Coordinated caching and intelligent request routing

## Data Infrastructure

### Database Architecture

**PostgreSQL with pgvector**
- Semantic search capabilities for Memory service
- ACID compliance for transactional data
- Vector embeddings with similarity search indexes
- Configurable retention policies and data lifecycle management

**Redis Cache Layer**
- High-performance caching for frequent queries
- Session management and temporary data storage
- Cross-service communication and pub/sub messaging
- Performance optimization with configurable TTL

### Performance Benchmarks

**Intelligence Service**: 64.3 contacts/sec processing rate (maintained from Rockford)
**Memory Service**: Sub-100ms semantic search response time
**Social Service**: Multi-platform posting with rate limiting compliance
**Cross-Service**: < 5 second coordination for complex workflows

## SPELWork Ethical Framework Integration

### Ethical AI Evaluation
All AI operations across Twinning services are evaluated through the SPELWork ethical framework:

```typescript
// Example: Ethical evaluation pattern used across all services
const wish = createWishDefinition(
  'process_user_data',
  userData,
  userId
);

const evaluation = await ethicalFramework.evaluateWish(wish);

if (evaluation.ethicallySound) {
  // Proceed with AI processing
  const result = await processWithAI(userData);
  return ethicalFramework.validateOutput(result);
} else {
  // Block operation and provide reasoning
  return { blocked: true, reasoning: evaluation.reasoning };
}
```

### Human Agency Preservation
- **Override Capability**: Every AI decision can be overridden by human choice
- **Transparency**: Clear reasoning provided for all AI recommendations
- **Bias Detection**: Systematic monitoring for bias in AI operations
- **Human-in-the-Loop**: Critical decisions require human confirmation

## Security & Privacy Model

### Data Sovereignty Architecture
- **Zero Cloud Dependencies**: All processing happens locally or on user-controlled infrastructure
- **No External Data Sharing**: AI processing occurs entirely within Twinning boundaries
- **Platform Independence**: No vendor lock-in or mandatory external services
- **User Control**: Complete ownership of data with export/import capabilities

### Security Measures
- **Encrypted Storage**: AES-256 for data at rest
- **Secure Communication**: TLS 1.3 for all inter-service communication
- **Access Control**: Role-based permissions with audit logging
- **VPN Access**: WireGuard for secure remote connections
- **Certificate Management**: Let's Encrypt for HTTPS with automated renewal

### Backup & Recovery
- **Local Redundancy**: Automated backups with configurable retention
- **Encrypted Cloud Storage**: Optional encrypted remote backup
- **Point-in-Time Recovery**: Database-level transaction log recovery
- **Service Health Monitoring**: Automated recovery and failover procedures

## Deployment Architecture

### Docker Compose Infrastructure
**Network**: `twinning-network` with service discovery
**Volumes**: Persistent storage for databases and application data
**Health Checks**: Comprehensive monitoring with automatic restart policies
**Environment Management**: Centralized configuration with validation

### Development Environment
```bash
# Quick start for development
docker-compose up
# Services available at:
# - Core: http://localhost:3000
# - Intelligence: http://localhost:3002  
# - Memory: http://localhost:3003
# - Social: http://localhost:8080
```

### Production Deployment Options

**Self-Hosted VPS**
- Ubuntu/Debian on user-controlled VPS
- Domain with SSL certificate management
- Prometheus monitoring with Grafana dashboards
- Production-grade database configuration

**Local Development**
- macOS with Docker Desktop
- Full MCP ecosystem integration
- Local development and testing
- Family/personal use cases

**Hybrid Architecture**
- Local Mac Mini for development and testing
- VPS for production services and public access
- Synchronized data between environments
- Seamless development-to-production workflow

## Future Architecture (Phase 1.0 & 2.0)

### Phase 1.0 Enhancements
- **Local LLM Integration**: Self-hosted language models with MCP data sources
- **Advanced Analytics**: Predictive insights using semantic search
- **Voice Interface**: Natural language interaction with MCP ecosystem
- **Performance Optimization**: Sub-50ms response times for critical operations

### Phase 2.0 Vision
- **Federated MCP Networks**: Cross-device and cross-platform synchronization
- **Advanced AI Collaboration**: Sophisticated human-AI workflow patterns
- **Community Ecosystem**: Third-party MCP server marketplace
- **Industry Leadership**: Reference implementation for privacy-focused AI platforms
