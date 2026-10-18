import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, getLocale } from "@/lib/i18n/server";
import { getLegalPage, legalTitle, LEGAL_PAGES } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";
import { shortDate } from "@/lib/format";
import { Breadcrumbs } from "@/components/site/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return LEGAL_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const page = getLegalPage(slug);
  if (!page) return { title: "404" };
  return pageMetadata({
    title: legalTitle(page, locale),
    description: page.sections[locale].map((s) => s.body[0] ?? "").join(" ").slice(0, 160),
    path: `/legal/${page.slug}`,
    locale,
  });
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getDict();
  const locale = await getLocale();
  const page = getLegalPage(slug);
  if (!page) notFound();

  const title = legalTitle(page, locale);
  const sections = page.sections[locale];

  return (
    <div className="page-enter">
      <Breadcrumbs
        items={[
          { label: t.shop.breadcrumbHome, href: "/" },
          { label: t.legal.title },
          { label: title },
        ]}
      />

      <header className="section max-w-[820px] pt-8 pb-4">
        <h1 className="text-[34px] leading-[1.08] font-semibold tracking-[-0.03em] sm:text-[44px]">
          {title}
        </h1>
        <p className="mt-4 text-[14px] text-muted">
          {t.legal.updated}{" "}
          <time dateTime={page.updated} className="tabular-nums">
            {shortDate(page.updated, locale)}
          </time>
        </p>
      </header>

      <div className="section max-w-[820px] pb-16">
        {sections.map((section) => (
          <section key={section.heading} className="mt-10 first:mt-6">
            <h2 className="text-[22px] font-semibold tracking-[-0.015em]">{section.heading}</h2>
            <div className="mt-4 flex flex-col gap-4">
              {section.body.map((paragraph, j) => (
                <p key={j} className="text-[16px] leading-[1.75] text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-14 border-t border-line-soft pt-8">
          <Link href="/" className="btn btn-ghost btn-sm">
            <i className="fa-solid fa-arrow-left text-[11px]" aria-hidden="true" />
            <span>{t.legal.backToHome}</span>
          </Link>
        </div>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: title,
          inLanguage: locale,
        }}
      />
    </div>
  );
}
