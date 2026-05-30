# Deployment Notes

## v0.1 Runtime

The v0.1 server uses stdio transport. It is intended to be launched by an MCP client through `node`, `npm run dev`, or `npx`.

Required runtime:

- Node.js 20+
- npm

## Build

```bash
npm ci
npm run build
```

## Run

```bash
npm start
```

The process waits for MCP client messages on stdin/stdout.

## Docker

The Dockerfile builds and runs the compiled stdio server:

```bash
docker build -t ai-business-system-advisor-mcp:0.1.0 .
docker run --rm -i ai-business-system-advisor-mcp:0.1.0
```

For MCP Registry Docker/OCI publishing later, add the required OCI annotation:

```dockerfile
LABEL io.modelcontextprotocol.server.name="io.github.tenkai2018/ai-business-system-advisor-mcp"
```

## Not Included In v0.1

- Hosted Streamable HTTP transport
- Database storage
- CRM writes
- Email sending
- Booking or lead capture endpoint
- Admin dashboard
