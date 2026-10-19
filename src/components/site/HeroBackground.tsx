"use client";

/**
 * Hero background — the open-graph brand image, full-bleed.
 * A slow, infinite Ken Burns drift keeps it feeling alive (the previous version
 * crossfaded six photos to read as an animated video); prefers-reduced-motion
 * falls back to a static still.
 */
const OG_IMAGE = "/atelier_richard_mecano_open_graph.png";

export function HeroBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={OG_IMAGE}
        alt=""
        className="hero-drift absolute inset-0 h-full w-full object-cover"
        loading="eager"
        decoding="async"
      />
      <div className="absolute inset-0 bg-black/25" />
    </div>
  );
}
