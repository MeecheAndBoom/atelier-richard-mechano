"use client";

import { useId, useState } from "react";

/**
 * Disclosure row used across FAQ/legal/accordion sections — height animates
 * through grid-template-rows so content of any size works without measuring.
 */
export function Accordion({
  question,
  children,
  defaultOpen = false,
}: {
  question: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className="border-b border-line-soft last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center justify-between gap-6 py-5 text-left cursor-pointer"
      >
        <span className="text-[17px] font-medium leading-snug text-ink transition-colors duration-150 group-hover:text-accent">
          {question}
        </span>
        <span
          aria-hidden="true"
          className="relative grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line"
        >
          <span className="absolute h-[1.5px] w-2.5 bg-ink" />
          <span
            className={`absolute h-[1.5px] w-2.5 bg-ink transition-transform duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? "rotate-0 scale-x-0" : "rotate-90"
            }`}
          />
        </span>
      </button>
      <div
        id={id}
        role="region"
        className={`grid transition-[grid-template-rows,opacity] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-6 pr-10 text-[15px] leading-relaxed text-muted">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
