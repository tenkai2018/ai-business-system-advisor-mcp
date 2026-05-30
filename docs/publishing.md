# Publishing Guide

This project is prepared for the npm package plus MCP Registry metadata flow.

## Current Publish Identity

- npm package: `ai-business-system-advisor-mcp`
- npm binary: `ai-business-system-advisor-mcp`
- MCP Registry name: `io.github.tenkai2018/ai-business-system-advisor-mcp`
- Registry metadata file: `server.json`
- Package verification field: `package.json` field `mcpName`

If publishing under another GitHub namespace, update all of these together:

- `package.json` `mcpName`
- `package.json` `repository.url`
- `server.json` `name`
- `server.json` `repository.url`

## Local Verification

```bash
npm ci
npm run verify:publish
```

`verify:publish` runs typecheck, tests, build, lint, registry validation, and `npm pack --dry-run`.

## npm Publish

```bash
npm login
npm publish --access public
```

Verify that npm can install the server:

```bash
npx ai-business-system-advisor-mcp
```

The command starts a stdio MCP server, so it waits for MCP JSON-RPC messages from a client.

## MCP Registry Publish

Install the official publisher CLI from the MCP Registry release page, then authenticate:

```bash
mcp-publisher login github
mcp-publisher publish
```

After publishing, verify discovery:

```bash
curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.tenkai2018/ai-business-system-advisor-mcp"
```

## GitHub Actions Publish

The workflow at `.github/workflows/publish-mcp.yml` runs on version tags.

Required repository secret:

- `NPM_TOKEN`: npm automation token allowed to publish this package.

OIDC-based GitHub auth is used for the MCP Registry, so no dedicated MCP registry secret is required for the configured GitHub namespace.

Release flow:

```bash
git tag v0.1.0
git push origin v0.1.0
```
