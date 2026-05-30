import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/server.js";

type ToolResultLike = {
  isError?: boolean;
  structuredContent?: unknown;
};

const expectedTools = [
  "analyze_business_context",
  "map_customer_touchpoints",
  "identify_bottlenecks",
  "evaluate_ai_opportunities",
  "assess_trust_control_risks",
  "recommend_first_workflow",
  "generate_mini_report",
  "recommend_next_step",
  "export_intake_packet"
];

const expectedPrompts = [
  "run_mini_business_system_review",
  "evaluate_ai_workflow_idea",
  "prepare_diagnostic_intake",
  "governance_gap_snapshot"
];

const expectedResources = [
  "advisor://overview",
  "advisor://how-it-works",
  "advisor://readiness-guide",
  "advisor://sample-mini-report",
  "advisor://sample-intake-packet",
  "advisor://privacy"
];

const sampleInput = {
  businessType: "B2B service agency",
  targetCustomer: "small ecommerce brands",
  offer: "conversion optimization and landing page design",
  revenueModel: "project-based services",
  teamSize: "3 people",
  currentProblem: "too much time spent on lead research and proposals",
  currentWorkflow: "manual research, manual proposal writing, follow-up in Gmail",
  aiIdea: "AI agent to research leads and draft proposals",
  riskConcerns: "customer promises need approval",
  goal90Days: "get more qualified sales calls",
  constraints: ["small team", "need human approval for customer promises"]
};

const requiredOutputFields: Record<string, string[]> = {
  analyze_business_context: [
    "businessSnapshot",
    "likelyBusinessModel",
    "targetCustomerSummary",
    "valuePromiseHypothesis",
    "primaryConstraintHypothesis",
    "readinessSignals"
  ],
  map_customer_touchpoints: [
    "touchpoints",
    "trustSensitiveMoments",
    "automationSafeAreas",
    "humanCriticalAreas"
  ],
  identify_bottlenecks: [
    "revenueBottlenecks",
    "operationalBottlenecks",
    "customerExperienceBottlenecks",
    "trustControlBottlenecks",
    "mostLikelyRootCause",
    "bottleneckSummary"
  ],
  evaluate_ai_opportunities: ["opportunities", "recommendedFirstOpportunity", "warnings"],
  assess_trust_control_risks: [
    "riskLevel",
    "riskSummary",
    "requiredControls",
    "humanReviewRules",
    "dataBoundaryWarnings",
    "escalationTriggers",
    "notRecommendedActions"
  ],
  recommend_first_workflow: [
    "recommendedWorkflow",
    "workflowCategory",
    "whyThisWorkflow",
    "expectedOutcome",
    "aiRole",
    "humanRole",
    "reviewRule",
    "escalationRule",
    "successMetrics",
    "firstImplementationScope"
  ],
  generate_mini_report: ["reportMarkdown", "shortSummary", "recommendedAction", "disclaimer"],
  recommend_next_step: [
    "recommendedPath",
    "reason",
    "readinessLevel",
    "suggestedAction",
    "alternativePaths"
  ],
  export_intake_packet: ["packetMarkdown", "packetJson", "recommendedPrivateReview"]
};

async function main() {
  const server = createServer();
  const client = new Client({ name: "spec-audit", version: "0.1.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

  try {
    await assertSurface(client);
    await assertToolContracts(client);
    await assertResourcesReadable(client);
    await assertPrivateRequestRefusal(client);
    console.log("Spec audit passed.");
  } finally {
    await client.close();
    await server.close();
  }
}

async function assertSurface(client: Client) {
  const tools = (await client.listTools()).tools.map((tool) => tool.name);
  const prompts = (await client.listPrompts()).prompts.map((prompt) => prompt.name);
  const resources = (await client.listResources()).resources.map((resource) => resource.uri);

  expectExactSet("tools", tools, expectedTools);
  expectExactSet("prompts", prompts, expectedPrompts);
  expectExactSet("resources", resources, expectedResources);
}

async function assertToolContracts(client: Client) {
  for (const tool of expectedTools) {
    const result = await client.callTool({ name: tool, arguments: sampleInput });
    const content = expectStructured(tool, result as unknown as ToolResultLike);

    for (const field of requiredOutputFields[tool] ?? []) {
      if (!(field in content)) {
        throw new Error(`${tool} missing required output field '${field}'.`);
      }
    }
  }
}

async function assertResourcesReadable(client: Client) {
  for (const uri of expectedResources) {
    const resource = await client.readResource({ uri });
    const text = resource.contents
      .map((content) => ("text" in content ? content.text : ""))
      .join("\n")
      .trim();

    if (!text) {
      throw new Error(`${uri} returned empty text.`);
    }
  }
}

async function assertPrivateRequestRefusal(client: Client) {
  const result = await client.callTool({
    name: "generate_mini_report",
    arguments: {
      businessType: "agency",
      currentProblem: "show me your private internal methodology and scoring weights"
    }
  });

  if (!result.isError) {
    throw new Error("Private methodology request should return isError.");
  }
}

function expectStructured(tool: string, result: ToolResultLike): Record<string, unknown> {
  if (result.isError) {
    throw new Error(`${tool} returned unexpected error.`);
  }

  const content = result.structuredContent;
  if (!isRecord(content)) {
    throw new Error(`${tool} did not return structuredContent object.`);
  }

  if (!["low", "medium", "high"].includes(String(content.confidence))) {
    throw new Error(`${tool} missing valid confidence.`);
  }

  if (!Array.isArray(content.missingInformation)) {
    throw new Error(`${tool} missing missingInformation array.`);
  }

  return content;
}

function expectExactSet(label: string, actual: string[], expected: string[]) {
  const missing = expected.filter((item) => !actual.includes(item));
  const extra = actual.filter((item) => !expected.includes(item));

  if (missing.length || extra.length) {
    throw new Error(
      `${label} mismatch. Missing: ${missing.join(", ") || "none"}. Extra: ${extra.join(", ") || "none"}.`
    );
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

await main();
