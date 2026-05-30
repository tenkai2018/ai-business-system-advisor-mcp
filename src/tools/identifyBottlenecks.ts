import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BottlenecksInputSchema } from "../schemas/bottlenecks.schema.js";
import { identifyBottlenecks } from "../services/analysis.js";
import { ensurePublicSafe } from "../services/publicSafety.js";
import { maybeRefusePrivateRequest, toolResult } from "./result.js";

export function registerIdentifyBottlenecks(server: McpServer): void {
  server.registerTool(
    "identify_bottlenecks",
    {
      title: "Identify bottlenecks",
      description:
        "Identify likely revenue, operations, customer experience, and trust/control bottlenecks from the supplied context.",
      inputSchema: BottlenecksInputSchema.shape
    },
    (args) => maybeRefusePrivateRequest(args) ?? toolResult(ensurePublicSafe(identifyBottlenecks(args)))
  );
}
