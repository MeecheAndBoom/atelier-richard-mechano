import type { Metadata } from "next";
import Link from "next/link";
import { getDict, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDict();
  return pageMetadata({
    title: t.whyBuy.title,
    description: t.whyBuy.lead,
    path: "/why-buy-from-us",
    locale,
  });
}

const ICONS = [
  "fa-puzzle-piece",
  "fa-boxes-stacked",
  "fa-truck-fast",
  "fa-rotate-left",
  "fa-tag",
  "fa-comments",
];

export default async function WhyBuyPage() {
  const t = await getDict();

  return (
    <div>
      <PageHeader title={t.whyBuy.title} lead={t.whyBuy.lead} />

      <section className="section section-pad">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.whyBuy.points.map((point, i) => (
            <Reveal key={point.title} delay={i * 55}>
              <article className="card-flat h-full p-7">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-sky text-[16px] text-accent">
                  <i className={`fa-solid ${ICONS[i] ?? "fa-check"}`} aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-[17.5px] font-semibold tracking-[-0.01em]">
                  {point.title}
                </h2>
                <p className="mt-2 text-[15.5px] leading-[1.65] text-muted">{point.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <div className="rounded-card relative overflow-hidden bg-callout px-8 py-12 text-white sm:px-12">
            <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
            <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-[26px] font-semibold tracking-[-0.02em]">
                  {t.whyBuy.ctaTitle}
                </h2>
                <p className="mt-2 max-w-[460px] text-[15.5px] text-white/90">
                  {t.whyBuy.ctaLead}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/shop" className="btn btn-primary">
                  <i className="fa-solid fa-bag-shopping text-[12px]" aria-hidden="true" />
                  <span>{t.footer.allParts}</span>
                </Link>
                <Link href="/contact" className="btn btn-dark">
                  <i className="fa-solid fa-paper-plane text-[12px]" aria-hidden="true" />
                  <span>{t.home.ctaButton}</span>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
