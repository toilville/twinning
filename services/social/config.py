#!/usr/bin/env python3
"""
Scuttle Configuration Management
Handles user-configurable AI providers and MCP server suggestions
"""

import os
import json
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from dotenv import load_dotenv

load_dotenv()

@dataclass
class AIProvider:
    """Configuration for AI content processing providers"""
    name: str
    type: str  # 'anthropic', 'openai', 'local_llm'
    api_key_env: str
    model: str
    max_tokens: int = 500
    enabled: bool = True

@dataclass
class MCPServer:
    """Configuration for MCP server integrations"""
    name: str
    description: str
    capabilities: List[str]
    required_env_vars: List[str]
    optional: bool = True
    suggested: bool = False

@dataclass
class PlatformConfig:
    """Configuration for social media platforms"""
    name: str
    enabled: bool
    auth_type: str  # 'api_key', 'oauth', 'app_password'
    required_env_vars: List[str]

class ScuttleConfig:
    """Main configuration class for Scuttle service"""
    
    def __init__(self):
        self.ai_providers = self._load_ai_providers()
        self.mcp_servers = self._load_mcp_servers()
        self.platforms = self._load_platforms()
        self.service_config = self._load_service_config()
    
    def _load_ai_providers(self) -> List[AIProvider]:
        """Load configured AI providers"""
        providers = []
        
        # Anthropic Claude (Primary recommendation)
        if os.getenv('ANTHROPIC_API_KEY'):
            providers.append(AIProvider(
                name='Claude',
                type='anthropic',
                api_key_env='ANTHROPIC_API_KEY',
                model='claude-3-5-sonnet-20241022',
                max_tokens=500,
                enabled=True
            ))
        
        # OpenAI (Secondary option)
        if os.getenv('OPENAI_API_KEY'):
            providers.append(AIProvider(
                name='OpenAI',
                type='openai',
                api_key_env='OPENAI_API_KEY',
                model='gpt-4',
                max_tokens=500,
                enabled=bool(os.getenv('OPENAI_ENABLED', 'false').lower() == 'true')
            ))
        
        # Local LLM (Future expansion)
        if os.getenv('LOCAL_LLM_ENDPOINT'):
            providers.append(AIProvider(
                name='Local LLM',
                type='local_llm',
                api_key_env='LOCAL_LLM_ENDPOINT',
                model=os.getenv('LOCAL_LLM_MODEL', 'llama2'),
                max_tokens=500,
                enabled=bool(os.getenv('LOCAL_LLM_ENABLED', 'false').lower() == 'true')
            ))
        
        return providers
    
    def _load_mcp_servers(self) -> List[MCPServer]:
        """Load suggested MCP server configurations"""
        return [
            MCPServer(
                name='Apple MCP',
                description='Native macOS/iOS integration (Calendar, Notes, Contacts, Mail, etc.)',
                capabilities=['calendar', 'notes', 'contacts', 'mail', 'reminders', 'messages'],
                required_env_vars=[],  # Uses system authentication
                optional=True,
                suggested=True
            ),
            MCPServer(
                name='Notion MCP',
                description='Knowledge management and content workflow',
                capabilities=['databases', 'pages', 'blocks', 'comments'],
                required_env_vars=['NOTION_TOKEN', 'NOTION_DATABASE_ID'],
                optional=True,
                suggested=True
            ),
            MCPServer(
                name='GitHub MCP',
                description='Repository management and development workflows',
                capabilities=['issues', 'pull_requests', 'repositories', 'workflows'],
                required_env_vars=['GITHUB_TOKEN'],
                optional=True,
                suggested=False
            ),
            MCPServer(
                name='Twinning Analytics MCP',
                description='Personal analytics and business intelligence',
                capabilities=['metrics', 'insights', 'reporting'],
                required_env_vars=['TWINNING_API_KEY'],
                optional=True,
                suggested=False
            )
        ]
    
    def _load_platforms(self) -> List[PlatformConfig]:
        """Load social media platform configurations"""
        return [
            PlatformConfig(
                name='Bluesky',
                enabled=bool(os.getenv('BLUESKY_PERSONAL_HANDLE') or os.getenv('BLUESKY_BUSINESS_HANDLE')),
                auth_type='app_password',
                required_env_vars=['BLUESKY_HANDLE', 'BLUESKY_PASSWORD']
            ),
            PlatformConfig(
                name='LinkedIn',
                enabled=bool(os.getenv('LINKEDIN_ACCESS_TOKEN')),
                auth_type='oauth',
                required_env_vars=['LINKEDIN_ACCESS_TOKEN']
            ),
            PlatformConfig(
                name='WordPress',
                enabled=bool(os.getenv('WORDPRESS_URL')),
                auth_type='app_password',
                required_env_vars=['WORDPRESS_URL', 'WORDPRESS_USER', 'WORDPRESS_APP_PASSWORD']
            )
        ]
    
    def _load_service_config(self) -> Dict[str, Any]:
        """Load general service configuration"""
        return {
            'test_mode': os.getenv('TEST_MODE', 'true').lower() == 'true',
            'service_port': int(os.getenv('SERVICE_PORT', 8080)),
            'twinning_api_url': os.getenv('TWINNING_API_URL', 'http://twinning-core:3000'),
            'log_level': os.getenv('LOG_LEVEL', 'INFO'),
            'rate_limit_posts_per_hour': int(os.getenv('RATE_LIMIT_POSTS_PER_HOUR', 10)),
            'default_ai_provider': os.getenv('DEFAULT_AI_PROVIDER', 'anthropic')
        }
    
    def get_active_ai_provider(self) -> Optional[AIProvider]:
        """Get the currently active AI provider"""
        # Try default provider first
        default_type = self.service_config['default_ai_provider']
        for provider in self.ai_providers:
            if provider.type == default_type and provider.enabled:
                return provider
        
        # Fall back to first enabled provider
        for provider in self.ai_providers:
            if provider.enabled:
                return provider
        
        return None
    
    def get_enabled_platforms(self) -> List[PlatformConfig]:
        """Get list of enabled social media platforms"""
        return [platform for platform in self.platforms if platform.enabled]
    
    def get_suggested_mcp_servers(self) -> List[MCPServer]:
        """Get list of suggested MCP servers"""
        return [server for server in self.mcp_servers if server.suggested]
    
    def validate_configuration(self) -> Dict[str, Any]:
        """Validate current configuration and return status"""
        validation = {
            'valid': True,
            'warnings': [],
            'errors': [],
            'ai_providers': len([p for p in self.ai_providers if p.enabled]),
            'platforms': len(self.get_enabled_platforms()),
            'suggested_mcp': len(self.get_suggested_mcp_servers())
        }
        
        # Check AI providers
        if not self.get_active_ai_provider():
            validation['errors'].append('No active AI provider configured')
            validation['valid'] = False
        
        # Check platforms
        if not self.get_enabled_platforms():
            validation['warnings'].append('No social media platforms enabled')
        
        # Check MCP servers
        available_mcp = []
        for server in self.mcp_servers:
            missing_vars = [var for var in server.required_env_vars if not os.getenv(var)]
            if not missing_vars:
                available_mcp.append(server.name)
            elif server.suggested:
                validation['warnings'].append(f'Suggested MCP server "{server.name}" missing: {missing_vars}')
        
        validation['available_mcp'] = available_mcp
        
        return validation
    
    def to_dict(self) -> Dict[str, Any]:
        """Export configuration as dictionary"""
        return {
            'ai_providers': [asdict(p) for p in self.ai_providers],
            'mcp_servers': [asdict(m) for m in self.mcp_servers],
            'platforms': [asdict(p) for p in self.platforms],
            'service_config': self.service_config,
            'validation': self.validate_configuration()
        }

# Global configuration instance
config = ScuttleConfig()
