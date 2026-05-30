import { z } from "zod";
import { ConfidenceSchema } from "./common.schema.js";

export const BusinessContextInputSchema = z.object({
  businessType: z.string().optional(),
  targetCustomer: z.string().optional(),
  offer: z.string().optional(),
  revenueModel: z.string().optional(),
  teamSize: z.string().optional(),
  currentGoal: z.string().optional(),
  currentProblem: z.string().optional(),
  currentWorkflow: z.string().optional(),
  aiIdea: z.string().optional(),
  goal90Days: z.string().optional(),
  constraints: z.array(z.string()).optional(),
  riskConcerns: z.string().optional(),
  notes: z.string().optional()
});

export const BusinessContextResultSchema = z.object({
  businessSnapshot: z.string(),
  likelyBusinessModel: z.string(),
  targetCustomerSummary: z.string(),
  valuePromiseHypothesis: z.string(),
  primaryConstraintHypothesis: z.string(),
  readinessSignals: z.array(z.string()),
  missingInformation: z.array(z.string()),
  confidence: ConfidenceSchema
});

export type BusinessContextInput = z.infer<typeof BusinessContextInputSchema>;
export type BusinessContextResult = z.infer<typeof BusinessContextResultSchema>;
