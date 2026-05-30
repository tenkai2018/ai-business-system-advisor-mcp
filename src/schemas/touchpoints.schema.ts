import { z } from "zod";
import { ConfidenceSchema } from "./common.schema.js";
import { BusinessContextInputSchema } from "./businessContext.schema.js";

export const TouchpointSchema = z.object({
  stage: z.string(),
  likelyFriction: z.string(),
  classification: z.enum(["automation_safe", "hybrid", "human_critical"]),
  reviewRule: z.string()
});

export const TouchpointsInputSchema = BusinessContextInputSchema.extend({
  touchpoints: z.array(z.string()).optional()
});

export const TouchpointsResultSchema = z.object({
  touchpoints: z.array(TouchpointSchema),
  trustMoments: z.array(z.string()),
  serviceRecoveryOpportunities: z.array(z.string()),
  confidence: ConfidenceSchema
});

export type TouchpointsInput = z.infer<typeof TouchpointsInputSchema>;
export type TouchpointsResult = z.infer<typeof TouchpointsResultSchema>;
