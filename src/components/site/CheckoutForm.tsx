"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { placeOrder, type CheckoutResult } from "@/actions/orders";
import { useCart, cartSubtotal } from "@/store/cart";
import { money } from "@/lib/format";
import type { PaymentMethodSetting } from "@/lib/settings";

/**
 * Checkout form — customer details, pickup/delivery, payment method with
 * "Other" reveal, and a hidden JSON cart payload. On success the cart is
 * cleared and the reference drives the redirect (done in the page).
 */
export function CheckoutForm({
  paymentMethods,
  deliveryFee,
  freeThreshold,
}: {
  paymentMethods: PaymentMethodSetting[];
  deliveryFee: number;
  freeThreshold: number;
}) {
  const { locale, t } = useLocale();
  const router = useRouter();
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const [state, formAction, pending] = useActionState<CheckoutResult | null, FormData>(
    placeOrder,
    null,
  );
  const [delivery, setDelivery] = useState<"pickup" | "delivery">("pickup");
  const [method, setMethod] = useState<string>(paymentMethods[0]?.id ?? "");

  const enabledMethods = paymentMethods.filter((m) => m.enabled);
  const subtotal = cartSubtotal(lines);
  const fee =
    delivery === "delivery" && subtotal < freeThreshold ? deliveryFee : 0;
  const total = subtotal + fee;
  const itemsJson = useMemo(
    () => JSON.stringify(lines.map((l) => ({ slug: l.slug, qty: l.qty }))),
    [lines],
  );

  // Success: empty the cart and hand off to the confirmation page.
  useEffect(() => {
    if (state?.ok) {
      clear();
      router.replace(`/checkout/success/${state.reference}`);
    }
  }, [state, clear, router]);

  if (state?.ok) {
    return null;
  }

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <input type="hidden" name="items" value={itemsJson} />
      <input type="hidden" name="deliveryMethod" value={delivery} />
      <input type="hidden" name="paymentMethod" value={method} />

      {state && !state.ok ? (
        <p role="alert" className="rounded-box bg-[#fdeeee] px-4 py-3 text-[14px] text-danger">
          {state.error}
        </p>
      ) : null}

      {/* Contact */}
      <section className="rounded-card border border-line-soft p-6">
        <h2 className="mb-5 flex items-center gap-2.5 text-[17px] font-semibold">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-[11px] font-semibold text-white tabular-nums">
            1
          </span>
          {t.checkout.yourInfo}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="field-label">
              {t.checkout.name} *
            </label>
            <input id="name" name="name" required autoComplete="name" className="field" />
          </div>
          <div>
            <label htmlFor="email" className="field-label">
              {t.checkout.email} *
            </label>
            <input id="email" name="email" type="email" required autoComplete="email" className="field" />
          </div>
          <div>
            <label htmlFor="phone" className="field-label">
              {t.checkout.phone}
              <span className="ml-1.5 text-[13px] font-normal text-muted">
                ({t.common.optional})
              </span>
            </label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" className="field" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="notes" className="field-label">
              {t.checkout.notes}
              <span className="ml-1.5 text-[13px] font-normal text-muted">
                ({t.common.optional})
              </span>
            </label>
            <textarea id="notes" name="notes" rows={3} className="field resize-y" />
          </div>
        </div>
      </section>

      {/* Delivery */}
      <section className="rounded-card border border-line-soft p-6">
        <h2 className="mb-5 flex items-center gap-2.5 text-[17px] font-semibold">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-[11px] font-semibold text-white tabular-nums">
            2
          </span>
          {t.checkout.delivery}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["pickup", "delivery"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setDelivery(option)}
              aria-pressed={delivery === option}
              className={`rounded-card flex items-start gap-3 border-2 p-4 text-left transition-all duration-150 active:scale-[0.99] ${
                delivery === option
                  ? "border-accent bg-[#f0f6ff]"
                  : "border-line-soft hover:border-line"
              }`}
            >
              <span
                className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 ${
                  delivery === option ? "border-accent" : "border-line"
                }`}
              >
                {delivery === option ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                ) : null}
              </span>
              <span>
                <span className="block text-[15px] font-medium text-ink">
                  {option === "pickup" ? t.checkout.methodPickup : t.checkout.methodDelivery}
                </span>
                <span className="mt-0.5 block text-[13px] text-muted">
                  {option === "pickup" ? t.checkout.pickupHint : t.checkout.deliveryHint}
                </span>
              </span>
            </button>
          ))}
        </div>

        {delivery === "delivery" ? (
          <div className="mt-5 grid gap-5 border-t border-line-soft pt-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="addressLine1" className="field-label">
                {t.checkout.addressLine} *
              </label>
              <input id="addressLine1" name="addressLine1" required autoComplete="address-line1" className="field" />
            </div>
            <div>
              <label htmlFor="city" className="field-label">
                {t.checkout.city} *
              </label>
              <input id="city" name="city" required autoComplete="address-level2" className="field" />
            </div>
            <div>
              <label htmlFor="zip" className="field-label">
                {t.checkout.zip} *
              </label>
              <input id="zip" name="zip" required autoComplete="postal-code" className="field" />
            </div>
            <div>
              <label htmlFor="state" className="field-label">
                {t.checkout.state}
              </label>
              <input id="state" name="state" autoComplete="address-level1" className="field" />
            </div>
            <div>
              <label htmlFor="country" className="field-label">
                {t.checkout.country}
              </label>
              <input id="country" name="country" defaultValue="France" autoComplete="country-name" className="field" />
            </div>
          </div>
        ) : null}
      </section>

      {/* Payment */}
      <section className="rounded-card border border-line-soft p-6">
        <h2 className="mb-5 flex items-center gap-2.5 text-[17px] font-semibold">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-[11px] font-semibold text-white tabular-nums">
            3
          </span>
          {t.checkout.payment}
        </h2>
        <div className="flex flex-col gap-2.5">
          {enabledMethods.map((m) => (
            <label
              key={m.id}
              className={`flex cursor-pointer items-start gap-3 rounded-card border-2 p-4 transition-all duration-150 ${
                method === m.id
                  ? "border-accent bg-[#f0f6ff]"
                  : "border-line-soft hover:border-line"
              }`}
            >
              <input
                type="radio"
                name="payment-choice"
                checked={method === m.id}
                onChange={() => setMethod(m.id)}
                className="sr-only"
              />
              <span
                className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 ${
                  method === m.id ? "border-accent" : "border-line"
                }`}
              >
                {method === m.id ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                ) : null}
              </span>
              <span className="flex-1">
                <span className="block text-[15px] font-medium text-ink">
                  {locale === "en" && m.labelEn ? m.labelEn : m.label}
                </span>
                <span className="mt-0.5 block text-[13px] text-muted">
                  {locale === "en" && m.hintEn ? m.hintEn : m.hint}
                </span>
                {method === m.id && m.sendEmailAfterOrder === false ? (
                  <div className="mt-3 rounded-box border border-line-soft bg-white/70 p-3 text-[13.5px] leading-relaxed text-ink-soft">
                    <p className="mb-1.5 text-[13px] font-medium text-ink">
                      {locale === "en" ? "Payment details" : "Coordonnées de paiement"}
                    </p>
                    <p className="whitespace-pre-wrap">
                      {locale === "en"
                        ? m.defaultPaymentDetailsEn || m.defaultPaymentDetails
                        : m.defaultPaymentDetails || m.defaultPaymentDetailsEn}
                    </p>
                    <p className="mt-2 text-[12.5px] text-muted">
                      {locale === "en"
                        ? "Pay using the details above, then upload your payment screenshot right on the confirmation page or on your Track Order page."
                        : "Payez avec les coordonnées ci-dessus, puis importez votre preuve de paiement dès la page de confirmation ou sur votre page « Suivre ma commande »."}
                    </p>
                  </div>
                ) : null}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Totals + submit */}
      <section className="rounded-card border border-line-soft p-6">
        <dl className="flex flex-col gap-2.5 text-[15px]">
          <div className="flex justify-between">
            <dt className="text-muted">{t.cart.subtotal}</dt>
            <dd className="font-medium tabular-nums">{money(subtotal, locale)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">{t.cart.shipping}</dt>
            <dd className="font-medium tabular-nums">
              {fee > 0 ? money(fee, locale) : t.common.free}
            </dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-line-soft pt-3 text-[17px]">
            <dt className="font-semibold">{t.cart.total}</dt>
            <dd className="font-semibold tabular-nums">{money(total, locale)}</dd>
          </div>
        </dl>

        <button type="submit" disabled={pending || lines.length === 0} className="btn btn-primary btn-lg mt-6 w-full">
          {pending ? (
            <i className="fa-solid fa-circle-notch animate-spin text-[13px]" aria-hidden="true" />
          ) : (
            <i className="fa-solid fa-lock text-[12px]" aria-hidden="true" />
          )}
          <span>{pending ? t.checkout.placing : t.checkout.placeOrder}</span>
        </button>
        <p className="mt-3 text-center text-[13px] text-muted">{t.checkout.byPlacing}</p>
      </section>
    </form>
  );
}
