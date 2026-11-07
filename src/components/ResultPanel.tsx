export type Outcome =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success" }
  | { status: "error"; message: string };

type Props = {
  outcome: Outcome;
  onReset: () => void;
};

export function ResultPanel({ outcome, onReset }: Props) {
  // aria-live makes screen readers announce each state change.
  return (
    <div aria-live="polite" className="lg:sticky lg:top-6">
      {outcome.status === "pending" && (
        <div className="rounded-lg border border-line bg-panel p-6 text-sm leading-relaxed text-muted">
          <p className="font-medium text-ink">Processing your lead...</p>
          <p className="mt-2">
            The workflow researches and scores each lead before it replies, so
            this can take up to a minute.
          </p>
        </div>
      )}

      {outcome.status === "success" && (
        <div className="rounded-lg border border-line bg-panel p-6 text-sm leading-relaxed">
          <p className="font-semibold text-accent">Lead submitted</p>
          <p className="mt-2 text-muted">
            Your lead was sent to the n8n workflow and the workflow replied
            successfully.
          </p>
          <button
            type="button"
            onClick={onReset}
            className="mt-5 rounded-md border border-line bg-panel px-4 py-2.5 font-medium text-ink hover:border-ink"
          >
            Submit another lead
          </button>
        </div>
      )}

      {outcome.status === "error" && (
        <div
          role="alert"
          className="rounded-lg border border-danger bg-panel p-6 text-sm leading-relaxed"
        >
          <p className="font-semibold text-danger">Submission failed</p>
          <p className="mt-2 text-muted">{outcome.message}</p>
        </div>
      )}

      {outcome.status === "idle" && (
        <div className="rounded-lg border border-dashed border-line p-6 text-sm leading-relaxed text-muted">
          <p className="font-medium text-ink">No submission yet</p>
          <p className="mt-2">
            After you submit, the result of the workflow request appears here.
          </p>
        </div>
      )}
    </div>
  );
}
