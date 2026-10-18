import type { Metadata } from "next";
import Link from "next/link";
import { getDict, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/site/PageHeader";
import { QuoteForm } from "@/components/site/PublicForms";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDict();
  return pageMetadata({
    title: t.retrieveQuote.title,
    description: t.retrieveQuote.lead,
    path: "/retrieve-quote",
    locale,
  });
}

export default async function RetrieveQuotePage() {
  const t = await getDict();

  return (
    <div>
      <PageHeader title={t.retrieveQuote.title} lead={t.retrieveQuote.lead} />
      <div className="section grid gap-10 py-12 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
        <div>
          <QuoteForm />
          <p className="mt-6 rounded-card bg-alt px-5 py-4 text-[14.5px] leading-relaxed text-muted">
            <i className="fa-solid fa-lightbulb mr-2 text-accent" aria-hidden="true" />
            {t.retrieveQuote.noQuoteHint}
          </p>
        </div>

        <aside className="card-flat h-fit p-7">
          <h2 className="text-[17px] font-semibold">{t.success.steps[0].title}</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            {t.success.steps[0].body}
          </p>
          <div className="mt-6 flex flex-col gap-3 border-t border-line-soft pt-5">
            <Link href="/help" className="btn btn-ghost btn-sm">
              <i className="fa-solid fa-circle-question text-[11px]" aria-hidden="true" />
              <span>{t.nav.help}</span>
            </Link>
            <Link href="/contact" className="btn btn-ghost btn-sm">
              <i className="fa-solid fa-paper-plane text-[11px]" aria-hidden="true" />
              <span>{t.common.contactUs}</span>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
