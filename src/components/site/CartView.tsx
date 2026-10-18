"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useCart, cartSubtotal } from "@/store/cart";
import { money } from "@/lib/format";

/** Full cart page — line items with steppers plus the totals rail. */
export function CartView({
  deliveryFee,
  freeThreshold,
}: {
  deliveryFee: number;
  freeThreshold: number;
}) {
  const { locale, t } = useLocale();
  const lines = useCart((s) => s.lines);
  const remove = useCart((s) => s.remove);
  const setQty = useCart((s) => s.setQty);
  const clear = useCart((s) => s.clear);

  const subtotal = cartSubtotal(lines);

  if (lines.length === 0) {
    return (
      <div className="rounded-card flex flex-col items-center gap-5 border border-line-soft px-8 py-20 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-alt text-[22px] text-muted-light">
          <i className="fa-solid fa-bag-shopping" aria-hidden="true" />
        </span>
        <p className="text-[17px] text-muted">{t.cart.empty}</p>
        <Link href="/shop" className="btn btn-primary">
          {t.cart.browse}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <div>
        <ul className="flex flex-col">
          {lines.map((line) => (
            <li
              key={line.slug}
              className="flex gap-4 border-b border-line-soft py-6 first:pt-0 sm:gap-5"
            >
              <Link
                href={`/shop/${line.slug}`}
                className="h-24 w-24 shrink-0 overflow-hidden rounded-box border border-line-soft bg-alt sm:h-28 sm:w-28"
                tabIndex={-1}
                aria-hidden="true"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={line.image} alt="" className="h-full w-full object-cover" />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/shop/${line.slug}`}
                    className="text-[16px] font-medium leading-snug hover:text-accent"
                  >
                    {line.title}
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(line.slug)}
                    className="p-1 text-muted-light transition-colors hover:text-danger"
                    aria-label={`${t.cart.remove}: ${line.title}`}
                  >
                    <i className="fa-regular fa-trash-can text-[14px]" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between gap-4 pt-3">
                  <div className="flex h-8 items-center rounded-pill border border-line">
                    <button
                      type="button"
                      onClick={() => setQty(line.slug, line.qty - 1)}
                      disabled={line.qty <= 1}
                      className="grid h-8 w-8 place-items-center rounded-pill text-muted transition-colors hover:text-ink disabled:opacity-30"
                      aria-label="−"
                    >
                      <i className="fa-solid fa-minus text-[10px]" aria-hidden="true" />
                    </button>
                    <span className="w-7 text-center text-[14px] font-medium tabular-nums">
                      {line.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(line.slug, line.qty + 1)}
                      disabled={line.qty >= Math.min(line.stock || 99, 99)}
                      className="grid h-8 w-8 place-items-center rounded-pill text-muted transition-colors hover:text-ink disabled:opacity-30"
                      aria-label="+"
                    >
                      <i className="fa-solid fa-plus text-[10px]" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] text-muted tabular-nums">
                      {money(line.price, locale)} × {line.qty}
                    </p>
                    <p className="text-[17px] font-semibold tabular-nums">
                      {money(line.price * line.qty, locale)}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Link href="/shop" className="btn btn-ghost btn-sm">
            <i className="fa-solid fa-arrow-left text-[12px]" aria-hidden="true" />
            <span>{t.cart.continueShopping}</span>
          </Link>
          <button
            type="button"
            onClick={clear}
            className="text-[13px] text-muted underline-offset-4 transition-colors hover:text-danger hover:underline"
          >
            {t.cart.clear}
          </button>
        </div>
      </div>

      {/* Totals rail */}
      <aside className="h-fit rounded-card border border-line-soft p-6 lg:sticky lg:top-20">
        <h2 className="text-[17px] font-semibold">{t.cart.summary}</h2>
        <dl className="mt-4 flex flex-col gap-2.5 text-[15px]">
          <div className="flex justify-between">
            <dt className="text-muted">{t.cart.subtotal}</dt>
            <dd className="font-medium tabular-nums">{money(subtotal, locale)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">{t.cart.shipping}</dt>
            <dd className="text-[13px] text-muted">
              {subtotal >= freeThreshold
                ? t.common.free
                : `${money(deliveryFee, locale)} — ${t.cart.freeFrom.replace("{amount}", money(freeThreshold, locale))}`}
            </dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-line-soft pt-3 text-[17px]">
            <dt className="font-semibold">{t.cart.total}</dt>
            <dd className="font-semibold tabular-nums">{money(subtotal, locale)}</dd>
          </div>
        </dl>
        <Link href="/checkout" className="btn btn-primary btn-lg mt-5 w-full">
          <i className="fa-solid fa-arrow-right text-[12px]" aria-hidden="true" />
          <span>{t.cart.proceedCheckout}</span>
        </Link>
        <p className="mt-3 text-center text-[12.5px] text-muted">{t.cart.shippingNote}</p>
      </aside>
    </div>
  );
}
