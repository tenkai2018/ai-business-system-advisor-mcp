import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { MiniReportInputSchema } from "../schemas/miniReport.schema.js";
import { buildMiniReport } from "../services/reportBuilder.js";
import { maybeRefusePrivateRequest, toolResult } from "./result.js";

export function registerGenerateMiniReport(server: McpServer): void {
  server.registerTool(
    "generate_mini_report",
    {
      title: "Generate mini report",
      description:
        "Generate a concise public-safe mini business system review with bottlenecks, opportunities, risks, first workflow, next step, and note.",
      inputSchema: MiniReportInputSchema.shape
    },
    (args) => maybeRefusePrivateRequest(args) ?? toolResult(buildMiniReport(args))
  );
}
