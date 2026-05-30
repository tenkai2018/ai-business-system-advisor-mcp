# Website Integration Notes

The diagnostic logic can later power a website form or free tool.

## Suggested Free Tool Modes

- AI Business System Readiness Score
- AI Workflow Risk Checker
- First AI Workflow Finder
- AI-Human Workflow Audit
- AI Agent Readiness Review

## Integration Shape

For v0.1, keep website integration outside the MCP server. A later HTTP wrapper can call the same services used by the MCP tools:

- `analyzeBusinessContext`
- `identifyBottlenecks`
- `evaluateAiOpportunities`
- `assessTrustControlRisks`
- `recommendFirstWorkflow`
- `buildMiniReport`
- `buildIntakePacket`

## Data Rules

Do not collect secrets, credentials, raw private customer records, regulated data, or confidential documents. Ask for sanitized summaries and workflow examples.
