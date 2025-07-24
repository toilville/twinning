# OMAC iOS Shortcuts Integration Guide

This guide demonstrates how to integrate iOS Shortcuts with the OMAC Memory Service for seamless capture and retrieval of memories on Apple devices.

## Overview

The OMAC Memory Service provides a RESTful API that can be accessed via iOS Shortcuts, allowing for:

1. **Memory Capture**: Quickly save notes, ideas, and content from your iOS device
2. **Memory Retrieval**: Search and retrieve memories using semantic search
3. **Workflow Automation**: Trigger n8n workflows from your iOS device
4. **Daily Summaries**: Request and view daily memory summaries

## Prerequisites

- iOS 14.0 or later
- OMAC Memory Service deployed and accessible via HTTPS
- Basic familiarity with iOS Shortcuts app

## Setup Instructions

### 1. Configure OMAC for iOS Access

Ensure your OMAC Memory Service is accessible via HTTPS and has CORS configured to accept requests from iOS devices:

```yaml
# In your docker-compose.yml
services:
  memory:
    environment:
      - CORS_ORIGINS=*  # For development only, restrict in production
```

### 2. Create Authentication Shortcut

This shortcut handles authentication with your OMAC instance:

1. Open the Shortcuts app on your iOS device
2. Create a new shortcut named "OMAC Auth"
3. Add the following actions:

```
Text: [Your OMAC API Key]
Set Variable: OMAC_API_KEY
Text: [Your OMAC URL, e.g., https://memory.yourdomain.com]
Set Variable: OMAC_BASE_URL
Dictionary:
  - "Authorization": "Bearer " + OMAC_API_KEY
  - "Content-Type": "application/json"
Set Variable: OMAC_HEADERS
```

4. Save the shortcut

### 3. Create Memory Capture Shortcut

This shortcut allows you to quickly capture memories:

1. Create a new shortcut named "OMAC Capture"
2. Add the following actions:

```
Text: [Empty]
Ask for Input: "What would you like to remember?"
Set Variable: MEMORY_TEXT
Get Current Location
Set Variable: LOCATION
Run Shortcut: OMAC Auth
URL: OMAC_BASE_URL + "/api/memories"
Get Contents of URL:
  - Method: POST
  - Headers: OMAC_HEADERS
  - Request Body: JSON
    {
      "content": {
        "text": MEMORY_TEXT
      },
      "metadata": {
        "source": "ios_shortcut",
        "location": LOCATION,
        "timestamp": Current Date
      }
    }
```

3. Save the shortcut

## Example Shortcuts

### Daily Summary Shortcut

```
Run Shortcut: OMAC Auth
URL: OMAC_BASE_URL + "/api/summaries/daily"
Get Contents of URL:
  - Method: GET
  - Headers: OMAC_HEADERS
Set Variable: DAILY_SUMMARY
Show Result: DAILY_SUMMARY
```

### Semantic Search Shortcut

```
Text: [Empty]
Ask for Input: "What would you like to search for?"
Set Variable: SEARCH_QUERY
Run Shortcut: OMAC Auth
URL: OMAC_BASE_URL + "/api/memories/search?query=" + URL-Encode(SEARCH_QUERY)
Get Contents of URL:
  - Method: GET
  - Headers: OMAC_HEADERS
Set Variable: SEARCH_RESULTS
Show Result: SEARCH_RESULTS
```

### Trigger Workflow Shortcut

```
Run Shortcut: OMAC Auth
Dictionary:
  - "daily-summary": "Generate daily summary"
  - "weekly-report": "Generate weekly report"
  - "content-ideas": "Generate content ideas"
Choose from List: [Dictionary Keys]
Set Variable: SELECTED_WORKFLOW
URL: OMAC_BASE_URL + "/api/workflows/trigger/" + SELECTED_WORKFLOW
Get Contents of URL:
  - Method: POST
  - Headers: OMAC_HEADERS
  - Request Body: JSON
    {
      "trigger_source": "ios_shortcut"
    }
```

## Advanced Integration: URL Scheme Handler

For deeper iOS integration, you can implement a URL scheme handler in your iOS app:

```swift
// iOS Shortcut URL Scheme for OMAC
func handleOMACURL(_ url: URL) {
    guard let components = URLComponents(url: url, resolvingAgainstBaseURL: true),
          let path = components.path.split(separator: "/").first else {
        return
    }
    
    let queryItems = components.queryItems ?? []
    let queryParams = Dictionary(uniqueKeysWithValues: queryItems.map { ($0.name, $0.value ?? "") })
    
    switch path {
    case "memory":
        // Add memory entry via OMAC API
        addMemoryEntry(from: queryParams)
    case "summary":
        // Request daily summary
        requestDailySummary()
    case "workflow":
        // Trigger n8n workflow
        if let workflowId = queryParams["workflow_id"] {
            triggerWorkflow(workflowId)
        }
    default:
        break
    }
}

func addMemoryEntry(from params: [String: String]) {
    guard let text = params["text"] else { return }
    
    // Create memory payload
    let payload: [String: Any] = [
        "content": ["text": text],
        "metadata": [
            "source": "ios_app",
            "timestamp": ISO8601DateFormatter().string(from: Date())
        ]
    ]
    
    // Send to OMAC API
    sendToOMACAPI(endpoint: "/api/memories", payload: payload)
}

func requestDailySummary() {
    // Request daily summary from OMAC
    sendToOMACAPI(endpoint: "/api/summaries/daily", payload: nil, method: "GET") { result in
        // Display summary in app
        DispatchQueue.main.async {
            self.displaySummary(result)
        }
    }
}

func triggerWorkflow(_ workflowId: String) {
    // Trigger n8n workflow via OMAC
    let payload: [String: Any] = [
        "trigger_source": "ios_app"
    ]
    
    sendToOMACAPI(endpoint: "/api/workflows/trigger/\(workflowId)", payload: payload)
}
```

## Integration with Siri

You can make your OMAC shortcuts accessible via Siri:

1. Open the Shortcuts app
2. Select your OMAC Capture shortcut
3. Tap the ⋯ (ellipsis) button
4. Tap "Add to Siri"
5. Record a phrase like "Remember this"

Now you can say "Hey Siri, remember this" and dictate your memory directly to OMAC.

## Security Considerations

- Use HTTPS for all communications with your OMAC instance
- Store API keys securely using iOS Keychain in production apps
- Consider implementing OAuth2 for more secure authentication
- Restrict CORS origins to your specific domains in production

## Troubleshooting

- **Authentication Errors**: Verify your API key is correct and not expired
- **Connection Issues**: Ensure your OMAC instance is accessible from your iOS device
- **CORS Errors**: Check that your OMAC server has CORS properly configured
- **JSON Parsing Errors**: Validate the JSON structure in your shortcuts

## Next Steps

- Create custom shortcuts for your specific workflows
- Integrate with other iOS apps using Share Sheet extensions
- Develop a dedicated iOS app for more advanced OMAC integration
- Explore automation possibilities with iOS Shortcuts Automation triggers
