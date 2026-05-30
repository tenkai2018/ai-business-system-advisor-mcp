# Distribution Playbook

## Package Channels

- Local development: `npm run dev`
- Built local server: `npm start`
- npm package: `npx ai-business-system-advisor-mcp`
- MCP Registry metadata: `server.json`
- Docker image: optional later channel using the included Dockerfile

## MCP Client Config

For npm package users:

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

For remote-capable clients:

```json
{
  "mcpServers": {
    "ai-business-system-advisor": {
      "url": "https://ai-business-system-advisor-mcp.henrytran-portfolio.workers.dev/mcp"
    }
  }
}
```

## Registry Description

AI Business System Advisor helps founders and operators review where AI can improve operations without damaging customer trust, service quality, or human judgment. It provides tools for business context analysis, bottleneck detection, AI opportunity evaluation, trust/control risk assessment, first workflow recommendation, mini report generation, and intake packet export.

## Keywords

AI business systems, AI workflow, AI readiness, AI automation, business operations, AI agents, trust and control, human-in-the-loop, workflow design, customer experience.
