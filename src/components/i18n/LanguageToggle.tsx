"use client";

import { useLocale } from "./LocaleProvider";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n/config";

/**
 * FR / EN segmented pill. Sliding thumb follows the active locale with the
 * project's ease-out curve; pointer-down compresses the control for instant
 * feedback (apple-design: touch feedback + interruptible motion).
 */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      role="group"
      aria-label="Langue / Language"
      className={`relative flex h-8 items-center rounded-pill border border-line bg-white/70 p-0.5 select-none ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute top-0.5 bottom-0.5 left-0.5 w-[34px] rounded-pill bg-ink transition-transform duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: `translateX(${LOCALES.indexOf(locale) * 34}px)`,
        }}
      />
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={active}
            onClick={() => setLocale(code)}
            className={`relative z-10 h-[26px] w-[34px] rounded-pill text-[11px] font-semibold tracking-[0.04em] transition-colors duration-[160ms] active:scale-95 ${
              active ? "text-white" : "text-muted hover:text-ink"
            }`}
          >
            {LOCALE_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
