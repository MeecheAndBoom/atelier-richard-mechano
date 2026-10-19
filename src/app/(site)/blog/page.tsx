import type { Metadata } from "next";
import Link from "next/link";
import { getDict, getLocale } from "@/lib/i18n/server";
import { getPosts } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";
import { shortDate } from "@/lib/format";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDict();
  return pageMetadata({
    title: t.blog.title,
    description: t.blog.lead,
    path: "/blog",
    locale,
  });
}

export default async function BlogPage() {
  const t = await getDict();
  const locale = await getLocale();
  const posts = await getPosts();

  const card = (post: (typeof posts)[number], index: number, big = false) => {
    const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
    const excerpt = locale === "en" && post.excerptEn ? post.excerptEn : post.excerpt;
    return (
      <Reveal key={post.slug} delay={index * 60}>
        <Link
          href={`/blog/${post.slug}`}
          className={`card group flex h-full flex-col overflow-hidden ${big ? "sm:col-span-2 sm:flex-row" : ""}`}
        >
          <div
            className={`overflow-hidden bg-alt ${big ? "aspect-[16/10] w-full sm:aspect-auto sm:w-[46%] sm:shrink-0" : "aspect-[16/9] w-full"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image || "/images/placeholder.jpg"}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2.5 p-5 sm:p-7">
            <p className="text-[12.5px] text-muted">
              {post.category} · <time dateTime={post.date}>{shortDate(post.date, locale)}</time>
            </p>
            <h2
              className={`leading-snug font-semibold tracking-[-0.01em] group-hover:text-accent ${
                big ? "text-[22px] sm:text-[26px]" : "text-[17.5px]"
              }`}
            >
              {title}
            </h2>
            <p className={`text-[15px] leading-relaxed text-muted ${big ? "line-clamp-4" : "line-clamp-3"}`}>
              {excerpt}
            </p>
            <span className="mt-auto flex items-center gap-2 pt-2 text-[14px] font-medium text-accent">
              {t.common.readMore}
              <i className="fa-solid fa-arrow-right text-[11px]" aria-hidden="true" />
            </span>
          </div>
        </Link>
      </Reveal>
    );
  };

  const [lead, ...rest] = posts;

  return (
    <div>
      <PageHeader title={t.blog.title} lead={t.blog.lead} />
      <div className="section py-10 sm:py-14">
        {posts.length === 0 ? (
          <p className="rounded-card border border-line-soft px-6 py-16 text-center text-[16px] text-muted">
            {t.blog.empty}
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {card(lead, 0, true)}
            {rest.map((post, i) => card(post, i + 1))}
          </div>
        )}
      </div>
    </div>
  );
}
