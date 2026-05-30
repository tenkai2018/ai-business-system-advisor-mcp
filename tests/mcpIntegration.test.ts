import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { describe, expect, it } from "vitest";
import { createServer } from "../src/server.js";

describe("MCP integration", () => {
  it("lists tools, prompts, and resources and calls a tool", async () => {
    const server = createServer();
    const client = new Client({
      name: "test-client",
      version: "0.1.0"
    });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

    const tools = await client.listTools();
    const prompts = await client.listPrompts();
    const resources = await client.listResources();
    const result = await client.callTool({
      name: "recommend_first_workflow",
      arguments: {
        businessType: "B2B service agency",
        currentProblem: "manual lead research and proposal writing"
      }
    });

    expect(tools.tools.map((tool) => tool.name)).toContain("generate_mini_report");
    expect(prompts.prompts.map((prompt) => prompt.name)).toContain(
      "run_mini_business_system_review"
    );
    expect(resources.resources.map((resource) => resource.uri)).toContain("advisor://overview");
    expect(JSON.stringify(result)).toContain("workflow");

    await client.close();
    await server.close();
  });
});
