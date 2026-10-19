import type { Metadata } from "next";
import Link from "next/link";
import { getDict, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { SITE, CATEGORY_LABELS, PART_CATEGORIES } from "@/lib/constants";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDict();
  return pageMetadata({
    title: t.about.title,
    description: t.about.intro,
    path: "/about",
    locale,
  });
}

export default async function AboutPage() {
  const t = await getDict();
  const locale = await getLocale();

  return (
    <div>
      <PageHeader title={t.about.title} lead={t.about.intro} />

      {/* Story */}
      <section className="section grid gap-10 py-14 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div>
          <h2 className="text-[26px] font-semibold tracking-[-0.02em]">{t.about.storyTitle}</h2>
          <p className="mt-5 text-[16.5px] leading-[1.75] text-ink-soft">{t.about.story1}</p>
          <p className="mt-4 text-[16.5px] leading-[1.75] text-ink-soft">{t.about.story2}</p>
        </div>
        <Reveal>
          <div className="overflow-hidden rounded-card border border-line-soft bg-alt">
            <div className="aspect-[4/3] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/editorial/atelier.jpg" alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Values */}
      <section className="border-y border-line-soft bg-alt">
        <div className="section section-pad">
          <Reveal>
            <h2 className="text-[26px] font-semibold tracking-[-0.02em] sm:text-[32px]">
              {t.about.valuesTitle}
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {t.about.values.map((value, i) => (
              <Reveal key={value.title} delay={i * 60}>
                <article className="card-flat h-full p-7">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-sky text-[15px] text-accent">
                    <i
                      className={`fa-solid ${["fa-magnifying-glass", "fa-list-check", "fa-comments", "fa-rotate-left"][i] ?? "fa-check"}`}
                      aria-hidden="true"
                    />
                  </span>
                  <h3 className="mt-4 text-[17.5px] font-semibold">{value.title}</h3>
                  <p className="mt-2 text-[15.5px] leading-relaxed text-muted">{value.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers + categories */}
      <section className="section section-pad">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-[26px] font-semibold tracking-[-0.02em]">
              {t.about.numbersTitle}
            </h2>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {t.home.stats.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 60}>
                  <p className="text-[30px] leading-none font-semibold tracking-[-0.03em] tabular-nums">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[13.5px] text-muted">{stat.label}</p>
                </Reveal>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {PART_CATEGORIES.slice(0, 8).map((category) => (
                <Link
                  key={category}
                  href={`/shop?category=${encodeURIComponent(category)}`}
                  className="badge bg-alt text-ink-soft transition-colors hover:bg-sky hover:text-accent"
                >
                  {CATEGORY_LABELS[category][locale]}
                </Link>
              ))}
            </div>
          </div>

          <div className="card-flat p-8">
            <h2 className="text-[19px] font-semibold">{t.contact.addressTitle}</h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{SITE.address}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-[14.5px] font-medium text-accent hover:underline"
            >
              {t.contact.mapLink}
              <i className="fa-solid fa-arrow-up-right-from-square text-[11px]" aria-hidden="true" />
            </a>

            <h3 className="mt-7 text-[17px] font-semibold">{t.contact.hoursTitle}</h3>
            <dl className="mt-3 flex flex-col gap-2 text-[14.5px]">
              {SITE.hours.map((row) => (
                <div key={row.days} className="flex justify-between gap-4 border-b border-line-soft pb-2 last:border-0">
                  <dt className="text-muted">{locale === "en" ? row.daysEn : row.days}</dt>
                  <dd className="font-medium tabular-nums">{row.time}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 flex flex-wrap gap-3">
              <a href={`tel:${SITE.phoneHref}`} className="btn btn-primary btn-sm">
                <i className="fa-solid fa-phone text-[11px]" aria-hidden="true" />
                <span>{SITE.phone}</span>
              </a>
              <Link href="/contact" className="btn btn-ghost btn-sm">
                <i className="fa-solid fa-paper-plane text-[11px]" aria-hidden="true" />
                <span>{t.common.emailUs}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Reveal className="mt-14">
          <div className="rounded-card flex flex-col items-start gap-4 bg-graphite px-8 py-12 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[24px] font-semibold tracking-[-0.02em]">{t.about.ctaTitle}</h2>
              <p className="mt-2 max-w-[480px] text-[15.5px] text-[#a1a1a6]">{t.about.ctaLead}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">
                <span>{t.home.ctaButton}</span>
              </Link>
              <Link href="/shop" className="btn btn-dark">
                <span>{t.footer.allParts}</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
