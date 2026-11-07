import type { LeadPayload } from "@/lib/lead";

type Props = {
  payload: LeadPayload | null;
  onReset: () => void;
};

export function PreviewPanel({ payload, onReset }: Props) {
  // aria-live makes screen readers announce the preview when it appears.
  return (
    <div aria-live="polite" className="lg:sticky lg:top-6">
      {payload ? (
        <div className="rounded-lg border border-line bg-panel">
          <div className="border-b border-warn-line bg-warn px-5 py-4 text-warn-ink">
            <p className="text-sm font-semibold">Local preview</p>
            <p className="mt-1 text-sm">
              Demo preview only — no lead has been submitted to n8n.
            </p>
          </div>
          <div className="p-5">
            <p className="text-sm text-muted">
              This is the JSON the form would send:
            </p>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-md border border-line bg-canvas p-4 font-mono text-[13px] leading-relaxed">
              {JSON.stringify(payload, null, 2)}
            </pre>
            <button
              type="button"
              onClick={onReset}
              className="mt-5 rounded-md border border-line bg-panel px-4 py-2.5 text-sm font-medium hover:border-ink"
            >
              Test another lead
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-line p-6 text-sm leading-relaxed text-muted">
          <p className="font-medium text-ink">No preview yet</p>
          <p className="mt-2">
            Submit the form to see the exact data this front end would send.
            Nothing leaves your browser in this version.
          </p>
        </div>
      )}
    </div>
  );
}
