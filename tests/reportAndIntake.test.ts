import { describe, expect, it } from "vitest";
import { buildIntakePacket } from "../src/services/intakePacketBuilder.js";
import { buildMiniReport } from "../src/services/reportBuilder.js";
import { containsForbiddenTerm } from "../src/services/publicSafety.js";

const input = {
  businessType: "one-person AI consulting business",
  currentProblem: "content ideas, leads, proposals, and delivery tasks are scattered everywhere",
  aiIdea: "create assistants to support business operations",
  goal90Days: "create a repeatable operating system"
};

describe("report and intake builders", () => {
  it("generates required mini report sections", () => {
    const report = buildMiniReport(input);

    expect(report.markdown).toContain("Business Snapshot");
    expect(report.markdown).toContain("Likely Bottlenecks");
    expect(report.markdown).toContain("AI Opportunity Areas");
    expect(report.markdown).toContain("Trust & Control Risks");
    expect(report.markdown).toContain("Recommended First Workflow");
    expect(report.markdown).toContain("Recommended Next Step");
    expect(report.markdown).toContain("Important Note");
    expect(containsForbiddenTerm(report.markdown)).toBe(false);
  });

  it("generates intake packet markdown and JSON", () => {
    const packet = buildIntakePacket(input);

    expect(packet.markdown).toContain("Business Review Intake Packet");
    expect(packet.markdown).toContain("Missing Information");
    expect(packet.packet).toHaveProperty("businessContext");
    expect(packet.packet).toHaveProperty("recommendedFirstWorkflow");
    expect(containsForbiddenTerm(packet.markdown)).toBe(false);
  });
});
