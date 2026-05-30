import { IntakePacketInput, IntakePacketResult } from "../schemas/intakePacket.schema.js";
import { analyzeBusinessContext, assessTrustControlRisks, evaluateAiOpportunities, identifyBottlenecks, mapCustomerTouchpoints } from "./analysis.js";
import { ensurePublicSafe } from "./publicSafety.js";
import { recommendNextStep } from "./nextStepRouter.js";
import { recommendFirstWorkflow } from "./workflowAdvisor.js";

export function buildIntakePacket(input: IntakePacketInput): IntakePacketResult {
  const context = analyzeBusinessContext(input);
  const touchpoints = mapCustomerTouchpoints(input);
  const analysisInput = {
    ...input,
    businessContext:
      typeof input.businessContext === "string"
        ? input.businessContext
        : input.businessContext
          ? JSON.stringify(input.businessContext)
          : undefined
  };
  const bottlenecks = identifyBottlenecks(analysisInput);
  const opportunities = evaluateAiOpportunities(analysisInput);
  const risks = assessTrustControlRisks(input);
  const workflow = recommendFirstWorkflow(input);
  const nextStep = recommendNextStep(input);

  const packet = {
    businessContext: input.businessContext ?? {
      businessType: input.businessType ?? "",
      targetCustomer: input.targetCustomer ?? "",
      coreOffer: input.offer ?? "",
      revenueModel: input.revenueModel ?? "",
      teamSize: input.teamSize ?? "",
      goal90Days: input.goal90Days ?? ""
    },
    currentProblem: input.currentProblem ?? "",
    currentWorkflow: input.currentWorkflow ?? "",
    customerTouchpoints: input.touchpointMap ?? touchpoints.touchpoints,
    bottlenecks: input.bottleneckSummary ?? {
      revenue: bottlenecks.revenueBottlenecks,
      operations: bottlenecks.operationalBottlenecks,
      customerExperience: bottlenecks.customerExperienceBottlenecks,
      trustControl: bottlenecks.trustControlBottlenecks
    },
    opportunities: opportunities.opportunities,
    risks: input.riskSummary ?? risks,
    recommendedFirstWorkflow: input.recommendedWorkflow ?? workflow,
    recommendedNextStepCategory: input.recommendedNextStep ?? nextStep,
    missingInformation: [
      ...context.missingInformation,
      ...workflow.missingInformation,
      ...nextStep.missingInformation
    ],
    notesForPrivateReview: input.userNotes ??
      "Use this packet to confirm workflow evidence, data readiness, owner, review rules, escalation rules, success metrics, and implementation constraints."
  };

  const markdown = `# Business Review Intake Packet

## Business Context
- Business type: ${packet.businessContext.businessType}
- Target customer: ${packet.businessContext.targetCustomer}
- Core offer: ${packet.businessContext.coreOffer}
- Revenue model: ${packet.businessContext.revenueModel}
- Team size: ${packet.businessContext.teamSize}
- 90-day goal: ${packet.businessContext.goal90Days}

## Current Problem
${packet.currentProblem}

## Current Workflow
${packet.currentWorkflow}

## Customer Touchpoints
${touchpoints.touchpoints.map((item) => `- ${item.stage}: ${item.classification}; ${item.suggestedControl}`).join("\n")}

## Likely Bottlenecks
${[
  ...bottlenecks.revenueBottlenecks,
  ...bottlenecks.operationalBottlenecks,
  ...bottlenecks.customerExperienceBottlenecks,
  ...bottlenecks.trustControlBottlenecks
].map((item) => `- ${item}`).join("\n")}

## AI Opportunity Areas
${opportunities.opportunities.map((item) => `- ${item.name}: ${item.recommendedFirstVersion}`).join("\n")}

## Trust & Control Risks
${[risks.riskSummary, ...risks.requiredControls].map((item) => `- ${item}`).join("\n")}

## Recommended First Workflow
- Workflow: ${workflow.recommendedWorkflow}
- AI role: ${workflow.aiRole}
- Human role: ${workflow.humanRole}
- Review rule: ${workflow.reviewRule}
- Escalation rule: ${workflow.escalationRule}
- Success metrics: ${workflow.successMetrics.join(", ")}

## Recommended Next Step Category
${nextStep.recommendedPath}

## Missing Information
${packet.missingInformation.map((item) => `- ${item}`).join("\n")}

## Notes for Private Review
${packet.notesForPrivateReview}`;

  return ensurePublicSafe({
    packetMarkdown: markdown,
    packetJson: packet,
    missingInformation: packet.missingInformation,
    recommendedPrivateReview:
      "Prepare this intake packet for deeper private review of workflow evidence, risk controls, implementation readiness, and next-step fit.",
    confidence: context.confidence
  });
}
