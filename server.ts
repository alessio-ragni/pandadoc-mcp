import { getToolsFromOpenApi } from "openapi-mcp-generator";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const PORT = process.env.PORT || 3000;

// Your PandaDoc OpenAPI spec (public on GitHub)
const SPEC_URL =
  "https://raw.githubusercontent.com/PandaDoc/pandadoc-openapi-specification/main/openapi.yaml";

async function main() {
  // Get tools from OpenAPI spec
  const tools = await getToolsFromOpenApi(SPEC_URL, {
    baseUrl: "https://api.pandadoc.com",
    defaultInclude: true
  });

  // Create MCP server
  const server = new Server(
    {
      name: "pandadoc-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name: toolName, arguments: args } = request.params;
    
    const tool = tools.find(t => t.name === toolName);
    if (!tool) {
      throw new Error(`Tool ${toolName} not found`);
    }

    // Here you would implement the actual API call
    // For now, return a placeholder response
    return {
      content: [
        {
          type: "text",
          text: `Tool ${toolName} called with args: ${JSON.stringify(args, null, 2)}\n\nNote: This is a placeholder. To make actual API calls, you need to implement the HTTP client logic.`,
        },
      ],
    };
  });

  // Start server with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.log(`✅ PandaDoc MCP server running`);
}

main().catch((err) => {
  console.error("❌ Failed to start MCP server:", err);
  process.exit(1);
});
