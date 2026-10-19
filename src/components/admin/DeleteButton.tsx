"use client";

import { useState, useTransition } from "react";

/**
 * Destructive-action button with an inline confirm step — two taps for a
 * delete, one for everything else. No blocking dialogs.
 */
export function ConfirmAction({
  action,
  arg,
  label,
  confirmLabel,
  icon = "fa-trash-can",
  className = "btn btn-ghost btn-sm text-danger",
}: {
  /**
   * A server-action reference passed **by name**, never an inline closure —
   * Server Components can't serialize arrow functions across the RSC
   * boundary (it throws "Event handlers cannot be passed to Client
   * Component props"), so the argument travels separately.
   */
  action: (arg: string) => Promise<{ ok: boolean; error?: string }>;
  /** Serializable argument for `action` — slug, id or order reference. */
  arg: string;
  label: string;
  confirmLabel: string;
  icon?: string;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <span className="inline-flex flex-col gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!armed) {
            setArmed(true);
            window.setTimeout(() => setArmed(false), 3200);
            return;
          }
          startTransition(async () => {
            const result = await action(arg);
            setArmed(false);
            if (!result.ok) setError(result.error ?? "Action échouée.");
          });
        }}
        className={`${className} ${armed ? "!bg-[#fdeeee] !text-danger" : ""} transition-all duration-150`}
      >
        <i
          className={`fa-solid ${pending ? "fa-circle-notch animate-spin" : armed ? "fa-triangle-exclamation" : icon} text-[12px]`}
          aria-hidden="true"
        />
        <span>{armed ? confirmLabel : label}</span>
      </button>
      {error ? (
        <span role="alert" className="text-[12px] text-danger">
          {error}
        </span>
      ) : null}
    </span>
  );
}
