import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAnalyzeBusinessContext } from "./analyzeBusinessContext.js";
import { registerAssessTrustControlRisks } from "./assessTrustControlRisks.js";
import { registerEvaluateAiOpportunities } from "./evaluateAiOpportunities.js";
import { registerExportIntakePacket } from "./exportIntakePacket.js";
import { registerGenerateMiniReport } from "./generateMiniReport.js";
import { registerIdentifyBottlenecks } from "./identifyBottlenecks.js";
import { registerMapCustomerTouchpoints } from "./mapCustomerTouchpoints.js";
import { registerRecommendFirstWorkflow } from "./recommendFirstWorkflow.js";
import { registerRecommendNextStep } from "./recommendNextStep.js";

export function registerTools(server: McpServer): void {
  registerAnalyzeBusinessContext(server);
  registerMapCustomerTouchpoints(server);
  registerIdentifyBottlenecks(server);
  registerEvaluateAiOpportunities(server);
  registerAssessTrustControlRisks(server);
  registerRecommendFirstWorkflow(server);
  registerGenerateMiniReport(server);
  registerRecommendNextStep(server);
  registerExportIntakePacket(server);
}
