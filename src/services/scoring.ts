import { HIGH_RISK_TERMS } from "../constants/riskPatterns.js";
import { toSearchText } from "./validation.js";

export type RiskLevel = "low" | "medium" | "high";

export function assessRiskLevel(input: unknown): RiskLevel {
  const text = toSearchText(input).toLowerCase();
  const matches = HIGH_RISK_TERMS.filter((term) => text.includes(term));

  if (matches.length >= 3 || text.includes("fully automate") || text.includes("no human")) {
    return "high";
  }

  if (matches.length >= 1) {
    return "medium";
  }

  return "low";
}

export function estimateReadiness(input: unknown): "low" | "medium" | "high" {
  const text = toSearchText(input);
  const fields = text.split(/\s+/).filter(Boolean).length;

  if (fields > 45) {
    return "high";
  }

  if (fields > 15) {
    return "medium";
  }

  return "low";
}

export function confidenceFromCompleteness(input: Record<string, unknown>): "low" | "medium" | "high" {
  const present = Object.values(input).filter((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== undefined && value !== "";
  }).length;

  if (present >= 7) {
    return "high";
  }

  if (present >= 4) {
    return "medium";
  }

  return "low";
}
