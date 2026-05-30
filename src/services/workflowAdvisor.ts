import { WORKFLOW_PATTERNS } from "../constants/workflowRecommendations.js";
import { WorkflowInput, WorkflowRecommendation } from "../schemas/workflow.schema.js";
import { assessRiskLevel, confidenceFromCompleteness, missingFields } from "./scoring.js";
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
    recommendedWorkflow: selected.workflow,
    workflowCategory: categoryForWorkflow(selected.workflow),
    whyThisWorkflow:
      "It is narrow, repeated often enough to measure, useful before broader automation, and can be reviewed by a human before trust-sensitive actions.",
    expectedOutcome:
      "Faster cycle time, clearer handoff, better review quality, and a measurable first workflow before broader automation.",
    aiRole: selected.aiRole,
    humanRole: selected.humanRole,
    reviewRule,
    escalationRule:
      "Escalate when the case involves money, legal exposure, privacy, customer emotion, missing context, low confidence, or brand-sensitive commitments.",
    successMetrics: selected.metrics,
    firstImplementationScope:
      riskLevel === "high"
        ? "Start with internal triage, summary, and draft preparation only; require approval before any customer-facing action."
        : "Start with one repeated workflow, one owner, one review rule, and three success metrics.",
    missingInformation: missingFields(input, [
      ["businessType", "business type"],
      ["bottlenecks", "bottlenecks"],
      ["opportunities", "opportunities"],
      ["risks", "risks"],
      ["goal90Days", "90-day goal"]
    ]),
    confidence: confidenceFromCompleteness(input)
  };
}

function categoryForWorkflow(workflow: string): string {
  const normalized = workflow.toLowerCase();
  if (normalized.includes("lead")) {
    return "lead research and qualification";
  }
  if (normalized.includes("support")) {
    return "customer support triage";
  }
  if (normalized.includes("content")) {
    return "content research and repurposing";
  }
  if (normalized.includes("onboarding")) {
    return "client onboarding";
  }
  return "workflow documentation and review";
}
