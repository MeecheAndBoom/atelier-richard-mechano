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
    title: t.resources.title,
    description: t.resources.lead,
    path: "/resources",
    locale,
  });
}

export default async function ResourcesPage() {
  const t = await getDict();

  return (
    <div>
      <PageHeader title={t.resources.title} lead={t.resources.lead} />

      <section className="section section-pad">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Guides */}
          <div>
            <Reveal>
              <h2 className="text-[24px] font-semibold tracking-[-0.02em]">
                {t.resources.guidesTitle}
              </h2>
            </Reveal>
            <div className="mt-6 flex flex-col gap-4">
              {t.resources.guides.map((guide, i) => (
                <Reveal key={guide.title} delay={i * 60}>
                  <article className="card-flat flex gap-4 p-6">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sky text-[15px] text-accent">
                      <i className="fa-solid fa-book-open" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-[16.5px] font-semibold">{guide.title}</h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{guide.body}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <Reveal>
              <h2 className="text-[24px] font-semibold tracking-[-0.02em]">
                {t.resources.toolsTitle}
              </h2>
            </Reveal>
            <div className="mt-6 flex flex-col gap-4">
              {t.resources.tools.map((tool, i) => (
                <Reveal key={tool.title} delay={i * 60}>
                  <article className="card-flat flex gap-4 p-6">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-alt text-[15px] text-ink-soft">
                      <i className="fa-solid fa-screwdriver-wrench" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-[16.5px] font-semibold">{tool.title}</h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{tool.body}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
              <Reveal delay={140}>
                <Link
                  href="/blog"
                  className="card-flat flex items-center justify-between gap-4 p-6 transition-colors hover:border-accent"
                >
                  <span className="flex items-center gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sky text-[15px] text-accent">
                      <i className="fa-solid fa-newspaper" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-[16.5px] font-semibold">{t.blog.title}</span>
                      <span className="mt-1 block text-[15px] text-muted">{t.blog.lead}</span>
                    </span>
                  </span>
                  <i className="fa-solid fa-arrow-right text-[13px] text-muted-light" aria-hidden="true" />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Reveal className="mt-14">
          <div className="rounded-card relative overflow-hidden bg-callout px-8 py-11 text-center text-white">
            <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
            <div className="relative">
              <h2 className="text-[24px] font-semibold tracking-[-0.02em]">
                {t.resources.ctaTitle}
              </h2>
              <p className="mx-auto mt-2 max-w-[480px] text-[15.5px] text-white/90">
                {t.resources.ctaLead}
              </p>
              <Link href="/contact" className="btn btn-primary mt-6">
                <i className="fa-solid fa-paper-plane text-[12px]" aria-hidden="true" />
                <span>{t.common.contactUs}</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
