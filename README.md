# Twinning

**Personal AI Automation to Improve Your Workflow - The SPELCraft Way**

*Your Data, Your Rules - AI amplifies humans, never replaces human choice*

[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red.svg)](LICENSE.md)
[![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-orange.svg)](#mcp-ecosystem)
[![AI Ethics](https://img.shields.io/badge/AI-SPELWork%20Framework-green.svg)](#ethical-ai-framework)
[![Data Sovereignty](https://img.shields.io/badge/Data-Self%20Hosted-purple.svg)](#data-sovereignty)

**Twinning** is your personal AI automation platform that improves workflow efficiency through ethical, self-hosted intelligence. Built with the SPELWork framework, Twinning transforms how you work by automating routine tasks while preserving complete control over your personal and business data.

## 🎯 Core Philosophy

**AI amplifies humans, never replaces human choice.**

Twinning embodies the #ProleVibeSummer principle: "Let the algorithms toil while the humans vibe" by ensuring:
- **Human Agency**: Every AI decision can be overridden by human choice
- **Data Sovereignty**: Complete ownership and control of personal/business data
- **Ethical AI**: All AI operations evaluated through the SPELWork ethical framework
- **Privacy First**: No unnecessary external dependencies or data sharing
- **Transparency**: Clear understanding of how AI systems make decisions

## 🏗️ Platform Architecture

### Production-Ready Microservices

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
│                         SPELWork Ethical Framework                          │
│                           MCP Ecosystem Integration                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Service Capabilities

**🧠 Intelligence Service (Rockford Integration)**
- **Performance**: 64.3 contacts/sec processing rate
- **Contact Intelligence**: Sync, deduplication, and enrichment
- **Email Intelligence**: Processing and status tracking
- **Data Enrichment**: Multi-source web/LinkedIn intelligence
- **Pipeline Orchestration**: Workflow automation

**💾 Memory Service (OMAC Integration)**
- **Performance**: Sub-100ms semantic search across 100K+ memories
- **Semantic Search**: pgvector-powered similarity search
- **Cross-Service Memory**: Unified memory layer for all services
- **MCP Orchestration**: Apple, Notion, GitHub, RSS coordination

**📱 Social Service (Scuttle)**
- **Multi-Platform**: Bluesky, LinkedIn, WordPress integration
- **AI Content Generation**: Anthropic Claude, OpenAI, local LLM support
- **Rate Limiting**: Platform-compliant posting automation
- **MCP Integration**: Coordinated content workflows

**🎯 Core Service**
- **Service Orchestration**: Health monitoring and coordination
- **API Gateway**: Unified service management
- **Docker Compose**: Multi-service deployment

## 🔗 MCP Ecosystem

**Active MCP Servers:**

- **📱 Apple MCP**: Calendar, Notes, Mail, Contacts, Reminders, Messages, Maps
- **🐙 GitHub MCP**: Repository management, issues, PRs, releases
- **📝 Notion MCP**: Knowledge management and databases
- **📡 RSS MCP**: Content aggregation and monitoring

**Benefits:**
- **Unified AI Interface**: Single protocol for all external integrations
- **Data Sovereignty**: Local processing with secure API boundaries
- **Modular Architecture**: Add/remove capabilities without core system changes
- **Cross-Service Coordination**: Shared MCP access across all services

## 🛡️ Ethical AI Framework

All AI operations are evaluated through the **SPELWork ethical framework**:

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

**Human Agency Preservation:**
- **Override Capability**: Every AI decision can be overridden by human choice
- **Transparency**: Clear reasoning provided for all AI recommendations
- **Bias Detection**: Systematic monitoring for bias in AI operations
- **Human-in-the-Loop**: Critical decisions require human confirmation

## 🚀 Quick Start

### Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/toilville/twinning.git
cd twinning

# Start all services
docker-compose up

# Services will be available at:
# - Core: http://localhost:3000
# - Intelligence: http://localhost:3002
# - Memory: http://localhost:3003
# - Social: http://localhost:8080
```

### Manual Service Setup

```bash
# Intelligence Service
cd services/intelligence
npm install && npm run dev

# Memory Service  
cd services/memory
pip install -r requirements.txt && python memory_api.py

# Social Service
cd services/social
pip install -r requirements.txt && python social_automation_api.py
```

### Health Checks

```bash
# Verify all services are running
curl http://localhost:3000/health  # Core
curl http://localhost:3002/health  # Intelligence
curl http://localhost:3003/health  # Memory
curl http://localhost:8080/health  # Social
```

## 📊 Performance Benchmarks

- **Intelligence Service**: 64.3 contacts/sec processing rate
- **Memory Service**: Sub-100ms semantic search response time
- **Social Service**: Multi-platform posting with rate limiting compliance
- **Cross-Service**: < 5 second coordination for complex workflows

## 🔒 Data Sovereignty

**Complete Control:**
- **Zero Cloud Dependencies**: All processing happens on your infrastructure
- **No External Data Sharing**: AI processing occurs entirely within Twinning boundaries
- **Platform Independence**: No vendor lock-in or mandatory external services
- **User Control**: Complete ownership of data with export/import capabilities

**Security Measures:**
- **Encrypted Storage**: AES-256 for data at rest
- **Secure Communication**: TLS 1.3 for all inter-service communication
- **Access Control**: Role-based permissions with audit logging
- **Privacy by Design**: No surveillance capitalism or data monetization

## 🛠️ Development

### Prerequisites

- Docker and Docker Compose
- Node.js (for Intelligence service)
- Python 3.8+ (for Memory and Social services)
- PostgreSQL with pgvector extension
- Redis for caching

### Environment Setup

```bash
# Copy environment templates
cp services/intelligence/.env.example services/intelligence/.env
cp services/memory/.env.example services/memory/.env
cp services/social/.env.example services/social/.env

# Configure your API keys and settings
# Edit the .env files with your credentials
```

### Service Development

```bash
# Intelligence Service (TypeScript)
cd services/intelligence
npm run dev

# Memory Service (Python)
cd services/memory
python memory_api.py

# Social Service (Python)
cd services/social
python social_automation_api.py
```

## 📚 Documentation

- **[Intelligence Service](services/intelligence/README.md)**: Contact processing and data enrichment
- **[Memory Service](services/memory/README.md)**: Semantic search and cross-service coordination
- **[Social Service](services/social/README.md)**: Multi-platform content automation
- **[MCP Ecosystem](docs/MCP_ECOSYSTEM.md)**: Model Context Protocol integration
- **[Architecture](docs/TWINNING_ARCHITECTURE.md)**: Technical architecture and deployment
- **[Contributing](CONTRIBUTING.md)**: Development guidelines and ethical AI principles

## 🎯 Use Cases

### Personal Productivity
- **AI-Amplified Workflows**: Enhance human decision-making with intelligent automation
- **Data-Driven Insights**: Personal analytics while maintaining complete privacy
- **Cross-Platform Integration**: Unified access to Apple, GitHub, Notion ecosystems

### Business Operations
- **Client Intelligence**: 64.3 contacts/sec processing for business development
- **Content Automation**: AI-powered social media with human oversight
- **Knowledge Management**: Semantic search across all business information

### Privacy-Focused AI
- **Data Sovereignty**: Complete control over AI training and inference
- **Ethical AI Development**: SPELWork framework ensures responsible AI deployment
- **Platform Independence**: No dependency on external AI services

## 🤝 Community & Support

### Contributing

We welcome contributions that align with our core principles:
- **Ethical AI**: All contributions must use the SPELWork framework
- **Data Sovereignty**: Preserve user control and privacy
- **Human Agency**: Maintain human override capabilities
- **Professional Quality**: Production-ready code with comprehensive testing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/toilville/twinning/issues)
- **Discussions**: [GitHub Discussions](https://github.com/toilville/twinning/discussions)
- **Documentation**: Comprehensive guides in each service directory

## ⚖️ License

**Copyright (c) 2025 Toilville Consulting / Peter Swimm**

**All Rights Reserved** - See [LICENSE.md](LICENSE.md) for details.

*This is a temporary licensing arrangement while we evaluate the most appropriate open source license for this project. We remain committed to eventually providing this technology under terms that support the broader community while protecting our intellectual property interests.*

For licensing inquiries: licensing@itstoilville.com

---

**Twinning** - AI-Human Collaboration with Data Sovereignty

*Built by workers, for workers. Professional AI infrastructure that respects human choice.*

🔗 **Repository**: https://github.com/toilville/twinning
