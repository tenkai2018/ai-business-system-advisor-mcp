import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const serverUrl = process.argv[2] ?? process.env.REMOTE_MCP_URL;

if (!serverUrl) {
  console.error("Usage: npm run test:remote -- <remote-mcp-url>");
  process.exit(1);
}

const client = new Client({ name: "remote-smoke-test", version: "0.1.0" });
const transport = new StreamableHTTPClientTransport(new URL(serverUrl));

await client.connect(transport);

try {
  const tools = await client.listTools();
  const names = tools.tools.map((tool) => tool.name);

  if (names.length !== 9 || !names.includes("generate_mini_report")) {
    throw new Error(`Expected 9 tools including generate_mini_report, received: ${names.join(", ")}`);
  }

  const result = await client.callTool({
    name: "generate_mini_report",
    arguments: {
      businessType: "B2B service agency",
      currentProblem: "manual lead research and proposal writing takes too much time",
      aiIdea: "AI assists lead research and proposal drafting"
    }
  });

  const structured = result.structuredContent;
  if (!structured || typeof structured !== "object" || !("reportMarkdown" in structured)) {
    throw new Error("Expected generate_mini_report to return reportMarkdown.");
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        url: serverUrl,
        toolCount: names.length,
        tools: names
      },
      null,
      2
    )
  );
} finally {
  await client.close();
}
