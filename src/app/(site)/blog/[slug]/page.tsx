import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, getLocale } from "@/lib/i18n/server";
import { getPost, getPosts } from "@/lib/blog";
import {
  absoluteUrl,
  blogPostJsonLd,
  breadcrumbJsonLd,
  localizedPost,
  pageMetadata,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { shortDate } from "@/lib/format";
import { SITE } from "@/lib/constants";
import { Breadcrumbs } from "@/components/site/PageHeader";
import { PostBody } from "@/components/site/PostBody";
import { CopyButton } from "@/components/site/CopyButton";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const post = await getPost(slug);
  if (!post) return { title: "404" };
  const { title, excerpt } = localizedPost(post, locale);
  return pageMetadata({
    title,
    description: excerpt,
    path: `/blog/${post.slug}`,
    locale,
    image: post.image,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getDict();
  const locale = await getLocale();
  const post = await getPost(slug);
  if (!post || post.status === "draft") notFound();

  const { title, excerpt, body } = localizedPost(post, locale);
  const all = await getPosts();
  const related = all.filter((p) => p.slug !== post.slug).slice(0, 2);
  return (
    <article className="page-enter">
      <Breadcrumbs
        items={[
          { label: t.shop.breadcrumbHome, href: "/" },
          { label: t.blog.title, href: "/blog" },
          { label: title },
        ]}
      />

      <JsonLd data={blogPostJsonLd(post, locale, `/blog/${post.slug}`)} />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: t.shop.breadcrumbHome, path: "/" },
            { name: t.blog.title, path: "/blog" },
            { name: title, path: `/blog/${post.slug}` },
          ],
          locale,
        )}
      />

      {/* Header */}
      <header className="section max-w-[820px] pt-8 pb-10">
        <p className="text-[13px] text-muted">
          {post.category} · <time dateTime={post.date}>{shortDate(post.date, locale)}</time>
        </p>
        <h1 className="mt-3 text-[34px] leading-[1.08] font-semibold tracking-[-0.03em] sm:text-[46px]">
          {title}
        </h1>
        <p className="mt-5 text-[18px] leading-[1.6] text-muted">{excerpt}</p>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-line-soft pt-6 text-[14px] text-muted">
          <span>
            {t.blog.byAuthor}{" "}
            <span className="font-medium text-ink">{post.author || SITE.name}</span>
          </span>
          <CopyButton value={absoluteUrl(`/blog/${post.slug}`)} />
        </div>
      </header>

      {/* Cover */}
      <div className="section max-w-[1040px]">
        <div className="aspect-[16/9] w-full overflow-hidden rounded-card border border-line-soft bg-alt">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image || "/images/placeholder.jpg"}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Body */}
      <div className="section max-w-[760px] pt-12 pb-14">
        <PostBody markdown={body} />

        {post.tags.length ? (
          <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-line-soft pt-7">
            <span className="mr-1 text-[13px] text-muted">{t.blog.tags}</span>
            {post.tags.map((tag) => (
              <span key={tag} className="badge bg-alt text-ink-soft">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {/* Related */}
      {related.length ? (
        <section className="border-t border-line-soft bg-alt">
          <div className="section section-pad">
            <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[26px] font-semibold tracking-[-0.02em]">{t.blog.related}</h2>
              <Link href="/blog" className="btn btn-ghost btn-sm">
                <i className="fa-solid fa-arrow-left text-[11px]" aria-hidden="true" />
                <span>{t.blog.backToBlog}</span>
              </Link>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2">
              {related.map((item, i) => {
                const itemTitle = locale === "en" && item.titleEn ? item.titleEn : item.title;
                const itemExcerpt =
                  locale === "en" && item.excerptEn ? item.excerptEn : item.excerpt;
                return (
                  <Reveal key={item.slug} delay={i * 70}>
                    <Link href={`/blog/${item.slug}`} className="card group flex h-full flex-col overflow-hidden">
                      <div className="aspect-[16/9] w-full overflow-hidden bg-alt">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image || "/images/placeholder.jpg"}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-2 p-5">
                        <p className="text-[12.5px] text-muted">{shortDate(item.date, locale)}</p>
                        <h3 className="text-[17px] leading-snug font-semibold group-hover:text-accent">
                          {itemTitle}
                        </h3>
                        <p className="text-[14.5px] leading-relaxed text-muted line-clamp-2">
                          {itemExcerpt}
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
