"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

/**
 * Near-full-screen cookie consent gate (RGPD/ePrivacy).
 *
 * - Blocks the page until the visitor makes an explicit choice: accept all,
 *   refuse all, or save a per-category selection. No backdrop/ESC dismissal —
 *   a hidden dismissal is exactly the pattern that creates legal exposure.
 * - Choice persists in localStorage and can be revised at any time through
 *   the footer's "Manage cookies" entry (dispatches `arm:manage-cookies`).
 * - Essential cookies are always on and not user-disableable.
 */

const STORAGE_KEY = "arm-cookie-consent-v1";

/** Event dispatched by the footer link to reopen this modal. */
export const COOKIE_MANAGE_EVENT = "arm:manage-cookies";

type CategoryKey = "preferences" | "analytics" | "marketing";

type Consent = Record<CategoryKey, boolean> & { version: number; updatedAt: string };

const OPTIONAL_KEYS: CategoryKey[] = ["preferences", "analytics", "marketing"];

function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Consent>;
    if (typeof parsed !== "object" || parsed === null || parsed.version !== 1) return null;
    return {
      version: 1,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
      preferences: Boolean(parsed.preferences),
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    };
  } catch {
    return null;
  }
}

function writeConsent(value: Omit<Consent, "version" | "updatedAt">): Consent {
  const consent: Consent = {
    ...value,
    version: 1,
    updatedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    /* private mode — choice still applies for this visit */
  }
  document.cookie = `arm-consent=${OPTIONAL_KEYS.filter((k) => consent[k]).join(",") || "none"}; path=/; max-age=15552000; SameSite=Lax`;
  return consent;
}

export function CookieConsent() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Consent>({
    version: 1,
    updatedAt: "",
    preferences: false,
    analytics: false,
    marketing: false,
  });
  const panelRef = useRef<HTMLDivElement>(null);

  /* First visit → gate the page; returning visit → just hydrate state. */
  useEffect(() => {
    const existing = readConsent();
    if (existing) {
      setDraft(existing);
    } else {
      setOpen(true);
    }
    const onManage = () => {
      setDraft(readConsent() ?? { version: 1, updatedAt: "", preferences: false, analytics: false, marketing: false });
      setOpen(true);
    };
    window.addEventListener(COOKIE_MANAGE_EVENT, onManage);
    return () => window.removeEventListener(COOKIE_MANAGE_EVENT, onManage);
  }, []);

  /* Lock scrolling + move focus into the panel while the gate is open. */
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = window.setTimeout(() => panelRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(id);
    };
  }, [open]);

  const save = useCallback((next: Consent) => {
    const saved = writeConsent(next);
    setDraft(saved);
    setOpen(false);
    window.dispatchEvent(new CustomEvent("arm:consent-saved"));
  }, []);

  const toggle = (key: CategoryKey) =>
    setDraft((prev) => ({ ...prev, [key]: !prev[key] }));

  if (!open) return null;

  const categories: { key: CategoryKey; title: string; description: string }[] = [
    { key: "preferences", title: t.cookies.categories.preferences.title, description: t.cookies.categories.preferences.description },
    { key: "analytics", title: t.cookies.categories.analytics.title, description: t.cookies.categories.analytics.description },
    { key: "marketing", title: t.cookies.categories.marketing.title, description: t.cookies.categories.marketing.description },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6">
      {/* Backdrop — clicking it does nothing: an explicit choice is required. */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/70 backdrop-blur-[3px]" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-consent-title"
        tabIndex={-1}
        className="relative flex max-h-[calc(100dvh-16px)] w-full max-w-[940px] flex-col overflow-hidden rounded-card border border-line bg-white shadow-[0_30px_90px_rgba(0,0,0,0.45)] outline-none sm:max-h-[calc(100dvh-32px)] lg:max-h-[calc(100dvh-48px)]"
      >
        {/* Header */}
        <div className="border-b border-line px-5 pt-6 pb-5 sm:px-9 sm:pt-8">
          <div className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-icon.png"
              alt=""
              className="h-11 w-11 shrink-0 object-contain sm:h-14 sm:w-14"
            />
            <div className="min-w-0">
              <h2
                id="cookie-consent-title"
                className="text-[21px] leading-tight font-semibold tracking-[-0.02em] sm:text-[27px]"
              >
                {t.cookies.title}
              </h2>
              <p className="mt-2.5 max-w-[76ch] text-[13.5px] leading-relaxed text-muted sm:text-[14.5px]">
                {t.cookies.lead}
              </p>
            </div>
          </div>
        </div>

        {/* Category choices */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-9 sm:py-6">
          <p className="text-micro font-semibold uppercase tracking-[0.08em] text-muted-light">
            {t.cookies.customize}
          </p>

          <ul className="mt-3.5 space-y-3">
            {/* Essential — always on */}
            <li className="flex items-start justify-between gap-4 rounded-[14px] border border-line bg-alt px-4 py-3.5 sm:px-5">
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-ink">
                  {t.cookies.categories.essential.title}
                </p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
                  {t.cookies.categories.essential.description}
                </p>
              </div>
              <span className="shrink-0 rounded-pill border border-accent/40 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap text-accent">
                {t.cookies.categories.essential.alwaysOn}
              </span>
            </li>

            {/* Optional categories */}
            {categories.map((cat) => {
              const checked = draft[cat.key];
              return (
                <li
                  key={cat.key}
                  className="flex items-start justify-between gap-4 rounded-[14px] border border-line bg-white px-4 py-3.5 transition-colors sm:px-5"
                >
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-ink">{cat.title}</p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
                      {cat.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    aria-label={cat.title}
                    onClick={() => toggle(cat.key)}
                    className={`mt-0.5 inline-flex h-[26px] w-[46px] shrink-0 items-center rounded-pill border px-[3px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent ${
                      checked ? "border-accent bg-accent" : "border-line bg-alt"
                    }`}
                  >
                    <span
                      className={`h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        checked ? "translate-x-[20px]" : "translate-x-0"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="mt-4 text-[13px] text-muted">
            {t.cookies.privacyNote}{" "}
            <Link href="/legal/privacy" className="text-accent underline underline-offset-2 hover:text-ink transition-colors">
              {t.cookies.privacyLink}
            </Link>
          </p>
        </div>

        {/* Actions — the three explicit choices */}
        <div className="border-t border-line bg-alt px-5 py-4 sm:px-9 sm:py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12.5px] text-muted-light">{t.cookies.manageHint}</p>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                className="btn btn-dark btn-lg w-full sm:w-auto"
                onClick={() =>
                  save({ ...draft, preferences: false, analytics: false, marketing: false })
                }
              >
                {t.cookies.rejectAll}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-lg w-full sm:w-auto"
                onClick={() => save(draft)}
              >
                {t.cookies.save}
              </button>
              <button
                type="button"
                autoFocus
                className="btn btn-primary btn-lg w-full sm:w-auto"
                onClick={() =>
                  save({ ...draft, preferences: true, analytics: true, marketing: true })
                }
              >
                {t.cookies.acceptAll}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
