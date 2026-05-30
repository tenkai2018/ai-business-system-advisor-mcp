import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerPrepareDiagnosticIntakePrompt(server: McpServer): void {
  server.registerPrompt(
    "prepare_diagnostic_intake",
    {
      title: "Prepare diagnostic intake",
      description: "Prepare a structured intake packet for a deeper business-system review.",
      argsSchema: {
        notes: z.string().optional()
      }
    },
    (args) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Prepare a structured intake packet. Capture business context, current problem, current workflow, touchpoints, bottlenecks, opportunities, risks, recommended first workflow, missing information, and notes for review. Notes: ${args.notes ?? ""}`
          }
        }
      ]
    })
  );
}
