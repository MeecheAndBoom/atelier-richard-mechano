import type { Metadata } from "next";
import Link from "next/link";
import { getDict, getLocale } from "@/lib/i18n/server";
import { findOrder } from "@/lib/orders";
import { pageMetadata } from "@/lib/seo";
import { money } from "@/lib/format";
import { CopyButton } from "@/components/site/CopyButton";
import { PaymentProofUpload } from "@/components/site/PaymentProofUpload";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDict();
  return pageMetadata({
    title: t.success.title,
    description: t.success.lead,
    path: "/checkout/success",
    locale,
    noIndex: true,
  });
}

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  const t = await getDict();
  const locale = await getLocale();
  const reference = ref.toUpperCase();
  const order = await findOrder(reference);

  return (
    <div className="section max-w-[820px] py-14 sm:py-20">
      <div className="page-enter flex flex-col items-center text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-[#eaf6ee] text-[30px] text-success">
          <i className="fa-solid fa-circle-check" aria-hidden="true" />
        </span>

        <h1 className="mt-7 text-[34px] leading-tight font-semibold tracking-[-0.03em] sm:text-[46px]">
          {t.success.title}
        </h1>
        <p className="mt-4 max-w-[540px] text-[16.5px] leading-relaxed text-muted">
          {t.success.lead}{" "}
          <span className="font-medium text-ink">{order?.customer.email}</span>.
        </p>

        <div className="mt-8 w-full rounded-card border border-line-soft bg-alt px-6 py-6">
          <p className="text-micro uppercase tracking-[0.1em] text-muted">
            {t.success.yourRef}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <p className="font-mono text-[30px] font-semibold tracking-[0.06em] tabular-nums">
              {reference}
            </p>
            <CopyButton value={reference} label={t.common.save} />
          </div>
          {order ? (
            <p className="mt-3 text-[14.5px] text-muted tabular-nums">
              {t.cart.total}:{" "}
              <span className="font-semibold text-ink">{money(order.total, locale)}</span>
              {" · "}
              {t.checkout.payment}: <span className="font-medium text-ink">{order.payment.label}</span>
            </p>
          ) : null}
          {order && order.payment.proofMethod === "upload" && (order.payment.paymentDetails || order.payment.instructions) ? (
            <div className="mt-4 rounded-box border border-line-soft bg-white p-4 text-left">
              <p className="text-[14px] font-medium text-ink">
                {locale === "en" ? "Payment details" : "Détails de paiement"}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-[13.5px] leading-relaxed text-ink-soft">
                {order.payment.paymentDetails ?? order.payment.instructions}
              </p>
              <p className="mt-2 text-[12.5px] text-muted">
                {locale === "en"
                  ? "Pay using the details above, then upload your payment screenshot here or on your Track Order page."
                  : "Payez avec les coordonnées ci-dessus, puis importez votre preuve de paiement ici ou sur votre page « Suivre ma commande »."}
              </p>
            </div>
          ) : null}

          {order && order.payment.proofMethod === "upload" ? (
            <div className="mt-6">
              <PaymentProofUpload order={order} />
            </div>
          ) : null}
          <p className="mt-3 text-[13.5px] text-muted-light">{t.success.saveRef}</p>
        </div>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/track" className="btn btn-primary">
            <i className="fa-solid fa-location-crosshairs text-[12px]" aria-hidden="true" />
            <span>{t.success.track}</span>
          </Link>
          <Link href="/shop" className="btn btn-ghost">
            <i className="fa-solid fa-bag-shopping text-[12px]" aria-hidden="true" />
            <span>{t.success.keepBrowsing}</span>
          </Link>
        </div>

        <p className="mt-7 text-[14px] text-muted">{t.success.questions}</p>
      </div>

      {/* Next steps */}
      <ol className="mt-14 grid gap-4 sm:grid-cols-3">
        {t.success.steps.map((step, i) => (
          <li key={step.title} className="card-flat flex flex-col gap-2.5 p-6 text-left">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-[12px] font-semibold text-white tabular-nums">
              {i + 1}
            </span>
            <span className="text-[15.5px] font-semibold">{step.title}</span>
            <span className="text-[14px] leading-relaxed text-muted">{step.body}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
