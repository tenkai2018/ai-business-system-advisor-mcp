import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { isPrivateMethodologyRequest, privateMethodologyResponse } from "../services/publicSafety.js";
import { toSearchText } from "../services/validation.js";

export function maybeRefusePrivateRequest(input: unknown): CallToolResult | null {
  if (!isPrivateMethodologyRequest(toSearchText(input))) {
    return null;
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(privateMethodologyResponse(), null, 2)
      }
    ],
    isError: true
  };
}

export function toolResult(structuredContent: Record<string, unknown>): CallToolResult {
  return {
    structuredContent,
    content: [
      {
        type: "text",
        text: JSON.stringify(structuredContent, null, 2)
      }
    ]
  };
}
