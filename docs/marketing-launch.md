# Marketing Launch

## Positioning

AI Business System Advisor MCP helps founders and operators answer:

- What workflow should I improve first with AI?
- Where are the bottlenecks in my business system?
- Which AI ideas are risky without human review?
- What information is missing before implementation?
- What should go into an intake packet for deeper review?

## Primary Links

- npm: `https://www.npmjs.com/package/ai-business-system-advisor-mcp`
- GitHub: `https://github.com/tenkai2018/ai-business-system-advisor-mcp`
- Remote MCP: `https://<worker-subdomain>.workers.dev/mcp`

## Sample Launch Copy

```text
I published AI Business System Advisor MCP.

It helps founders and operators review business bottlenecks, AI workflow fit,
trust/control risks, and the safest first workflow to improve.

Local install:
npx -y ai-business-system-advisor-mcp

Remote MCP:
https://<worker-subdomain>.workers.dev/mcp
```

## Demo Prompts

```text
Review my business: I run a landing page agency for ecommerce brands and spend too much time on lead research and proposals.
```

```text
What AI workflow should I automate first for my consulting business?
```

```text
Is it safe to fully automate ecommerce complaints, refunds, and angry customer replies?
```

## Launch Checklist

- npm package is published and `npx -y ai-business-system-advisor-mcp` works.
- GitHub README shows local and remote usage.
- MCP Registry returns the server name.
- Remote `/health` returns `ok: true`.
- Remote `/mcp` lists 9 tools in MCP Inspector or `npm run test:remote`.
- Public output does not expose private implementation details.
