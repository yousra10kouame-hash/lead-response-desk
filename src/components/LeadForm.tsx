"use client";

import { useState } from "react";
import {
  LIMITS,
  validateLead,
  type LeadErrors,
  type LeadField,
  type LeadPayload,
} from "@/lib/lead";
import { submitLead } from "@/lib/submitLead";
import { PreviewPanel } from "./PreviewPanel";

const inputClass =
  "mt-2 block w-full rounded-md border border-line bg-panel px-3.5 py-2.5 text-base placeholder:text-muted/70 aria-[invalid=true]:border-danger";

export function LeadForm() {
  const [errors, setErrors] = useState<LeadErrors>({});
  const [pending, setPending] = useState(false);
  const [preview, setPreview] = useState<LeadPayload | null>(null);
  // Changing the key remounts the form, which clears every field.
  const [formKey, setFormKey] = useState(0);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return; // blocks double submits

    const form = event.currentTarget;
    const result = validateLead(Object.fromEntries(new FormData(form)));

    if (!result.ok) {
      setErrors(result.errors);
      setPreview(null);
      const first = Object.keys(result.errors)[0];
      const field = form.elements.namedItem(first);
      if (field instanceof HTMLElement) field.focus();
      return;
    }

    setErrors({});
    setPending(true);
    try {
      const response = await submitLead(result.data);
      setPreview(response.payload);
    } finally {
      setPending(false);
    }
  }

  function clearError(event: React.FormEvent<HTMLFormElement>) {
    const field = (event.target as HTMLInputElement).name as LeadField;
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function reset() {
    setPreview(null);
    setErrors({});
    setFormKey((k) => k + 1);
  }

  const a11y = (field: LeadField) => ({
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
  });

  return (
    <section
      aria-labelledby="form-heading"
      className="grid gap-8 pb-16 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
    >
      <form
        key={formKey}
        onSubmit={handleSubmit}
        onInput={clearError}
        noValidate
        className="rounded-lg border border-line bg-panel p-6 sm:p-8"
      >
        <h2 id="form-heading" className="text-2xl font-semibold tracking-tight">
          Submit a test lead
        </h2>
        <p className="mt-2 text-muted">
          Enter a sample inquiry. In this version nothing is sent anywhere.
        </p>

        <div className="mt-8 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={LIMITS.name}
                className={inputClass}
                {...a11y("name")}
              />
              <FieldError id="name-error" message={errors.name} />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Work email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={LIMITS.email}
                className={inputClass}
                {...a11y("email")}
              />
              <FieldError id="email-error" message={errors.email} />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="company" className="text-sm font-medium">
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                required
                maxLength={LIMITS.company}
                className={inputClass}
                {...a11y("company")}
              />
              <FieldError id="company-error" message={errors.company} />
            </div>
            <div>
              <label htmlFor="website" className="text-sm font-medium">
                Company website <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id="website"
                name="website"
                type="url"
                inputMode="url"
                placeholder="https://example.com"
                maxLength={LIMITS.website}
                className={inputClass}
                {...a11y("website")}
              />
              <FieldError id="website-error" message={errors.website} />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              maxLength={LIMITS.message}
              className={inputClass}
              {...a11y("message")}
            />
            <FieldError id="message-error" message={errors.message} />
          </div>

          <div className="sm:max-w-xs">
            <label htmlFor="language" className="text-sm font-medium">
              Reply language
            </label>
            <select
              id="language"
              name="language"
              defaultValue="en"
              className={inputClass}
              {...a11y("language")}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
            <FieldError id="language-error" message={errors.language} />
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-8 w-full rounded-md bg-accent px-5 py-3 font-medium text-white hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Preparing preview…" : "Preview lead"}
        </button>
      </form>

      <PreviewPanel payload={preview} onReset={reset} />
    </section>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm text-danger">
      {message}
    </p>
  );
}
