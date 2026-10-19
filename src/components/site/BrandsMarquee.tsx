import type { CSSProperties } from "react";

/**
 * Text marquee of part brands the workshop fits — a quiet trust band under
 * the stats. Pure CSS loop, pauses on hover, static under reduced-motion.
 */
const BRAND_NAMES = [
  "Brembo",
  "Bosch",
  "Sachs",
  "LuK",
  "Valeo",
  "SKF",
  "NGK",
  "Mann-Filter",
  "Febi Bilstein",
  "TRW",
  "Denso",
  "Hella",
  "ATE",
  "Continental",
];

export function BrandsMarquee() {
  const track = (clone: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={clone ? "true" : undefined}>
      {BRAND_NAMES.map((name) => (
        <li key={`${name}-${clone ? "b" : "a"}`} className="flex items-center">
          <span className="px-6 text-[19px] font-semibold tracking-[-0.01em] text-muted-light sm:px-8 sm:text-[22px]">
            {name}
          </span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#d2d2d7]" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee">
      <div className="marquee-group flex" style={{ "--marquee-duration": "48s" } as CSSProperties}>
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
