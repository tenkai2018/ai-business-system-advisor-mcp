import { z } from "zod";
import { ConfidenceSchema } from "./common.schema.js";
export const TouchpointSchema = z.object({
  stage: z.string(),
  description: z.string(),
  classification: z.enum(["automation_safe", "hybrid", "human_critical", "unknown"]),
  reason: z.string(),
  suggestedControl: z.string()
});

export const TouchpointsInputSchema = z.object({
  customerJourney: z.array(z.string()).optional(),
  touchpoints: z.array(z.string()).optional(),
  salesProcess: z.string().optional(),
  onboardingProcess: z.string().optional(),
  deliveryProcess: z.string().optional(),
  supportProcess: z.string().optional(),
  recoveryProcess: z.string().optional(),
  retentionProcess: z.string().optional(),
  businessType: z.string().optional(),
  currentProblem: z.string().optional(),
  currentWorkflow: z.string().optional(),
  aiIdea: z.string().optional(),
  riskConcerns: z.string().optional()
});

export const TouchpointsResultSchema = z.object({
  touchpoints: z.array(TouchpointSchema),
  trustSensitiveMoments: z.array(z.string()),
  automationSafeAreas: z.array(z.string()),
  humanCriticalAreas: z.array(z.string()),
  missingInformation: z.array(z.string()),
  confidence: ConfidenceSchema
});

export type TouchpointsInput = z.infer<typeof TouchpointsInputSchema>;
export type TouchpointsResult = z.infer<typeof TouchpointsResultSchema>;
