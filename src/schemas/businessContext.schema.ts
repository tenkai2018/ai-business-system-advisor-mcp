import { z } from "zod";
import { ConfidenceSchema } from "./common.schema.js";

export const BusinessContextInputSchema = z.object({
  businessType: z.string().optional(),
  targetCustomer: z.string().optional(),
  offer: z.string().optional(),
  revenueModel: z.string().optional(),
  teamSize: z.string().optional(),
  currentProblem: z.string().optional(),
  currentWorkflow: z.string().optional(),
  aiIdea: z.string().optional(),
  goal90Days: z.string().optional(),
  constraints: z.array(z.string()).optional(),
  riskConcerns: z.string().optional()
});

export const BusinessContextResultSchema = z.object({
  summary: z.string(),
  valueCreationPoints: z.array(z.string()),
  constraints: z.array(z.string()),
  missingInformation: z.array(z.string()),
  opportunityHypotheses: z.array(z.string()),
  confidence: ConfidenceSchema
});

export type BusinessContextInput = z.infer<typeof BusinessContextInputSchema>;
export type BusinessContextResult = z.infer<typeof BusinessContextResultSchema>;
