# AI Business System Advisor MCP

AI Business System Advisor MCP helps founders, operators, and service businesses review where AI can improve operations without damaging customer trust, service quality, or human judgment.

It provides first-pass, public-safe tools for business context analysis, customer touchpoint mapping, AI opportunity evaluation, trust/control risk assessment, first workflow recommendation, mini report generation, next-step category recommendation, and intake packet export.

This server is a practical review aid. It does not replace professional consulting, legal, financial, medical, HR, or compliance advice.

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

For remote MCP clients, use:

```text
https://ai-business-system-advisor-mcp.henrytran-portfolio.workers.dev/mcp
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

## Privacy And Safety

The server is read-mostly and does not intentionally persist submitted business context. Do not send passwords, API keys, raw private customer records, regulated data, or confidential contracts.

Outputs are first-pass reviews based on the information provided. They focus on business context, workflow fit, risk controls, recommended next steps, and missing information.

The server refuses requests for private implementation details and keeps user-facing output in business-facing language.
