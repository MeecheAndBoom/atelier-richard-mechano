"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { money } from "@/lib/format";
import type { SearchHit, SearchResponse } from "@/app/api/search/route";

/**
 * Site-wide type-ahead search. Self-contained: owns its trigger button, its
 * overlay and the Cmd/Ctrl-K + "/" shortcuts, and navigates to the hit on
 * Enter or tap. Results stream from /api/search.
 */
export function SearchDialog({ className = "" }: { className?: string }) {
  const { locale, t } = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const reqRef = useRef(0);

  const close = useCallback(() => setOpen(false), []);

  // Global shortcuts to open the palette.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus + scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 40);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(id);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Debounced fetch with a stale-response guard.
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const id = ++reqRef.current;
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as SearchResponse;
        if (id !== reqRef.current) return;
        setHits(data.hits);
        setActive(0);
      } catch {
        if (id === reqRef.current) setHits([]);
      } finally {
        if (id === reqRef.current) setLoading(false);
      }
    }, 180);
    return () => window.clearTimeout(timer);
  }, [query, open]);

  const parts = useMemo(() => hits.filter((h) => h.type === "part"), [hits]);
  const posts = useMemo(() => hits.filter((h) => h.type === "post"), [hits]);
  const flat = useMemo(() => [...parts, ...posts], [parts, posts]);

  function go(hit: SearchHit) {
    close();
    setQuery("");
    router.push(hit.type === "part" ? `/shop/${hit.slug}` : `/blog/${hit.slug}`);
  }

  function seeAll() {
    const q = query.trim();
    close();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(flat.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flat[active]) go(flat[active]);
      else seeAll();
    }
  }

  const label = (hit: SearchHit) =>
    locale === "en" && hit.titleEn ? hit.titleEn : hit.title;

  let index = -1;
  const row = (hit: SearchHit) => {
    index += 1;
    const i = index;
    return (
      <li key={`${hit.type}-${hit.slug}`}>
        <button
          type="button"
          onMouseEnter={() => setActive(i)}
          onClick={() => go(hit)}
          className={`flex w-full items-center gap-3.5 rounded-box px-3 py-2.5 text-left transition-colors ${
            active === i ? "bg-alt" : "hover:bg-alt"
          }`}
        >
          <span className="h-11 w-11 shrink-0 overflow-hidden rounded-box border border-line-soft bg-alt">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hit.image} alt="" className="h-full w-full object-cover" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[14.5px] font-medium text-ink">
              {label(hit)}
            </span>
            <span className="block truncate text-[13px] text-muted">{hit.meta}</span>
          </span>
          {hit.type === "part" && typeof hit.price === "number" ? (
            <span className="shrink-0 text-[13.5px] font-semibold tabular-nums text-ink">
              {money(hit.price, locale)}
            </span>
          ) : null}
        </button>
      </li>
    );
  };

  const q = query.trim();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.search.open}
        className={`grid h-9 w-9 place-items-center rounded-pill text-ink transition-all duration-150 hover:bg-alt active:scale-95 ${className}`}
      >
        <i className="fa-solid fa-magnifying-glass text-[15px]" aria-hidden="true" />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh] sm:pt-[14vh]"
          role="dialog"
          aria-modal="true"
          aria-label={t.search.open}
        >
          <div
            role="presentation"
            onClick={close}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <div className="page-enter relative w-full max-w-[620px] overflow-hidden rounded-card border border-line-soft bg-white shadow-[0_30px_80px_-24px_rgba(0,0,0,0.55)]">
            <div className="flex items-center gap-3 border-b border-line-soft px-4">
              <i
                className={`fa-solid ${loading ? "fa-circle-notch animate-spin" : "fa-magnifying-glass"} text-[14px] text-muted`}
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                type="text"
                role="combobox"
                aria-expanded={flat.length > 0}
                aria-controls="search-results"
                aria-autocomplete="list"
                placeholder={t.search.placeholder}
                className="h-14 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-muted-light"
              />
              <button
                type="button"
                onClick={close}
                aria-label={t.search.close}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-pill text-muted transition-colors hover:bg-alt hover:text-ink"
              >
                <i className="fa-solid fa-xmark text-[14px]" aria-hidden="true" />
              </button>
            </div>

            <div id="search-results" role="listbox" className="max-h-[54vh] overflow-y-auto px-2 py-2">
              {q.length < 2 ? (
                <p className="px-4 py-10 text-center text-[14px] text-muted">
                  {t.search.idle}
                </p>
              ) : flat.length === 0 ? (
                <p className="px-4 py-10 text-center text-[14px] text-muted">
                  {loading
                    ? t.search.loading
                    : t.search.noResults.replace("{q}", q)}
                </p>
              ) : (
                <>
                  {parts.length ? (
                    <>
                      <p className="px-3 pt-2 pb-1 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted-light">
                        {t.search.parts}
                      </p>
                      <ul>{parts.map(row)}</ul>
                    </>
                  ) : null}
                  {posts.length ? (
                    <>
                      <p className="px-3 pt-3 pb-1 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted-light">
                        {t.search.posts}
                      </p>
                      <ul>{posts.map(row)}</ul>
                    </>
                  ) : null}
                </>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-line-soft bg-alt/60 px-4 py-2.5">
              <span className="text-[12px] text-muted">{t.search.hint}</span>
              {q.length >= 2 ? (
                <button
                  type="button"
                  onClick={seeAll}
                  className="flex items-center gap-1.5 text-[12.5px] font-medium text-accent hover:text-accent-hover"
                >
                  {t.search.seeAll}
                  <i className="fa-solid fa-arrow-right text-[10px]" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
