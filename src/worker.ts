/// <reference types="@cloudflare/workers-types" />

import { createMcpHandler } from "agents/mcp";
import { config } from "./config.js";
import { createServer } from "./server.js";

const mcpOptions = {
  corsOptions: {
    origin: "*",
    methods: "GET, POST, OPTIONS",
    headers: "Content-Type, MCP-Protocol-Version, Mcp-Session-Id",
    exposeHeaders: "Mcp-Session-Id",
    maxAge: 86400
  }
};

const PACKAGE_URL = "https://www.npmjs.com/package/ai-business-system-advisor-mcp";
const REPOSITORY_URL = "https://github.com/tenkai2018/ai-business-system-advisor-mcp";

export default {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/mcp" || url.pathname.startsWith("/mcp/")) {
      if (request.method === "OPTIONS") {
        return withCors(new Response(null, { status: 204 }));
      }

      return createMcpHandler(createServer(), mcpOptions)(request, env, ctx);
    }

    if (url.pathname === "/health") {
      return Response.json({
        ok: true,
        name: "ai-business-system-advisor-mcp",
        version: config.serverVersion,
        transport: "streamable-http",
        mcp: `${url.origin}/mcp`
      });
    }

    if (url.pathname === "/.well-known/mcp/server-card.json") {
      return Response.json(serverCard(url.origin), {
        headers: {
          "access-control-allow-origin": "*",
          "cache-control": "public, max-age=3600"
        }
      });
    }

    if (url.pathname === "/") {
      return new Response(renderLandingPage(url.origin), {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "x-content-type-options": "nosniff"
        }
      });
    }

    return Response.json({ error: "Not found" }, { status: 404 });
  }
};

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, MCP-Protocol-Version, Mcp-Session-Id");
  headers.set("Access-Control-Expose-Headers", "Mcp-Session-Id");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function serverCard(origin: string) {
  return {
    name: "AI Business System Advisor MCP",
    description:
      "Review business workflows, AI opportunities, trust/control risks, and implementation readiness before building AI agents or automation.",
    homepage: `${origin}/`,
    repository: REPOSITORY_URL,
    transport: {
      type: "streamable-http",
      url: `${origin}/mcp`
    },
    categories: ["business", "ai-agents", "automation", "operations", "consulting"],
    prompts: [
      "run_mini_business_system_review",
      "evaluate_ai_workflow_idea",
      "prepare_diagnostic_intake",
      "governance_gap_snapshot"
    ],
    tools: [
      "analyze_business_context",
      "map_customer_touchpoints",
      "identify_bottlenecks",
      "evaluate_ai_opportunities",
      "assess_trust_control_risks",
      "recommend_first_workflow",
      "generate_mini_report",
      "recommend_next_step",
      "export_intake_packet"
    ]
  };
}

