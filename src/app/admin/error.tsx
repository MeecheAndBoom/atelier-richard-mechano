"use client";

import Link from "next/link";

/**
 * Admin error boundary — a screenful of back-office context so a failed data
 * load doesn't dump the operator on Next's raw error page.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-card border border-[#f3dfbc] bg-[#fff9f0] p-8">
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-[18px] text-warning">
          <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h1 className="text-[22px] font-semibold tracking-[-0.02em]">
            We couldn’t load this section
          </h1>
          <p className="mt-2 max-w-[520px] text-[15px] leading-relaxed text-muted">
            A data source didn’t respond. Your records are safe — retry the
            load, or go back to the overview.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="btn btn-primary btn-sm"
            >
              <i className="fa-solid fa-rotate-right text-[12px]" aria-hidden="true" />
              <span>Retry</span>
            </button>
            <Link href="/admin" className="btn btn-ghost btn-sm">
              <i className="fa-solid fa-chart-line text-[12px]" aria-hidden="true" />
              <span>Overview</span>
            </Link>
          </div>
          {error.digest ? (
            <p className="mt-5 font-mono text-[12px] text-muted-light">
              Ref: {error.digest}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
