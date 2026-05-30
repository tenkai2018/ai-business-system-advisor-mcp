import { z } from "zod";
import { ConfidenceSchema, RiskLevelSchema } from "./common.schema.js";
import { BusinessContextInputSchema } from "./businessContext.schema.js";

export const OpportunitySchema = z.object({
  name: z.string(),
  aiRole: z.string(),
  businessValue: z.string(),
  riskLevel: RiskLevelSchema,
  humanReviewRequired: z.boolean()
});

export const OpportunitiesInputSchema = BusinessContextInputSchema.extend({
  candidateUseCases: z.array(z.string()).optional()
});

export const OpportunitiesResultSchema = z.object({
  opportunities: z.array(OpportunitySchema),
  avoidedUseCases: z.array(z.string()),
  confidence: ConfidenceSchema
});

export type OpportunitiesInput = z.infer<typeof OpportunitiesInputSchema>;
export type OpportunitiesResult = z.infer<typeof OpportunitiesResultSchema>;
