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
      content="Public-safe MCP server for first-pass AI business workflow, bottleneck, risk, and intake reviews."
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
        max-width: 920px;
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
    </style>
  </head>
  <body>
    <main>
      <h1>AI Business System Advisor MCP</h1>
      <p class="lead">
        A public-safe MCP server that helps founders and operators review business context, bottlenecks,
        AI workflow opportunities, trust/control risks, and the safest first workflow to improve.
      </p>
      <div class="links">
        <a href="https://www.npmjs.com/package/ai-business-system-advisor-mcp">npm package</a>
        <a href="https://github.com/tenkai2018/ai-business-system-advisor-mcp">GitHub repo</a>
        <a href="/health">Health check</a>
      </div>

      <h2>Remote MCP URL</h2>
      <pre><code>${escapeHtml(remoteUrl)}</code></pre>

      <h2>Local MCP Install</h2>
      <pre><code>npx -y ai-business-system-advisor-mcp</code></pre>

      <h2>Sample Prompts</h2>
      <ul>
        <li>Review my business: I run a landing page agency for ecommerce brands and spend too much time on lead research and proposals.</li>
        <li>What AI workflow should I automate first for my consulting business?</li>
        <li>Is it safe to fully automate ecommerce complaints, refunds, and angry customer replies?</li>
        <li>Prepare a mini business system review and tell me what information is missing.</li>
      </ul>

      <h2>Privacy</h2>
      <p>
        This public v0.1 endpoint is stateless and does not intentionally store submitted business context.
        Do not send passwords, API keys, raw private customer records, regulated data, or confidential contracts.
      </p>
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
