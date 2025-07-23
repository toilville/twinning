# Scuttle - Social Media Automation Service

**Scuttle** is a sophisticated social media automation service within the **Twinning** ecosystem, designed for AI-powered content processing, multi-platform posting, and user-configurable integrations.

## 🚀 Features

### AI Content Processing
- **Multi-Provider Support**: Anthropic Claude, OpenAI GPT, and Local LLM support
- **User-Configurable**: Choose your preferred AI provider via environment variables
- **Custom Prompts**: Personalized content generation for different use cases
- **Smart Fallbacks**: Automatic provider switching if primary fails

### Social Media Platforms
- **Bluesky**: Personal and business account support via AT Protocol
- **LinkedIn**: Professional posting with OAuth integration
- **WordPress**: Blog publishing with metadata tracking
- **Rate Limiting**: Built-in rate limiting to respect platform limits

### MCP Ecosystem Integration
- **Apple MCP**: Native macOS integration (Calendar, Notes, Contacts, Mail, Reminders)
- **Notion MCP**: Content workflow management and database integration
- **GitHub MCP**: Development workflow automation and project announcements
- **User-Configurable**: Enable only the MCP servers you need

### Twinning Integration
- **Microservice Architecture**: Seamlessly integrates with Twinning's self-hosted infrastructure
- **Docker Support**: Containerized deployment with docker-compose
- **Health Monitoring**: Comprehensive health checks and status reporting
- **Configuration Management**: Centralized configuration with validation

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Scuttle Service                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   AI Providers  │  │   Platforms     │  │  MCP Servers    │  │
│  │  - Anthropic    │  │  - Bluesky      │  │  - Apple MCP    │  │
│  │  - OpenAI       │  │  - LinkedIn     │  │  - Notion MCP   │  │
│  │  - Local LLM    │  │  - WordPress    │  │  - GitHub MCP   │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                     Flask REST API                              │
├─────────────────────────────────────────────────────────────────┤
│                   Twinning Integration                          │
└─────────────────────────────────────────────────────────────────┘
```

## 🛠️ Setup & Configuration

### 1. Environment Configuration

Copy the example environment file and configure your credentials:

```bash
cp .env.example .env
# Edit .env with your actual API keys and credentials
```

### 2. Required Configuration

**Minimum setup requires:**
- At least one AI provider (Anthropic Claude recommended)
- At least one social media platform
- Service configuration (optional, has defaults)

### 3. AI Provider Setup

**Anthropic Claude (Recommended):**
```bash
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxx
DEFAULT_AI_PROVIDER=anthropic
```

**OpenAI (Alternative):**
```bash
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
OPENAI_ENABLED=true
DEFAULT_AI_PROVIDER=openai
```

**Local LLM (Future):**
```bash
LOCAL_LLM_ENDPOINT=http://localhost:11434
LOCAL_LLM_MODEL=llama2
LOCAL_LLM_ENABLED=true
DEFAULT_AI_PROVIDER=local_llm
```

### 4. Social Media Platform Setup

**Bluesky:**
```bash
BLUESKY_PERSONAL_HANDLE=your.handle.bsky.social
BLUESKY_PERSONAL_PASSWORD=xxxx-xxxx-xxxx-xxxx
BLUESKY_BUSINESS_HANDLE=business.bsky.social
BLUESKY_BUSINESS_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

**LinkedIn:**
```bash
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token
```

**WordPress:**
```bash
WORDPRESS_URL=https://yourdomain.com
WORDPRESS_USER=your_username
WORDPRESS_APP_PASSWORD=your_app_password
```

### 5. MCP Server Integration (Optional)

**Notion MCP:**
```bash
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**GitHub MCP:**
```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxx
```

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start the service
python social_automation_api.py
```

### Docker Deployment

```bash
# Build and run with docker-compose (from twinning root)
docker-compose up scuttle-social
```

### Testing the Service

```bash
# Health check
curl http://localhost:8080/health

# Get configuration status
curl http://localhost:8080/config

# Get MCP integration suggestions
curl http://localhost:8080/mcp/suggestions

# Process content with AI
curl -X POST http://localhost:8080/api/process \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello world! This is a test post."}'

# Post to social media platforms
curl -X POST http://localhost:8080/api/post \
  -H "Content-Type: application/json" \
  -d '{
    "content": "🚀 Just launched Scuttle! #AI #automation",
    "platforms": ["bluesky"],
    "title": "Scuttle Launch"
  }'
```

