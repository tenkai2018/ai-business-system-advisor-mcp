import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerRunMiniBusinessSystemReviewPrompt(server: McpServer): void {
  server.registerPrompt(
    "run_mini_business_system_review",
    {
      title: "Run mini business system review",
      description: "Guide the assistant to run a public-safe mini business system review.",
      argsSchema: {
        businessContext: z.string().optional()
      }
    },
    (args) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Run a public-safe mini business system review. Use tool outputs for context, bottlenecks, AI opportunities, trust/control risks, first workflow, next step, and intake gaps. Context: ${args.businessContext ?? ""}`
          }
        }
      ]
    })
  );
}
