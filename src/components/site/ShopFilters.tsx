"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { PART_CONDITIONS } from "@/lib/constants";

type Facets = {
  makes: string[];
  models: string[];
  brands: string[];
  categories: string[];
};

/**
 * URL-driven filter rail. Every change writes straight to the query string
 * (server re-filters), so filtered views stay linkable and back/forward work.
 * On mobile the rail collapses behind a disclosure instead of a modal.
 */
export function ShopFilters({ facets }: { facets: Facets }) {
  const { t } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(params.get("q") ?? "");

  useEffect(() => {
    // Sync the search box when the URL changes (back/forward, facet links) —
    // one frame later so React treats it as an external update.
    const raf = requestAnimationFrame(() => setQuery(params.get("q") ?? ""));
    return () => cancelAnimationFrame(raf);
  }, [params]);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function clear() {
    setQuery("");
    router.replace(pathname, { scroll: false });
  }

  const activeCount = [...params.keys()].filter((k) => k !== "sort").length;
  const select =
    "field cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236e6e73%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_0.9rem_center] bg-no-repeat pr-9";

  const rail = (
    <div className="flex flex-col gap-5">
      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          update("q", query.trim());
        }}
        className="flex gap-2"
      >
        <label htmlFor="shop-q" className="sr-only">
          {t.common.search}
        </label>
        <input
          id="shop-q"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.common.searchPlaceholder}
          className="field"
        />
        <button type="submit" className="btn btn-primary btn-sm shrink-0" aria-label={t.common.search}>
          <i className="fa-solid fa-magnifying-glass text-[12px]" aria-hidden="true" />
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="f-make" className="field-label">
            {t.shop.filterMake}
          </label>
          <select
            id="f-make"
            className={`${select} text-[14.5px]`}
            value={params.get("make") ?? ""}
            onChange={(e) => update("make", e.target.value)}
          >
            <option value="">{t.common.all}</option>
            {facets.makes.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-brand" className="field-label">
            {t.shop.filterBrand}
          </label>
          <select
            id="f-brand"
            className={`${select} text-[14.5px]`}
            value={params.get("brand") ?? ""}
            onChange={(e) => update("brand", e.target.value)}
          >
            <option value="">{t.common.all}</option>
            {facets.brands.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-category" className="field-label">
            {t.shop.filterCategory}
          </label>
          <select
            id="f-category"
            className={`${select} text-[14.5px]`}
            value={params.get("category") ?? ""}
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="">{t.common.all}</option>
            {facets.categories.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-condition" className="field-label">
            {t.shop.filterCondition}
          </label>
          <select
            id="f-condition"
            className={`${select} text-[14.5px]`}
            value={params.get("condition") ?? ""}
            onChange={(e) => update("condition", e.target.value)}
          >
            <option value="">{t.common.all}</option>
            {PART_CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {t.shop.conditions[c]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="f-min" className="field-label">
            {t.shop.filterPrice} — {t.shop.priceMin} (€)
          </label>
          <input
            id="f-min"
            type="number"
            min={0}
            inputMode="numeric"
            defaultValue={params.get("min") ?? ""}
            onBlur={(e) => update("min", e.target.value)}
            className="field"
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="f-max" className="field-label">
            {t.shop.filterPrice} — {t.shop.priceMax} (€)
          </label>
          <input
            id="f-max"
            type="number"
            min={0}
            inputMode="numeric"
            defaultValue={params.get("max") ?? ""}
            onBlur={(e) => update("max", e.target.value)}
            className="field"
            placeholder="500"
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 text-[14.5px] text-ink-soft">
        <input
          type="checkbox"
          checked={params.get("stock") === "1"}
          onChange={(e) => update("stock", e.target.checked ? "1" : "")}
          className="h-4 w-4 accent-[var(--color-accent,#0071e3)]"
        />
        {t.shop.filterInStock}
      </label>

      {activeCount > 0 ? (
        <button type="button" onClick={clear} className="btn btn-ghost btn-sm self-start">
          <i className="fa-solid fa-xmark text-[12px]" aria-hidden="true" />
          <span>{t.common.clearFilters}</span>
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile disclosure — pinned under the fixed top bar so the filter
          control never scrolls out of reach on small screens. */}
      <div className="sticky top-[52px] z-30 -mx-4 flex items-center justify-between gap-3 border-b border-line-soft bg-white/85 px-4 py-2.5 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={`btn btn-sm ${open || activeCount ? "btn-primary" : "btn-ghost"}`}
        >
          <i className={`fa-solid ${open ? "fa-sliders" : "fa-filter"} text-[12px]`} aria-hidden="true" />
          <span>
            {t.shop.filters}
            {activeCount ? ` (${activeCount})` : ""}
          </span>
        </button>
        {activeCount > 0 ? (
          <button type="button" onClick={clear} className="btn btn-ghost btn-sm">
            <i className="fa-solid fa-xmark text-[12px]" aria-hidden="true" />
            <span>{t.common.clearFilters}</span>
          </button>
        ) : null}
      </div>

      <aside
        className={`${open ? "block" : "hidden"} rounded-card border border-line-soft p-5 lg:block lg:sticky lg:top-20 lg:h-fit`}
      >
        <div className="flex flex-col gap-5">{rail}</div>
      </aside>
    </div>
  );
}