function renderLandingPage(origin: string): string {
  const remoteUrl = `${origin}/mcp`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AI Business System Advisor MCP</title>
    <meta
      name="description"
      content="Find the safest first AI workflow for your business before investing in AI agents or automation."
    />
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f8fafc;
        color: #1f2937;
      }
      body {
        margin: 0;
      }
      main {
        max-width: 980px;
        margin: 0 auto;
        padding: 64px 24px;
      }
      h1 {
        margin: 0 0 16px;
        font-size: clamp(2rem, 4vw, 3.5rem);
        line-height: 1.05;
      }
      h2 {
        margin: 40px 0 12px;
        font-size: 1.25rem;
      }
      p,
      li {
        font-size: 1rem;
        line-height: 1.65;
      }
      .lead {
        max-width: 760px;
        font-size: 1.2rem;
        color: #475569;
      }
      .section {
        border-top: 1px solid #d8dee8;
        margin-top: 36px;
        padding-top: 24px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 14px;
      }
      .card {
        border: 1px solid #d8dee8;
        border-radius: 8px;
        background: #ffffff;
        padding: 16px;
      }
      .card h3 {
        margin: 0 0 8px;
        font-size: 1rem;
      }
      code,
      pre {
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
      }
      pre {
        overflow-x: auto;
        border: 1px solid #d8dee8;
        border-radius: 8px;
        background: #ffffff;
        padding: 16px;
      }
      a {
        color: #0f766e;
      }
      .links {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 24px;
      }
      .links a {
        border: 1px solid #0f766e;
        border-radius: 6px;
        padding: 10px 14px;
        text-decoration: none;
      }
      .primary {
        background: #0f766e;
        color: #ffffff;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Find the safest first AI workflow for your business.</h1>
      <p class="lead">
        AI Business System Advisor MCP helps founders, operators, consultants, and small teams review business
        context, operational bottlenecks, AI opportunities, trust/control risks, and implementation readiness.
      </p>
      <div class="links">
        <a class="primary" href="#remote">Run with remote MCP</a>
        <a href="${PACKAGE_URL}">npm package</a>
        <a href="${REPOSITORY_URL}">GitHub repo</a>
        <a href="/health">Health check</a>
      </div>

      <section class="section">
        <h2>What It Helps You Do</h2>
        <div class="grid">
          <div class="card">
            <h3>Identify bottlenecks</h3>
            <p>Review revenue, operations, customer experience, and trust/control friction.</p>
          </div>
          <div class="card">
            <h3>Evaluate AI ideas</h3>
            <p>Check whether an AI workflow idea is useful, ready, safe, and reviewable.</p>
          </div>
          <div class="card">
            <h3>Design human control</h3>
            <p>Clarify review rules, escalation triggers, data boundaries, and quality checks.</p>
          </div>
          <div class="card">
            <h3>Prepare next steps</h3>
            <p>Generate a mini review or structured intake packet for deeper workflow planning.</p>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>Who It Is For</h2>
        <ul>
          <li>Solo founders and operators</li>
          <li>Service businesses and agencies</li>
          <li>B2B consultants and small teams</li>
          <li>Teams exploring AI agents or workflow automation</li>
        </ul>
      </section>

      <section class="section">
        <h2>Example Questions</h2>
        <ul>
          <li>Which workflow should I automate first?</li>
          <li>Is this AI agent idea safe for my customer experience?</li>
          <li>Where should humans stay in control?</li>
          <li>What information is missing before implementation?</li>
        </ul>
      </section>

      <section class="section">
        <h2>Example Output</h2>
        <pre><code>AI Workflow Readiness: Medium
Recommended First Workflow: Proposal drafting with human approval
Trust Risk: Medium
Human Review Rule: Review pricing, scope, claims, and customer-facing promises
Missing Information: customer journey, approved claims, escalation triggers, success metrics</code></pre>
      </section>

      <section class="section" id="remote">
      <h2>Remote MCP URL</h2>
      <pre><code>${escapeHtml(remoteUrl)}</code></pre>
      </section>

      <section class="section">
      <h2>Local MCP Install</h2>
      <pre><code>npx -y ai-business-system-advisor-mcp</code></pre>
      </section>

      <section class="section">
      <h2>Sample Prompts</h2>
      <ul>
        <li>Review my business: I run a landing page agency for ecommerce brands and spend too much time on lead research and proposals.</li>
        <li>What AI workflow should I automate first for my consulting business?</li>
        <li>Is it safe to fully automate ecommerce complaints, refunds, and angry customer replies?</li>
        <li>Prepare a mini business system review and tell me what information is missing.</li>
      </ul>
      </section>

      <section class="section">
      <h2>Privacy</h2>
      <p>
        This public endpoint is stateless and does not intentionally store submitted business context.
        Do not send passwords, API keys, raw private customer records, regulated data, or confidential contracts.
      </p>
      </section>

      <section class="section">
        <h2>Public Safety Boundary</h2>
        <p>
          The MCP provides public-safe business reviews. It does not expose protected implementation details,
          exact formulas, confidential designs, or client-specific confidential data.
        </p>
      </section>
    </main>
  </body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
