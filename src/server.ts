import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { config } from "./config.js";
import { SERVER_INSTRUCTIONS } from "./constants/publicCopy.js";
import { registerPrompts } from "./prompts/index.js";
import { registerResources } from "./resources/index.js";
import { registerTools } from "./tools/index.js";

export function createServer(): McpServer {
  const server = new McpServer(
    {
      name: config.serverName,
      version: config.serverVersion
    },
    {
      instructions: SERVER_INSTRUCTIONS
    }
  );

  registerResources(server);
  registerPrompts(server);
  registerTools(server);

  return server;
}
