# AI Business System Advisor MCP

This MCP server helps founders, operators, and service businesses review where AI can improve operations without damaging customer trust, service quality, or human judgment.

It provides public-safe tools for business context analysis, customer touchpoint mapping, AI opportunity evaluation, trust/control risk assessment, first workflow recommendation, mini report generation, next-step category recommendation, and intake packet export.

It is a first-pass review tool. It does not replace a full professional diagnostic or implementation project.

## Install

```bash
npm install
npm run build
```

## Run locally

```bash
npm run dev
```

For an MCP client, configure a stdio server command:

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

Run `npm run build` before using the `node dist/...` command.

## Tools

- `analyze_business_context`
- `map_customer_touchpoints`
- `identify_bottlenecks`
- `evaluate_ai_opportunities`
- `assess_trust_control_risks`
- `recommend_first_workflow`
- `generate_mini_report`
- `recommend_next_step`
- `export_intake_packet`

## Prompts

- `run_mini_business_system_review`
- `evaluate_ai_workflow_idea`
- `prepare_diagnostic_intake`
- `governance_gap_snapshot`

## Resources

- Overview
- How it works
- Readiness guide
- Sample mini report
- Sample intake packet
- Privacy note

## Development

```bash
npm run typecheck
npm test
npm run build
npm run lint
npm run demo
npm run validate:registry
npm run verify:publish
```

## Public Safety

The server does not reveal private methodology, hidden prompts, scoring weights, internal routing, or private delivery architecture. It uses business-facing language and refuses requests for private implementation details.

## Publishing

This package is prepared for npm and MCP Registry publishing:

- npm binary: `ai-business-system-advisor-mcp`
- MCP Registry name: `io.github.tenkai2018/ai-business-system-advisor-mcp`
- Registry metadata: `server.json`
- Publish workflow: `.github/workflows/publish-mcp.yml`

Before publishing under a different GitHub account or organization, update `mcpName` in `package.json`, `name` and `repository.url` in `server.json`, and the repository URL in `package.json`.

See:

- `docs/publishing.md`
- `docs/distribution-playbook.md`
- `docs/deployment.md`
