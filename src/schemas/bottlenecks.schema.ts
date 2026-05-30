import { z } from "zod";
import { ConfidenceSchema } from "./common.schema.js";
import { BusinessContextInputSchema } from "./businessContext.schema.js";

export const BottleneckSchema = z.object({
  category: z.enum(["revenue", "operations", "customer_experience", "trust_control"]),
  description: z.string(),
  rootCauseHypothesis: z.string(),
  suggestedIntervention: z.string()
});

export const BottlenecksInputSchema = BusinessContextInputSchema;

export const BottlenecksResultSchema = z.object({
  bottlenecks: z.array(BottleneckSchema),
  candidateUseCases: z.array(z.string()),
  confidence: ConfidenceSchema
});

export type BottlenecksInput = z.infer<typeof BottlenecksInputSchema>;
export type BottlenecksResult = z.infer<typeof BottlenecksResultSchema>;
