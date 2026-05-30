import {
  FORBIDDEN_PUBLIC_PATTERNS,
  FORBIDDEN_PUBLIC_TERMS,
  PRIVATE_METHODOLOGY_REFUSAL
} from "../constants/guardrails.js";
import { redactPublicUnsafeText } from "./redaction.js";

export function containsForbiddenTerm(text: string): boolean {
  const normalized = text.toLowerCase();
  return (
    FORBIDDEN_PUBLIC_TERMS.some((term) => normalized.includes(term.toLowerCase())) ||
    FORBIDDEN_PUBLIC_PATTERNS.some((pattern) => pattern.test(text))
  );
}

export function isPrivateMethodologyRequest(input: string): boolean {
  const normalized = input.toLowerCase();
  return [
    "private methodology",
    "internal methodology",
    "hidden layer",
    "hidden layers",
    "internal skills",
    "skill library",
    "scoring weights",
    "internal prompts",
    "private implementation",
    "implementation system",
    "private architecture"
  ].some((term) => normalized.includes(term));
}

export function ensurePublicSafe<T extends string | object>(output: T): T {
  if (typeof output === "string") {
    return redactPublicUnsafeText(output) as T;
  }

  return sanitizeObject(output) as T;
}

export function privateMethodologyResponse() {
  return {
    refused: true,
    message: PRIVATE_METHODOLOGY_REFUSAL,
    confidence: "high" as const
  };
}

function sanitizeObject(value: unknown): unknown {
  if (typeof value === "string") {
    return redactPublicUnsafeText(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeObject(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, sanitizeObject(child)])
    );
  }

  return value;
}
