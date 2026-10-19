import type { CSSProperties } from "react";

/**
 * Brand logo marquee — quiet trust band under the stats. Pure CSS loop,
 * pauses on hover, static under reduced-motion. Falls back to text if a logo
 * image is missing.
 */
const BRANDS = [
  { name: "Brembo", image: "/images/brands/brembo.jpg" },
  { name: "Bosch", image: "/images/brands/bosch.jpg" },
  { name: "Sachs", image: "/images/brands/sachs.jpg" },
  { name: "LuK", image: "/images/brands/luk.jpg" },
  { name: "Valeo", image: "/images/brands/valeo.svg" },
  { name: "SKF", image: "/images/brands/skf.svg" },
  { name: "NGK", image: "/images/brands/ngk.svg" },
  { name: "Mann-Filter", image: "/images/brands/mann-filter.svg" },
  { name: "Febi Bilstein", image: "/images/brands/febi-bilstein.svg" },
  { name: "TRW", image: "/images/brands/trw.svg" },
  { name: "Denso", image: "/images/brands/denso.svg" },
  { name: "Hella", image: "/images/brands/hella.svg" },
  { name: "ATE", image: "/images/brands/ate.svg" },
  { name: "Continental", image: "/images/brands/continental.svg" },
];

export function BrandsMarquee() {
  const track = (clone: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={clone ? "true" : undefined}>
      {BRANDS.map((brand) => (
        <li key={`${brand.name}-${clone ? "b" : "a"}`} className="flex items-center">
          <div className="flex h-12 items-center px-6 sm:px-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={brand.image}
              alt={brand.name}
              className="h-7 max-w-[120px] object-contain opacity-90 sm:h-9 sm:max-w-[150px]"
              loading="lazy"
            />
          </div>
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
