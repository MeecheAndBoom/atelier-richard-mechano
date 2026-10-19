import type { CSSProperties } from "react";

/**
 * Brand logo marquee — quiet trust band under the stats. Pure CSS loop,
 * pauses on hover, static under reduced-motion. Falls back to text if a logo
 * image is missing.
 */
const BRANDS = [
  { name: "Brembo", image: "/images/brands/brembo.webp" },
  { name: "Bosch", image: "/images/brands/Bosch_logo.png" },
  { name: "Sachs", image: "/images/brands/Sachs-Logo.png" },
  { name: "LuK", image: "/images/brands/luk.svg" },
  { name: "Valeo", image: "/images/brands/valeo.svg" },
  { name: "SKF", image: "/images/brands/skf.jpeg" },
  { name: "NGK", image: "/images/brands/ngk.jpeg" },
  { name: "Mann-Filter", image: "/images/brands/mann-filter.png" },
  { name: "Febi Bilstein", image: "/images/brands/febi-bilstein.jpeg" },
  { name: "TRW", image: "/images/brands/trw.png" },
  { name: "Denso", image: "/images/brands/denso.png" },
  { name: "Hella", image: "/images/brands/Hella.jpeg" },
  { name: "ATE", image: "/images/brands/ATE.png" },
  { name: "Continental", image: "/images/brands/Continental.png" },
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
              alt=""
              aria-hidden="true"
              className="h-10 max-h-10 w-auto object-contain sm:h-12 sm:max-h-12"
              loading="lazy"
            />
          </div>
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
