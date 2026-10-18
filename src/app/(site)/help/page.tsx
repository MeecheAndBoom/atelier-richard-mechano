import type { Metadata } from "next";
import Link from "next/link";
import { getDict, getLocale } from "@/lib/i18n/server";
import { pageMetadata, faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/site/PageHeader";
import { FaqExplorer, type FaqGroup } from "@/components/site/FaqExplorer";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDict();
  return pageMetadata({
    title: t.help.title,
    description: t.help.lead,
    path: "/help",
    locale,
  });
}

export default async function HelpPage() {
  const t = await getDict();
  const locale = await getLocale();

  const groups: FaqGroup[] = (
    Object.entries(t.help.faqs) as [keyof typeof t.help.faqs, { q: string; a: string }[]][]
  ).map(([key, items]) => ({
    key,
    label: t.help.categories[key],
    items,
  }));

  const flatFaqs = groups.flatMap((g) => g.items.map((i) => ({ q: i.q, a: i.a })));

  return (
    <div>
      <PageHeader title={t.help.title} lead={t.help.lead} />

      <div className="section grid gap-10 py-12 lg:grid-cols-[220px_1fr] lg:gap-14">
        <nav aria-label={t.help.title} className="hidden lg:block">
          <ul className="sticky top-24 flex flex-col gap-1 text-[14.5px]">
            {groups.map((group) => (
              <li key={group.key}>
                <a
                  href={`#faq-${group.key}`}
                  className="rounded-pill block px-3.5 py-2 text-muted transition-colors hover:bg-alt hover:text-ink"
                >
                  {group.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <FaqExplorer groups={groups} />

          <div className="mt-14 rounded-card border border-line-soft bg-alt px-7 py-9 text-center">
            <h2 className="text-[22px] font-semibold tracking-[-0.015em]">
              {t.help.contactTitle}
            </h2>
            <p className="mt-2 text-[15.5px] text-muted">{t.help.contactLead}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn btn-primary">
                <i className="fa-solid fa-paper-plane text-[12px]" aria-hidden="true" />
                <span>{t.common.contactUs}</span>
              </Link>
              <Link href="/track" className="btn btn-ghost">
                <i className="fa-solid fa-location-crosshairs text-[12px]" aria-hidden="true" />
                <span>{t.nav.track}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <JsonLd data={faqJsonLd(flatFaqs, locale)} />
    </div>
  );
}
