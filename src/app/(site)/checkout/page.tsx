import type { Metadata } from "next";
import { getDict, getLocale } from "@/lib/i18n/server";
import { getSettings } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/site/PageHeader";
import { CheckoutForm } from "@/components/site/CheckoutForm";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDict();
  return pageMetadata({
    title: t.checkout.title,
    description: t.checkout.lead,
    path: "/checkout",
    locale,
    noIndex: true,
  });
}

export default async function CheckoutPage() {
  const t = await getDict();
  const settings = await getSettings();

  return (
    <div>
      <PageHeader title={t.checkout.title} lead={t.checkout.lead} />
      <div className="section max-w-[820px] py-10 sm:py-14">
        <CheckoutForm
          paymentMethods={settings.paymentMethods}
          deliveryFee={settings.delivery.fee}
          freeThreshold={settings.delivery.freeThreshold}
        />
      </div>
    </div>
  );
}
