import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerEvaluateAiWorkflowIdeaPrompt } from "./evaluateAiWorkflowIdea.js";
import { registerGovernanceGapSnapshotPrompt } from "./governanceGapSnapshot.js";
import { registerPrepareDiagnosticIntakePrompt } from "./prepareDiagnosticIntake.js";
import { registerRunMiniBusinessSystemReviewPrompt } from "./runMiniBusinessSystemReview.js";

export function registerPrompts(server: McpServer): void {
  registerRunMiniBusinessSystemReviewPrompt(server);
  registerEvaluateAiWorkflowIdeaPrompt(server);
  registerPrepareDiagnosticIntakePrompt(server);
  registerGovernanceGapSnapshotPrompt(server);
}
