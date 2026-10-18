import type { Metadata } from "next";
import { getDict, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/site/PageHeader";
import { AffiliateForm } from "@/components/site/PublicForms";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDict();
  return pageMetadata({
    title: t.affiliate.title,
    description: t.affiliate.lead,
    path: "/affiliate-program",
    locale,
  });
}

export default async function AffiliatePage() {
  const t = await getDict();

  return (
    <div>
      <PageHeader title={t.affiliate.title} lead={t.affiliate.lead} />

      {/* How it works */}
      <section className="section section-pad">
        <Reveal>
          <h2 className="text-[26px] font-semibold tracking-[-0.02em]">
            {t.affiliate.howTitle}
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {t.affiliate.how.map((step, i) => (
            <Reveal key={step.title} delay={i * 70}>
              <article className="card-flat h-full p-7">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-sky text-[15px] font-semibold text-accent tabular-nums">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-[17.5px] font-semibold">{step.title}</h3>
                <p className="mt-2 text-[15.5px] leading-relaxed text-muted">{step.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Terms + form */}
      <section className="border-t border-line-soft bg-alt">
        <div className="section grid gap-10 py-14 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <div>
            <h2 className="text-[24px] font-semibold tracking-[-0.02em]">
              {t.affiliate.termsTitle}
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {t.affiliate.terms.map((term) => (
                <li key={term} className="flex gap-3 text-[15.5px] leading-relaxed text-ink-soft">
                  <i className="fa-solid fa-check mt-1 text-[12px] text-success" aria-hidden="true" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-card border border-line-soft bg-white p-7 sm:p-8">
            <h2 className="text-[20px] font-semibold">{t.affiliate.ctaTitle}</h2>
            <p className="mt-2 text-[15px] text-muted">{t.affiliate.ctaLead}</p>
            <div className="mt-6">
              <AffiliateForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
