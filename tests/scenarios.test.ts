import { describe, expect, it } from "vitest";
import { assessTrustControlRisks, evaluateAiOpportunities } from "../src/services/analysis.js";
import { recommendNextStep } from "../src/services/nextStepRouter.js";
import { recommendFirstWorkflow } from "../src/services/workflowAdvisor.js";
import { BusinessContextInputSchema } from "../src/schemas/businessContext.schema.js";

describe("business review scenarios", () => {
  it("validates malformed input with Zod", () => {
    expect(() =>
      BusinessContextInputSchema.parse({
        businessType: 123
      })
    ).toThrow();
  });

  it("recommends lead research and proposal drafting for a B2B service founder", () => {
    const workflow = recommendFirstWorkflow({
      businessType: "B2B service agency",
      targetCustomer: "small ecommerce brands",
      offer: "conversion optimization and landing page design",
      currentProblem: "too much time spent on lead research and proposals",
      currentWorkflow: "manual research, manual proposal writing, follow-up in Gmail",
      aiIdea: "AI agent to research leads and draft proposals",
      goal90Days: "get more qualified sales calls"
    });

    expect(workflow.recommendedWorkflow.toLowerCase()).toContain("lead research");
    expect(workflow.humanRole.toLowerCase()).toContain("approve");
    expect(workflow).toHaveProperty("missingInformation");
  });

  it("does not recommend full autonomy for ecommerce support complaints", () => {
    const input = {
      businessType: "ecommerce store",
      currentProblem: "support tickets and refund complaints are increasing",
      aiIdea: "fully automate customer support replies",
      riskConcerns: "angry customers and bad reviews"
    };

    const workflow = recommendFirstWorkflow(input);
    const opportunities = evaluateAiOpportunities(input);
    const risks = assessTrustControlRisks(input);

    expect(risks.riskLevel).toBe("high");
    expect(workflow.recommendedWorkflow.toLowerCase()).toContain("support triage");
    expect(opportunities.warnings.join(" ").toLowerCase()).toContain("fully autonomous");
  });

  it("routes low-risk self-guided users to self-guided resource", () => {
    const nextStep = recommendNextStep({
      businessType: "solo consultant",
      currentProblem: "simple weekly content drafting checklist",
      preference: "self_guided",
      riskLevel: "low",
      readiness: "medium"
    });

    expect(nextStep.recommendedPath).toBe("self_guided_resource");
  });

  it("routes existing unreliable automation to monthly review", () => {
    const nextStep = recommendNextStep({
      businessType: "agency",
      currentProblem: "existing automation system is unreliable",
      hasExistingAutomation: true
    });

    expect(nextStep.recommendedPath).toBe("monthly_review");
  });
});
