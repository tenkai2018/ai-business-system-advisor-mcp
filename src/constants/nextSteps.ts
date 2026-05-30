export const NEXT_STEP_CATEGORIES = {
  selfGuidedResource: {
    id: "self_guided_resource",
    label: "Use a self-guided checklist or worksheet",
    description:
      "Best when the workflow is simple, low-risk, and the user wants to think through the problem independently."
  },
  deeperDiagnostic: {
    id: "deeper_diagnostic",
    label: "Request a deeper business-system review",
    description:
      "Best when the business has multiple bottlenecks, unclear workflows, or trust/control risks that need structured analysis."
  },
  implementationReadyDocs: {
    id: "implementation_ready_docs",
    label: "Prepare implementation-ready documentation",
    description:
      "Best when the user knows what needs to be improved but needs clear workflow maps, SOPs, review rules, and automation specifications."
  },
  aiReadySystemBuild: {
    id: "ai_ready_system_build",
    label: "Build an AI-ready workflow or operating system",
    description:
      "Best when business processes are clear enough to convert into structured workflows, agent instructions, and automation specs."
  },
  monthlyReview: {
    id: "monthly_review",
    label: "Review and improve existing AI-enabled operations",
    description:
      "Best when the user already has AI tools or automations but needs governance, quality review, and continuous improvement."
  }
} as const;

export type NextStepId =
  (typeof NEXT_STEP_CATEGORIES)[keyof typeof NEXT_STEP_CATEGORIES]["id"];
