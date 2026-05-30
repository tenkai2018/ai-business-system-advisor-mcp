import { z } from "zod";
import { ConfidenceSchema, RiskLevelSchema } from "./common.schema.js";

export const OpportunitySchema = z.object({
  name: z.string(),
  summary: z.string(),
  priority: z.enum(["high", "medium", "low", "not_recommended_yet"]),
  businessValueScore: z.number().min(1).max(5),
  implementationReadinessScore: z.number().min(1).max(5),
  trustRiskLevel: RiskLevelSchema,
  recommendedFirstVersion: z.string(),
  requiredHumanControl: z.string()
});

export const CandidateUseCaseSchema = z.union([
  z.string(),
  z.object({
    name: z.string(),
    description: z.string(),
    customerFacing: z.boolean().optional(),
    riskIfWrong: z.string().optional(),
    availableData: z.string().optional(),
    expectedImpact: z.string().optional(),
    currentControls: z.string().optional()
  })
]);

export const OpportunitiesInputSchema = z.object({
  businessContext: z.string().optional(),
  businessType: z.string().optional(),
  currentProblem: z.string().optional(),
  currentWorkflow: z.string().optional(),
  aiIdea: z.string().optional(),
  riskConcerns: z.string().optional(),
  candidateUseCases: z.array(CandidateUseCaseSchema).optional()
});

export const OpportunitiesResultSchema = z.object({
  opportunities: z.array(OpportunitySchema),
  recommendedFirstOpportunity: z.string().optional(),
  warnings: z.array(z.string()),
  missingInformation: z.array(z.string()),
  confidence: ConfidenceSchema
});

export type OpportunitiesInput = z.infer<typeof OpportunitiesInputSchema>;
export type OpportunitiesResult = z.infer<typeof OpportunitiesResultSchema>;
