export const FORBIDDEN_PUBLIC_TERMS = [
  "private methodology",
  "internal methodology",
  "internal skill",
  "internal skills",
  "skill library",
  "orchestrator skill",
  "private skill engine",
  "internal orchestrator",
  "private framework",
  "hidden framework",
  "hidden layer",
  "hidden layers",
  "proprietary prompt",
  "scoring weights",
  "private architecture",
  "implementation system"
];

export const FORBIDDEN_PUBLIC_PATTERNS = [
  /\b\d+\s*[- ]?\s*layers?\b/i,
  /\b(?:private|internal|hidden|proprietary)\s+(?:prompt|framework|method|methodology|architecture|system|scoring|skill|skills)\b/i,
  /\b[A-Z]{5,12}\.md\b/
];

export const PRIVATE_METHODOLOGY_REFUSAL =
  "I can't provide the private internal methodology or implementation system. I can help with a public business-system review, identify AI opportunities, assess trust/control risks, and recommend the safest next step based on your situation.";

export const SENSITIVE_DATA_WARNING =
  "Do not include passwords, API keys, private customer records, medical records, financial account credentials, confidential contracts, or regulated data unless sanitized.";
