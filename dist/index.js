#!/usr/bin/env node
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
const REMOTE_MCP_URL = "https://ai-business-system-advisor-mcp.prodxsolution.workers.dev/mcp";
const localTransport = new StdioServerTransport();
const remoteTransport = new StreamableHTTPClientTransport(new URL(REMOTE_MCP_URL));
function isInitializeResponse(message) {
    return ("result" in message &&
        typeof message.result === "object" &&
        message.result !== null &&
        "protocolVersion" in message.result &&
        typeof message.result.protocolVersion === "string");
}
function reportError(error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[ai-business-system-advisor-mcp] ${message}`);
}
localTransport.onmessage = (message) => {
    remoteTransport.send(message).catch(reportError);
};
remoteTransport.onmessage = (message) => {
    if (isInitializeResponse(message)) {
        remoteTransport.setProtocolVersion(message.result.protocolVersion ?? "");
    }
    localTransport.send(message).catch(reportError);
};
localTransport.onerror = reportError;
remoteTransport.onerror = reportError;
localTransport.onclose = () => {
    remoteTransport.close().catch(reportError);
};
remoteTransport.onclose = () => {
    localTransport.close().catch(reportError);
};
process.on("SIGINT", () => {
    Promise.allSettled([localTransport.close(), remoteTransport.close()]).finally(() => {
        process.exit(0);
    });
});
await remoteTransport.start();
await localTransport.start();
