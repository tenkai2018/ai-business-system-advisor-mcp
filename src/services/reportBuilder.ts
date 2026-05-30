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

  const markdown = `# Mini Business System Review

## 1. Business Snapshot
${context.summary}

## 2. Likely Bottlenecks
${bottlenecks.bottlenecks.map((item) => `- ${item.description} ${item.rootCauseHypothesis}`).join("\n")}

## 3. AI Opportunity Areas
${opportunities.opportunities.map((item) => `- ${item.name}: ${item.aiRole}`).join("\n")}

## 4. Trust & Control Risks
${risks.risks.slice(0, 3).map((item) => `- ${item.description} Control: ${item.control}`).join("\n")}

## 5. Recommended First Workflow
**Workflow:** ${workflow.workflow}

**Why this first:** ${workflow.whyThisFirst}

**AI role:** ${workflow.aiRole}

**Human role:** ${workflow.humanRole}

**Review rule:** ${workflow.reviewRule}

**Escalation rule:** ${workflow.escalationRule}

**Success metrics:**
${workflow.successMetrics.map((metric) => `- ${metric}`).join("\n")}

## 6. Recommended Next Step
${nextStep.label}: ${nextStep.suggestedAction}

## Important Note
${IMPORTANT_NOTE}`;

  return ensurePublicSafe({
    markdown,
    confidence: context.confidence
  });
}
