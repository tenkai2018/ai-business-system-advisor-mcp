# Distribution Playbook

## Package Channels

- Local development: `npm run dev`
- Built local server: `npm start`
- npm package: `npx ai-business-system-advisor-mcp`
- MCP Registry metadata: `server.json`
- Docker image: optional later channel using the included Dockerfile

## MCP Client Config

For local source checkout:

```json
{
  "mcpServers": {
    "ai-business-system-advisor": {
      "command": "node",
      "args": ["D:/HUYTQ/ProdXSolution/Projects/AI Business System Advisor MCP/dist/src/index.js"]
    }
  }
}
```

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

## Registry Description

AI Business System Advisor helps founders and operators review where AI can improve operations without damaging customer trust, service quality, or human judgment. It provides tools for business context analysis, bottleneck detection, AI opportunity evaluation, trust/control risk assessment, first workflow recommendation, mini report generation, and intake packet export.

## Keywords

AI business systems, AI workflow, AI readiness, AI automation, business operations, AI agents, trust and control, human-in-the-loop, workflow design, customer experience.
