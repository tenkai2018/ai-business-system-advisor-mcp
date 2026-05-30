import { z } from "zod";
import { ConfidenceSchema, RiskLevelSchema } from "./common.schema.js";
import { BusinessContextInputSchema } from "./businessContext.schema.js";

export const WorkflowRecommendationSchema = z.object({
  workflow: z.string(),
  whyThisFirst: z.string(),
  aiRole: z.string(),
  humanRole: z.string(),
  reviewRule: z.string(),
  escalationRule: z.string(),
  successMetrics: z.array(z.string()),
  riskLevel: RiskLevelSchema,
  confidence: ConfidenceSchema
});

export const WorkflowInputSchema = BusinessContextInputSchema.extend({
  opportunities: z.array(z.string()).optional(),
  risks: z.array(z.string()).optional()
});

export type WorkflowInput = z.infer<typeof WorkflowInputSchema>;
export type WorkflowRecommendation = z.infer<typeof WorkflowRecommendationSchema>;
