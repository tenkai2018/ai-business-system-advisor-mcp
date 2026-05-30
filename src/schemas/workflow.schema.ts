import { z } from "zod";
import { ConfidenceSchema } from "./common.schema.js";
import { BusinessContextInputSchema } from "./businessContext.schema.js";

export const WorkflowRecommendationSchema = z.object({
  recommendedWorkflow: z.string(),
  workflowCategory: z.string(),
  whyThisWorkflow: z.string(),
  expectedOutcome: z.string(),
  aiRole: z.string(),
  humanRole: z.string(),
  reviewRule: z.string(),
  escalationRule: z.string(),
  successMetrics: z.array(z.string()),
  firstImplementationScope: z.string(),
  missingInformation: z.array(z.string()),
  confidence: ConfidenceSchema
});

export const WorkflowInputSchema = BusinessContextInputSchema.extend({
  bottlenecks: z.array(z.string()).optional(),
  opportunities: z.array(z.string()).optional(),
  risks: z.array(z.string()).optional(),
  goal90Days: z.string().optional()
});

export type WorkflowInput = z.infer<typeof WorkflowInputSchema>;
export type WorkflowRecommendation = z.infer<typeof WorkflowRecommendationSchema>;
