const stack = [
  { name: "Next.js", role: "Front end and server-side relay" },
  { name: "n8n", role: "Workflow automation" },
  { name: "Gemini", role: "Lead research and scoring" },
  { name: "Airtable", role: "Lead records" },
  { name: "Gmail", role: "Test notifications and follow-ups" },
];

export function TechStack() {
  return (
    <section
      aria-labelledby="stack-heading"
      className="border-t border-line py-16"
    >
      <h2 id="stack-heading" className="text-2xl font-semibold tracking-tight">
        Technology stack
      </h2>
      <ul className="mt-8 grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
        {stack.map((item) => (
          <li key={item.name}>
            <p className="font-semibold">{item.name}</p>
            <p className="mt-1 text-sm text-muted">{item.role}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
