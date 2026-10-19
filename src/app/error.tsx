"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Root error boundary — catches any unhandled server/client throw and renders
 * a calm, on-brand recovery panel instead of Next's raw error page.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to console for debugging without exposing details to visitors.
    console.error("[site error]", error);
  }, [error]);

  return (
    <main
      id="main"
      className="grid min-h-[80vh] place-items-center bg-white px-6 py-20"
    >
      <div className="page-enter max-w-[560px] text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#fdeeee] text-[26px] text-danger">
          <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-[32px] leading-tight font-semibold tracking-[-0.03em] sm:text-[40px]">
          Something went wrong
        </h1>
        <p className="mt-3 text-[16.5px] leading-relaxed text-muted">
          We hit a temporary problem loading this page. It’s usually nothing —
          try again, or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn btn-primary">
            <i className="fa-solid fa-rotate-right text-[12px]" aria-hidden="true" />
            <span>Try again</span>
          </button>
          <Link href="/" className="btn btn-ghost">
            <i className="fa-solid fa-house text-[12px]" aria-hidden="true" />
            <span>Back home</span>
          </Link>
        </div>
        {error.digest ? (
          <p className="mt-8 font-mono text-[12px] text-muted-light">
            Ref: {error.digest}
          </p>
        ) : null}
      </div>
    </main>
  );
}
