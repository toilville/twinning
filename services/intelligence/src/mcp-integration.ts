import { logger } from './utils/logger.js';
import { config } from './config.js';

/**
 * MCP Integration for Intelligence Service
 * 
 * Coordinates with MCP servers (Apple, Notion, GitHub) for data operations
 * Maintains connections and handles MCP protocol communication
 */

interface MCPServer {
  name: string;
  url: string;
  connected: boolean;
  lastHealthCheck?: Date;
}

export class MCPIntegration {
  private servers: Map<string, MCPServer> = new Map();
  private initialized: boolean = false;

  constructor() {
    // Initialize server configurations
    if (config.mcp.enabled) {
      this.servers.set('apple', {
        name: 'apple',
        url: config.mcp.appleServerUrl,
        connected: false
      });

      this.servers.set('notion', {
        name: 'notion', 
        url: config.mcp.notionServerUrl,
        connected: false
      });

      this.servers.set('github', {
        name: 'github',
        url: config.mcp.githubServerUrl,
        connected: false
      });
    }
  }

  public async initialize(): Promise<void> {
    if (!config.mcp.enabled) {
      logger.info('MCP integration disabled');
      this.initialized = true;
      return;
    }

    try {
      logger.info('Initializing MCP server connections');

      // Attempt to connect to each configured server
      const connectionPromises = Array.from(this.servers.values()).map(
        server => this.connectToServer(server)
      );

      await Promise.allSettled(connectionPromises);

      this.initialized = true;
      
      const connectedServers = Array.from(this.servers.values())
        .filter(server => server.connected)
        .map(server => server.name);

      logger.info('MCP integration initialized', {
        total_servers: this.servers.size,
        connected_servers: connectedServers.length,
        connected: connectedServers
      });

      // Start health check interval
      this.startHealthChecks();

    } catch (error) {
      logger.error('Failed to initialize MCP integration', { error });
      throw error;
    }
  }

  private async connectToServer(server: MCPServer): Promise<void> {
    try {
      logger.info(`Connecting to MCP server: ${server.name}`, { url: server.url });

      // In a full implementation, this would use the MCP SDK to establish connections
      // For now, we'll simulate connection checks
      
      // Simulate health check
      const isHealthy = await this.checkServerHealth(server);
      
      if (isHealthy) {
        server.connected = true;
        server.lastHealthCheck = new Date();
        logger.info(`Successfully connected to MCP server: ${server.name}`);
      } else {
        logger.warn(`Failed to connect to MCP server: ${server.name}`);
      }

    } catch (error) {
      logger.error(`Error connecting to MCP server: ${server.name}`, { error });
      server.connected = false;
    }
  }

  private async checkServerHealth(server: MCPServer): Promise<boolean> {
    try {
      // In a real implementation, this would ping the MCP server
      // For now, we'll assume servers are healthy if the config is valid
      return server.url && server.url.startsWith('http');
    } catch (error) {
      logger.error(`Health check failed for ${server.name}`, { error });
      return false;
    }
  }

  private startHealthChecks(): void {
    setInterval(async () => {
      for (const server of this.servers.values()) {
        if (server.connected) {
          const isHealthy = await this.checkServerHealth(server);
          if (!isHealthy) {
            logger.warn(`MCP server ${server.name} health check failed`);
            server.connected = false;
          } else {
            server.lastHealthCheck = new Date();
          }
        }
      }
    }, config.monitoring.healthCheckInterval);
  }

  public getConnectedServers(): string[] {
    return Array.from(this.servers.values())
      .filter(server => server.connected)
      .map(server => server.name);
  }

  public isServerConnected(serverName: string): boolean {
    const server = this.servers.get(serverName);
    return Boolean(server?.connected) ?? false;
  }

  public async callAppleServer(operation: string, params: any): Promise<any> {
    if (!this.isServerConnected('apple')) {
      throw new Error('Apple MCP server not connected');
    }

    try {
      logger.debug(`Calling Apple MCP server: ${operation}`, { params });
      
      // In a real implementation, this would use the MCP SDK
      // For now, return a mock response
      return {
        success: true,
        operation,
        result: `Mock result for ${operation}`,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error(`Error calling Apple MCP server`, { operation, error });
      throw error;
    }
  }

  public async callNotionServer(operation: string, params: any): Promise<any> {
    if (!this.isServerConnected('notion')) {
      throw new Error('Notion MCP server not connected');
    }

    try {
      logger.debug(`Calling Notion MCP server: ${operation}`, { params });
      
      // Mock implementation
      return {
        success: true,
        operation,
        result: `Mock result for ${operation}`,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error(`Error calling Notion MCP server`, { operation, error });
      throw error;
    }
  }

  public async callGitHubServer(operation: string, params: any): Promise<any> {
    if (!this.isServerConnected('github')) {
      throw new Error('GitHub MCP server not connected');
    }

    try {
      logger.debug(`Calling GitHub MCP server: ${operation}`, { params });
      
      // Mock implementation
      return {
        success: true,
        operation,
        result: `Mock result for ${operation}`,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error(`Error calling GitHub MCP server`, { operation, error });
      throw error;
    }
  }

  public getServerStatus(): Record<string, any> {
    const status: Record<string, any> = {};
    
    for (const [name, server] of this.servers.entries()) {
      status[name] = {
        connected: server.connected,
        url: server.url,
        last_health_check: server.lastHealthCheck?.toISOString()
      };
    }

    return status;
  }

  public async cleanup(): Promise<void> {
    if (this.initialized) {
      logger.info('Cleaning up MCP server connections');
      
      // Disconnect from all servers
      for (const server of this.servers.values()) {
        if (server.connected) {
          server.connected = false;
          logger.info(`Disconnected from MCP server: ${server.name}`);
        }
      }

      this.initialized = false;
    }
  }
}

// Helper functions for common MCP operations
export async function syncContactsWithNotion(
  mcpIntegration: MCPIntegration,
  contacts: any[]
): Promise<any> {
  try {
    return await mcpIntegration.callNotionServer('sync_contacts', {
      contacts,
      operation: 'batch_sync'
    });
  } catch (error) {
    logger.error('Failed to sync contacts with Notion', { error });
    throw error;
  }
}

export async function extractEmailsFromAppleMail(
  mcpIntegration: MCPIntegration,
  criteria: any
): Promise<any> {
  try {
    return await mcpIntegration.callAppleServer('extract_emails', criteria);
  } catch (error) {
    logger.error('Failed to extract emails from Apple Mail', { error });
    throw error;
  }
}

export async function getGitHubProjectData(
  mcpIntegration: MCPIntegration,
  projectIds: string[]
): Promise<any> {
  try {
    return await mcpIntegration.callGitHubServer('get_projects', {
      project_ids: projectIds
    });
  } catch (error) {
    logger.error('Failed to get GitHub project data', { error });
    throw error;
  }
}
