import type { Metadata } from "next";
import Link from "next/link";
import { getDict, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";
import { PageHeader } from "@/components/site/PageHeader";
import { TrackLookupForm } from "@/components/site/TrackLookup";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDict();
  return pageMetadata({
    title: t.track.title,
    description: t.track.lead,
    path: "/track",
    locale,
    noIndex: true,
  });
}

export default async function TrackPage() {
  const t = await getDict();

  return (
    <div>
      <PageHeader title={t.track.title} lead={t.track.lead} />
      <div className="section max-w-[860px] py-10 sm:py-14">
        <TrackLookupForm />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-card bg-alt px-6 py-5">
          <p className="flex items-center gap-2.5 text-[14.5px] text-muted">
            <i className="fa-solid fa-headset text-accent text-[14px]" aria-hidden="true" />
            {t.common.questions}
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${SITE.phoneHref}`} className="btn btn-ghost btn-sm">
              <i className="fa-solid fa-phone text-[11px]" aria-hidden="true" />
              <span>{SITE.phone}</span>
            </a>
            <Link href="/help" className="btn btn-ghost btn-sm">
              <i className="fa-solid fa-circle-question text-[11px]" aria-hidden="true" />
              <span>{t.nav.help}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
