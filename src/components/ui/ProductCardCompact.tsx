"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { money } from "@/lib/format";
import { categoryLabel } from "@/lib/constants";
import { localizedTitle } from "@/lib/seo";
import type { Product } from "@/lib/types";

/** Dense tile for compact view — reference-free, price-forward. */
export function ProductCardCompact({ product }: { product: Product }) {
  const { locale, t } = useLocale();
  const title = localizedTitle(product, locale);

  return (
    <article className="group">
      <Link
        href={`/shop/${product.slug}`}
        className="block aspect-square overflow-hidden rounded-card border border-line-soft bg-alt"
        tabIndex={-1}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0] ?? "/images/placeholder.jpg"}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
      </Link>
      <div className="mt-3">
        <p className="text-micro uppercase tracking-[0.06em] text-muted">
          {categoryLabel(product.category, locale)}
        </p>
        <h3 className="mt-1 text-[15px] leading-snug font-medium">
          <Link
            href={`/shop/${product.slug}`}
            className="line-clamp-2 transition-colors duration-150 hover:text-accent"
          >
            {title}
          </Link>
        </h3>
        <p className="mt-1 text-[14px] font-semibold text-ink">
          {money(product.price, locale)}
          {product.stock <= 0 ? (
            <span className="ml-2 text-[12px] font-normal text-danger">
              {t.common.outOfStock}
            </span>
          ) : null}
        </p>
      </div>
    </article>
  );
}
