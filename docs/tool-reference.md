# Tool Reference

All tools return JSON-like structured content and a text copy of the same content.
Every successful tool result includes `confidence` and `missingInformation`.

## Tools

- `analyze_business_context`: summarize business context, constraints, missing information, and initial opportunity hypotheses.
- `map_customer_touchpoints`: map likely customer stages, trust moments, and review rules.
- `identify_bottlenecks`: identify revenue, operations, customer experience, and trust/control bottlenecks.
- `evaluate_ai_opportunities`: evaluate AI assistance opportunities and warn against high-risk use cases.
- `assess_trust_control_risks`: assess risk categories, data boundaries, and review rules.
- `recommend_first_workflow`: recommend a narrow, measurable first AI-assisted workflow.
- `generate_mini_report`: generate a markdown mini business system review.
- `recommend_next_step`: recommend a neutral next-step category.
- `export_intake_packet`: generate markdown and JSON intake packet output.

## Common Input Fields

- `businessType`
- `targetCustomer`
- `offer`
- `revenueModel`
- `teamSize`
- `currentProblem`
- `currentWorkflow`
- `aiIdea`
- `goal90Days`
- `constraints`
- `riskConcerns`
