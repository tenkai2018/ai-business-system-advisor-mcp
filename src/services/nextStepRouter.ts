import { NEXT_STEP_CATEGORIES } from "../constants/nextSteps.js";
import { NextStepInput, NextStepResult } from "../schemas/nextStep.schema.js";
import { assessRiskLevel, confidenceFromCompleteness, estimateReadiness, missingFields } from "./scoring.js";

export function recommendNextStep(input: NextStepInput): NextStepResult {
  const riskLevel = input.riskLevel === "unknown" || !input.riskLevel ? assessRiskLevel(input) : input.riskLevel;
  const readiness =
    input.implementationReadiness === "unknown" || !input.implementationReadiness
      ? input.readiness ?? estimateReadiness(input)
      : input.implementationReadiness;
  const wantsSelfGuided = input.wantsSelfGuided === true || input.preference === "self_guided";
  const wantsDoneForYou = input.wantsDoneForYou === true || input.preference === "done_for_you";
  const category =
    input.hasExistingAutomation === true
      ? NEXT_STEP_CATEGORIES.monthlyReview
      : wantsSelfGuided && riskLevel === "low"
        ? NEXT_STEP_CATEGORIES.selfGuidedResource
      : riskLevel === "high" || readiness === "low"
          ? NEXT_STEP_CATEGORIES.deeperDiagnostic
          : readiness === "high" && wantsDoneForYou
            ? NEXT_STEP_CATEGORIES.aiReadySystemBuild
            : NEXT_STEP_CATEGORIES.implementationReadyDocs;

  return {
    recommendedPath: category.id,
    reason: category.description,
    readinessLevel: readiness,
    suggestedAction:
      category.id === "self_guided_resource"
        ? "Use the review output as a checklist and clarify the workflow, data, owner, review rule, and success metric before building."
        : category.id === "monthly_review"
          ? "Review the current AI-enabled workflow for quality, escalation, trust impact, and measurable business outcomes."
          : "Prepare this intake packet for a deeper private review or implementation-ready workflow documentation.",
    alternativePaths: Object.values(NEXT_STEP_CATEGORIES)
      .filter((item) => item.id !== category.id)
      .map((item) => item.id),
    missingInformation: missingFields(input, [
      ["userGoal", "user goal"],
      ["problemComplexity", "problem complexity"],
      ["implementationReadiness", "implementation readiness"],
      ["riskLevel", "risk level"],
      ["timeline", "timeline"]
    ]),
    confidence: confidenceFromCompleteness(input)
  };
}
