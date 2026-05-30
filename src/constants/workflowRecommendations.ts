export const WORKFLOW_PATTERNS = [
  {
    match: ["lead", "proposal", "sales", "follow-up"],
    workflow: "Lead research and qualification with human-approved proposal drafting",
    aiRole: "Research, summarize, qualify, and draft first-pass proposal material.",
    humanRole: "Approve customer promises, pricing, scope, and final messages.",
    metrics: ["qualified calls booked", "proposal cycle time", "human edit rate"]
  },
  {
    match: ["support", "ticket", "refund", "complaint", "angry"],
    workflow: "Support triage and draft response with human escalation",
    aiRole: "Classify tickets, summarize context, draft replies, and flag escalation signals.",
    humanRole: "Approve sensitive replies, refunds, exceptions, and service recovery decisions.",
    metrics: ["first response time", "escalation accuracy", "customer satisfaction"]
  },
  {
    match: ["content", "newsletter", "social", "ideas"],
    workflow: "Content idea capture and drafting pipeline",
    aiRole: "Organize ideas, research angles, draft outlines, and prepare reusable briefs.",
    humanRole: "Choose positioning, approve claims, and finalize voice-sensitive content.",
    metrics: ["ideas processed", "draft-to-publish rate", "content cycle time"]
  },
  {
    match: ["onboarding", "delivery", "client", "project"],
    workflow: "Client onboarding and delivery checklist assistant",
    aiRole: "Collect context, summarize requirements, prepare checklists, and flag missing details.",
    humanRole: "Confirm scope, expectations, exceptions, and high-trust customer communication.",
    metrics: ["missing information rate", "onboarding cycle time", "delivery rework"]
  }
];
