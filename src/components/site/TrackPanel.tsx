"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { money } from "@/lib/format";
import { PaymentProofUpload } from "@/components/site/PaymentProofUpload";
import type { OrderRecord } from "@/lib/types";

const STATUS_TONE: Record<string, string> = {
  "Payment Received": "bg-[#eaf6ee] text-success",
  "Payment Proof Submitted": "bg-[#f0f6ff] text-accent",
  "Awaiting Payment Proof": "bg-[#fff4e6] text-warning",
  "Payment Pending": "bg-[#fff4e6] text-warning",
  Placed: "bg-alt text-muted",
  Cancelled: "bg-[#fdeeee] text-danger",
};

/**
 * Track-page order panel — status timeline plus the payment-proof upload
 * when the order is in an awaiting state (master prompt §7).
 */
export function TrackPanel({ order }: { order: OrderRecord }) {
  const { locale, t } = useLocale();
  const router = useRouter();
  const statusLabel =
    t.order.statuses[order.status as keyof typeof t.order.statuses] ??
    order.status;
  const proofDone = order.payment.proof?.decision === "approved";
  const paymentReceived = order.payment.status === "received" || proofDone;

  return (
    <div className="flex flex-col gap-6">
      {/* Status card */}
      <section className="rounded-card border border-line-soft p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-micro uppercase tracking-[0.08em] text-muted">
              {t.track.refLabel}
            </p>
            <p className="mt-1 font-mono text-[19px] font-semibold tracking-[0.04em]">
              {order.reference}
            </p>
          </div>
          <span
            className={`badge ${STATUS_TONE[order.status] ?? "bg-alt text-muted"}`}
          >
            {statusLabel}
          </span>
        </div>

        <dl className="mt-5 grid gap-x-8 gap-y-2 border-t border-line-soft pt-5 text-[14px] sm:grid-cols-2">
          <div className="flex justify-between gap-4 sm:justify-start">
            <dt className="text-muted">{t.checkout.name}</dt>
            <dd className="font-medium">{order.customer.name}</dd>
          </div>
          <div className="flex justify-between gap-4 sm:justify-start">
            <dt className="text-muted">{t.cart.total}</dt>
            <dd className="font-semibold tabular-nums">{money(order.total, locale)}</dd>
          </div>
          <div className="flex justify-between gap-4 sm:justify-start">
            <dt className="text-muted">{t.checkout.payment}</dt>
            <dd className="font-medium">{order.payment.label}</dd>
          </div>
          <div className="flex justify-between gap-4 sm:justify-start">
            <dt className="text-muted">{t.track.placedOn}</dt>
            <dd className="font-medium">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString(
                    locale === "fr" ? "fr-FR" : "en-GB",
                  )
                : "—"}
            </dd>
          </div>
        </dl>
      </section>

      {/* Timeline */}
      <section className="rounded-card border border-line-soft p-6">
        <h2 className="text-[17px] font-semibold">{t.track.historyTitle}</h2>
        <ol className="mt-5 flex flex-col">
          {(order.statusHistory ?? []).map((event, i, all) => (
            <li key={`${event.status}-${event.at}`} className="relative flex gap-4 pb-6 last:pb-0">
              {i < all.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute left-[7px] top-4 h-full w-px bg-line-soft"
                />
              ) : null}
              <span
                aria-hidden="true"
                className={`relative mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                  i === all.length - 1
                    ? "border-accent bg-accent"
                    : "border-line bg-white"
                }`}
              />
              <div className="min-w-0">
                <p className="text-[14.5px] font-medium text-ink">
                  {t.order.statuses[event.status as keyof typeof t.order.statuses] ?? event.status}
                </p>
                <p className="mt-0.5 text-[13px] text-muted">
                  {new Date(event.at).toLocaleString(locale === "fr" ? "fr-FR" : "en-GB")}
                </p>
                {event.note ? (
                  <p className="mt-1 text-[13px] text-ink-soft">{event.note}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Payment details — hidden once payment is received */}
      {!paymentReceived && (order.payment.paymentDetails || order.payment.instructions) ? (
        <section className="rounded-card border border-line-soft p-6">
          <h2 className="text-[17px] font-semibold">{t.track.paymentInstructions}</h2>
          <p className="mt-3 whitespace-pre-wrap text-[14.5px] leading-relaxed text-ink-soft">
            {order.payment.paymentDetails ?? order.payment.instructions}
          </p>
        </section>
      ) : null}

      {/* Proof upload */}
      <PaymentProofUpload order={order} onSuccess={() => router.refresh()} />

      {/* Proof received preview */}
      {order.payment.proof ? (
        <section className="rounded-card border border-line-soft p-6">
          <h2 className="text-[17px] font-semibold">{t.track.proofOnFile}</h2>
          <div className="mt-4 flex flex-wrap items-start gap-5">
            {order.payment.proof.url.match(/\.(jpg|jpeg|png|webp)(\?|$)/i) ||
            order.payment.proof.url.includes("cloudinary") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={order.payment.proof.url}
                alt={t.track.proofTitle}
                className="h-40 w-auto max-w-full rounded-box border border-line-soft object-contain"
              />
            ) : null}
            <div className="text-[14px] text-muted">
              <p>
                {t.track.proofUploadedAt}:{" "}
                <span className="font-medium text-ink">
                  {order.payment.proof.uploadedAt
                    ? new Date(order.payment.proof.uploadedAt).toLocaleString(
                        locale === "fr" ? "fr-FR" : "en-GB",
                      )
                    : "—"}
                </span>
              </p>
              {order.payment.proof.note ? (
                <p className="mt-1">
                  {t.track.proofNote}: <span className="text-ink-soft">{order.payment.proof.note}</span>
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
