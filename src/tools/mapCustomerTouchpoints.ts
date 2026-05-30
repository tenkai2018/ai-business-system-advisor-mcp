import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TouchpointsInputSchema } from "../schemas/touchpoints.schema.js";
import { mapCustomerTouchpoints } from "../services/analysis.js";
import { ensurePublicSafe } from "../services/publicSafety.js";
import { maybeRefusePrivateRequest, toolResult } from "./result.js";

export function registerMapCustomerTouchpoints(server: McpServer): void {
  server.registerTool(
    "map_customer_touchpoints",
    {
      title: "Map customer touchpoints",
      description:
        "Map likely customer journey stages, trust moments, service recovery opportunities, and human review rules.",
      inputSchema: TouchpointsInputSchema.shape
    },
    (args) => maybeRefusePrivateRequest(args) ?? toolResult(ensurePublicSafe(mapCustomerTouchpoints(args)))
  );
}
