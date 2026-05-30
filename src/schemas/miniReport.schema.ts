import { z } from "zod";
import { ConfidenceSchema } from "./common.schema.js";
import { BusinessContextInputSchema } from "./businessContext.schema.js";

export const MiniReportInputSchema = BusinessContextInputSchema.extend({
  businessSnapshot: z.string().optional(),
  bottlenecks: z.array(z.string()).optional(),
  opportunities: z.array(z.string()).optional(),
  risks: z.array(z.string()).optional(),
  recommendedWorkflow: z.string().optional(),
  nextStep: z.string().optional(),
  preferredNextStep: z.string().optional(),
  confidence: ConfidenceSchema.optional()
});

export const MiniReportResultSchema = z.object({
  reportMarkdown: z.string(),
  shortSummary: z.string(),
  recommendedAction: z.string(),
  disclaimer: z.string(),
  missingInformation: z.array(z.string()),
  confidence: ConfidenceSchema
});

export type MiniReportInput = z.infer<typeof MiniReportInputSchema>;
export type MiniReportResult = z.infer<typeof MiniReportResultSchema>;
