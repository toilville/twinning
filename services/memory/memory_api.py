#!/usr/bin/env python3
"""
Twinning Memory Service (OMAC Integration)
AI Memory Coordination Layer with Semantic Search and MCP Integration
"""

import os
import sys
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from flask import Flask, request, jsonify, g
from flask_cors import CORS
import structlog

# Add the dependencies path for SPELWork integration
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'dependencies'))

try:
    from twinning_spelwork_integration import TwinningEthicalFramework, WishDefinition
    ETHICS_AVAILABLE = True
except ImportError:
    print("SPELWork integration not available - running without ethical framework")
    ETHICS_AVAILABLE = False

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

class TwinningMemoryService:
    """
    OMAC (Online Memory Access Coordinator) for Twinning
    
    Provides unified semantic memory across all Twinning services with:
    - pgvector-powered semantic search
    - MCP server orchestration
    - Cross-service memory coordination
    - SPELWork ethical framework integration
    """
    
    def __init__(self):
        self.app = Flask(__name__)
        self.setup_cors()
        self.setup_config()
        self.setup_ethics()
        self.setup_routes()
        
        logger.info("Twinning Memory Service (OMAC) initialized", 
                   service="memory", version="1.0.0")
    
    def setup_cors(self):
        """Configure CORS for cross-origin requests"""
        cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
        CORS(self.app, origins=cors_origins, supports_credentials=True)
        
    def setup_config(self):
        """Load and validate configuration"""
        self.config = {
            'port': int(os.getenv('PORT', 3003)),
            'service_name': os.getenv('SERVICE_NAME', 'memory'),
            'database_url': os.getenv('DATABASE_URL', 'postgresql://localhost:5432/twinning_memory'),
            'pgvector_enabled': os.getenv('PGVECTOR_ENABLED', 'true').lower() == 'true',
            'redis_enabled': os.getenv('REDIS_ENABLED', 'true').lower() == 'true',
            'semantic_search_enabled': os.getenv('SEMANTIC_SEARCH_ENABLED', 'true').lower() == 'true',
            'ethics_enabled': os.getenv('ETHICS_ENABLED', 'true').lower() == 'true' and ETHICS_AVAILABLE,
            'mcp_servers_enabled': os.getenv('MCP_SERVERS_ENABLED', 'true').lower() == 'true',
            'embedding_model': os.getenv('EMBEDDING_MODEL', 'all-MiniLM-L6-v2'),
            'similarity_threshold': float(os.getenv('SIMILARITY_THRESHOLD', '0.7')),
            'max_memory_items': int(os.getenv('MAX_MEMORY_ITEMS', '100000')),
            'twinning_core_url': os.getenv('TWINNING_CORE_URL', 'http://localhost:3000'),
            'intelligence_service_url': os.getenv('INTELLIGENCE_SERVICE_URL', 'http://localhost:3002'),
            'social_service_url': os.getenv('SOCIAL_SERVICE_URL', 'http://localhost:3001')
        }
        
        logger.info("Configuration loaded", config_summary={
            'pgvector_enabled': self.config['pgvector_enabled'],
            'semantic_search_enabled': self.config['semantic_search_enabled'],
            'ethics_enabled': self.config['ethics_enabled'],
            'mcp_servers_enabled': self.config['mcp_servers_enabled']
        })
    
    def setup_ethics(self):
        """Initialize SPELWork ethical framework integration"""
        if self.config['ethics_enabled']:
            try:
                self.ethics = TwinningEthicalFramework('memory', 'ai-memory-coordination')
                logger.info("SPELWork ethical framework initialized for memory service")
            except Exception as e:
                logger.error("Failed to initialize ethical framework", error=str(e))
                self.ethics = None
        else:
            self.ethics = None
    
    def setup_routes(self):
        """Setup Flask routes for the memory service"""
        
        # Health and status endpoints
        @self.app.route('/health', methods=['GET'])
        def health():
            return jsonify({
                'status': 'healthy',
                'service': 'memory',
                'version': '1.0.0',
                'timestamp': datetime.now().isoformat(),
                'capabilities': {
                    'semantic_search': self.config['semantic_search_enabled'],
                    'pgvector': self.config['pgvector_enabled'],
                    'ethics_framework': self.config['ethics_enabled'],
                    'mcp_integration': self.config['mcp_servers_enabled']
                }
            })
        
        # Memory search endpoint
        @self.app.route('/api/memory/search', methods=['POST'])
        def search_memory():
            try:
                data = request.get_json()
                query = data.get('query', '')
                limit = data.get('limit', 10)
                threshold = data.get('threshold', self.config['similarity_threshold'])
                user_id = request.headers.get('X-User-Id', 'anonymous')
                
                if not query:
                    return jsonify({'error': 'Query is required'}), 400
                
                logger.info("Memory search requested", 
                           query=query, limit=limit, user_id=user_id)
                
                # Mock semantic search results
                results = [
                    {
                        'id': f'memory-{i}',
                        'content': f'Mock memory content related to: {query}',
                        'source': 'notion' if i % 2 == 0 else 'github',
                        'similarity_score': 0.9 - (i * 0.1),
                        'timestamp': datetime.now().isoformat(),
                        'metadata': {
                            'type': 'document',
                            'tags': ['ai', 'memory', 'search']
                        }
                    }
                    for i in range(min(limit, 5))  # Return up to 5 mock results
                ]
                
                return jsonify({
                    'success': True,
                    'query': query,
                    'results_count': len(results),
                    'similarity_threshold': threshold,
                    'results': results,
                    'timestamp': datetime.now().isoformat()
                })
                
            except Exception as e:
                logger.error("Memory search failed", error=str(e))
                return jsonify({'error': 'Memory search failed'}), 500
        
        # Memory storage endpoint
        @self.app.route('/api/memory/store', methods=['POST'])
        def store_memory():
            try:
                data = request.get_json()
                content = data.get('content', '')
                source = data.get('source', 'api')
                metadata = data.get('metadata', {})
                user_id = request.headers.get('X-User-Id', 'anonymous')
                
                if not content:
                    return jsonify({'error': 'Content is required'}), 400
                
                # Create ethical wish for memory storage
                if self.ethics:
                    wish = WishDefinition(
                        objective="Store content in semantic memory",
                        context={
                            'content_length': len(content),
                            'source': source,
                            'metadata': metadata
                        },
                        domain='ai-memory-coordination',
                        user_identity=user_id,
                        safeguards=['bias-detection', 'human-override', 'privacy-protection']
                    )
                    
                    evaluation = self.ethics.evaluate_wish(wish)
                    
                    if not evaluation.ethically_sound:
                        logger.warning("Memory storage blocked by ethical evaluation", 
                                     reasoning=evaluation.reasoning)
                        return jsonify({
                            'error': 'Memory storage blocked by ethical evaluation',
                            'reasoning': evaluation.reasoning
                        }), 403
                
                logger.info("Memory storage requested", 
                           content_length=len(content), source=source, user_id=user_id)
                
                # Mock memory storage
                memory_id = f"memory-{datetime.now().timestamp()}"
                
                return jsonify({
                    'success': True,
                    'memory_id': memory_id,
                    'content_length': len(content),
                    'source': source,
                    'stored_at': datetime.now().isoformat(),
                    'ethical_evaluation': {
                        'approved': True,
                        'trust_score': evaluation.trust_score if self.ethics else 1.0
                    } if self.ethics else None
                })
                
            except Exception as e:
                logger.error("Memory storage failed", error=str(e))
                return jsonify({'error': 'Memory storage failed'}), 500
        
        # Cross-service memory coordination
        @self.app.route('/api/memory/coordinate', methods=['POST'])
        def coordinate_memory():
            try:
                data = request.get_json()
                services = data.get('services', ['intelligence', 'social'])
                operation = data.get('operation', 'sync')
                user_id = request.headers.get('X-User-Id', 'anonymous')
                
                logger.info("Memory coordination requested", 
                           services=services, operation=operation, user_id=user_id)
                
                # Mock cross-service coordination
                coordination_results = []
                for service in services:
                    result = {
                        'service': service,
                        'status': 'synchronized',
                        'items_processed': 42,  # Mock number
                        'timestamp': datetime.now().isoformat()
                    }
                    coordination_results.append(result)
                
                return jsonify({
                    'success': True,
                    'operation': operation,
                    'services_coordinated': len(services),
                    'results': coordination_results,
                    'timestamp': datetime.now().isoformat()
                })
                
            except Exception as e:
                logger.error("Memory coordination failed", error=str(e))
                return jsonify({'error': 'Memory coordination failed'}), 500
        
        # Service status endpoint
        @self.app.route('/api/status', methods=['GET'])
        def service_status():
            return jsonify({
                'service': 'memory',
                'status': 'operational',
                'version': '1.0.0',
                'capabilities': [
                    'semantic_search',
                    'memory_storage',
                    'cross_service_coordination',
                    'mcp_orchestration',
                    'ethical_evaluation'
                ],
                'configuration': {
                    'pgvector_enabled': self.config['pgvector_enabled'],
                    'semantic_search_enabled': self.config['semantic_search_enabled'],
                    'ethics_enabled': self.config['ethics_enabled'],
                    'mcp_servers_enabled': self.config['mcp_servers_enabled'],
                    'embedding_model': self.config['embedding_model'],
                    'similarity_threshold': self.config['similarity_threshold']
                },
                'integrations': {
                    'intelligence_service': self.config['intelligence_service_url'],
                    'social_service': self.config['social_service_url'],
                    'twinning_core': self.config['twinning_core_url']
                },
                'last_updated': datetime.now().isoformat()
            })
        
        # MCP orchestration endpoint
        @self.app.route('/api/mcp/orchestrate', methods=['POST'])
        def orchestrate_mcp():
            try:
                data = request.get_json()
                servers = data.get('servers', ['notion', 'github', 'apple'])
                operation = data.get('operation', 'sync')
                user_id = request.headers.get('X-User-Id', 'anonymous')
                
                logger.info("MCP orchestration requested", 
                           servers=servers, operation=operation, user_id=user_id)
                
                # Mock MCP orchestration
                orchestration_results = []
                for server in servers:
                    result = {
                        'server': server,
                        'status': 'success',
                        'operation': operation,
                        'items_processed': 15,  # Mock number
                        'response_time': '250ms',
                        'timestamp': datetime.now().isoformat()
                    }
                    orchestration_results.append(result)
                
                return jsonify({
                    'success': True,
                    'operation': operation,
                    'servers_orchestrated': len(servers),
                    'results': orchestration_results,
                    'timestamp': datetime.now().isoformat()
                })
                
            except Exception as e:
                logger.error("MCP orchestration failed", error=str(e))
                return jsonify({'error': 'MCP orchestration failed'}), 500
    
    def run(self):
        """Start the memory service"""
        logger.info("Starting Twinning Memory Service (OMAC)",
                   port=self.config['port'],
                   ethics_enabled=self.config['ethics_enabled'],
                   semantic_search_enabled=self.config['semantic_search_enabled'])
        
        self.app.run(
            host='0.0.0.0',
            port=self.config['port'],
            debug=os.getenv('FLASK_ENV') == 'development'
        )

if __name__ == '__main__':
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()
    
    # Create and run the memory service
    memory_service = TwinningMemoryService()
    memory_service.run()
