import { IntakePacketInput, IntakePacketResult } from "../schemas/intakePacket.schema.js";
import { analyzeBusinessContext, assessTrustControlRisks, evaluateAiOpportunities, identifyBottlenecks, mapCustomerTouchpoints } from "./analysis.js";
import { ensurePublicSafe } from "./publicSafety.js";
import { recommendNextStep } from "./nextStepRouter.js";
import { recommendFirstWorkflow } from "./workflowAdvisor.js";

export function buildIntakePacket(input: IntakePacketInput): IntakePacketResult {
  const context = analyzeBusinessContext(input);
  const touchpoints = mapCustomerTouchpoints(input);
  const bottlenecks = identifyBottlenecks(input);
  const opportunities = evaluateAiOpportunities(input);
  const risks = assessTrustControlRisks(input);
  const workflow = recommendFirstWorkflow(input);
  const nextStep = recommendNextStep(input);

  const packet = {
    businessContext: {
      businessType: input.businessType ?? "",
      targetCustomer: input.targetCustomer ?? "",
      coreOffer: input.offer ?? "",
      revenueModel: input.revenueModel ?? "",
      teamSize: input.teamSize ?? "",
      goal90Days: input.goal90Days ?? ""
    },
    currentProblem: input.currentProblem ?? "",
    currentWorkflow: input.currentWorkflow ?? "",
    customerTouchpoints: touchpoints.touchpoints,
    bottlenecks: bottlenecks.bottlenecks,
    opportunities: opportunities.opportunities,
    risks: risks.risks,
    recommendedFirstWorkflow: workflow,
    recommendedNextStepCategory: nextStep,
    missingInformation: context.missingInformation,
    notesForPrivateReview:
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
${touchpoints.touchpoints.map((item) => `- ${item.stage}: ${item.classification}; ${item.reviewRule}`).join("\n")}

## Likely Bottlenecks
${bottlenecks.bottlenecks.map((item) => `- ${item.category}: ${item.description}`).join("\n")}

## AI Opportunity Areas
${opportunities.opportunities.map((item) => `- ${item.name}: ${item.aiRole}`).join("\n")}

## Trust & Control Risks
${risks.risks.map((item) => `- ${item.category}: ${item.control}`).join("\n")}

## Recommended First Workflow
- Workflow: ${workflow.workflow}
- AI role: ${workflow.aiRole}
- Human role: ${workflow.humanRole}
- Review rule: ${workflow.reviewRule}
- Escalation rule: ${workflow.escalationRule}
- Success metrics: ${workflow.successMetrics.join(", ")}

## Recommended Next Step Category
${nextStep.label}

## Missing Information
${context.missingInformation.map((item) => `- ${item}`).join("\n")}

## Notes for Private Review
${packet.notesForPrivateReview}`;

  return ensurePublicSafe({
    markdown,
    packet,
    confidence: context.confidence
  });
}
