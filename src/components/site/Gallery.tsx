"use client";

import { useState } from "react";

/**
 * Product image gallery — main stage + thumbnail rail. Thumbnails scroll
 * horizontally on mobile and never wrap, so the stage size is stable.
 */
export function Gallery({
  images,
  alt,
  badge,
}: {
  images: string[];
  alt: string;
  badge?: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const list = images.length ? images : ["/images/placeholder.jpg"];
  const current = list[Math.min(index, list.length - 1)];

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="relative min-w-0 overflow-hidden rounded-card border border-line-soft bg-alt">
        <div className="aspect-[4/3] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={current}
            src={current}
            alt={alt}
            className="h-full w-full object-cover"
          />
        </div>
        {badge ? <span className="absolute top-4 left-4">{badge}</span> : null}
      </div>

      {list.length > 1 ? (
        <div
          role="group"
          aria-label={alt}
          className="rail flex gap-2.5 overflow-x-auto pb-1"
        >
          {list.map((image, i) => (
            <button
              key={image + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-current={i === index ? "true" : undefined}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-box border-2 transition-all duration-150 sm:h-20 sm:w-20 ${
                i === index
                  ? "border-accent"
                  : "border-line-soft opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
