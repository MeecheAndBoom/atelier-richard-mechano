import type { CSSProperties } from "react";
import { Stars } from "@/components/ui/FormBits";
import { shortDate } from "@/lib/format";
import type { Review } from "@/lib/types";

/**
 * Horizontal auto-scrolling reviews strip for the home page.
 * Two identical tracks slide left in a seamless loop (CSS only); hovering
 * pauses, and prefers-reduced-motion turns it into a static scrollable row.
 * The duplicated track is hidden from assistive tech.
 */
export function ReviewsMarquee({ reviews, locale }: { reviews: Review[]; locale: "fr" | "en" }) {
  if (!reviews.length) return null;
  // ~14s per card keeps the pace readable without feeling slow.
  const duration = Math.max(40, reviews.length * 14);

  const track = (clone: boolean) => (
    <ul
      className="flex shrink-0 items-stretch"
      aria-hidden={clone ? "true" : undefined}
    >
      {reviews.map((review) => (
        <li key={`${review.name}-${review.date}-${clone ? "b" : "a"}`} className="w-[340px] shrink-0 pr-5 sm:w-[400px]">
          <figure className="card-flat flex h-full flex-col gap-4 p-7">
            <Stars rating={review.rating} />
            <blockquote className="text-[15px] leading-[1.7] text-ink-soft">
              {review.title ? (
                <span className="mb-1.5 block font-semibold text-ink">{review.title}</span>
              ) : null}
              <span className="line-clamp-4">{review.body}</span>
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
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee">
      <div
        className="marquee-group flex"
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
