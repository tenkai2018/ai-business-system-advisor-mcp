import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { IntakePacketInputSchema } from "../schemas/intakePacket.schema.js";
import { buildIntakePacket } from "../services/intakePacketBuilder.js";
import { maybeRefusePrivateRequest, toolResult } from "./result.js";

export function registerExportIntakePacket(server: McpServer): void {
  server.registerTool(
    "export_intake_packet",
    {
      title: "Export intake packet",
      description:
        "Export a structured public-safe markdown and JSON intake packet for deeper review.",
      inputSchema: IntakePacketInputSchema.shape
    },
    (args) => maybeRefusePrivateRequest(args) ?? toolResult(buildIntakePacket(args))
  );
}
