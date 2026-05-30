import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ensurePublicSafe } from "../services/publicSafety.js";
import { howItWorks } from "./howItWorks.js";
import { overview } from "./overview.js";
import { privacy } from "./privacy.js";
import { readinessGuide } from "./readinessGuide.js";
import { sampleIntakePacket } from "./sampleIntakePacket.js";
import { sampleMiniReport } from "./sampleMiniReport.js";

const resources = [
  ["overview", "advisor://overview", "Overview", overview],
  ["how-it-works", "advisor://how-it-works", "How it works", howItWorks],
  ["readiness-guide", "advisor://readiness-guide", "Readiness guide", readinessGuide],
  ["sample-mini-report", "advisor://sample-mini-report", "Sample mini report", sampleMiniReport],
  ["sample-intake-packet", "advisor://sample-intake-packet", "Sample intake packet", sampleIntakePacket],
  ["privacy", "advisor://privacy", "Privacy note", privacy]
] as const;

export function registerResources(server: McpServer): void {
  for (const [name, uri, title, text] of resources) {
    server.registerResource(
      name,
      uri,
      {
        title,
        description: title,
        mimeType: "text/markdown"
      },
      () => ({
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: ensurePublicSafe(text)
          }
        ]
      })
    );
  }
}
