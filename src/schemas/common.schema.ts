import { z } from "zod";

export const ConfidenceSchema = z.enum(["low", "medium", "high"]);
export const RiskLevelSchema = z.enum(["low", "medium", "high"]);
export const ReadinessLevelSchema = z.enum(["low", "medium", "high", "unknown"]);

export const BaseResultSchema = z.object({
  missingInformation: z.array(z.string()),
  confidence: ConfidenceSchema
});

export const TextListSchema = z.array(z.string()).default([]);
