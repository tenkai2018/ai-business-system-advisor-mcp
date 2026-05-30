import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WorkflowInputSchema, WorkflowRecommendationSchema } from "../schemas/workflow.schema.js";
import { ensurePublicSafe } from "../services/publicSafety.js";
import { recommendFirstWorkflow } from "../services/workflowAdvisor.js";
import { maybeRefusePrivateRequest, toolResult } from "./result.js";

export function registerRecommendFirstWorkflow(server: McpServer): void {
  server.registerTool(
    "recommend_first_workflow",
    {
      title: "Recommend first workflow",
      description:
        "Recommend a narrow, measurable, human-reviewable first AI-assisted workflow with roles, review rule, escalation rule, and metrics.",
      inputSchema: WorkflowInputSchema.shape,
      outputSchema: WorkflowRecommendationSchema.shape
    },
    (args) => maybeRefusePrivateRequest(args) ?? toolResult(ensurePublicSafe(recommendFirstWorkflow(args)))
  );
}
