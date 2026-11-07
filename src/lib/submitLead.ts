import type { LeadErrors, LeadPayload } from "./lead";

export type SubmitResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: LeadErrors };

type ApiResponse = { ok?: boolean; message?: string; errors?: LeadErrors };

// Slightly longer than the server's own 45 s limit to n8n.
const CLIENT_TIMEOUT_MS = 55_000;

/**
 * Sends the lead to our own same-origin route. The browser never sees the
 * n8n URL or secret; /api/leads (server side) holds both.
 */
export async function submitLead(payload: LeadPayload): Promise<SubmitResult> {
  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(CLIENT_TIMEOUT_MS),
    });

    // The reply may not be JSON (for example a platform error page).
    const data = (await response.json().catch(() => null)) as ApiResponse | null;

    if (response.ok && data?.ok === true) return { ok: true };

    return {
      ok: false,
      message:
        typeof data?.message === "string"
          ? data.message
          : "Something went wrong. Please try again in a moment.",
      fieldErrors: data?.errors,
    };
  } catch {
    return {
      ok: false,
      message: "The request took too long or the connection failed. Please try again.",
    };
  }
}
