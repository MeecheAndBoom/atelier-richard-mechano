import type { Metadata } from "next";
import { getDict, getLocale } from "@/lib/i18n/server";
import { getReviews, averageRating } from "@/lib/reviews";
import { pageMetadata } from "@/lib/seo";
import { shortDate } from "@/lib/format";
import { PageHeader } from "@/components/site/PageHeader";
import { ReviewForm } from "@/components/site/PublicForms";
import { Stars } from "@/components/ui/FormBits";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDict();
  return pageMetadata({
    title: t.testimonials.title,
    description: t.testimonials.lead,
    path: "/testimonials",
    locale,
  });
}

export default async function TestimonialsPage() {
  const t = await getDict();
  const locale = await getLocale();
  const reviews = await getReviews();
  const average = averageRating(reviews);
  const summary =
    reviews.length === 1
      ? t.testimonials.summaryOne
      : t.testimonials.summary
          .replace("{rating}", average.toFixed(1))
          .replace("{count}", String(reviews.length));

  return (
    <div>
      <PageHeader title={t.testimonials.title} lead={t.testimonials.lead}>
        {reviews.length ? (
          <span className="flex items-center gap-3 rounded-pill bg-white px-4 py-2 text-[14px]">
            <Stars rating={average} />
            <span className="font-medium text-ink tabular-nums">{summary}</span>
          </span>
        ) : null}
      </PageHeader>

      <div className="section grid gap-10 py-12 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
        {/* Reviews */}
        <div>
          {reviews.length === 0 ? (
            <p className="rounded-card border border-line-soft px-6 py-14 text-center text-[16px] text-muted">
              {t.testimonials.empty}
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {reviews.map((review, i) => (
                <Reveal as="li" key={`${review.name}-${review.date}`} delay={i * 50}>
                  <figure className="card-flat p-6 sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Stars rating={review.rating} />
                      <span className="badge bg-[#eaf6ee] text-success">
                        <i className="fa-solid fa-circle-check text-[11px]" aria-hidden="true" />
                        {t.testimonials.verified}
                      </span>
                    </div>
                    {review.title ? (
                      <h2 className="mt-3 text-[17.5px] font-semibold">{review.title}</h2>
                    ) : null}
                    <blockquote className="mt-2 text-[15.5px] leading-[1.7] text-ink-soft">
                      {review.body}
                    </blockquote>
                    <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-4 text-[13.5px]">
                      <span className="font-medium text-ink">
                        {review.name}
                        {review.city ? <span className="font-normal text-muted"> — {review.city}</span> : null}
                      </span>
                      <span className="flex items-center gap-3 text-muted-light">
                        {review.purchased ? <span className="text-muted">{review.purchased}</span> : null}
                        <time dateTime={review.date} className="tabular-nums">
                          {shortDate(review.date, locale)}
                        </time>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </ul>
          )}
        </div>

        {/* Write a review */}
        <aside className="h-fit rounded-card border border-line-soft p-7 lg:sticky lg:top-24">
          <h2 className="text-[21px] font-semibold tracking-[-0.015em]">
            {t.testimonials.writeTitle}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            {t.testimonials.writeLead}
          </p>
          <div className="mt-6 border-t border-line-soft pt-6">
            <ReviewForm />
          </div>
        </aside>
      </div>
    </div>
  );
}
