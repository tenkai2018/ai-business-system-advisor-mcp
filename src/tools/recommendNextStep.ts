import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { NextStepInputSchema, NextStepResultSchema } from "../schemas/nextStep.schema.js";
import { ensurePublicSafe } from "../services/publicSafety.js";
import { recommendNextStep } from "../services/nextStepRouter.js";
import { maybeRefusePrivateRequest, toolResult } from "./result.js";

export function registerRecommendNextStep(server: McpServer): void {
  server.registerTool(
    "recommend_next_step",
    {
      title: "Recommend next step",
      description:
        "Recommend a neutral next-step category without pricing or hardcoded sales offers.",
      inputSchema: NextStepInputSchema.shape,
      outputSchema: NextStepResultSchema.shape
    },
    (args) => maybeRefusePrivateRequest(args) ?? toolResult(ensurePublicSafe(recommendNextStep(args)))
  );
}
