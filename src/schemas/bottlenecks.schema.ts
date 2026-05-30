import { z } from "zod";
import { ConfidenceSchema } from "./common.schema.js";
export const BottlenecksInputSchema = z.object({
  businessContext: z.string().optional(),
  businessType: z.string().optional(),
  currentProblem: z.string().optional(),
  currentWorkflow: z.string().optional(),
  customerComplaints: z.string().optional(),
  teamPainPoints: z.string().optional(),
  metrics: z.string().optional(),
  aiIdea: z.string().optional(),
  riskConcerns: z.string().optional()
});

export const BottlenecksResultSchema = z.object({
  revenueBottlenecks: z.array(z.string()),
  operationalBottlenecks: z.array(z.string()),
  customerExperienceBottlenecks: z.array(z.string()),
  trustControlBottlenecks: z.array(z.string()),
  mostLikelyRootCause: z.string(),
  bottleneckSummary: z.string(),
  missingInformation: z.array(z.string()),
  confidence: ConfidenceSchema
});

export type BottlenecksInput = z.infer<typeof BottlenecksInputSchema>;
export type BottlenecksResult = z.infer<typeof BottlenecksResultSchema>;
