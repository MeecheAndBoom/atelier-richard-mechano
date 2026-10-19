"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { money } from "@/lib/format";

function titleOf(p: { title: string; titleEn?: string }, locale: "fr" | "en") {
  return locale === "en" && p.titleEn ? p.titleEn : p.title;
}
function descOf(
  p: { description: string; descriptionEn?: string },
  locale: "fr" | "en",
) {
  return locale === "en" && p.descriptionEn ? p.descriptionEn : p.description;
}

type SpotProduct = {
  slug: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  price: number;
  listPrice?: number;
  images: string[];
  stock: number;
};

export function Spotlight({
  items,
  locale,
  ctaLabel,
  secondaryLabel,
}: {
  items: SpotProduct[];
  locale: "fr" | "en";
  ctaLabel: string;
  secondaryLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length, tick]);

  function go(delta: number) {
    setIndex((i) => (i + delta + items.length) % items.length);
    setTick((t) => t + 1); // restart the auto-rotate timer on manual navigation
  }

  if (!items.length) return null;
  const item = items[index];
  const save =
    item.listPrice && item.listPrice > item.price ? item.listPrice - item.price : 0;

  return (
    <section className="relative isolate overflow-hidden bg-graphite">
      <div className="relative min-h-[520px] sm:min-h-[600px]">
        {items.map((p, i) => (
          <div
            key={p.slug}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={i !== index}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.images[0]}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(105deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.78)_40%,rgba(0,0,0,0.4)_70%,rgba(0,0,0,0.06)_100%)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.6)_45%,rgba(0,0,0,0.85)_75%,rgba(0,0,0,0.94)_100%)]"
            />
            <div className="section relative flex min-h-[520px] items-end py-14 sm:min-h-[600px] sm:py-20">
              <div className="max-w-[520px]">
                <h2 className="mt-5 text-[30px] leading-[1.08] font-semibold tracking-[-0.025em] text-white sm:text-[42px]">
                  {titleOf(p, locale)}
                </h2>
                <p className="mt-4 line-clamp-3 text-[15.5px] leading-[1.65] text-white/85">
                  {descOf(p, locale)}
                </p>
                <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <span className="text-[30px] font-semibold tracking-[-0.02em] tabular-nums text-white">
                    {money(p.price, locale)}
                  </span>
                  {p.listPrice && p.listPrice > p.price ? (
                    <span className="text-[17px] text-white/55 line-through tabular-nums">
                      {money(p.listPrice, locale)}
                    </span>
                  ) : null}
                  {save > 0 ? (
                    <span className="rounded-full bg-[#ff453a] px-2.5 py-1 text-[12.5px] font-semibold text-white">
                      −{money(save, locale)}
                    </span>
                  ) : null}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={`/shop/${p.slug}`} className="btn btn-primary btn-lg">
                    <span>{ctaLabel}</span>
                    <i className="fa-solid fa-arrow-right text-[12px]" aria-hidden="true" />
                  </Link>
                  <Link href="/shop" className="btn btn-dark btn-lg">
                    <span>{secondaryLabel}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length > 1 ? (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous product"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white/80 transition-colors duration-200 hover:bg-white/20 hover:text-white"
          >
            <i className="fa-solid fa-chevron-left text-[10px]" aria-hidden="true" />
          </button>
          <div className="flex gap-2">
            {items.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => {
                  setIndex(i);
                  setTick((t) => t + 1);
                }}
                aria-label={`Show ${titleOf(p, locale)}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-white" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next product"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white/80 transition-colors duration-200 hover:bg-white/20 hover:text-white"
          >
            <i className="fa-solid fa-chevron-right text-[10px]" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
