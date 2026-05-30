export const REDACTION_MAP: Record<string, string> = {
  "internal skill": "private delivery process",
  "internal skills": "private delivery process",
  "skill library": "private delivery process",
  "internal orchestrator": "private review process",
  "private framework": "private delivery process",
  "hidden framework": "private delivery process",
  "hidden layer": "private delivery process",
  "hidden layers": "private delivery process",
  "proprietary prompt": "private delivery logic",
  "scoring weights": "private scoring logic"
};

const REDACTION_PATTERNS = [
  { pattern: /\b\d+\s*[- ]?\s*layers?\b/gi, replacement: "structured diagnostic areas" },
  {
    pattern:
      /\b(?:private|internal|hidden|proprietary)\s+(?:prompt|framework|method|methodology|architecture|system|scoring|skill|skills)\b/gi,
    replacement: "private delivery process"
  },
  { pattern: /\b[A-Z]{5,12}\.md\b/g, replacement: "AI operating instructions" }
];

export function redactPublicUnsafeText(text: string): string {
  const mapped = Object.entries(REDACTION_MAP).reduce((current, [unsafe, safe]) => {
    return current.replace(new RegExp(escapeRegExp(unsafe), "gi"), safe);
  }, text);

  return REDACTION_PATTERNS.reduce((current, rule) => {
    return current.replace(rule.pattern, rule.replacement);
  }, mapped);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
