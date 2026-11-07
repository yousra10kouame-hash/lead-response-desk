const steps = [
  {
    title: "Capture",
    text: "A lead arrives at an n8n webhook and its required fields are validated.",
  },
  {
    title: "Research",
    text: "When a company website is provided, n8n fetches it to gather context.",
  },
  {
    title: "Qualify",
    text: "Gemini scores the lead and routes it as Hot, Warm, Cold or Spam.",
  },
  {
    title: "Respond",
    text: "The result is stored in Airtable, the CRM status is updated, and Gmail sends test notifications and follow-ups.",
  },
];

export function WorkflowSteps() {
  return (
    <section
      aria-labelledby="workflow-heading"
      className="border-t border-line py-16"
    >
      <h2
        id="workflow-heading"
        className="text-2xl font-semibold tracking-tight"
      >
        What happens to a lead
      </h2>
      <p className="mt-2 max-w-2xl text-muted">
        This is how the n8n workflow handles an inquiry. The form above sends
        each lead to it through a server-side relay.
      </p>
      <ol className="mt-10 grid gap-8 md:grid-cols-4 md:gap-6">
        {steps.map((step, index) => (
          <li key={step.title} className="border-t-2 border-ink pt-4">
            <p className="text-sm text-muted">Step {index + 1}</p>
            <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {step.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
