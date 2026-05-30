import { BOTTLENECK_PATTERNS } from "../constants/bottleneckPatterns.js";
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
import { assessRiskLevel, confidenceFromCompleteness, estimateReadiness, missingFields } from "./scoring.js";
import { toSearchText } from "./validation.js";
import { recommendFirstWorkflow } from "./workflowAdvisor.js";

export function analyzeBusinessContext(input: BusinessContextInput): BusinessContextResult {
  const missingInformation = missingFields(input, [
    ["businessType", "business type"],
    ["targetCustomer", "target customer"],
    ["offer", "core offer"],
    ["currentWorkflow", "current workflow"],
    ["currentProblem", "current problem"],
    ["aiIdea", "AI idea"],
    ["riskConcerns", "risk concerns"],
    ["goal90Days", "90-day goal"]
  ]);

  const businessSnapshot = [
    input.businessType ?? "The business type is not yet specified",
    input.targetCustomer ? `serving ${input.targetCustomer}` : "with an unclear target customer",
    input.offer ? `through ${input.offer}` : "with an offer that needs clarification"
  ].join(" ");

  return {
    businessSnapshot,
    likelyBusinessModel: input.revenueModel ?? "Business model not specified; infer only after revenue flow is clarified.",
    targetCustomerSummary: input.targetCustomer ?? "Target customer needs clarification.",
    valuePromiseHypothesis: input.offer
      ? `The likely value promise is tied to ${input.offer}.`
      : "Value promise is unclear until the core offer and customer outcome are specified.",
    primaryConstraintHypothesis:
      input.currentProblem ??
      "Primary constraint is unclear; likely candidates are workflow clarity, data readiness, ownership, or review controls.",
    readinessSignals: [
      input.currentWorkflow ? "Current workflow described" : "Current workflow missing",
      input.aiIdea ? "AI idea provided" : "AI idea missing",
      input.riskConcerns ? "Risk concerns provided" : "Risk concerns missing",
      `Implementation readiness appears ${estimateReadiness(input)}`
    ],
    missingInformation,
    confidence: confidenceFromCompleteness(input)
  };
}

export function mapCustomerTouchpoints(input: TouchpointsInput): TouchpointsResult {
  const baseStages = input.customerJourney?.length
    ? input.customerJourney
    : input.touchpoints?.length
      ? input.touchpoints
      : ["awareness", "inquiry", "purchase", "onboarding", "delivery", "support", "retention"];

  const riskLevel = assessRiskLevel(input);
  const missingInformation = missingFields(input, [
    ["customerJourney", "customer journey"],
    ["salesProcess", "sales process"],
    ["supportProcess", "support process"],
    ["recoveryProcess", "recovery process"]
  ]);
  const touchpoints = baseStages.map((stage) => {
    const classification: "automation_safe" | "hybrid" | "human_critical" | "unknown" =
      riskLevel === "high" &&
      ["support", "refund", "complaint", "recovery"].some((term) => stage.toLowerCase().includes(term))
        ? "human_critical"
        : ["support", "delivery", "onboarding"].some((term) => stage.toLowerCase().includes(term))
          ? "hybrid"
          : "automation_safe";

    return {
      stage,
      description: likelyFrictionForStage(stage),
      classification,
      reason:
        classification === "automation_safe"
          ? "The stage appears repeatable and low sensitivity based on provided context."
          : classification === "hybrid"
            ? "AI can prepare or route work, but a person should review customer-facing outcomes."
            : "This stage may involve trust, money, emotion, exception handling, or recovery.",
      suggestedControl:
        "Use AI for preparation and routing; require human review when the message affects trust, money, scope, or customer emotion."
    };
  });

  return {
    touchpoints,
    trustSensitiveMoments: [
      "Pricing, refund, exception, complaint, and service recovery moments need human accountability.",
      "Low-confidence or missing-context cases should be escalated before customer-facing action."
    ],
    automationSafeAreas: touchpoints
      .filter((item) => item.classification === "automation_safe")
      .map((item) => item.stage),
    humanCriticalAreas: touchpoints
      .filter((item) => item.classification === "human_critical")
      .map((item) => item.stage),
    missingInformation,
    confidence: confidenceFromCompleteness(input)
  };
}

export function identifyBottlenecks(input: BottlenecksInput): BottlenecksResult {
  const text = toSearchText(input).toLowerCase();
  const revenueBottlenecks = findCategoryBottlenecks(text, BOTTLENECK_PATTERNS.revenue, "Revenue flow may be slowed by inconsistent lead, sales, proposal, or follow-up work.");
  const operationalBottlenecks = findCategoryBottlenecks(text, BOTTLENECK_PATTERNS.operations, "Operations may depend on manual, repeated, scattered, or unclear handoff work.");
  const customerExperienceBottlenecks = findCategoryBottlenecks(text, BOTTLENECK_PATTERNS.customerExperience, "Customer experience may be affected by support, onboarding, complaint, or response-time friction.");
  const trustControlBottlenecks = findCategoryBottlenecks(text, BOTTLENECK_PATTERNS.trustControl, "Trust/control may be weak where approval, escalation, policy, quality, or sensitive data boundaries are unclear.");
  const all = [
    ...revenueBottlenecks,
    ...operationalBottlenecks,
    ...customerExperienceBottlenecks,
    ...trustControlBottlenecks
  ];

  return {
    revenueBottlenecks,
    operationalBottlenecks,
    customerExperienceBottlenecks,
    trustControlBottlenecks,
    mostLikelyRootCause: all.length
      ? "The workflow likely needs clearer inputs, ownership, review rules, escalation paths, and reusable operating instructions."
      : "The root cause cannot be identified confidently without more workflow evidence.",
    bottleneckSummary: all.length
      ? all.join(" ")
      : "The main bottleneck is not yet specific enough. Clarify workflow, owner, data sources, volume, errors, and success metrics.",
    missingInformation: missingFields(input, [
      ["businessContext", "business context"],
      ["currentWorkflow", "current workflow"],
      ["metrics", "metrics"],
      ["teamPainPoints", "team pain points"]
    ]),
    confidence: confidenceFromCompleteness(input)
  };
}

