import { BOTTLENECK_PATTERNS } from "../constants/bottleneckPatterns.js";
import { TRUST_RISK_CATEGORIES } from "../constants/riskPatterns.js";
import {
  BottlenecksInput,
  BottlenecksResult,
  BusinessContextInput,
  BusinessContextResult,
  OpportunitiesInput,
  OpportunitiesResult,
  RisksInput,
  RisksResult,
  TouchpointsInput,
  TouchpointsResult
} from "../schemas/index.js";
import { assessRiskLevel, confidenceFromCompleteness } from "./scoring.js";
import { toSearchText } from "./validation.js";
import { recommendFirstWorkflow } from "./workflowAdvisor.js";

export function analyzeBusinessContext(input: BusinessContextInput): BusinessContextResult {
  const missingInformation = [
    ["businessType", "business type"],
    ["targetCustomer", "target customer"],
    ["offer", "core offer"],
    ["currentWorkflow", "current workflow"],
    ["goal90Days", "90-day goal"]
  ]
    .filter(([key]) => !input[key as keyof BusinessContextInput])
    .map(([, label]) => label);

  const summary = [
    input.businessType ?? "The business type is not yet specified",
    input.targetCustomer ? `serving ${input.targetCustomer}` : "with an unclear target customer",
    input.offer ? `through ${input.offer}` : "with an offer that needs clarification"
  ].join(" ");

  return {
    summary,
    valueCreationPoints: [
      input.offer ? `Deliver the core offer: ${input.offer}` : "Clarify the core customer outcome",
      input.goal90Days ? `Support the 90-day goal: ${input.goal90Days}` : "Define a measurable near-term business goal",
      "Improve speed while preserving human judgment in trust-sensitive moments"
    ],
    constraints: input.constraints?.length
      ? input.constraints
      : ["Limited workflow detail", "Unclear data readiness", "Review ownership needs confirmation"],
    missingInformation,
    opportunityHypotheses: [
      "Use AI to summarize, classify, draft, route, and prepare decision context.",
      "Keep humans accountable for approvals, exceptions, customer promises, and sensitive decisions."
    ],
    confidence: confidenceFromCompleteness(input)
  };
}

export function mapCustomerTouchpoints(input: TouchpointsInput): TouchpointsResult {
  const baseStages = input.touchpoints?.length
    ? input.touchpoints
    : ["awareness", "inquiry", "purchase", "onboarding", "delivery", "support", "retention"];

  const riskLevel = assessRiskLevel(input);
  return {
    touchpoints: baseStages.map((stage) => ({
      stage,
      likelyFriction: likelyFrictionForStage(stage),
      classification:
        riskLevel === "high" && ["support", "refund", "complaint", "recovery"].some((term) => stage.toLowerCase().includes(term))
          ? "human_critical"
          : ["support", "delivery", "onboarding"].some((term) => stage.toLowerCase().includes(term))
            ? "hybrid"
            : "automation_safe",
      reviewRule:
        "Use AI for preparation and routing; require human review when the message affects trust, money, scope, or customer emotion."
    })),
    trustMoments: [
      "Pricing, refund, exception, complaint, and service recovery moments need human accountability.",
      "Low-confidence or missing-context cases should be escalated before customer-facing action."
    ],
    serviceRecoveryOpportunities: [
      "Flag disappointed or angry customers early.",
      "Prepare concise context summaries before a human responds."
    ],
    confidence: confidenceFromCompleteness(input)
  };
}

export function identifyBottlenecks(input: BottlenecksInput): BottlenecksResult {
  const text = toSearchText(input).toLowerCase();
  const bottlenecks = Object.entries(BOTTLENECK_PATTERNS).flatMap(([category, terms]) => {
    const hit = terms.find((term) => text.includes(term));
    if (!hit) {
      return [];
    }

    return {
      category: category === "customerExperience" ? "customer_experience" : category === "trustControl" ? "trust_control" : category,
      description: `The current context suggests friction around ${hit}.`,
      rootCauseHypothesis: "The workflow may lack clear inputs, ownership, review rules, or reusable operating instructions.",
      suggestedIntervention: "Clarify the process first, then use AI to prepare, classify, draft, or route work with human review."
    };
  });

  const normalized = bottlenecks.length
    ? bottlenecks
    : [
        {
          category: "operations",
          description: "The main bottleneck is not yet specific enough.",
          rootCauseHypothesis: "The current workflow, owner, data sources, and success metric need clarification.",
          suggestedIntervention: "Start with a small workflow review before choosing an automation tool."
        }
      ];

  return {
    bottlenecks: normalized as BottlenecksResult["bottlenecks"],
    candidateUseCases: normalized.map((item) => `${item.description} Use AI to prepare the work, not own the decision.`),
    confidence: confidenceFromCompleteness(input)
  };
}

export function evaluateAiOpportunities(input: OpportunitiesInput): OpportunitiesResult {
  const recommendation = recommendFirstWorkflow(input);
  const riskLevel = assessRiskLevel(input);

  return {
    opportunities: [
      {
        name: recommendation.workflow,
        aiRole: recommendation.aiRole,
        businessValue: recommendation.whyThisFirst,
        riskLevel,
        humanReviewRequired: riskLevel !== "low"
      },
      {
        name: "Workflow intake and missing-information checklist",
        aiRole: "Extract context, identify gaps, and prepare a review-ready intake packet.",
        businessValue: "Reduces ambiguity before implementation and helps avoid tool-first automation.",
        riskLevel: "low",
        humanReviewRequired: false
      }
    ],
    avoidedUseCases:
      riskLevel === "high"
        ? ["Fully autonomous customer-facing decisions without human review"]
        : ["Broad multi-system automation before the first workflow is clear"],
    confidence: confidenceFromCompleteness(input)
  };
}

export function assessTrustControlRisks(input: RisksInput): RisksResult {
  const riskLevel = assessRiskLevel(input);
  return {
    risks: TRUST_RISK_CATEGORIES.slice(0, riskLevel === "low" ? 3 : 7).map((category) => ({
      category,
      level: category.includes("privacy") || category.includes("legal") ? riskLevel : riskLevel === "high" ? "medium" : riskLevel,
      description: `AI use can create ${category} risk if it acts without clear boundaries or review.`,
      control: "Define data boundaries, human approval triggers, escalation rules, and quality checks before deployment."
    })),
    dataBoundaries: [
      "Do not submit secrets, credentials, regulated records, or raw private customer data.",
      "Use anonymized examples and summarized workflow evidence where possible."
    ],
    reviewRules: [
      "Require human review for customer-facing promises, money decisions, exceptions, complaints, legal exposure, privacy risk, and low confidence.",
      "Escalate when AI lacks context or the customer situation is emotionally sensitive."
    ],
    confidence: confidenceFromCompleteness(input)
  };
}

function likelyFrictionForStage(stage: string): string {
  const normalized = stage.toLowerCase();
  if (normalized.includes("support") || normalized.includes("complaint")) {
    return "Slow or inconsistent responses can damage trust.";
  }
  if (normalized.includes("sales") || normalized.includes("inquiry")) {
    return "Lead context and follow-up may be inconsistent.";
  }
  if (normalized.includes("onboarding")) {
    return "Missing information can create delivery rework.";
  }
  return "The friction should be confirmed with real workflow evidence.";
}
