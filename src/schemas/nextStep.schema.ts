import { z } from "zod";
import { ConfidenceSchema } from "./common.schema.js";
import { BusinessContextInputSchema } from "./businessContext.schema.js";

export const NextStepInputSchema = BusinessContextInputSchema.extend({
  riskLevel: z.enum(["low", "medium", "high"]).optional(),
  readiness: z.enum(["low", "medium", "high"]).optional(),
  preference: z.enum(["self_guided", "done_for_you", "unsure"]).optional(),
  hasExistingAutomation: z.boolean().optional()
});

export const NextStepResultSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  suggestedAction: z.string(),
  confidence: ConfidenceSchema
});

export type NextStepInput = z.infer<typeof NextStepInputSchema>;
export type NextStepResult = z.infer<typeof NextStepResultSchema>;
