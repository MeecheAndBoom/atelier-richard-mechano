import type { Metadata } from "next";
import Link from "next/link";
import { getDict, getLocale } from "@/lib/i18n/server";
import { getProducts } from "@/lib/products";
import { getFacets } from "@/lib/categories";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/site/PageHeader";
import { ShopFilters } from "@/components/site/ShopFilters";
import { ShopResults, ShopViewToggle } from "@/components/ui/ShopResults";
import type { Product } from "@/lib/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDict();
  return pageMetadata({
    title: t.shop.title,
    description: t.meta.shortDescription,
    path: "/shop",
    locale,
  });
}

const first = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? (value[0] ?? "") : (value ?? "");

/** Pure query-string → product filter, shared by render and tests. */
function applyFilters(
  products: Product[],
  sp: Record<string, string | string[] | undefined>,
): Product[] {
  const q = first(sp.q).trim().toLowerCase();
  const make = first(sp.make);
  const brand = first(sp.brand);
  const category = first(sp.category);
  const condition = first(sp.condition);
  const min = Number(first(sp.min)) || 0;
  const max = Number(first(sp.max)) || Infinity;
  const inStock = first(sp.stock) === "1";
  const sort = first(sp.sort) || "featured";

  let list = products.filter((p) => {
    if (make && p.make !== make) return false;
    if (brand && p.brand !== brand) return false;
    if (category && p.category !== category) return false;
    if (condition && p.condition !== condition) return false;
    if (p.price < min || p.price > max) return false;
    if (inStock && p.stock <= 0) return false;
    if (q) {
      const haystack = [
        p.title,
        p.titleEn ?? "",
        p.partNumber,
        p.sku ?? "",
        p.brand,
        p.make,
        p.model,
        p.category,
        p.subcategory ?? "",
        p.description,
        ...p.tags,
        ...p.oemNumbers,
        ...p.fitment,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  list = [...list].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name":
        return a.title.localeCompare(b.title, "fr");
      case "newest":
        return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
      default:
        return Number(b.featured) - Number(a.featured) || a.price - b.price;
    }
  });

  return list;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const t = await getDict();
  const all = await getProducts();
  const facets = await getFacets(
    all.map((p) => ({ make: p.make, brand: p.brand, category: p.category, model: p.model })),
  );
  const results = applyFilters(all, sp);
  const countLabel =
    results.length === 1
      ? t.shop.resultsOne
      : t.shop.results.replace("{count}", String(results.length));

  return (
    <div>
      <PageHeader title={t.shop.title} lead={t.shop.lead}>
        <ShopViewToggle />
      </PageHeader>

      <div className="section grid gap-8 py-10 lg:grid-cols-[280px_1fr] lg:gap-10">
        <ShopFilters
          facets={{
            makes: facets.makes,
            models: facets.models,
            brands: facets.brands,
            categories: facets.categories,
          }}
        />

        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className="text-[14.5px] text-muted">
              <span className="sr-only">{countLabel}</span>
              <span aria-hidden="true" className="font-semibold text-ink tabular-nums">
                {results.length}
              </span>
              <span aria-hidden="true">
                {" "}
                {countLabel.replace(/^\d+\s*/, "")}
              </span>
            </p>
          </div>

          {results.length ? (
            <ShopResults products={results} />
          ) : (
            <div className="rounded-card flex flex-col items-center gap-4 border border-line-soft px-6 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-alt text-[20px] text-muted-light">
                <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
              </span>
              <p className="text-[16.5px] text-ink-soft">{t.shop.noResults}</p>
              <p className="max-w-[420px] text-[14.5px] text-muted">{t.shop.noResultsHint}</p>
              <Link href="/shop" className="btn btn-primary btn-sm mt-1">
                <i className="fa-solid fa-rotate-left text-[12px]" aria-hidden="true" />
                <span>{t.common.clearFilters}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
