# OMAC n8n Workflow Examples

This directory contains example n8n workflows that demonstrate how to integrate n8n with the OMAC Memory Service for workflow automation.

## Overview

[n8n](https://n8n.io/) is a powerful workflow automation tool that can be used to automate tasks and connect different services. The OMAC Memory Service integrates with n8n to provide powerful workflow automation capabilities for memory management and processing.

## Included Workflows

### Daily Summary Workflow

**File:** `daily_summary_workflow.json`

This workflow demonstrates how to:

1. Trigger a daily summary generation via webhook
2. Retrieve memories from the OMAC Memory Service
3. Generate a formatted summary of the day's memories
4. Save the summary back to the OMAC Memory Service
5. Optionally send the summary via email
6. Send a notification when the summary is complete

## How to Import Workflows

1. Access your n8n instance (default: http://localhost:5678)
2. Click on "Workflows" in the sidebar
3. Click the "Import from File" button
4. Select the workflow JSON file you want to import
5. Click "Import" to load the workflow

## Webhook Endpoints

The example workflows use webhook triggers that can be called from the OMAC Memory Service or other services. When you deploy a workflow with a webhook trigger, n8n will generate a unique URL for that webhook.

For example, the Daily Summary workflow creates a webhook endpoint at:

```
http://n8n:5678/webhook/daily-summary
```

You can trigger this workflow by sending a POST request to this endpoint:

```bash
curl -X POST http://n8n:5678/webhook/daily-summary \
  -H "Content-Type: application/json" \
  -d '{"send_email": true, "email": "user@example.com"}'
```

## Integration with OMAC Memory Service

The OMAC Memory Service can trigger n8n workflows through its MCP integration. The `workflow_integration.py` module in the OMAC Memory Service provides the necessary functionality to trigger n8n workflows from memory events.

Example integration code:

```python
from services.memory.src.mcp.workflow_integration import OMACMemoryServer, WorkflowTriggerRequest

# Create OMAC Memory Server instance
server = OMACMemoryServer()

# Create workflow trigger request
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
```

## Creating Custom Workflows

You can create custom workflows in n8n to automate various tasks with the OMAC Memory Service:

1. **Memory Processing**: Automatically process and categorize memories
2. **Content Generation**: Generate content based on memories
3. **Data Integration**: Integrate memories with other services
4. **Notifications**: Send notifications based on memory events
5. **Scheduled Tasks**: Run scheduled tasks on memories

## Environment Variables

The example workflows use the following environment variables:

- `MEMORY_SERVICE_URL`: The URL of the OMAC Memory Service (default: `http://memory:3003`)
- `N8N_HOST`: The hostname of the n8n service (default: `n8n.localhost`)
- `N8N_PROTOCOL`: The protocol to use for n8n (default: `http`)

## Security Considerations

- Use HTTPS for all communications in production
- Secure webhook endpoints with authentication
- Restrict access to n8n to authorized users only
- Use environment variables for sensitive information

## Troubleshooting

- **Webhook Not Triggering**: Ensure the webhook URL is correct and accessible
- **Connection Issues**: Check that the OMAC Memory Service is running and accessible from n8n
- **Authentication Errors**: Verify that authentication credentials are correct
- **Data Format Issues**: Ensure the data format matches what the workflow expects

## Additional Resources

- [n8n Documentation](https://docs.n8n.io/)
- [OMAC Memory Service Documentation](../../services/memory/README.md)
- [Unified Implementation Strategy](../../docs/UNIFIED_IMPLEMENTATION_STRATEGY.md)
