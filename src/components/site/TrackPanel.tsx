"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { submitPaymentProof, type ProofState } from "@/actions/orders";
import { money } from "@/lib/format";
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
  const [proofState, setProofState] = useState<ProofState>(null);
  const [pending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);

  const acceptsProof =
    order.payment.proofMethod === "upload" ||
    ["awaiting-proof", "proof-submitted", "pending"].includes(
      order.payment.status ?? "pending",
    );
  const proofDone = order.payment.proof?.decision === "approved";
  const proofRejected = order.payment.proof?.decision === "rejected";
  const statusLabel =
    t.order.statuses[order.status as keyof typeof t.order.statuses] ??
    order.status;

  function handleUpload(formData: FormData) {
    if (file) formData.set("file", file);
    startTransition(async () => {
      const result = await submitPaymentProof(order.reference, order.customer.email, formData);
      setProofState(result);
      if (result?.ok) {
        setFile(null);
        router.refresh();
      }
    });
  }

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

      {/* Payment details */}
      {order.payment.paymentDetails || order.payment.instructions ? (
        <section className="rounded-card border border-line-soft p-6">
          <h2 className="text-[17px] font-semibold">{t.track.paymentInstructions}</h2>
          <p className="mt-3 whitespace-pre-wrap text-[14.5px] leading-relaxed text-ink-soft">
            {order.payment.paymentDetails ?? order.payment.instructions}
          </p>
        </section>
      ) : null}

      {/* Proof upload */}
      {acceptsProof && !proofDone ? (
        <section className="rounded-card border border-line-soft p-6">
          <h2 className="flex items-center gap-2.5 text-[17px] font-semibold">
            {t.track.proofTitle}
            {proofRejected ? (
              <span className="badge bg-[#fdeeee] text-danger">
                {t.track.proofRejected}
              </span>
            ) : null}
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            {proofRejected && order.payment.proof?.decisionNote
              ? `${t.track.proofRejected}: ${order.payment.proof.decisionNote}`
              : t.track.proofLead}
          </p>

          <form action={handleUpload} className="mt-5 flex flex-col gap-4">
            <div>
              <label htmlFor="proof-file" className="field-label">
                {t.track.proofFile}
              </label>
              <input
                id="proof-file"
                name="file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="field cursor-pointer file:mr-4 file:cursor-pointer file:rounded-pill file:border-0 file:bg-alt file:px-4 file:py-1.5 file:text-[13px] file:font-medium file:text-ink"
              />
              <p className="mt-1.5 text-[13px] text-muted">{t.track.proofDrop}</p>
            </div>
            <div>
              <label htmlFor="proof-note" className="field-label">
                {t.track.proofNote}
                <span className="ml-1.5 text-[13px] font-normal text-muted">
                  ({t.common.optional})
                </span>
              </label>
              <textarea id="proof-note" name="note" rows={2} className="field resize-y" />
            </div>

            {proofState?.error ? (
              <p role="alert" className="rounded-box bg-[#fdeeee] px-4 py-3 text-[14px] text-danger">
                {proofState.error}
              </p>
            ) : null}
            {proofState?.ok ? (
              <p role="status" className="rounded-box flex items-center gap-2.5 bg-[#eaf6ee] px-4 py-3 text-[14px] text-success">
                <i className="fa-solid fa-circle-check" aria-hidden="true" />
                {t.track.proofDone}
              </p>
            ) : null}

            <button type="submit" disabled={pending} className="btn btn-primary self-start">
              {pending ? (
                <i className="fa-solid fa-circle-notch animate-spin text-[12px]" aria-hidden="true" />
              ) : (
                <i className="fa-solid fa-upload text-[12px]" aria-hidden="true" />
              )}
              <span>{t.track.proofButton}</span>
            </button>
          </form>
        </section>
      ) : null}

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