## 📊 API Endpoints

### Core Service
- `GET /health` - Service health check
- `GET /status` - Detailed service status
- `GET /config` - Configuration details

### Content Processing
- `POST /api/process` - Process content with AI
- `POST /api/post` - Post to social media platforms
- `GET /api/analytics` - Get analytics data

### MCP Integration
- `GET /mcp` - MCP integration status
- `GET /mcp/suggestions` - MCP server suggestions
- `GET /mcp/setup-guide` - Personalized setup guide
- `GET /mcp/apple` - Apple MCP integration details
- `GET /mcp/notion` - Notion MCP integration details
- `GET /mcp/github` - GitHub MCP integration details

## 🔧 Configuration Options

### Service Settings
```bash
SERVICE_PORT=8080              # API service port
TEST_MODE=true                 # Enable test mode ([TEST] prefix)
LOG_LEVEL=INFO                 # Logging level
RATE_LIMIT_POSTS_PER_HOUR=10   # Rate limiting
```

### Twinning Integration
```bash
TWINNING_API_URL=http://twinning-core:3000  # Twinning core API
DOCKER_NETWORK=twinning-network             # Docker network
```

## 🎯 Use Cases

### 1. Personal Content Automation
- Process personal thoughts into engaging social media posts
- Schedule content across multiple platforms
- Maintain consistent online presence

### 2. Business Social Media Management
- AI-powered content optimization for brand voice
- Multi-platform posting with platform-specific formatting
- Analytics tracking for performance optimization

### 3. Developer Community Engagement
- Automate project announcements from GitHub releases
- Share development progress and milestones
- Build developer community engagement

### 4. Integrated Workflow Management
- Use Apple ecosystem for content creation and scheduling
- Notion for content planning and workflow management
- GitHub for automated documentation updates

## 🔐 Security & Privacy

### Data Sovereignty
- All processing happens within your Twinning infrastructure
- No data sent to external services except chosen AI providers
- Full control over data retention and access

### API Security
- Environment variable protection
- Rate limiting to prevent abuse
- Comprehensive error handling and logging
- Test mode for safe development

### Credential Management
- Secure credential storage via environment variables
- No hardcoded credentials in source code
- Optional MCP server integration (user choice)

## 🚀 Deployment

### Standalone Deployment
```bash
python social_automation_api.py
```

### Docker Deployment
```bash
docker build -t scuttle .
docker run -p 8080:8080 --env-file .env scuttle
```

### Twinning Integration
```bash
# From Twinning root directory
docker-compose up scuttle-social
```

## 🛠️ Development

### Project Structure
```
services/social/
├── social_automation_api.py    # Main Flask application
├── config.py                   # Configuration management
├── mcp_integration.py          # MCP server integration
├── requirements.txt            # Python dependencies
├── .env.example               # Environment template
├── Dockerfile                 # Container configuration
└── README.md                  # This file
```

### Adding New Platforms
1. Update `config.py` with new platform configuration
2. Add platform-specific posting logic in `social_automation_api.py`
3. Update environment variable templates
4. Add platform tests

### Adding New AI Providers
1. Update `AIProvider` configuration in `config.py`
2. Add provider client initialization in `social_automation_api.py`
3. Implement provider-specific processing logic
4. Update documentation and examples

## 📈 Roadmap

### Phase 1: Core Functionality ✅
- Multi-provider AI content processing
- Multi-platform social media posting
- User-configurable MCP server integration
- Twinning ecosystem integration

### Phase 2: Enhanced Analytics
- Real-time engagement tracking
- Performance optimization recommendations
- Advanced analytics dashboard
- Cross-platform analytics correlation

### Phase 3: Advanced Automation
- Automated content scheduling optimization
- AI-powered audience analysis
- Custom workflow automation
- Advanced MCP server integrations

## 🤝 Contributing

Scuttle is part of the Twinning ecosystem. Contributions are welcome!

1. Fork the Twinning repository
2. Create a feature branch for social service changes
3. Test thoroughly with multiple configurations
4. Submit a pull request with comprehensive documentation

## 📞 Support

- **Documentation**: See main Twinning documentation
- **Issues**: Create issues in the main Twinning repository
- **Community**: Join Twinning community discussions

---

**Scuttle** - Intelligent social media automation for the privacy-focused AI era.
