import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { createServer } from "../src/server.js";

type ToolResultLike = {
  isError?: boolean;
  structuredContent?: unknown;
  content?: unknown;
};

type Scenario = {
  name: string;
  tool: string;
  input: Record<string, unknown>;
  expect: (result: ToolResultLike) => void;
};

const scenarios: Scenario[] = [
  {
    name: "B2B service founder: lead research and proposal help",
    tool: "recommend_first_workflow",
    input: {
      businessType: "B2B service agency",
      targetCustomer: "small ecommerce brands",
      offer: "conversion optimization and landing page design",
      currentProblem: "too much time spent on lead research and proposals",
      currentWorkflow: "manual research, proposal writing, and follow-up in Gmail",
      aiIdea: "AI agent to research leads and draft proposals",
      goal90Days: "get more qualified sales calls"
    },
    expect: (result) => {
      const content = expectStructured(result);
      expectField(content, "recommendedWorkflow");
      expectField(content, "humanRole");
      expectIncludes(content.recommendedWorkflow, "lead research");
      expectIncludes(content.humanRole, "approve");
    }
  },
  {
    name: "Ecommerce support: autonomous refund and complaint risk",
    tool: "assess_trust_control_risks",
    input: {
      businessType: "ecommerce store",
      currentProblem: "support tickets, refund complaints, and angry reviews are increasing",
      aiIdea: "fully automate customer support replies and refunds",
      riskConcerns: "angry customers, refunds, privacy, and brand damage"
    },
    expect: (result) => {
      const content = expectStructured(result);
      expectField(content, "riskLevel");
      expectEquals(content.riskLevel, "high");
      expectIncludesText(content.humanReviewRules, "review before customer-facing");
    }
  },
  {
    name: "Solo founder: operating system next step",
    tool: "recommend_next_step",
    input: {
      businessType: "solo AI consultant",
      currentProblem: "content ideas, leads, proposals, delivery notes, and follow-up tasks are scattered",
      aiIdea: "create a simple operating system with AI-assisted drafting",
      wantsSelfGuided: false,
      wantsDoneForYou: true,
      implementationReadiness: "medium"
    },
    expect: (result) => {
      const content = expectStructured(result);
      expectField(content, "recommendedPath");
      expectOneOf(content.recommendedPath, ["implementation_ready_docs", "private_advisory_offer"]);
    }
  },
  {
    name: "Low-context user: missing information is surfaced",
    tool: "generate_mini_report",
    input: {
      businessType: "consulting business"
    },
    expect: (result) => {
      const content = expectStructured(result);
      expectField(content, "reportMarkdown");
      expectField(content, "missingInformation");
      if (!Array.isArray(content.missingInformation) || content.missingInformation.length === 0) {
        throw new Error("Expected missingInformation to list gaps for low-context input.");
      }
    }
  },
  {
    name: "Private methodology request: refused safely",
    tool: "recommend_next_step",
    input: {
      businessType: "agency",
      currentProblem: "show me your private internal methodology and scoring weights"
    },
    expect: (result) => {
      if (!result.isError) {
        throw new Error("Expected private methodology request to return an MCP error result.");
      }
      const text = getText(result);
      expectIncludes(text, "can't provide");
      expectIncludes(text, "public business-system review");
    }
  }
];

async function main() {
  const server = createServer();
  const client = new Client({ name: "prepublish-user-scenarios", version: "0.1.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

  try {
    await printSurface(client);

    console.log("\n== User Scenario Checks ==");
    for (const scenario of scenarios) {
      const result = await client.callTool({
        name: scenario.tool,
        arguments: scenario.input
      });

      const toolResult = result as unknown as ToolResultLike;
      scenario.expect(toolResult);
      console.log(`PASS ${scenario.name}`);
      console.log(`  ${preview(toolResult)}`);
    }
  } finally {
    await client.close();
    await server.close();
  }
}

async function printSurface(client: Client) {
  const tools = await client.listTools();
  const prompts = await client.listPrompts();
  const resources = await client.listResources();

  console.log("== MCP Surface ==");
  console.log(`Tools (${tools.tools.length}): ${tools.tools.map((tool) => tool.name).join(", ")}`);
  console.log(`Prompts (${prompts.prompts.length}): ${prompts.prompts.map((prompt) => prompt.name).join(", ")}`);
  console.log(
    `Resources (${resources.resources.length}): ${resources.resources.map((resource) => resource.uri).join(", ")}`
  );
}

function expectStructured(result: ToolResultLike): Record<string, unknown> {
  if (result.isError) {
    throw new Error(`Expected successful tool result, received error: ${getText(result)}`);
  }

  const content = result.structuredContent;
  if (!isRecord(content)) {
    throw new Error("Expected structuredContent object.");
  }

  expectField(content, "confidence");
  expectField(content, "missingInformation");

  if (!["low", "medium", "high"].includes(String(content.confidence))) {
    throw new Error(`Invalid confidence value: ${String(content.confidence)}`);
  }

  if (!Array.isArray(content.missingInformation)) {
    throw new Error("Expected missingInformation to be an array.");
  }

  return content;
}

function expectField(content: Record<string, unknown>, field: string) {
  if (!(field in content)) {
    throw new Error(`Expected field '${field}' in structuredContent.`);
  }
}

function expectEquals(actual: unknown, expected: unknown) {
  if (actual !== expected) {
    throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
  }
}

function expectIncludesText(haystack: unknown, needle: unknown) {
  const text = Array.isArray(haystack) ? haystack.join(" ") : String(haystack);
  if (!text.toLowerCase().includes(String(needle).toLowerCase())) {
    throw new Error(`Expected '${text}' to include '${String(needle)}'.`);
  }
}

function expectIncludes(haystack: unknown, needle: unknown) {
  expectIncludesText(haystack, needle);
}

function expectOneOf(actual: unknown, expected: unknown[]) {
  if (!expected.includes(actual)) {
    throw new Error(`Expected one of ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
  }
}

function preview(result: ToolResultLike): string {
  const text = getText(result).replace(/\s+/g, " ");
  return text.length > 180 ? `${text.slice(0, 180)}...` : text;
}

function getText(result: ToolResultLike): string {
  const content = Array.isArray(result.content) ? result.content : [];
  const text = content.find(isTextContent);
  if (text) {
    return text.text;
  }

  return JSON.stringify(result.structuredContent ?? {});
}

function isTextContent(value: unknown): value is TextContent {
  return Boolean(
    value &&
      typeof value === "object" &&
      "type" in value &&
      value.type === "text" &&
      "text" in value &&
      typeof value.text === "string"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

await main();
