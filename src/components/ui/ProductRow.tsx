"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { AddToCart } from "@/components/site/AddToCart";
import { money } from "@/lib/format";
import { categoryLabel } from "@/lib/constants";
import { localizedTitle } from "@/lib/seo";
import type { Product } from "@/lib/types";

/** Horizontal row for list view — spec-rich, comparison friendly. */
export function ProductRow({ product }: { product: Product }) {
  const { locale, t } = useLocale();
  const title = localizedTitle(product, locale);

  return (
    <article className="card-flat flex gap-4 p-4 sm:gap-5 sm:p-5">
      <Link
        href={`/shop/${product.slug}`}
        className="block h-24 w-24 shrink-0 overflow-hidden rounded-box border border-line-soft bg-alt sm:h-28 sm:w-28"
        tabIndex={-1}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0] ?? "/images/placeholder.jpg"}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-micro uppercase tracking-[0.06em] text-muted">
          {categoryLabel(product.category, locale)} · {product.brand}
        </p>
        <h3 className="mt-1 truncate text-[16px] font-semibold">
          <Link href={`/shop/${product.slug}`} className="hover:text-accent">
            {title}
          </Link>
        </h3>
        <dl className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
          <div className="flex gap-1.5">
            <dt>{t.product.partNumber}:</dt>
            <dd className="font-medium text-ink-soft">{product.partNumber}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt>{t.product.model}:</dt>
            <dd className="font-medium text-ink-soft">{product.model}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt>{t.product.condition}:</dt>
            <dd className="font-medium text-ink-soft">
              {t.shop.conditions[product.condition] ?? product.condition}
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="text-[17px] font-semibold">
            {money(product.price, locale)}
            {product.stock <= 0 ? (
              <span className="ml-2 text-[13px] font-normal text-danger">
                {t.common.outOfStock}
              </span>
            ) : null}
          </span>
          <AddToCart product={product} compact />
        </div>
      </div>
    </article>
  );
}
