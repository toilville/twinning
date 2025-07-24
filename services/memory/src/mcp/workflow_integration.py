"""
OMAC Memory Service - n8n Workflow Integration
This module provides integration between the OMAC Memory Service and n8n for workflow automation.
"""

import os
import json
import logging
import requests
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class McpServer:
    """Base MCP Server class"""
    def __init__(self, name: str):
        self.name = name

class WorkflowTriggerRequest:
    """Request object for workflow triggers"""
    def __init__(self, workflow_id: str, memory_id: str, content: Dict[str, Any], metadata: Dict[str, Any]):
        self.workflow_id = workflow_id
        self.memory_id = memory_id
        self.content = content
        self.metadata = metadata

class OMACMemoryServer(McpServer):
    """OMAC Memory Server with n8n Integration"""
    
    def __init__(self):
        super().__init__("omac-memory")
        self.n8n_host = os.environ.get("N8N_HOST", "n8n.localhost")
        self.n8n_protocol = os.environ.get("N8N_PROTOCOL", "http")
        self.webhook_base_url = f"{self.n8n_protocol}://{self.n8n_host}/webhook/"
    
    async def handle_workflow_trigger(self, request: WorkflowTriggerRequest) -> Dict[str, Any]:
        """
        Trigger n8n workflows from OMAC memory events
        
        Args:
            request: The workflow trigger request containing workflow ID, memory ID, content, and metadata
            
        Returns:
            The response from the n8n webhook
        """
        webhook_url = f"{self.webhook_base_url}{request.workflow_id}"
        
        payload = {
            "memory_id": request.memory_id,
            "content": request.content,
            "metadata": request.metadata,
            "timestamp": request.metadata.get("timestamp"),
            "source": request.metadata.get("source"),
            "tags": request.metadata.get("tags", [])
        }
        
        logger.info(f"Triggering n8n workflow {request.workflow_id} with memory {request.memory_id}")
        
        try:
            response = requests.post(
                webhook_url,
                headers={"Content-Type": "application/json"},
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Error triggering n8n workflow: {str(e)}")
            return {"error": str(e), "status": "failed"}
    
    async def register_memory_webhook(self, memory_type: str, workflow_id: str) -> Dict[str, Any]:
        """
        Register a webhook for a specific memory type
        
        Args:
            memory_type: The type of memory to trigger on (e.g., "note", "contact", "email")
            workflow_id: The n8n workflow ID to trigger
            
        Returns:
            Registration status
        """
        # In a real implementation, this would store the registration in a database
        logger.info(f"Registered webhook for memory type {memory_type} to workflow {workflow_id}")
        return {
            "status": "registered",
            "memory_type": memory_type,
            "workflow_id": workflow_id,
            "webhook_url": f"{self.webhook_base_url}{workflow_id}"
        }

# Example usage
async def trigger_workflow_example():
    """Example of triggering a workflow"""
    server = OMACMemoryServer()
    
    # Create a sample memory event
    request = WorkflowTriggerRequest(
        workflow_id="daily-summary",
        memory_id="mem_12345",
        content={
            "text": "Remember to prepare for the meeting tomorrow",
            "title": "Meeting preparation"
        },
        metadata={
            "timestamp": "2025-07-24T08:00:00Z",
            "source": "user_input",
            "tags": ["meeting", "reminder"]
        }
    )
    
    # Trigger the workflow
    result = await server.handle_workflow_trigger(request)
    print(f"Workflow trigger result: {json.dumps(result, indent=2)}")
