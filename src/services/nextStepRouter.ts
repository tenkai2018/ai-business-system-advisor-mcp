import { NEXT_STEP_CATEGORIES } from "../constants/nextSteps.js";
import { NextStepInput, NextStepResult } from "../schemas/nextStep.schema.js";
import { assessRiskLevel, confidenceFromCompleteness, estimateReadiness } from "./scoring.js";

export function recommendNextStep(input: NextStepInput): NextStepResult {
  const riskLevel = input.riskLevel ?? assessRiskLevel(input);
  const readiness = input.readiness ?? estimateReadiness(input);
  const category =
    input.hasExistingAutomation === true
      ? NEXT_STEP_CATEGORIES.monthlyReview
      : input.preference === "self_guided" && riskLevel === "low"
        ? NEXT_STEP_CATEGORIES.selfGuidedResource
        : riskLevel === "high" || readiness === "low"
          ? NEXT_STEP_CATEGORIES.deeperDiagnostic
          : readiness === "high" && input.preference === "done_for_you"
            ? NEXT_STEP_CATEGORIES.aiReadySystemBuild
            : NEXT_STEP_CATEGORIES.implementationReadyDocs;

  return {
    ...category,
    suggestedAction:
      category.id === "self_guided_resource"
        ? "Use the review output as a checklist and clarify the workflow, data, owner, review rule, and success metric before building."
        : category.id === "monthly_review"
          ? "Review the current AI-enabled workflow for quality, escalation, trust impact, and measurable business outcomes."
          : "Prepare this intake packet for a deeper private review or implementation-ready workflow documentation.",
    confidence: confidenceFromCompleteness(input)
  };
}
