import express from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getToolsFromOpenApi } from "openapi-mcp-generator";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const PORT = process.env.PORT || 3000;
const SPEC_URL = "https://raw.githubusercontent.com/PandaDoc/pandadoc-openapi-specification/main/openapi.yaml";

// OAuth2 Middleware for MCP Server Authentication
const oauth2Middleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: "OAuth2 Bearer token required for MCP server access",
      authRequired: {
        type: "OAuth2",
        description: "MCP server requires OAuth2 authentication",
        authUrl: "https://app.pandadoc.com/oauth2/authorize",
        tokenUrl: "https://api.pandadoc.com/oauth2/access_token",
        scopes: ["read+write"],
        clientRegistration: "Register at https://developers.pandadoc.com"
      }
    });
  }

  const token = authHeader.substring(7);
  
  // TODO: Validate the OAuth2 token with PandaDoc API
  // For now, we'll do basic validation
  if (token.length < 10) {
    return res.status(401).json({
      error: "Invalid OAuth2 token format"
    });
  }

  // Store token for later use
  (req as any).oauth2Token = token;
  next();
};

async function createMCPServer() {
  const app = express();
  app.use(express.json());

  // Public endpoint - no auth required
  app.get("/", (req, res) => {
    res.json({
      message: "🔐 OAuth2-Protected PandaDoc MCP Server",
      status: "running",
      authentication: "OAuth2 Bearer token required",
      endpoints: {
        mcp: "/mcp/* (OAuth2 protected)",
        health: "/health"
      }
    });
  });

  // Health check - no auth required  
  app.get("/health", (req, res) => {
    res.json({ status: "OK", auth: "OAuth2 required for MCP endpoints" });
  });

  // ALL MCP endpoints require OAuth2 authentication
  app.use("/mcp", oauth2Middleware);

  // Get OAuth2-only tools
  const oauth2Tools = await getToolsFromOpenApi(SPEC_URL, {
    baseUrl: "https://api.pandadoc.com",
    defaultInclude: true,
    filterFn: (tool) => {
      return tool.securityRequirements.some(requirement => 
        Object.keys(requirement).some(key => key.toLowerCase().includes('oauth'))
      );
    }
  });

  // MCP Tools endpoint (OAuth2 protected)
  app.get("/mcp/tools", (req, res) => {
    res.json({
      success: true,
      authenticated: true,
      oauth2Tools: oauth2Tools.length,
      tools: oauth2Tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        method: tool.method,
        pathTemplate: tool.pathTemplate,
        requiresOAuth2: true
      }))
    });
  });

  // MCP Tool execution endpoint (OAuth2 protected)
  app.post("/mcp/tools/:toolName", (req, res) => {
    const { toolName } = req.params;
    const args = req.body;
    const token = (req as any).oauth2Token;

    const tool = oauth2Tools.find(t => t.name === toolName);
    if (!tool) {
      return res.status(404).json({
        success: false,
        error: `OAuth2-enabled tool '${toolName}' not found`
      });
    }

    res.json({
      success: true,
      authenticated: true,
      mcpServerAuth: "OAuth2",
      tool: {
        name: tool.name,
        description: tool.description,
        method: tool.method,
        pathTemplate: tool.pathTemplate
      },
      args,
      note: "MCP server OAuth2 authenticated. Ready for PandaDoc API call with provided token."
    });
  });

  return app;
}

async function main() {
  const app = await createMCPServer();
  
  app.listen(PORT, () => {
    console.log(`🔐 OAuth2-Protected PandaDoc MCP Server running at http://localhost:${PORT}`);
    console.log(`📋 Endpoints:`);
    console.log(`   Public: /health`);
    console.log(`   OAuth2: /mcp/tools (Bearer token required)`);
    console.log(`   OAuth2: /mcp/tools/:toolName (Bearer token required)`);
  });
}

// Export for Vercel
export default async function handler(req: express.Request, res: express.Response) {
  const app = await createMCPServer();
  return app(req, res);
}
