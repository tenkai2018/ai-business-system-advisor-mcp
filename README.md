# AI Business System Advisor MCP

This MCP server helps founders, operators, and service businesses review where AI can improve operations without damaging customer trust, service quality, or human judgment.

It provides public-safe tools for business context analysis, customer touchpoint mapping, AI opportunity evaluation, trust/control risk assessment, first workflow recommendation, mini report generation, next-step category recommendation, and intake packet export.

It is a first-pass review tool. It does not replace a full professional diagnostic or implementation project.

## Use With MCP Clients

For Claude Desktop, Cursor, Windsurf, Codex, or another stdio MCP client:

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

You can also run the package directly:

```bash
npx -y ai-business-system-advisor-mcp
```

Remote MCP URL:

```text
https://ai-business-system-advisor-mcp.henrytran-portfolio.workers.dev/mcp
```

## Local Development

```bash
npm install
npm run build
npm run dev
```

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
npm run dev:remote
npm run validate:registry
npm run verify:publish
```

## Public Safety

The server uses business-facing language and refuses requests for private implementation details. Public reports focus on business context, workflow fit, risk controls, recommended next steps, and missing information.

## Registry

- MCP Registry name: `io.github.tenkai2018/ai-business-system-advisor-mcp`
- Registry metadata: `server.json`
