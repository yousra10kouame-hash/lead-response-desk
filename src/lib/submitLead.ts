import type { LeadPayload } from "./lead";

export type SubmitResult = {
  mode: "local-preview";
  payload: LeadPayload;
};

/**
 * THE ONE SEAM TO CHANGE WHEN CONNECTING n8n.
 *
 * Version 1 (now): nothing leaves the browser. We just hand the validated
 * payload back so the form can show a local preview.
 *
 * Version 2 (next step): replace the body with a same-origin request, e.g.
 *
 *   const res = await fetch("/api/leads", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(payload),
 *   });
 *
 * and update SubmitResult to describe the real response.
 * The webhook URL never appears here; it stays on the server.
 */
export async function submitLead(payload: LeadPayload): Promise<SubmitResult> {
  return { mode: "local-preview", payload };
}
