import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { OpportunitiesInputSchema } from "../schemas/opportunities.schema.js";
import { evaluateAiOpportunities } from "../services/analysis.js";
import { ensurePublicSafe } from "../services/publicSafety.js";
import { maybeRefusePrivateRequest, toolResult } from "./result.js";

export function registerEvaluateAiOpportunities(server: McpServer): void {
  server.registerTool(
    "evaluate_ai_opportunities",
    {
      title: "Evaluate AI opportunities",
      description:
        "Evaluate practical AI assistance opportunities and avoid high-risk full-autonomy patterns.",
      inputSchema: OpportunitiesInputSchema.shape
    },
    (args) => maybeRefusePrivateRequest(args) ?? toolResult(ensurePublicSafe(evaluateAiOpportunities(args)))
  );
}
