"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { Accordion } from "@/components/ui/Accordion";

export type FaqGroup = { key: string; label: string; items: { q: string; a: string }[] };

/**
 * Help-center explorer — instant client-side search across every FAQ, with
 * category anchors as chips. Falls back to the full list while the query is
 * short, so it never shows an empty state on first paint.
 */
export function FaqExplorer({ groups }: { groups: FaqGroup[] }) {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups
      .filter((g) => !active || g.key === active)
      .map((g) => ({
        ...g,
        items: q
          ? g.items.filter(
              (item) =>
                item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q),
            )
          : g.items,
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, query, active]);

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-4">
        <label htmlFor="faq-search" className="sr-only">
          {t.help.searchPlaceholder}
        </label>
        <div className="relative">
          <i
            className="fa-solid fa-magnifying-glass pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[14px] text-muted-light"
            aria-hidden="true"
          />
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.help.searchPlaceholder}
            className="field pl-10"
          />
        </div>

        <div className="rail flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActive("")}
            aria-pressed={active === ""}
            className={`btn btn-sm shrink-0 ${active === "" ? "btn-dark" : "btn-ghost"}`}
          >
            {t.common.all}
          </button>
          {groups.map((group) => (
            <button
              key={group.key}
              type="button"
              onClick={() => setActive(active === group.key ? "" : group.key)}
              aria-pressed={active === group.key}
              className={`btn btn-sm shrink-0 ${active === group.key ? "btn-dark" : "btn-ghost"}`}
            >
              {group.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-line-soft px-6 py-14 text-center">
          <p className="text-[16px] text-ink-soft">{t.help.noResults}</p>
          <p className="mt-2 text-[14.5px] text-muted">{t.help.contactLead}</p>
          <a href="/contact" className="btn btn-primary btn-sm mt-5">
            <i className="fa-solid fa-paper-plane text-[12px]" aria-hidden="true" />
            <span>{t.common.contactUs}</span>
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {filtered.map((group) => (
            <section key={group.key} id={`faq-${group.key}`} className="scroll-mt-24">
              <h2 className="text-[21px] font-semibold tracking-[-0.015em]">{group.label}</h2>
              <div className="mt-2 divide-y divide-line-soft border-t border-b border-line-soft">
                {group.items.map((item) => (
                  <Accordion key={item.q} question={item.q}>
                    <p className="pb-5 text-[15.5px] leading-[1.7] text-muted">{item.a}</p>
                  </Accordion>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
