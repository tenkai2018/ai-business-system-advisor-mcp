import { z } from "zod";
import { ConfidenceSchema } from "./common.schema.js";
import { BusinessContextInputSchema } from "./businessContext.schema.js";

export const IntakePacketInputSchema = BusinessContextInputSchema.extend({
  businessContext: z.record(z.string(), z.unknown()).optional(),
  touchpointMap: z.record(z.string(), z.unknown()).optional(),
  bottleneckSummary: z.record(z.string(), z.unknown()).optional(),
  opportunitySummary: z.record(z.string(), z.unknown()).optional(),
  riskSummary: z.record(z.string(), z.unknown()).optional(),
  recommendedWorkflow: z.record(z.string(), z.unknown()).optional(),
  recommendedNextStep: z.record(z.string(), z.unknown()).optional(),
  userNotes: z.string().optional(),
  preferredNextStep: z.string().optional()
});

export const IntakePacketResultSchema = z.object({
  packetMarkdown: z.string(),
  packetJson: z.record(z.string(), z.unknown()),
  missingInformation: z.array(z.string()),
  recommendedPrivateReview: z.string(),
  confidence: ConfidenceSchema
});

export type IntakePacketInput = z.infer<typeof IntakePacketInputSchema>;
export type IntakePacketResult = z.infer<typeof IntakePacketResultSchema>;
