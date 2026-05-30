# Remote MCP

This project includes a public, stateless remote MCP server target for Cloudflare Workers.

## Endpoints

- Landing page: `https://ai-business-system-advisor-mcp.henrytran-portfolio.workers.dev/`
- Health check: `https://ai-business-system-advisor-mcp.henrytran-portfolio.workers.dev/health`
- Remote MCP: `https://ai-business-system-advisor-mcp.henrytran-portfolio.workers.dev/mcp`

## Deploy

```powershell
npm run verify:prepublish
npx wrangler login
npm run deploy:remote
```

Remote deploy uses Wrangler 4.95+, which requires Node.js 22 or newer. The local stdio MCP package still supports Node.js 20+.

## Test

```powershell
npm run dev:remote
npm run test:remote -- http://localhost:8787/mcp
```

After deployment:

```powershell
curl https://ai-business-system-advisor-mcp.henrytran-portfolio.workers.dev/health
npm run test:remote -- https://ai-business-system-advisor-mcp.henrytran-portfolio.workers.dev/mcp
```

## Client Config

Remote-capable clients can use the `/mcp` URL directly.

For stdio-only clients, use `mcp-remote`:

```json
{
  "mcpServers": {
    "ai-business-system-advisor": {
      "command": "npx",
      "args": ["mcp-remote", "https://ai-business-system-advisor-mcp.henrytran-portfolio.workers.dev/mcp"]
    }
  }
}
```

The local npm package remains available:

```json
{
  "mcpServers": {
    "ai-business-system-advisor": {
      "command": "npx",
      "args": ["-y", "ai-business-system-advisor-mcp"]
    }
  }
}
```

## Safety

The remote v0.1 endpoint is public and authless. It is stateless, does not intentionally store submitted business context, and exposes no external write actions. Users should not send passwords, API keys, raw customer records, regulated data, or confidential contracts.
