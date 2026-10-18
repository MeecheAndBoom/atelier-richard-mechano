import type { Metadata } from "next";
import Link from "next/link";
import { getDict, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";
import { PageHeader } from "@/components/site/PageHeader";
import { ContactForm } from "@/components/site/PublicForms";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDict();
  return pageMetadata({
    title: t.contact.title,
    description: t.contact.lead,
    path: "/contact",
    locale,
  });
}

export default async function ContactPage() {
  const t = await getDict();
  const locale = await getLocale();

  return (
    <div>
      <PageHeader
        title={t.contact.title}
        lead={t.contact.lead}
      >
        <span className="badge bg-white text-ink-soft">
          <i className="fa-regular fa-clock text-[11px] text-accent" aria-hidden="true" />
          {t.contact.responseTime}
        </span>
      </PageHeader>

      <div className="section grid gap-10 py-12 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
        {/* Form */}
        <div>
          <h2 className="text-[22px] font-semibold tracking-[-0.015em]">{t.contact.title}</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          <div className="card-flat p-7">
            <h2 className="text-[17px] font-semibold">{t.contact.directTitle}</h2>
            <ul className="mt-4 flex flex-col gap-3.5 text-[15px]">
              <li>
                <a
                  href={`tel:${SITE.phoneHref}`}
                  className="flex items-center gap-3 text-ink-soft transition-colors hover:text-accent"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-alt text-[13px] text-accent">
                    <i className="fa-solid fa-phone" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[12.5px] text-muted">{t.contact.phone}</span>
                    <span className="font-medium tabular-nums">{SITE.phone}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-3 text-ink-soft transition-colors hover:text-accent"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-alt text-[13px] text-accent">
                    <i className="fa-solid fa-envelope" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[12.5px] text-muted">{t.contact.email}</span>
                    <span className="font-medium break-all">{SITE.email}</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div className="card-flat p-7">
            <h2 className="text-[17px] font-semibold">{t.contact.addressTitle}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{SITE.address}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-[14.5px] font-medium text-accent hover:underline"
            >
              {t.contact.mapLink}
              <i className="fa-solid fa-arrow-up-right-from-square text-[11px]" aria-hidden="true" />
            </a>
            <div className="mt-4 overflow-hidden rounded-box border border-line-soft bg-alt">
              <div className="aspect-[16/9] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/parts/map.svg" alt="" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>

          <div className="card-flat p-7">
            <h2 className="text-[17px] font-semibold">{t.contact.hoursTitle}</h2>
            <dl className="mt-3 flex flex-col gap-2 text-[14.5px]">
              {SITE.hours.map((row) => (
                <div
                  key={row.days}
                  className="flex justify-between gap-4 border-b border-line-soft pb-2 last:border-0"
                >
                  <dt className="text-muted">{locale === "en" ? row.daysEn : row.days}</dt>
                  <dd className="font-medium tabular-nums">{row.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          <Reveal>
            <Link href="/help" className="btn btn-ghost w-full justify-center">
              <i className="fa-solid fa-circle-question text-[12px]" aria-hidden="true" />
              <span>{t.help.title}</span>
            </Link>
          </Reveal>
        </aside>
      </div>
    </div>
  );
}
