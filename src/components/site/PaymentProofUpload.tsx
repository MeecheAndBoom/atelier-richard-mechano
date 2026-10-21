"use client";

import { useState, useTransition } from "react";
import { submitPaymentProof, type ProofState } from "@/actions/orders";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { OrderRecord } from "@/lib/types";

/**
 * Reusable payment-proof upload form.
 *
 * Shown when the order accepts a proof upload (proofMethod === "upload" and
 * the payment is awaiting proof). On success it calls `onSuccess` (the page
 * can refresh to re-fetch the order) and reports the result inline.
 */
export function PaymentProofUpload({
  order,
  onSuccess,
}: {
  order: OrderRecord;
  onSuccess?: () => void;
}) {
  const { locale, t } = useLocale();
  const [proofState, setProofState] = useState<ProofState>(null);
  const [pending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);

  const acceptsProof =
    order.payment.proofMethod === "upload" &&
    ["awaiting-proof", "proof-submitted"].includes(
      order.payment.status ?? "pending",
    );
  const proofDone = order.payment.proof?.decision === "approved";
  const proofRejected = order.payment.proof?.decision === "rejected";

  if (!acceptsProof || proofDone) return null;

  function handleUpload(formData: FormData) {
    if (file) formData.set("file", file);
    startTransition(async () => {
      const result = await submitPaymentProof(
        order.reference,
        order.customer.email,
        formData,
      );
      setProofState(result);
      if (result?.ok) {
        setFile(null);
        onSuccess?.();
      }
    });
  }

  return (
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
  );
}
