"use client";

import { useRef } from "react";

/**
 * Horizontal scroll-snap rail with arrow controls (Apple product rows).
 * On mobile it behaves as a native touch scroll; arrows are pointer-only.
 */
export function ScrollRail({
  children,
  label,
  prevLabel,
  nextLabel,
}: {
  children: React.ReactNode;
  label: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: dir * Math.min(el.clientWidth * 0.85, 720),
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const arrowBtn = (dir: 1 | -1, label: string) => (
    <button
      type="button"
      onClick={() => scrollBy(dir)}
      aria-label={label}
      className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-line-soft bg-white text-[14px] text-ink shadow-[0_10px_28px_-14px_rgba(0,0,0,0.45)] transition-all duration-200 hover:border-accent hover:text-accent"
    >
      <i className={`fa-solid ${dir === 1 ? "fa-chevron-right" : "fa-chevron-left"}`} aria-hidden="true" />
    </button>
  );

  return (
    <div className="group/rail relative">
      <div
        ref={ref}
        role="region"
        aria-label={label}
        className="rail flex overflow-x-auto pb-3"
      >
        {children}
      </div>
      <div className="pointer-events-none mt-2 hidden justify-end gap-2.5 sm:flex">
        {arrowBtn(-1, prevLabel)}
        {arrowBtn(1, nextLabel)}
      </div>
    </div>
  );
}
