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

    expect(report.reportMarkdown).toContain("Business Snapshot");
    expect(report.reportMarkdown).toContain("Likely Bottlenecks");
    expect(report.reportMarkdown).toContain("AI Opportunity Areas");
    expect(report.reportMarkdown).toContain("Trust & Control Risks");
    expect(report.reportMarkdown).toContain("Recommended First Workflow");
    expect(report.reportMarkdown).toContain("Recommended Next Step");
    expect(report.reportMarkdown).toContain("Important Note");
    expect(report).toHaveProperty("missingInformation");
    expect(containsForbiddenTerm(report.reportMarkdown)).toBe(false);
  });

  it("generates intake packet markdown and JSON", () => {
    const packet = buildIntakePacket(input);

    expect(packet.packetMarkdown).toContain("Business Review Intake Packet");
    expect(packet.packetMarkdown).toContain("Missing Information");
    expect(packet.packetJson).toHaveProperty("businessContext");
    expect(packet.packetJson).toHaveProperty("recommendedFirstWorkflow");
    expect(packet).toHaveProperty("missingInformation");
    expect(containsForbiddenTerm(packet.packetMarkdown)).toBe(false);
  });
});
