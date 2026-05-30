import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerEvaluateAiWorkflowIdeaPrompt(server: McpServer): void {
  server.registerPrompt(
    "evaluate_ai_workflow_idea",
    {
      title: "Evaluate AI workflow idea",
      description: "Evaluate whether an AI workflow idea is safe, useful, and reviewable.",
      argsSchema: {
        idea: z.string().optional()
      }
    },
    (args) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Evaluate this AI workflow idea for business value, readiness, trust/control risk, human review needs, and a safer first workflow: ${args.idea ?? ""}`
          }
        }
      ]
    })
  );
}
