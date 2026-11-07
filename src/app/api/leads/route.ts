import { NextResponse } from "next/server";
import { validateLead } from "@/lib/lead";
import { checkRateLimit } from "@/lib/rateLimit";

// Vercel: allow this function to run up to 60 s (n8n runs Gemini + Airtable + Gmail).
export const maxDuration = 60;

const MAX_BODY_CHARS = 10_000;
const N8N_TIMEOUT_MS = 45_000;
const RATE_LIMIT = 5; // submissions ...
const RATE_WINDOW_MS = 10 * 60 * 1000; // ... per 10 minutes per IP

function fail(status: number, message: string, extra?: object) {
  return NextResponse.json({ ok: false, message, ...extra }, { status });
}

export async function POST(request: Request) {
  // Server-only secrets. They are never sent to the browser.
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET;
  if (!webhookUrl || !webhookSecret) {
    console.error("N8N_WEBHOOK_URL or N8N_WEBHOOK_SECRET is not set");
    return fail(500, "The demo is not configured yet.");
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return fail(415, "Invalid request.");
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const limit = checkRateLimit(ip, RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.allowed) {
    return fail(429, "Too many submissions. Please wait a few minutes and try again.");
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) return fail(413, "The request is too large.");

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail(400, "Invalid request.");
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return fail(400, "Invalid request.");
  }

  // Re-validate on the server: browser checks can be bypassed.
  const result = validateLead(body as Record<string, unknown>);
  if (!result.ok) {
    return fail(400, "Please correct the highlighted fields.", { errors: result.errors });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": webhookSecret,
      },
      // Only the six validated fields are forwarded, nothing else.
      body: JSON.stringify(result.data),
      signal: AbortSignal.timeout(N8N_TIMEOUT_MS),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("n8n responded with status", response.status);
      return fail(502, "The workflow could not process this lead. Please try again later.");
    }

    // n8n's raw reply is deliberately not forwarded to the browser.
    return NextResponse.json({ ok: true });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    console.error(timedOut ? "n8n request timed out" : "n8n request failed");
    return timedOut
      ? fail(504, "The workflow took too long to respond. Please try again.")
      : fail(502, "Could not reach the workflow. Please try again later.");
  }
}
