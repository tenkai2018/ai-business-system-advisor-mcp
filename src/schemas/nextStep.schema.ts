import { z } from "zod";
import { ConfidenceSchema, ReadinessLevelSchema } from "./common.schema.js";
import { BusinessContextInputSchema } from "./businessContext.schema.js";

export const NextStepInputSchema = BusinessContextInputSchema.extend({
  userGoal: z.string().optional(),
  problemComplexity: ReadinessLevelSchema.optional(),
  implementationReadiness: ReadinessLevelSchema.optional(),
  riskLevel: ReadinessLevelSchema.optional(),
  readiness: z.enum(["low", "medium", "high"]).optional(),
  wantsSelfGuided: z.boolean().optional(),
  wantsDoneForYou: z.boolean().optional(),
  timeline: z.string().optional(),
  preference: z.enum(["self_guided", "done_for_you", "unsure"]).optional(),
  hasExistingAutomation: z.boolean().optional()
});

export const NextStepResultSchema = z.object({
  recommendedPath: z.enum([
    "self_guided_resource",
    "deeper_diagnostic",
    "implementation_ready_docs",
    "ai_ready_system_build",
    "monthly_review"
  ]),
  reason: z.string(),
  readinessLevel: z.enum(["low", "medium", "high"]),
  suggestedAction: z.string(),
  alternativePaths: z.array(z.string()),
  missingInformation: z.array(z.string()),
  confidence: ConfidenceSchema
});

export type NextStepInput = z.infer<typeof NextStepInputSchema>;
export type NextStepResult = z.infer<typeof NextStepResultSchema>;
