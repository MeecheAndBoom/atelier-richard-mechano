import Link from "next/link";
import { getDict, getLocale } from "@/lib/i18n/server";
import { getFeaturedProducts } from "@/lib/products";
import { getTiles } from "@/lib/categories";
import { getFeaturedPosts } from "@/lib/blog";
import { getReviews } from "@/lib/reviews";
import { ProductCard } from "@/components/ui/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/FormBits";
import { CATEGORY_LABELS } from "@/lib/constants";
import { shortDate } from "@/lib/format";

export default async function HomePage() {
  const t = await getDict();
  const locale = await getLocale();
  const [featured, tiles, posts, reviews] = await Promise.all([
    getFeaturedProducts(6),
    getTiles("category"),
    getFeaturedPosts(3),
    getReviews(),
  ]);
  const topReviews = reviews.slice(0, 3);

  return (
    <div className="page-enter">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-line-soft bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#f7faff_0%,#ffffff_60%)]"
        />
        <div className="section relative grid gap-12 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div>
            <h1 className="max-w-[680px] text-[40px] leading-[1.03] font-semibold tracking-[-0.035em] text-ink sm:text-[60px] lg:text-[68px]">
              {t.home.heroTitle}
            </h1>
            <p className="mt-6 max-w-[560px] text-[17px] leading-[1.7] text-muted sm:text-[19px]">
              {t.home.heroLead}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary btn-lg">
                <span>{t.home.heroCta}</span>
                <i className="fa-solid fa-arrow-right text-[12px]" aria-hidden="true" />
              </Link>
              <Link href="/contact" className="btn btn-ghost btn-lg">
                <i className="fa-solid fa-magnifying-glass text-[12px]" aria-hidden="true" />
                <span>{t.home.heroSecondary}</span>
              </Link>
            </div>
          </div>

          <Reveal delay={120} className="relative">
            <div className="relative overflow-hidden rounded-card border border-line-soft bg-alt">
              <div className="aspect-[5/4] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/parts/hero.svg"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-5 left-4 right-4 rounded-card border border-line-soft bg-white/90 p-4 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:left-8 sm:right-8">
              <ul className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[13.5px] text-ink-soft">
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-circle-check text-accent text-[13px]" aria-hidden="true" />
                  {t.home.stats[0].value} <span className="text-muted">{t.home.stats[0].label}</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-truck-fast text-accent text-[13px]" aria-hidden="true" />
                  {t.home.stats[1].value} <span className="text-muted">{t.home.stats[1].label}</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="fa-solid fa-star text-accent text-[13px]" aria-hidden="true" />
                  {t.home.stats[2].value} <span className="text-muted">{t.home.stats[2].label}</span>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Featured ─────────────────────────────────────────── */}
      <section className="section section-pad">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 className="text-[30px] font-semibold tracking-[-0.02em] sm:text-[38px]">
              {t.home.featuredTitle}
            </h2>
            <p className="mt-2.5 text-[16.5px] text-muted">{t.home.featuredLead}</p>
          </div>
          <Link href="/shop" className="btn btn-ghost btn-sm">
            <span>{t.footer.allParts}</span>
            <i className="fa-solid fa-arrow-right text-[11px]" aria-hidden="true" />
          </Link>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, i) => (
            <Reveal key={product.slug} delay={i * 60}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="border-y border-line-soft bg-alt">
        <div className="section section-pad">
          <Reveal className="mb-10">
            <h2 className="text-[30px] font-semibold tracking-[-0.02em] sm:text-[38px]">
              {t.home.categoriesTitle}
            </h2>
            <p className="mt-2.5 text-[16.5px] text-muted">{t.home.categoriesLead}</p>
          </Reveal>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {tiles.map((tile, i) => {
              const label =
                CATEGORY_LABELS[tile.name as keyof typeof CATEGORY_LABELS]?.[locale] ??
                tile.name;
              return (
                <Reveal key={tile.id} delay={i * 45}>
                  <Link
                    href={`/shop?category=${encodeURIComponent(tile.name)}`}
                    className="card group flex h-full flex-col overflow-hidden"
                  >
                    <div className="aspect-[5/3] w-full overflow-hidden bg-alt">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tile.image || "/parts/placeholder.svg"}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3 px-4 py-4">
                      <span className="text-[15px] font-medium text-ink">{label}</span>
                      <i
                        className="fa-solid fa-arrow-right text-[12px] text-muted-light transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                </Reveal>
              );
            })}
            {tiles.length === 0
              ? PART_CATEGORIES_FALLBACK(locale).map((label, i) => (
                  <Reveal key={label} delay={i * 45}>
                    <Link
                      href="/shop"
                      className="card flex h-full items-center justify-center px-4 py-8 text-center text-[15px] font-medium"
                    >
                      {label}
                    </Link>
                  </Reveal>
                ))
              : null}
          </div>
        </div>
      </section>

      {/* ── Why us ───────────────────────────────────────────── */}
      <section className="section section-pad">
        <Reveal className="mb-10">
          <h2 className="text-[30px] font-semibold tracking-[-0.02em] sm:text-[38px]">
            {t.home.whyTitle}
          </h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {t.home.why.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <article className="card-flat flex h-full flex-col gap-3 p-7">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-sky text-[16px] text-accent">
                  <i
                    className={`fa-solid ${["fa-puzzle-piece", "fa-tags", "fa-truck-fast"][i] ?? "fa-check"}`}
                    aria-hidden="true"
                  />
                </span>
                <h3 className="text-[18px] font-semibold tracking-[-0.01em]">{item.title}</h3>
                <p className="text-[15.5px] leading-[1.65] text-muted">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8">
          <Link href="/why-buy-from-us" className="btn btn-ghost btn-sm">
            <span>{t.whyBuy.title}</span>
            <i className="fa-solid fa-arrow-right text-[11px]" aria-hidden="true" />
          </Link>
        </Reveal>
      </section>

      {/* ── Stats band ───────────────────────────────────────── */}
      <section className="border-y border-line-soft bg-graphite text-white">
        <div className="section grid gap-8 py-14 sm:grid-cols-3">
          {t.home.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 70} className="text-center sm:text-left">
              <p className="text-[40px] leading-none font-semibold tracking-[-0.03em] tabular-nums">
                {stat.value}
              </p>
              <p className="mt-2.5 text-[14.5px] text-[#a1a1a6]">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      {topReviews.length ? (
        <section className="section section-pad">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2 className="text-[30px] font-semibold tracking-[-0.02em] sm:text-[38px]">
                {t.home.testimonialsTitle}
              </h2>
              <p className="mt-2.5 text-[16.5px] text-muted">{t.home.testimonialsLead}</p>
            </div>
            <Link href="/testimonials" className="btn btn-ghost btn-sm">
              <span>{t.testimonials.submit}</span>
              <i className="fa-solid fa-arrow-right text-[11px]" aria-hidden="true" />
            </Link>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {topReviews.map((review, i) => (
              <Reveal key={`${review.name}-${review.date}`} delay={i * 70}>
                <figure className="card-flat flex h-full flex-col gap-4 p-7">
                  <Stars rating={review.rating} />
                  <blockquote className="text-[15.5px] leading-[1.7] text-ink-soft">
                    {review.title ? (
                      <span className="mb-1.5 block font-semibold text-ink">{review.title}</span>
                    ) : null}
                    {review.body}
                  </blockquote>
                  <figcaption className="mt-auto flex items-center justify-between gap-3 border-t border-line-soft pt-4 text-[13.5px]">
                    <span className="font-medium text-ink">
                      {review.name}
                      {review.city ? <span className="font-normal text-muted"> — {review.city}</span> : null}
                    </span>
                    <time className="text-muted-light tabular-nums" dateTime={review.date}>
                      {shortDate(review.date, locale)}
                    </time>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Blog ─────────────────────────────────────────────── */}
      {posts.length ? (
        <section className="border-t border-line-soft bg-alt">
          <div className="section section-pad">
            <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-5">
              <div>
                <h2 className="text-[30px] font-semibold tracking-[-0.02em] sm:text-[38px]">
                  {t.home.blogTitle}
                </h2>
                <p className="mt-2.5 text-[16.5px] text-muted">{t.home.blogLead}</p>
              </div>
              <Link href="/blog" className="btn btn-ghost btn-sm">
                <span>{t.footer.blogGuides}</span>
                <i className="fa-solid fa-arrow-right text-[11px]" aria-hidden="true" />
              </Link>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-3">
              {posts.map((post, i) => {
                const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
                const excerpt =
                  locale === "en" && post.excerptEn ? post.excerptEn : post.excerpt;
                return (
                  <Reveal key={post.slug} delay={i * 70}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="card group flex h-full flex-col overflow-hidden"
                    >
                      <div className="aspect-[16/9] w-full overflow-hidden bg-alt">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.image || "/parts/placeholder.svg"}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-2.5 p-5">
                        <p className="text-[12.5px] text-muted">
                          {shortDate(post.date, locale)} · {post.category}
                        </p>
                        <h3 className="text-[17px] leading-snug font-semibold tracking-[-0.01em] group-hover:text-accent">
                          {title}
                        </h3>
                        <p className="text-[14.5px] leading-relaxed text-muted line-clamp-3">
                          {excerpt}
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

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="section section-pad">
        <Reveal>
          <div className="rounded-card relative overflow-hidden bg-graphite px-8 py-14 text-center text-white sm:px-14 sm:py-18">
            <h2 className="mx-auto max-w-[620px] text-[28px] leading-tight font-semibold tracking-[-0.02em] sm:text-[36px]">
              {t.home.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-[560px] text-[16.5px] leading-relaxed text-[#a1a1a6]">
              {t.home.ctaLead}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn btn-primary btn-lg">
                <i className="fa-solid fa-paper-plane text-[12px]" aria-hidden="true" />
                <span>{t.home.ctaButton}</span>
              </Link>
              <Link href="/retrieve-quote" className="btn btn-dark btn-lg">
                <i className="fa-solid fa-clock-rotate-left text-[12px]" aria-hidden="true" />
                <span>{t.footer.retrieveQuote}</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

/** Fallback chip grid when no taxonomy tiles exist yet. */
function PART_CATEGORIES_FALLBACK(locale: "fr" | "en"): string[] {
  const keys = ["Engine", "Brakes", "Electrical", "Suspension", "Cooling", "Filters", "Tools", "Interior"] as const;
  return keys.map((k) => CATEGORY_LABELS[k][locale]);
}
