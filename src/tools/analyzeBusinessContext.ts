import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BusinessContextInputSchema } from "../schemas/businessContext.schema.js";
import { analyzeBusinessContext } from "../services/analysis.js";
import { ensurePublicSafe } from "../services/publicSafety.js";
import { maybeRefusePrivateRequest, toolResult } from "./result.js";

export function registerAnalyzeBusinessContext(server: McpServer): void {
  server.registerTool(
    "analyze_business_context",
    {
      title: "Analyze business context",
      description:
        "Summarize business model, target customer, offer, constraints, goals, missing information, and first AI opportunity hypotheses.",
      inputSchema: BusinessContextInputSchema.shape
    },
    (args) => maybeRefusePrivateRequest(args) ?? toolResult(ensurePublicSafe(analyzeBusinessContext(args)))
  );
}
