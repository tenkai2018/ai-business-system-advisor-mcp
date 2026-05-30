import { IMPORTANT_NOTE } from "../constants/publicCopy.js";
import { MiniReportInput, MiniReportResult } from "../schemas/miniReport.schema.js";
import { analyzeBusinessContext, assessTrustControlRisks, evaluateAiOpportunities, identifyBottlenecks } from "./analysis.js";
import { ensurePublicSafe } from "./publicSafety.js";
import { recommendNextStep } from "./nextStepRouter.js";
import { recommendFirstWorkflow } from "./workflowAdvisor.js";

export function buildMiniReport(input: MiniReportInput): MiniReportResult {
  const context = analyzeBusinessContext(input);
  const bottlenecks = identifyBottlenecks(input);
  const opportunities = evaluateAiOpportunities(input);
  const risks = assessTrustControlRisks(input);
  const workflow = recommendFirstWorkflow(input);
  const nextStep = recommendNextStep(input);
  const bottleneckList = [
    ...bottlenecks.revenueBottlenecks,
    ...bottlenecks.operationalBottlenecks,
    ...bottlenecks.customerExperienceBottlenecks,
    ...bottlenecks.trustControlBottlenecks
  ];

  const markdown = `# Mini Business System Review

## 1. Business Snapshot
${input.businessSnapshot ?? context.businessSnapshot}

## 2. Likely Bottlenecks
${(input.bottlenecks ?? bottleneckList).map((item) => `- ${item}`).join("\n")}

## 3. AI Opportunity Areas
${(input.opportunities ?? opportunities.opportunities.map((item) => `${item.name}: ${item.recommendedFirstVersion}`)).map((item) => `- ${item}`).join("\n")}

## 4. Trust & Control Risks
${(input.risks ?? [risks.riskSummary, ...risks.humanReviewRules.slice(0, 2)]).map((item) => `- ${item}`).join("\n")}

## 5. Recommended First Workflow
**Workflow:** ${input.recommendedWorkflow ?? workflow.recommendedWorkflow}

**Why this first:** ${workflow.whyThisWorkflow}

**AI role:** ${workflow.aiRole}

**Human role:** ${workflow.humanRole}

**Review rule:** ${workflow.reviewRule}

**Escalation rule:** ${workflow.escalationRule}

**Success metrics:**
${workflow.successMetrics.map((metric) => `- ${metric}`).join("\n")}

## 6. Recommended Next Step
${input.nextStep ?? nextStep.recommendedPath}: ${nextStep.suggestedAction}

## Important Note
${IMPORTANT_NOTE}`;

  return ensurePublicSafe({
    reportMarkdown: markdown,
    shortSummary: context.businessSnapshot,
    recommendedAction: nextStep.suggestedAction,
    disclaimer: IMPORTANT_NOTE,
    missingInformation: [
      ...context.missingInformation,
      ...workflow.missingInformation,
      ...nextStep.missingInformation
    ],
    confidence: input.confidence ?? context.confidence
  });
}
