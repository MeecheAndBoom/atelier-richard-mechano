"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useCart, cartSubtotal, cartCount } from "@/store/cart";
import { money } from "@/lib/format";
import { useToast } from "@/components/ui/Toast";

/**
 * Slide-in bag drawer. Open state lives above the store so the backdrop
 * can animate independently; Escape and backdrop click both dismiss it.
 */
export function CartDrawer() {
  const { locale, t } = useLocale();
  const lines = useCart((s) => s.lines);
  const remove = useCart((s) => s.remove);
  const setQty = useCart((s) => s.setQty);
  const [open, setOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const subtotal = cartSubtotal(lines);
  const count = cartCount(lines);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative grid h-9 w-9 place-items-center rounded-pill text-ink transition-all duration-150 hover:bg-alt active:scale-95 md:hidden"
        aria-label={t.nav.cart}
      >
        <i className="fa-solid fa-bag-shopping text-[15px]" aria-hidden="true" />
        {count > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 grid h-[17px] min-w-[17px] place-items-center rounded-pill bg-accent px-1 text-[10px] font-semibold text-white tabular-nums" aria-hidden="true">
            {count > 9 ? "9+" : count}
          </span>
        ) : null}
      </button>

      {/* Backdrop */}
      <div
        role="presentation"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-[320ms] ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        aria-hidden={!open}
        aria-label={t.cart.drawerTitle}
        className={`fixed top-0 right-0 z-[61] flex h-full w-full max-w-[400px] flex-col bg-white shadow-[0_0_60px_rgba(0,0,0,0.18)] transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-line-soft px-6 py-5">
          <h2 className="text-[19px] font-semibold tracking-[-0.01em]">
            {t.cart.drawerTitle}
            {count > 0 ? (
              <span className="ml-2 text-[14px] font-normal text-muted tabular-nums">
                ({count})
              </span>
            ) : null}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-pill text-muted transition-all duration-150 hover:bg-alt hover:text-ink active:scale-95"
            aria-label={t.nav.close}
          >
            <i className="fa-solid fa-xmark text-[16px]" aria-hidden="true" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-alt text-[20px] text-muted-light">
              <i className="fa-solid fa-bag-shopping" aria-hidden="true" />
            </span>
            <p className="text-[15px] text-muted">{t.cart.drawerEmpty}</p>
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="btn btn-primary btn-sm"
            >
              {t.cart.browse}
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 py-4">
              {lines.map((line) => (
                <li
                  key={line.slug}
                  className="flex gap-4 border-b border-line-soft py-4 last:border-b-0"
                >
                  <Link
                    href={`/shop/${line.slug}`}
                    onClick={() => setOpen(false)}
                    className="h-16 w-16 shrink-0 overflow-hidden rounded-box border border-line-soft bg-alt"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={line.image} alt="" className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/shop/${line.slug}`}
                      onClick={() => setOpen(false)}
                      className="line-clamp-2 text-[14px] font-medium leading-snug hover:text-accent"
                    >
                      {line.title}
                    </Link>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <div className="flex h-7 items-center rounded-pill border border-line">
                        <button
                          type="button"
                          onClick={() => setQty(line.slug, line.qty - 1)}
                          className="grid h-7 w-7 place-items-center rounded-pill text-muted transition-colors hover:text-ink disabled:opacity-30"
                          disabled={line.qty <= 1}
                          aria-label="−"
                        >
                          <i className="fa-solid fa-minus text-[9px]" aria-hidden="true" />
                        </button>
                        <span className="w-6 text-center text-[13px] font-medium tabular-nums">
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(line.slug, line.qty + 1)}
                          className="grid h-7 w-7 place-items-center rounded-pill text-muted transition-colors hover:text-ink disabled:opacity-30"
                          disabled={line.qty >= Math.min(line.stock || 99, 99)}
                          aria-label="+"
                        >
                          <i className="fa-solid fa-plus text-[9px]" aria-hidden="true" />
                        </button>
                      </div>
                      <span className="text-[14px] font-semibold tabular-nums">
                        {money(line.price * line.qty, locale)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(line.slug)}
                    className="self-start p-1 text-muted-light transition-colors hover:text-danger"
                    aria-label={`${t.cart.remove}: ${line.title}`}
                  >
                    <i className="fa-regular fa-trash-can text-[13px]" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>

            <footer className="border-t border-line-soft px-6 py-5">
              <div className="flex items-center justify-between text-[15px]">
                <span className="text-muted">{t.cart.drawerSubtotal}</span>
                <span className="text-[17px] font-semibold tabular-nums">
                  {money(subtotal, locale)}
                </span>
              </div>
              <p className="mt-1 text-[12.5px] text-muted">{t.cart.shippingNote}</p>
              <div className="mt-4 flex flex-col gap-2.5">
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="btn btn-primary w-full"
                >
                  {t.cart.drawerCheckout}
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="btn btn-ghost w-full"
                >
                  {t.cart.drawerView}
                </Link>
              </div>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