export function evaluateAiOpportunities(input: OpportunitiesInput): OpportunitiesResult {
  const recommendation = recommendFirstWorkflow(input);
  const riskLevel = assessRiskLevel(input);
  const candidateUseCases = input.candidateUseCases?.length
    ? input.candidateUseCases
    : [
        {
          name: recommendation.recommendedWorkflow,
          description: recommendation.whyThisWorkflow,
          customerFacing: riskLevel !== "low",
          riskIfWrong: input.riskConcerns,
          availableData: input.currentWorkflow,
          expectedImpact: input.currentProblem,
          currentControls: ""
        }
      ];

  return {
    opportunities: candidateUseCases.map((useCase) => {
      const name = typeof useCase === "string" ? useCase : useCase.name;
      const description = typeof useCase === "string" ? useCase : useCase.description;
      const useCaseRisk = assessRiskLevel(useCase);
      const hasControls = typeof useCase === "string" ? false : Boolean(useCase.currentControls);
      const customerFacing = typeof useCase === "string" ? riskLevel !== "low" : useCase.customerFacing === true;
      const trustRiskLevel = customerFacing && !hasControls ? "high" : useCaseRisk;
      const businessValueScore = scoreByText(`${description} ${typeof useCase === "string" ? "" : useCase.expectedImpact ?? ""}`);
      const implementationReadinessScore = typeof useCase === "string" ? 2 : scoreByText(`${useCase.availableData ?? ""} ${useCase.currentControls ?? ""}`);

      return {
        name,
        summary: description,
        priority:
          trustRiskLevel === "high" && !hasControls
            ? "not_recommended_yet"
            : businessValueScore >= 4 && implementationReadinessScore >= 3
              ? "high"
              : implementationReadinessScore >= 2
                ? "medium"
                : "low",
        businessValueScore,
        implementationReadinessScore,
        trustRiskLevel,
        recommendedFirstVersion:
          trustRiskLevel === "high"
            ? "Start with triage, summarization, or draft preparation with human approval."
            : "Start with a narrow workflow that AI prepares and a human can review quickly.",
        requiredHumanControl:
          trustRiskLevel === "low"
            ? "Human review for exceptions, low confidence, or customer-facing commitments."
            : "Human approval before customer-facing action, money decisions, exceptions, or service recovery."
      };
    }),
    recommendedFirstOpportunity: recommendation.recommendedWorkflow,
    warnings:
      riskLevel === "high"
        ? ["Fully autonomous customer-facing decisions without human review"]
        : ["Broad multi-system automation before the first workflow is clear"],
    missingInformation: missingFields(input, [
      ["businessContext", "business context"],
      ["candidateUseCases", "candidate use cases"],
      ["currentControls", "current controls"]
    ]),
    confidence: confidenceFromCompleteness(input)
  };
}

export function assessTrustControlRisks(input: RisksInput): RisksResult {
  const riskLevel = assessRiskLevel(input);
  const workflowIdea = input.workflowIdea ?? input.proposedWorkflow ?? input.aiIdea ?? "the proposed AI-enabled workflow";
  const requiredControls = [
    "Define allowed, restricted, and prohibited AI uses.",
    "Set human review rules before customer-facing output.",
    "Add escalation for low confidence, missing context, complaints, money, privacy, legal exposure, and service recovery.",
    "Use quality checks for accuracy, tone, completeness, policy fit, and actionability."
  ];

  return {
    riskLevel,
    riskSummary: `${workflowIdea} is ${riskLevel} risk based on customer impact, data sensitivity, money/brand exposure, expert judgment, and current controls.`,
    requiredControls,
    humanReviewRules: [
      "Require review before customer-facing promises, refunds, pricing, exceptions, sensitive advice, or brand-sensitive communication.",
      "Require review when AI confidence is low or source context is incomplete."
    ],
    dataBoundaryWarnings: [
      "Do not submit secrets, credentials, regulated records, or raw private customer data.",
      "Use anonymized examples and summarized workflow evidence where possible."
    ],
    escalationTriggers: [
      "Money, refund, pricing, contract, privacy, legal, medical, financial, HR, or safety exposure.",
      "Angry customers, complaints, low confidence, missing data, or unclear owner."
    ],
    notRecommendedActions:
      riskLevel === "high"
        ? ["Do not launch full autonomy before review rules, data boundaries, QA, and escalation are defined."]
        : ["Do not expand beyond a narrow first workflow before measurement and review are in place."],
    missingInformation: missingFields(input, [
      ["workflowIdea", "workflow idea"],
      ["currentControls", "current controls"],
      ["customerFacing", "customer-facing status"],
      ["usesSensitiveData", "sensitive data status"]
    ]),
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

function findCategoryBottlenecks(text: string, terms: string[], fallback: string): string[] {
  const hits = terms.filter((term) => text.includes(term));
  return hits.length ? hits.map((term) => `Likely friction around ${term}.`) : [fallback];
}

function scoreByText(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words >= 18) {
    return 5;
  }
  if (words >= 10) {
    return 4;
  }
  if (words >= 5) {
    return 3;
  }
  return 2;
}
