"use client";

import { useActionState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  submitAffiliate,
  submitContact,
  submitRetrieveQuote,
  submitReview,
  type FormState,
} from "@/actions/forms";
import { Field, FormMessage, Stars } from "@/components/ui/FormBits";
import { useState } from "react";

/* ── Contact ──────────────────────────────────────────────────── */

export function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  const { t } = useLocale();
  const [state, action, pending] = useActionState<FormState, FormData>(
    submitContact,
    null,
  );

  if (state?.ok) {
    return <FormMessage state={state} success={t.contact.success} error={t.common.error} />;
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.contact.name} htmlFor="c-name" required>
          <input id="c-name" name="name" required autoComplete="name" className="field" />
        </Field>
        <Field label={t.contact.email} htmlFor="c-email" required>
          <input id="c-email" name="email" type="email" required autoComplete="email" className="field" />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.contact.phone} htmlFor="c-phone" optionalLabel={t.common.optional}>
          <input id="c-phone" name="phone" type="tel" autoComplete="tel" className="field" />
        </Field>
        <Field label={t.contact.subject} htmlFor="c-subject" optionalLabel={t.common.optional}>
          <input
            id="c-subject"
            name="subject"
            className="field"
            defaultValue={defaultSubject}
          />
        </Field>
      </div>
      <Field label={t.contact.message} htmlFor="c-message" required>
        <textarea id="c-message" name="message" rows={6} required className="field resize-y" />
      </Field>
      <FormMessage state={state} success={t.contact.success} error={t.common.error} />
      <button type="submit" disabled={pending} className="btn btn-primary self-start">
        {pending ? (
          <i className="fa-solid fa-circle-notch animate-spin text-[12px]" aria-hidden="true" />
        ) : (
          <i className="fa-solid fa-paper-plane text-[12px]" aria-hidden="true" />
        )}
        <span>{t.contact.send}</span>
      </button>
    </form>
  );
}

/* ── Retrieve quote ───────────────────────────────────────────── */

export function QuoteForm() {
  const { t } = useLocale();
  const [state, action, pending] = useActionState<FormState, FormData>(
    submitRetrieveQuote,
    null,
  );

  if (state?.ok) {
    return <FormMessage state={state} success={t.retrieveQuote.success} error={t.common.error} />;
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <Field label={t.retrieveQuote.email} htmlFor="q-email" required>
        <input id="q-email" name="email" type="email" required autoComplete="email" className="field" />
      </Field>
      <Field label={t.retrieveQuote.quoteRef} htmlFor="q-ref" optionalLabel={t.common.optional}>
        <input id="q-ref" name="quoteRef" className="field font-mono" placeholder="ARM-XXXXXX" />
      </Field>
      <Field label={t.retrieveQuote.message} htmlFor="q-message" required>
        <textarea id="q-message" name="message" rows={5} required className="field resize-y" />
      </Field>
      <FormMessage state={state} success={t.retrieveQuote.success} error={t.common.error} />
      <button type="submit" disabled={pending} className="btn btn-primary self-start">
        {pending ? (
          <i className="fa-solid fa-circle-notch animate-spin text-[12px]" aria-hidden="true" />
        ) : (
          <i className="fa-solid fa-magnifying-glass text-[12px]" aria-hidden="true" />
        )}
        <span>{t.retrieveQuote.submit}</span>
      </button>
    </form>
  );
}

/* ── Affiliate ────────────────────────────────────────────────── */

export function AffiliateForm() {
  const { t } = useLocale();
  const [state, action, pending] = useActionState<FormState, FormData>(
    submitAffiliate,
    null,
  );

  if (state?.ok) {
    return <FormMessage state={state} success={t.affiliate.success} error={t.common.error} />;
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.affiliate.name} htmlFor="a-name" required>
          <input id="a-name" name="name" required autoComplete="name" className="field" />
        </Field>
        <Field label={t.affiliate.email} htmlFor="a-email" required>
          <input id="a-email" name="email" type="email" required autoComplete="email" className="field" />
        </Field>
      </div>
      <Field label={t.affiliate.website} htmlFor="a-site" optionalLabel={t.common.optional}>
        <input id="a-site" name="website" type="url" className="field" placeholder="https://" />
      </Field>
      <Field label={t.affiliate.message} htmlFor="a-message" required>
        <textarea id="a-message" name="message" rows={5} required className="field resize-y" />
      </Field>
      <FormMessage state={state} success={t.affiliate.success} error={t.common.error} />
      <button type="submit" disabled={pending} className="btn btn-primary self-start">
        {pending ? (
          <i className="fa-solid fa-circle-notch animate-spin text-[12px]" aria-hidden="true" />
        ) : (
          <i className="fa-solid fa-handshake text-[12px]" aria-hidden="true" />
        )}
        <span>{t.affiliate.send}</span>
      </button>
    </form>
  );
}

/* ── Review ───────────────────────────────────────────────────── */

export function ReviewForm() {
  const { t } = useLocale();
  const [state, action, pending] = useActionState<FormState, FormData>(
    submitReview,
    null,
  );
  const [rating, setRating] = useState(5);

  if (state?.ok) {
    return <FormMessage state={state} success={t.testimonials.success} error={t.common.error} />;
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.testimonials.name} htmlFor="r-name" required>
          <input id="r-name" name="name" required autoComplete="name" className="field" />
        </Field>
        <Field label={t.testimonials.city} htmlFor="r-city" optionalLabel={t.common.optional}>
          <input id="r-city" name="city" className="field" />
        </Field>
      </div>
      <Field label={t.testimonials.email} htmlFor="r-email" required>
        <input id="r-email" name="email" type="email" required autoComplete="email" className="field" />
      </Field>

      <fieldset>
        <legend className="field-label">{t.testimonials.rating}</legend>
        <input type="hidden" name="rating" value={rating} />
        <div className="mt-1 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              aria-label={`${star}/5`}
              className="grid h-9 w-9 place-items-center rounded-pill transition-all duration-150 hover:bg-alt active:scale-90"
            >
              <i
                className={`${star <= rating ? "fa-solid" : "fa-regular"} fa-star text-[17px] text-[#f5a623]`}
                aria-hidden="true"
              />
            </button>
          ))}
          <span className="ml-2 text-[13px] text-muted">
            <Stars rating={rating} />
          </span>
        </div>
      </fieldset>

      <Field label={t.testimonials.reviewTitle} htmlFor="r-title" optionalLabel={t.common.optional}>
        <input id="r-title" name="title" className="field" />
      </Field>
      <Field label={t.testimonials.body} htmlFor="r-body" required>
        <textarea id="r-body" name="body" rows={5} required className="field resize-y" />
      </Field>
      <Field label={t.testimonials.purchased} htmlFor="r-purchased" optionalLabel={t.common.optional}>
        <input id="r-purchased" name="purchased" className="field" />
      </Field>

      <FormMessage state={state} success={t.testimonials.success} error={t.common.error} />
      <button type="submit" disabled={pending} className="btn btn-primary self-start">
        {pending ? (
          <i className="fa-solid fa-circle-notch animate-spin text-[12px]" aria-hidden="true" />
        ) : (
          <i className="fa-solid fa-star text-[12px]" aria-hidden="true" />
        )}
        <span>{t.testimonials.submit}</span>
      </button>
    </form>
  );
}
