# Pre-Publish Test Guide

Use this guide before publishing the MCP package to npm or the MCP Registry.

## Prerequisites

- Node.js 20 or newer.
- Dependencies installed with `npm install`.
- Run commands from the project root.
- Do not run `npm publish` or registry publish commands during this test pass.

## Commands

```powershell
npm run typecheck
npm test
npm run build
npm run demo
npm run test:user
npm run audit:spec
npm run audit:security
npm run verify:publish
npm run verify:prepublish
```

## What To Check

- `npm run demo` lists 9 tools, 4 prompts, and 6 resources.
- `npm run test:user` prints `PASS` for all user scenarios:
  - B2B service founder needing lead research and proposal support.
  - Ecommerce support/refund complaint risk.
  - Solo founder building a lightweight operating system.
  - Low-context user with missing information.
  - Private implementation-detail request refusal.
- `npm run audit:spec` confirms all MCP surface items and tool result contracts.
- `npm run audit:security` confirms the runtime has no command execution, arbitrary runtime network calls, filesystem writes from user input, hardcoded secrets, or forbidden public terms in public-facing output files.
- `npm run verify:publish` confirms typecheck, tests, build, lint, registry validation, and npm package dry run.

## Expected Behavior

- Successful tool calls include `confidence` and `missingInformation`.
- High-risk customer-facing automation ideas recommend human review, escalation, and safer first versions.
- Low-context input returns useful output while clearly listing missing information.
- Requests for private implementation details are refused and redirected to a public business-system review.
- Public reports, prompts, and resources use business-facing language only.

## Publish Gate

Publish is blocked if any command fails, if public output leaks private implementation wording, if a high-risk scenario recommends full autonomy, or if package dry-run omits `dist/src`, `docs`, core docs, or `server.json`.
