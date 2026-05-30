import { z } from "zod";
import { ConfidenceSchema } from "./common.schema.js";
import { BusinessContextInputSchema } from "./businessContext.schema.js";

export const IntakePacketInputSchema = BusinessContextInputSchema.extend({
  preferredNextStep: z.string().optional()
});

export const IntakePacketResultSchema = z.object({
  markdown: z.string(),
  packet: z.record(z.unknown()),
  confidence: ConfidenceSchema
});

export type IntakePacketInput = z.infer<typeof IntakePacketInputSchema>;
export type IntakePacketResult = z.infer<typeof IntakePacketResultSchema>;
