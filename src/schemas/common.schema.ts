import { z } from "zod";

export const ConfidenceSchema = z.enum(["low", "medium", "high"]);
export const RiskLevelSchema = z.enum(["low", "medium", "high"]);

export const BaseResultSchema = z.object({
  confidence: ConfidenceSchema
});

export const TextListSchema = z.array(z.string()).default([]);
