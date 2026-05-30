import { z } from "zod";
import { ConfidenceSchema, RiskLevelSchema } from "./common.schema.js";
import { BusinessContextInputSchema } from "./businessContext.schema.js";

export const RiskSchema = z.object({
  category: z.string(),
  level: RiskLevelSchema,
  description: z.string(),
  control: z.string()
});

export const RisksInputSchema = BusinessContextInputSchema.extend({
  proposedWorkflow: z.string().optional()
});

export const RisksResultSchema = z.object({
  risks: z.array(RiskSchema),
  dataBoundaries: z.array(z.string()),
  reviewRules: z.array(z.string()),
  confidence: ConfidenceSchema
});

export type RisksInput = z.infer<typeof RisksInputSchema>;
export type RisksResult = z.infer<typeof RisksResultSchema>;
