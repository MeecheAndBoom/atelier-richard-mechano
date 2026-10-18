import type { Metadata } from "next";
import { getDict, getLocale } from "@/lib/i18n/server";
import { getSettings } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/site/PageHeader";
import { CartView } from "@/components/site/CartView";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDict();
  return pageMetadata({
    title: t.cart.title,
    description: t.meta.shortDescription,
    path: "/cart",
    locale,
    noIndex: true,
  });
}

export default async function CartPage() {
  const t = await getDict();
  const settings = await getSettings();

  return (
    <div>
      <PageHeader title={t.cart.title} lead={t.cart.emptyHint} />
      <div className="section py-10 sm:py-14">
        <CartView
          deliveryFee={settings.delivery.fee}
          freeThreshold={settings.delivery.freeThreshold}
        />
      </div>
    </div>
  );
}
