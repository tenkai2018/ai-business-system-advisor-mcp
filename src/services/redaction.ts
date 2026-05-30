export const REDACTION_MAP: Record<string, string> = {
  "7-layer framework": "structured diagnostic method",
  "7 layers": "structured diagnostic areas",
  "seven-layer": "structured",
  "3-layer workspace": "structured AI-ready operating system",
  "3 layers": "structured system areas",
  "three-layer": "structured",
  "hcai skills": "private delivery process",
  "internal skill": "private delivery process",
  "skill library": "private delivery process",
  "internal orchestrator": "private review process",
  "private framework": "private delivery process",
  "hidden framework": "private delivery process",
  "proprietary prompt": "private delivery logic",
  "internal scoring weights": "private scoring logic",
  "AGENTS.md": "AI operating instructions",
  "ROUTER.md": "routing documentation"
};

export function redactPublicUnsafeText(text: string): string {
  return Object.entries(REDACTION_MAP).reduce((current, [unsafe, safe]) => {
    return current.replace(new RegExp(escapeRegExp(unsafe), "gi"), safe);
  }, text);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
