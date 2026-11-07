/**
 * Lead types, limits and validation.
 *
 * This file has no browser-only code, so the form uses it today and the
 * future POST /api/leads route handler can import the same validateLead()
 * to re-check every request on the server. Never trust the browser alone.
 */

export const LANGUAGES = ["en", "fr"] as const;
export type Language = (typeof LANGUAGES)[number];

export const LIMITS = {
  name: 100,
  email: 254,
  company: 150,
  website: 2048,
  message: 2000,
} as const;

export const MIN_MESSAGE_LENGTH = 10;

/** The exact JSON keys the n8n webhook expects. */
export type LeadPayload = {
  name: string;
  email: string;
  company: string;
  website?: string;
  message: string;
  language: Language;
};

export type LeadField = keyof LeadPayload;
export type LeadErrors = Partial<Record<LeadField, string>>;

export type ValidationResult =
  | { ok: true; data: LeadPayload }
  | { ok: false; errors: LeadErrors };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function tooLong(field: keyof typeof LIMITS): string {
  return `Use ${LIMITS[field]} characters or fewer.`;
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function validateLead(input: Record<string, unknown>): ValidationResult {
  const name = clean(input.name);
  const email = clean(input.email);
  const company = clean(input.company);
  const website = clean(input.website);
  const message = clean(input.message);
  const language = LANGUAGES.find((l) => l === input.language);

  // Fields are checked in on-screen order, so the first error is the topmost.
  const errors: LeadErrors = {};

  if (!name) errors.name = "Enter your name.";
  else if (name.length > LIMITS.name) errors.name = tooLong("name");

  if (!email) errors.email = "Enter your email address.";
  else if (email.length > LIMITS.email) errors.email = tooLong("email");
  else if (!EMAIL_PATTERN.test(email))
    errors.email = "Enter a valid email address, for example name@company.com.";

  if (!company) errors.company = "Enter your company name.";
  else if (company.length > LIMITS.company) errors.company = tooLong("company");

  if (website) {
    if (website.length > LIMITS.website) errors.website = tooLong("website");
    else if (!isHttpsUrl(website))
      errors.website =
        "Enter a full address starting with https://, for example https://example.com.";
  }

  if (!message) errors.message = "Enter a message.";
  else if (message.length < MIN_MESSAGE_LENGTH)
    errors.message = `Write at least ${MIN_MESSAGE_LENGTH} characters so the inquiry has some context.`;
  else if (message.length > LIMITS.message) errors.message = tooLong("message");

  if (!language) errors.language = "Choose a language.";

  if (Object.keys(errors).length > 0 || !language) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      company,
      ...(website ? { website } : {}),
      message,
      language,
    },
  };
}
