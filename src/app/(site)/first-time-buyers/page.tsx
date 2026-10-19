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
    title: t.firstTime.title,
    description: t.firstTime.lead,
    path: "/first-time-buyers",
    locale,
  });
}

export default async function FirstTimeBuyersPage() {
  const t = await getDict();

  return (
    <div>
      <PageHeader title={t.firstTime.title} lead={t.firstTime.lead} />

      {/* Steps */}
      <section className="section section-pad">
        <ol className="relative flex flex-col gap-6 sm:gap-8">
          {t.firstTime.steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 60}>
              <div className="card-flat flex gap-5 p-6 sm:gap-7 sm:p-8">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-[16px] font-semibold text-white tabular-nums">
                  {i + 1}
                </span>
                <div>
                  <h2 className="text-[18.5px] font-semibold tracking-[-0.01em]">{step.title}</h2>
                  <p className="mt-2 text-[15.5px] leading-[1.65] text-muted">{step.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* Guarantees */}
        <Reveal className="mt-12">
          <div className="rounded-card border border-line-soft bg-alt p-7 sm:p-9">
            <h2 className="text-[21px] font-semibold tracking-[-0.015em]">
              {t.firstTime.reassureTitle}
            </h2>
            <ul className="mt-5 grid gap-3.5 sm:grid-cols-3">
              {t.firstTime.reassure.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-ink-soft">
                  <i className="fa-solid fa-shield-halved mt-1 text-[13px] text-success" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal className="mt-10">
          <div className="rounded-card relative overflow-hidden bg-callout px-8 py-11 text-white">
            <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
            <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[24px] font-semibold tracking-[-0.02em]">
                  {t.firstTime.ctaTitle}
                </h2>
                <p className="mt-1.5 text-[15.5px] text-white/90">{t.firstTime.ctaLead}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/shop" className="btn btn-primary">
                  <i className="fa-solid fa-bag-shopping text-[12px]" aria-hidden="true" />
                  <span>{t.home.heroCta}</span>
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
