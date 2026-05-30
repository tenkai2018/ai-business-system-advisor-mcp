import { z } from "zod";
import { ConfidenceSchema, RiskLevelSchema } from "./common.schema.js";

export const RisksInputSchema = z.object({
  workflowIdea: z.string().optional(),
  proposedWorkflow: z.string().optional(),
  customerFacing: z.boolean().optional(),
  usesSensitiveData: z.boolean().optional(),
  canAffectMoney: z.boolean().optional(),
  canAffectBrandTrust: z.boolean().optional(),
  requiresExpertJudgment: z.boolean().optional(),
  currentControls: z.string().optional(),
  businessType: z.string().optional(),
  currentProblem: z.string().optional(),
  currentWorkflow: z.string().optional(),
  aiIdea: z.string().optional(),
  riskConcerns: z.string().optional()
});

export const RisksResultSchema = z.object({
  riskLevel: RiskLevelSchema,
  riskSummary: z.string(),
  requiredControls: z.array(z.string()),
  humanReviewRules: z.array(z.string()),
  dataBoundaryWarnings: z.array(z.string()),
  escalationTriggers: z.array(z.string()),
  notRecommendedActions: z.array(z.string()),
  missingInformation: z.array(z.string()),
  confidence: ConfidenceSchema
});

export type RisksInput = z.infer<typeof RisksInputSchema>;
export type RisksResult = z.infer<typeof RisksResultSchema>;
