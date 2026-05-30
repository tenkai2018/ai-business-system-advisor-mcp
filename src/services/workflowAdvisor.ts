import { WORKFLOW_PATTERNS } from "../constants/workflowRecommendations.js";
import { WorkflowInput, WorkflowRecommendation } from "../schemas/workflow.schema.js";
import { assessRiskLevel, confidenceFromCompleteness } from "./scoring.js";
import { toSearchText } from "./validation.js";

export function recommendFirstWorkflow(input: WorkflowInput): WorkflowRecommendation {
  const text = toSearchText(input).toLowerCase();
  const selected =
    WORKFLOW_PATTERNS.find((pattern) => pattern.match.some((term) => text.includes(term))) ??
    WORKFLOW_PATTERNS[3];

  const riskLevel = assessRiskLevel(input);
  const reviewRule =
    riskLevel === "high"
      ? "Human approval is required before any customer-facing action, money decision, or service recovery step."
      : "Human review is required for low-confidence outputs, customer-facing promises, exceptions, or sensitive cases.";

  return {
    workflow: selected.workflow,
    whyThisFirst:
      "It is narrow, repeated often enough to measure, useful before broader automation, and can be reviewed by a human before trust-sensitive actions.",
    aiRole: selected.aiRole,
    humanRole: selected.humanRole,
    reviewRule,
    escalationRule:
      "Escalate when the case involves money, legal exposure, privacy, customer emotion, missing context, low confidence, or brand-sensitive commitments.",
    successMetrics: selected.metrics,
    riskLevel,
    confidence: confidenceFromCompleteness(input)
  };
}
