#!/usr/bin/env python3
"""
Scuttle - Social Media Automation Service
Full-featured social media automation with AI content processing,
multi-platform posting, and user-configurable providers.
"""

from flask import Flask, request, jsonify
import os
import logging
import time
from datetime import datetime, date
from notion_client import Client
from atproto import Client as BlueSkyClient
import anthropic
import openai
import requests
from dotenv import load_dotenv
from config import config, AIProvider, PlatformConfig
from mcp_integration import mcp

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure logging
log_level = getattr(logging, config.service_config['log_level'], logging.INFO)
logging.basicConfig(level=log_level, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ScuttleService:
    """Main Scuttle service class handling AI processing and social media posting"""
    
    def __init__(self):
        self.config = config
        self.notion = None
        self.bluesky_accounts = {}
        self.ai_clients = {}
        
        # Initialize integrations
        self._init_notion()
        self._init_bluesky_accounts()
        self._init_ai_clients()
        self._init_wordpress()
        self._init_linkedin()
    
    def _init_notion(self):
        """Initialize Notion client if configured"""
        try:
            notion_token = os.getenv('NOTION_TOKEN')
            if notion_token:
                self.notion = Client(auth=notion_token)
                self.database_id = os.getenv('NOTION_DATABASE_ID')
                logger.info("Notion integration initialized")
            else:
                logger.warning("Notion token not found - Notion integration disabled")
        except Exception as e:
            logger.error(f"Failed to initialize Notion: {e}")
    
    def _init_bluesky_accounts(self):
        """Initialize Bluesky accounts"""
        self.bluesky_accounts = {}
        
        # Personal account
        try:
            personal_handle = os.getenv('BLUESKY_PERSONAL_HANDLE')
            personal_password = os.getenv('BLUESKY_PERSONAL_PASSWORD')
            
            if personal_handle and personal_password:
                personal_client = BlueSkyClient()
                personal_client.login(personal_handle, personal_password)
                self.bluesky_accounts['personal'] = {
                    'client': personal_client,
                    'handle': personal_handle
                }
                logger.info(f"Bluesky personal account initialized: {personal_handle}")
        except Exception as e:
            logger.error(f"Failed to initialize Bluesky personal account: {e}")
        
        # Business account
        try:
            business_handle = os.getenv('BLUESKY_BUSINESS_HANDLE')
            business_password = os.getenv('BLUESKY_BUSINESS_PASSWORD')
            
            if business_handle and business_password:
                business_client = BlueSkyClient()
                business_client.login(business_handle, business_password)
                self.bluesky_accounts['business'] = {
                    'client': business_client,
                    'handle': business_handle
                }
                logger.info(f"Bluesky business account initialized: {business_handle}")
        except Exception as e:
            logger.error(f"Failed to initialize Bluesky business account: {e}")
    
    def _init_ai_clients(self):
        """Initialize AI provider clients"""
        self.ai_clients = {}
        
        for provider in self.config.ai_providers:
            if not provider.enabled:
                continue
                
            try:
                if provider.type == 'anthropic':
                    api_key = os.getenv(provider.api_key_env)
                    if api_key:
                        self.ai_clients[provider.type] = anthropic.Anthropic(api_key=api_key)
                        logger.info(f"Anthropic client initialized: {provider.name}")
                
                elif provider.type == 'openai':
                    api_key = os.getenv(provider.api_key_env)
                    if api_key:
                        self.ai_clients[provider.type] = openai.OpenAI(api_key=api_key)
                        logger.info(f"OpenAI client initialized: {provider.name}")
                
                elif provider.type == 'local_llm':
                    endpoint = os.getenv(provider.api_key_env)
                    if endpoint:
                        # TODO: Implement local LLM client
                        logger.info(f"Local LLM endpoint configured: {endpoint}")
                        
            except Exception as e:
                logger.error(f"Failed to initialize {provider.name}: {e}")
    
    def _init_wordpress(self):
        """Initialize WordPress configuration"""
        self.wordpress_url = os.getenv('WORDPRESS_URL')
        self.wordpress_user = os.getenv('WORDPRESS_USER')
        self.wordpress_password = os.getenv('WORDPRESS_APP_PASSWORD')
        
        if all([self.wordpress_url, self.wordpress_user, self.wordpress_password]):
            logger.info("WordPress configuration loaded")
        else:
            logger.warning("WordPress credentials incomplete")
    
    def _init_linkedin(self):
        """Initialize LinkedIn configuration"""
        self.linkedin_token = os.getenv('LINKEDIN_ACCESS_TOKEN')
        if self.linkedin_token:
            logger.info("LinkedIn configuration loaded")
        else:
            logger.warning("LinkedIn token not found")
    
    def process_with_ai(self, content, custom_prompt=None, provider_type=None):
        """Process content with AI using configured provider"""
        try:
            # Get AI provider
            if provider_type:
                provider = next((p for p in self.config.ai_providers if p.type == provider_type), None)
            else:
                provider = self.config.get_active_ai_provider()
            
            if not provider or provider.type not in self.ai_clients:
                raise Exception("No active AI provider available")
            
            # Default prompt
            prompt = custom_prompt or """
            Rewrite this content to be engaging for social media while maintaining the core message.
            Make it conversational, add value, and include relevant hashtags if appropriate.
            Keep the tone professional but approachable.
            """
            
            full_prompt = f"{prompt}\n\nContent to rewrite:\n{content}"
            
            # Process with appropriate client
            if provider.type == 'anthropic':
                response = self.ai_clients['anthropic'].messages.create(
                    model=provider.model,
                    max_tokens=provider.max_tokens,
                    messages=[{"role": "user", "content": full_prompt}]
                )
                return response.content[0].text.strip()
            
            elif provider.type == 'openai':
                response = self.ai_clients['openai'].chat.completions.create(
                    model=provider.model,
                    max_tokens=provider.max_tokens,
                    messages=[{"role": "user", "content": full_prompt}]
                )
                return response.choices[0].message.content.strip()
            
            else:
                raise Exception(f"AI provider type '{provider.type}' not implemented")
                
        except Exception as e:
            logger.error(f"Error processing content with AI: {e}")
            return None
    
    def post_to_bluesky(self, content, account_type='business'):
        """Post to Bluesky account"""
        if account_type not in self.bluesky_accounts:
            logger.warning(f"Bluesky {account_type} account not available")
            return None
        
        try:
            # Add test prefix if in test mode
            if self.config.service_config['test_mode']:
                content = f"[TEST] {content}"
            
            account = self.bluesky_accounts[account_type]
            client = account['client']
            handle = account['handle']
            
            response = client.send_post(content)
            
            if response and response.uri:
                parts = response.uri.split('/')
                rkey = parts[-1]
                bluesky_url = f"https://bsky.app/profile/{handle}/post/{rkey}"
                
                logger.info(f"Posted to Bluesky ({account_type}): {bluesky_url}")
                return bluesky_url
            
        except Exception as e:
            logger.error(f"Error posting to Bluesky {account_type}: {e}")
        
        return None
    
    def post_to_linkedin(self, content):
        """Post to LinkedIn"""
        if not self.linkedin_token:
            logger.warning("LinkedIn token not available")
            return None
        
        try:
            if self.config.service_config['test_mode']:
                content = f"[TEST] {content}"
            
            # Get user profile
            profile_url = "https://api.linkedin.com/v2/people/~"
            headers = {
                'Authorization': f'Bearer {self.linkedin_token}',
                'Content-Type': 'application/json'
            }
            
            profile_response = requests.get(profile_url, headers=headers)
            if profile_response.status_code != 200:
                logger.error(f"Failed to get LinkedIn profile: {profile_response.status_code}")
                return None
            
            profile_data = profile_response.json()
            author_urn = profile_data['id']
            
            # Create post
            url = "https://api.linkedin.com/v2/ugcPosts"
            payload = {
                "author": f"urn:li:person:{author_urn}",
                "lifecycleState": "PUBLISHED",
                "specificContent": {
                    "com.linkedin.ugc.ShareContent": {
                        "shareCommentary": {"text": content},
                        "shareMediaCategory": "NONE"
                    }
                },
                "visibility": {
                    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                }
            }
            
            response = requests.post(url, headers=headers, json=payload)
            
            if response.status_code == 201:
                post_data = response.json()
                post_id = post_data.get('id', '').split(':')[-1]
                linkedin_url = f"https://www.linkedin.com/feed/update/{post_id}/"
                
                logger.info(f"Posted to LinkedIn: {linkedin_url}")
                return linkedin_url
            else:
                logger.error(f"LinkedIn posting failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            logger.error(f"Error posting to LinkedIn: {e}")
        
        return None
    
    def post_to_wordpress(self, title, content):
        """Post to WordPress"""
        if not all([self.wordpress_url, self.wordpress_user, self.wordpress_password]):
            logger.warning("WordPress credentials not complete")
            return None
        
        try:
            if self.config.service_config['test_mode']:
                title = f"[TEST] {title}"
            
            api_url = f"{self.wordpress_url.rstrip('/')}/wp-json/wp/v2/posts"
            
            post_data = {
                'title': title,
                'content': content,
                'status': 'publish',
                'meta': {
                    'scuttle_posted': True,
                    'post_date': datetime.now().isoformat()
                }
            }
            
            auth = (self.wordpress_user, self.wordpress_password)
            response = requests.post(api_url, json=post_data, auth=auth)
            
            if response.status_code == 201:
                post_data = response.json()
                wordpress_url = post_data.get('link')
                
                logger.info(f"Posted to WordPress: {wordpress_url}")
                return wordpress_url
            else:
                logger.error(f"WordPress posting failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            logger.error(f"Error posting to WordPress: {e}")
        
        return None

# Initialize service
scuttle = ScuttleService()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    validation = config.validate_configuration()
    return jsonify({
        'service': 'scuttle',
        'status': 'healthy' if validation['valid'] else 'degraded',
        'version': '2.0.0',
        'timestamp': datetime.now().isoformat(),
        'twinning_integration': 'active',
        'configuration': {
            'ai_providers': validation['ai_providers'],
            'platforms': validation['platforms'],
            'mcp_servers': len(validation['available_mcp'])
        }
    })

@app.route('/status', methods=['GET'])
def service_status():
    """Detailed service status"""
    return jsonify({
        'service': 'scuttle',
        'status': 'operational',
        'configuration': config.to_dict(),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/config', methods=['GET'])
def get_configuration():
    """Get current configuration"""
    return jsonify(config.to_dict())

@app.route('/api/process', methods=['POST'])
def process_content():
    """Process content with AI"""
    try:
        data = request.get_json()
        content = data.get('content')
        custom_prompt = data.get('custom_prompt')
        provider_type = data.get('provider_type')
        
        if not content:
            return jsonify({'error': 'Content is required'}), 400
        
        generated_content = scuttle.process_with_ai(content, custom_prompt, provider_type)
        
        if generated_content:
            return jsonify({
                'status': 'success',
                'original_content': content,
                'generated_content': generated_content,
                'provider': config.get_active_ai_provider().name if config.get_active_ai_provider() else 'unknown',
                'timestamp': datetime.now().isoformat()
            })
        else:
            return jsonify({'error': 'Failed to process content'}), 500
            
    except Exception as e:
        logger.error(f"Error in process_content: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/post', methods=['POST'])
def post_to_platforms():
    """Post content to social media platforms"""
    try:
        data = request.get_json()
        content = data.get('content')
        platforms = data.get('platforms', [])
        title = data.get('title', 'Scuttle Post')
        
        if not content:
            return jsonify({'error': 'Content is required'}), 400
        
        results = {}
        
        for platform in platforms:
            if platform.lower() == 'bluesky':
                account_type = data.get('bluesky_account', 'business')
                results['bluesky'] = scuttle.post_to_bluesky(content, account_type)
                time.sleep(2)  # Rate limiting
                
            elif platform.lower() == 'linkedin':
                results['linkedin'] = scuttle.post_to_linkedin(content)
                time.sleep(3)  # Rate limiting
                
            elif platform.lower() == 'wordpress':
                results['wordpress'] = scuttle.post_to_wordpress(title, content)
        
        return jsonify({
            'status': 'success',
            'results': results,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in post_to_platforms: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Get social media analytics"""
    # TODO: Implement real analytics collection
    return jsonify({
        'status': 'success',
        'analytics': {
            'engagement_rate': 8.5,
            'platforms_active': len(config.get_enabled_platforms()),
            'ai_provider': config.get_active_ai_provider().name if config.get_active_ai_provider() else 'none',
            'test_mode': config.service_config['test_mode']
        },
        'timestamp': datetime.now().isoformat()
    })

@app.route('/mcp', methods=['GET'])
def get_mcp_status():
    """Get MCP integration status and suggestions"""
    return jsonify(mcp.get_integration_status())

@app.route('/mcp/suggestions', methods=['GET'])
def get_mcp_suggestions():
    """Get MCP server suggestions for user configuration"""
    return jsonify(mcp.get_suggestions())

@app.route('/mcp/setup-guide', methods=['GET'])
def get_setup_guide():
    """Get personalized setup guide based on current configuration"""
    return jsonify(mcp.generate_setup_guide())

@app.route('/mcp/apple', methods=['GET'])
def get_apple_mcp_integration():
    """Get Apple MCP integration details"""
    return jsonify(mcp.apple_mcp_integration())

@app.route('/mcp/notion', methods=['GET'])
def get_notion_mcp_integration():
    """Get Notion MCP integration details"""
    return jsonify(mcp.notion_mcp_integration())

@app.route('/mcp/github', methods=['GET'])
def get_github_mcp_integration():
    """Get GitHub MCP integration details"""
    return jsonify(mcp.github_mcp_integration())

if __name__ == '__main__':
    logger.info(f"Starting Scuttle Social Automation Service on port {config.service_config['service_port']}")
    logger.info(f"Twinning Core API: {config.service_config['twinning_api_url']}")
    logger.info(f"Test Mode: {config.service_config['test_mode']}")
    
    # Log configuration summary
    validation = config.validate_configuration()
    logger.info(f"Configuration: {validation['ai_providers']} AI providers, {validation['platforms']} platforms, {len(validation['available_mcp'])} MCP servers")
    
    if validation['warnings']:
        for warning in validation['warnings']:
            logger.warning(warning)
    
    if validation['errors']:
        for error in validation['errors']:
            logger.error(error)
    
    app.run(
        host='0.0.0.0',
        port=config.service_config['service_port'],
        debug=os.getenv('NODE_ENV') != 'production'
    )
