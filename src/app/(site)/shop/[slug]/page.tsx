import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, getLocale } from "@/lib/i18n/server";
import { getProduct, getRelatedProducts } from "@/lib/products";
import {
  breadcrumbJsonLd,
  productJsonLd,
  productTitle,
  productDescription,
  localizedDescription,
  pageMetadata,
} from "@/lib/seo";
import { money, shortDate } from "@/lib/format";
import { CATEGORY_LABELS } from "@/lib/constants";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/site/PageHeader";
import { Gallery } from "@/components/site/Gallery";
import { AddToCart } from "@/components/site/AddToCart";
import { ProductCard } from "@/components/ui/ProductCard";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const product = await getProduct(slug);
  if (!product) return { title: "404" };
  return pageMetadata({
    title: productTitle(product, locale),
    description: productDescription(product, locale),
    path: `/shop/${product.slug}`,
    locale,
    image: product.images[0],
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getDict();
  const locale = await getLocale();
  const product = await getProduct(slug);
  if (!product || product.status === "draft") notFound();

  const related = await getRelatedProducts(product, 3);
  const title = locale === "en" && product.titleEn ? product.titleEn : product.title;
  const categoryLabel =
    CATEGORY_LABELS[product.category as keyof typeof CATEGORY_LABELS]?.[locale] ??
    product.category;
  const save =
    product.listPrice && product.listPrice > product.price
      ? product.listPrice - product.price
      : null;

  return (
    <div className="page-enter overflow-x-clip">
      <Breadcrumbs
        items={[
          { label: t.shop.breadcrumbHome, href: "/" },
          { label: t.product.breadcrumbShop, href: "/shop" },
          { label: title },
        ]}
      />

      <div className="section grid grid-cols-1 gap-10 py-8 lg:grid-cols-2 lg:gap-14 lg:py-12">
        <Gallery
          images={product.images}
          alt={t.product.galleryAlt.replace("{title}", title)}
          badge={
            product.stock > 0 ? (
              <span className="badge bg-white/95 text-success backdrop-blur">
                <i className="fa-solid fa-circle-check text-[11px]" aria-hidden="true" />
                {t.common.inStock}
              </span>
            ) : undefined
          }
        />

        <div className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="badge bg-alt text-ink-soft">{categoryLabel}</span>
            <span className="badge bg-sky text-accent">{t.shop.conditions[product.condition]}</span>
            {save ? (
              <span className="badge bg-[#fdeeee] text-danger">
                −{money(save, locale)} ({t.product.save})
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 text-[30px] leading-[1.1] font-semibold tracking-[-0.025em] break-words sm:text-[38px]">
            {title}
          </h1>

          <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[14px] text-muted">
            <span className="min-w-0">
              {t.product.partNumber}:{" "}
              <span className="font-mono font-medium break-all text-ink-soft">{product.partNumber}</span>
            </span>
            <span className="min-w-0">
              {t.product.brand}: <span className="font-medium break-words text-ink-soft">{product.brand}</span>
            </span>
          </p>

          <div className="mt-6 flex flex-wrap items-end gap-3">
            <span className="text-[36px] leading-none font-semibold tracking-[-0.03em] tabular-nums">
              {money(product.price, locale)}
            </span>
            {product.listPrice && product.listPrice > product.price ? (
              <span className="pb-1 text-[17px] text-muted-light line-through tabular-nums">
                {money(product.listPrice, locale)}
              </span>
            ) : null}
            <span className="pb-1.5 text-[13px] text-muted">{t.common.perUnit}</span>
          </div>

          <div className="mt-7 border-t border-line-soft pt-7">
            <AddToCart product={product} full />
          </div>

          <p className="mt-5 flex items-start gap-2.5 rounded-card bg-alt px-4 py-3.5 text-[14px] leading-relaxed text-muted">
            <i className="fa-solid fa-shield-halved mt-0.5 text-accent text-[14px]" aria-hidden="true" />
            <span className="min-w-0 break-words">{t.product.trustLine}</span>
          </p>

          {/* Compatibility */}
          <section className="mt-8">
            <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
              {t.product.compatibility}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="badge bg-alt text-ink-soft">
                {t.product.make}: {product.make}
              </span>
              <span className="badge bg-alt text-ink-soft">
                {t.product.model}: {product.model}
              </span>
              {product.yearRange ? (
                <span className="badge bg-alt text-ink-soft">
                  {t.product.years}: {product.yearRange}
                </span>
              ) : null}
            </div>
            {product.fitment.length ? (
              <ul className="mt-4 grid gap-1.5 text-[14.5px] text-ink-soft">
                {product.fitment.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <i className="fa-solid fa-check mt-1 text-[11px] text-success" aria-hidden="true" />
                    <span className="min-w-0 break-words">{line}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        </div>
      </div>

      {/* ── Detail body ─────────────────────────────────────── */}
      <section className="border-t border-line-soft bg-alt">
        <div className="section grid grid-cols-1 gap-10 py-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <h2 className="text-[24px] font-semibold tracking-[-0.02em]">
              {t.product.description}
            </h2>
            <p className="mt-4 text-[16.5px] leading-[1.75] whitespace-pre-line break-words text-ink-soft">
              {localizedDescription(product, locale)}
            </p>

            {product.features.length ? (
              <>
                <h3 className="mt-9 text-[18px] font-semibold">{t.product.features}</h3>
                <ul className="mt-4 grid gap-2.5">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-[15.5px] text-ink-soft">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span className="min-w-0 break-words">{feature}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {product.oemNumbers.length ? (
              <>
                <h3 className="mt-9 text-[18px] font-semibold">{t.product.oemNumbers}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.oemNumbers.map((oem) => (
                    <span key={oem} className="badge bg-white font-mono break-all text-ink-soft">
                      {oem}
                    </span>
                  ))}
                </div>
              </>
            ) : null}
          </div>

          <div className="flex min-w-0 flex-col gap-6">
            {Object.keys(product.specs).length ? (
              <div className="card-flat p-6">
                <h2 className="text-[17px] font-semibold">{t.product.specs}</h2>
                <dl className="mt-4 flex flex-col text-[14.5px]">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start justify-between gap-4 border-b border-line-soft py-2.5 last:border-0"
                    >
                      <dt className="shrink-0 text-muted">{key}</dt>
                      <dd className="min-w-0 text-right font-medium break-words text-ink-soft">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            <div className="card-flat p-6">
              <h2 className="text-[17px] font-semibold">{t.product.stockLabel}</h2>
              <dl className="mt-4 flex flex-col gap-2.5 text-[14.5px]">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted">{t.product.category}</dt>
                  <dd className="min-w-0 text-right font-medium break-words">{categoryLabel}</dd>
                </div>
                {product.weightKg ? (
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-muted">{t.product.weight}</dt>
                    <dd className="font-medium tabular-nums">{product.weightKg} kg</dd>
                  </div>
                ) : null}
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-muted">{t.product.condition}</dt>
                  <dd className="min-w-0 text-right font-medium break-words">
                    {t.shop.conditions[product.condition]}
                  </dd>
                </div>
                {product.sku ? (
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-muted">{t.product.sku}</dt>
                    <dd className="min-w-0 text-right font-mono font-medium break-all">{product.sku}</dd>
                  </div>
                ) : null}
                {product.createdAt ? (
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-muted">{t.product.updated}</dt>
                    <dd className="font-medium tabular-nums">
                      {shortDate(product.createdAt, locale)}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related ─────────────────────────────────────────── */}
      {related.length ? (
        <section className="section section-pad">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-[26px] font-semibold tracking-[-0.02em] sm:text-[32px]">
                {t.product.related}
              </h2>
              <p className="mt-2 text-[15.5px] text-muted">{t.product.relatedLead}</p>
            </div>
            <Link href="/shop" className="btn btn-ghost btn-sm">
              <i className="fa-solid fa-arrow-left text-[11px]" aria-hidden="true" />
              <span>{t.product.backToShop}</span>
            </Link>
          </Reveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, i) => (
              <Reveal key={item.slug} className="min-w-0" delay={i * 60}>
                <ProductCard product={item} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <JsonLd data={productJsonLd(product, locale)} />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: t.shop.breadcrumbHome, path: "/" },
            { name: t.product.breadcrumbShop, path: "/shop" },
            { name: title, path: `/shop/${product.slug}` },
          ],
          locale,
        )}
      />
    </div>
  );
}
