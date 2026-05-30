import { z } from "zod";
import { ConfidenceSchema } from "./common.schema.js";
import { BusinessContextInputSchema } from "./businessContext.schema.js";

export const MiniReportInputSchema = BusinessContextInputSchema.extend({
  preferredNextStep: z.string().optional()
});

export const MiniReportResultSchema = z.object({
  markdown: z.string(),
  confidence: ConfidenceSchema
});

export type MiniReportInput = z.infer<typeof MiniReportInputSchema>;
export type MiniReportResult = z.infer<typeof MiniReportResultSchema>;
