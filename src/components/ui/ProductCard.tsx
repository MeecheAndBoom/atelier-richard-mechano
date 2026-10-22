"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { AddToCart } from "@/components/site/AddToCart";
import { money } from "@/lib/format";
import { categoryLabel } from "@/lib/constants";
import { localizedTitle } from "@/lib/seo";
import type { Product } from "@/lib/types";

function StockBadge({ product, labels }: { product: Product; labels: { inStock: string; out: string; low: string } }) {
  if (product.stock <= 0) {
    return (
      <span className="badge bg-[#fdeeee] text-danger">
        <i className="fa-solid fa-circle-xmark" aria-hidden="true" /> {labels.out}
      </span>
    );
  }
  if (product.stock <= 3) {
    return (
      <span className="badge bg-[#fff4e6] text-warning">
        <i className="fa-solid fa-circle" aria-hidden="true" /> {labels.low}
      </span>
    );
  }
  return (
    <span className="badge bg-[#eaf6ee] text-success">
      <i className="fa-solid fa-circle-check" aria-hidden="true" /> {labels.inStock}
    </span>
  );
}

/** Editorial grid card — image-led, hairline border, lift on hover. */
export function ProductCard({ product }: { product: Product }) {
  const { locale, t } = useLocale();
  const title = localizedTitle(product, locale);
  const hasDiscount = product.listPrice && product.listPrice > product.price;

  return (
    <article className="card group flex h-full flex-col overflow-hidden">
      <Link
        href={`/shop/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-alt"
        tabIndex={-1}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0] ?? "/images/placeholder.jpg"}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        <span className="absolute top-3 left-3 flex flex-col gap-1.5">
          <StockBadge
            product={product}
            labels={{
              inStock: t.common.inStock,
              out: t.common.outOfStock,
              low: t.common.lowStock,
            }}
          />
        </span>
        {hasDiscount ? (
          <span className="absolute top-3 right-3 badge bg-accent text-white">
            −{Math.round(((product.listPrice! - product.price) / product.listPrice!) * 100)}%
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex min-w-0 items-center gap-2 text-micro uppercase tracking-[0.06em] text-muted">
          <span className="min-w-0 break-words">{categoryLabel(product.category, locale)}</span>
          <span aria-hidden="true">·</span>
          <span className="min-w-0 break-words font-semibold text-ink">{product.brand}</span>
        </div>

        <h3 className="mt-2 text-[17px] leading-snug font-semibold tracking-[-0.01em]">
          <Link
            href={`/shop/${product.slug}`}
            className="break-words transition-colors duration-150 hover:text-accent focus-visible:text-accent"
          >
            {title}
          </Link>
        </h3>

        <p className="mt-1 text-[13px] text-muted">
          {t.product.partNumber} ·{" "}
          <span className="font-medium break-all text-ink-soft">{product.partNumber}</span>
        </p>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
          <div className="flex min-w-0 flex-col">
            {hasDiscount ? (
              <span className="text-[13px] text-muted line-through">
                {money(product.listPrice!, locale)}
              </span>
            ) : null}
            <span className="text-[19px] font-semibold tracking-[-0.01em] text-ink">
              {money(product.price, locale)}
            </span>
          </div>
          <AddToCart product={product} compact />
        </div>
      </div>
    </article>
  );
}
