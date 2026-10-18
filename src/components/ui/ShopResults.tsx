"use client";

import { useEffect } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductCardCompact } from "@/components/ui/ProductCardCompact";
import { ProductRow } from "@/components/ui/ProductRow";
import { useShopView, persistShopView, readShopView } from "@/store/shopView";
import type { Product } from "@/lib/types";

/** Renders the shop results in the user's chosen layout: grid, compact, or list. */
export function ShopResults({ products }: { products: Product[] }) {
  const view = useShopView((s) => s.view);
  const setView = useShopView((s) => s.setView);

  // Read the saved preference after mount — keeps SSR output stable.
  useEffect(() => {
    setView(readShopView());
  }, [setView]);

  if (view === "list") {
    return (
      <div className="flex flex-col gap-4">
        {products.map((product, i) => (
          <Reveal key={product.slug} delay={(i % 3) * 70}>
            <ProductRow product={product} />
          </Reveal>
        ))}
      </div>
    );
  }

  if (view === "compact") {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product, i) => (
          <Reveal key={product.slug} delay={(i % 5) * 50}>
            <ProductCardCompact product={product} />
          </Reveal>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, i) => (
        <Reveal key={product.slug} delay={(i % 3) * 70}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}

/** Segmented view control — grid / compact / list. */
export function ShopViewToggle({ className = "" }: { className?: string }) {
  const view = useShopView((s) => s.view);
  const setView = useShopView((s) => s.setView);

  const options: { id: "grid" | "compact" | "list"; icon: string; label: string }[] = [
    { id: "grid", icon: "fa-table-cells-large", label: "Grid" },
    { id: "compact", icon: "fa-grip", label: "Compact" },
    { id: "list", icon: "fa-list", label: "List" },
  ];

  return (
    <div
      role="group"
      aria-label="Vue / View"
      className={`flex h-9 items-center gap-0.5 rounded-pill border border-line bg-white p-0.5 ${className}`}
    >
      {options.map((option) => {
        const active = option.id === view;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            title={option.label}
            onClick={() => {
              setView(option.id);
              persistShopView(option.id);
            }}
            className={`grid h-7 w-7 place-items-center rounded-pill transition-all duration-150 active:scale-95 ${
              active ? "bg-ink text-white" : "text-muted hover:bg-alt hover:text-ink"
            }`}
          >
            <i className={`fa-solid ${option.icon} text-[12px]`} aria-hidden="true" />
            <span className="sr-only">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
