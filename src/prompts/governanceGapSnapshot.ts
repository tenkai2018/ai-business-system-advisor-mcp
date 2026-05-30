import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerGovernanceGapSnapshotPrompt(server: McpServer): void {
  server.registerPrompt(
    "governance_gap_snapshot",
    {
      title: "Governance gap snapshot",
      description: "Identify data boundaries, review rules, escalation rules, and quality controls.",
      argsSchema: {
        workflow: z.string().optional()
      }
    },
    (args) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Create a governance gap snapshot for this AI-enabled workflow. Focus on allowed use, data boundaries, human review, escalation, quality checks, and monthly review needs: ${args.workflow ?? ""}`
          }
        }
      ]
    })
  );
}
