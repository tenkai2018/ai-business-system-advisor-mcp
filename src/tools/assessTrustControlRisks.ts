import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RisksInputSchema, RisksResultSchema } from "../schemas/risks.schema.js";
import { assessTrustControlRisks } from "../services/analysis.js";
import { ensurePublicSafe } from "../services/publicSafety.js";
import { maybeRefusePrivateRequest, toolResult } from "./result.js";

export function registerAssessTrustControlRisks(server: McpServer): void {
  server.registerTool(
    "assess_trust_control_risks",
    {
      title: "Assess trust and control risks",
      description:
        "Assess risk categories, data boundaries, human review rules, and escalation controls for AI-enabled workflows.",
      inputSchema: RisksInputSchema.shape,
      outputSchema: RisksResultSchema.shape
    },
    (args) => maybeRefusePrivateRequest(args) ?? toolResult(ensurePublicSafe(assessTrustControlRisks(args)))
  );
}
