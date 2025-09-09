import express from "express";
import { getToolsFromOpenApi } from "openapi-mcp-generator";

// Your PandaDoc OpenAPI spec (public on GitHub)
const SPEC_URL =
  "https://raw.githubusercontent.com/PandaDoc/pandadoc-openapi-specification/main/openapi.yaml";

// Create Express app
const app = express();
app.use(express.json());

// Add a simple health check endpoint
app.get("/", async (req, res) => {
  res.json({
    message: "🚀 PandaDoc MCP Server",
    status: "running",
    timestamp: new Date().toISOString(),
    endpoints: {
      tools: "/api/tools",
      health: "/health"
    }
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "pandadoc-mcp-server" });
});

// Tools endpoint
app.get("/api/tools", async (req, res) => {
  try {
    console.log("🔍 Fetching tools from PandaDoc OpenAPI spec...");
    
    // Get tools from OpenAPI spec
    const tools = await getToolsFromOpenApi(SPEC_URL, {
      baseUrl: "https://api.pandadoc.com",
      defaultInclude: true
    });

    console.log(`✅ Found ${tools.length} tools`);

    res.json({
      success: true,
      count: tools.length,
      tools: tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        method: tool.method,
        pathTemplate: tool.pathTemplate,
        parameters: tool.executionParameters
      }))
    });
  } catch (error) {
    console.error("❌ Error fetching tools:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch tools"
    });
  }
});

// Tool execution endpoint
app.post("/api/tools/:toolName", async (req, res) => {
  try {
    const { toolName } = req.params;
    const args = req.body;

    console.log(`🔧 Executing tool: ${toolName}`);
    
    // Get tools to find the specific tool
    const tools = await getToolsFromOpenApi(SPEC_URL, {
      baseUrl: "https://api.pandadoc.com",
      defaultInclude: true
    });

    const tool = tools.find(t => t.name === toolName);
    if (!tool) {
      return res.status(404).json({
        success: false,
        error: `Tool '${toolName}' not found`
      });
    }

    // Return tool information and args (placeholder for actual API call)
    res.json({
      success: true,
      tool: {
        name: tool.name,
        description: tool.description,
        method: tool.method,
        pathTemplate: tool.pathTemplate
      },
      args,
      note: "This is a placeholder response. To make actual PandaDoc API calls, you need to implement OAuth2 authentication and HTTP client logic."
    });
  } catch (error) {
    console.error("❌ Error executing tool:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to execute tool"
    });
  }
});

// Export for Vercel serverless function
export default app;