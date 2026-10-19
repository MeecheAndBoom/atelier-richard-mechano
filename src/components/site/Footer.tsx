"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { COOKIE_MANAGE_EVENT } from "@/components/site/CookieConsent";
import { LanguageToggle } from "@/components/i18n/LanguageToggle";
import { categoryLabel } from "@/lib/constants";

const LEGAL_SLUGS = [
  "privacy",
  "terms",
  "notice",
  "returns",
  "cancellation",
  "shipping",
  "delivery",
  "compliance",
] as const;

export function Footer() {
  const { locale, t } = useLocale();
  const year = new Date().getFullYear();

  const columns: { heading: string; links: { href: string; label: string }[] }[] = [
    {
      heading: t.footer.shop,
      links: [
        { href: "/", label: t.nav.home },
        { href: "/shop", label: t.footer.allParts },
        { href: "/cart", label: t.footer.cart },
        { href: "/track", label: t.footer.trackOrder },
        { href: "/retrieve-quote", label: t.footer.retrieveQuote },
      ],
    },
    {
      heading: t.footer.company,
      links: [
        { href: "/about", label: t.footer.aboutUs },
        { href: "/blog", label: t.footer.blogGuides },
        { href: "/guides", label: locale === "en" ? "Practical guides" : "Guides pratiques" },
        { href: "/testimonials", label: t.testimonials.title },
        { href: "/why-buy-from-us", label: t.whyBuy.title },
        { href: "/first-time-buyers", label: t.firstTime.title },
      ],
    },
    {
      heading: t.footer.support,
      links: [
        { href: "/help", label: t.footer.faq },
        { href: "/contact", label: t.footer.contactUs },
        { href: "/tools", label: locale === "en" ? "Workshop tools" : "Outils d’atelier" },
        { href: "/resources", label: t.footer.resources },
        { href: "/affiliate-program", label: t.footer.affiliate },
        { href: "/sitemap", label: t.sitemapPage.title },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-line-soft bg-alt">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
      >
        {/* Left copy: 900px (3× the old 300px) centred at 2% — most of the
            left half overflows the footer and is clipped by overflow-hidden. */}
        <img
          src="/logo-icon.png"
          alt=""
          className="absolute top-1/2 left-[2%] h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.08]"
        />
        {/* Right copy: mirror at 102% — most of the right half overflows and is clipped */}
        <img
          src="/logo-icon.png"
          alt=""
          className="absolute top-1/2 left-[102%] h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.08]"
        />
      </div>
      {/* Mobile: logo centered, 80vw (uncapped — fills small screens) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden"
      >
        <img
          src="/logo-icon.png"
          alt=""
          className="absolute top-1/2 left-1/2 h-[80vw] w-[80vw] -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.07]"
        />
      </div>
      <div className="section relative py-14 md:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          {/* Identity + contact */}
          <div>
            <Image
              src="/full-logo.png"
              alt={t.meta.siteName}
              width={836}
              height={285}
              className="h-10 w-auto"
            />
            <p className="mt-4 max-w-[300px] text-[14px] leading-relaxed text-muted">
              {t.meta.tagline}
            </p>

            <ul className="mt-5 space-y-2 text-[14px] text-muted">
              <li className="flex items-start gap-2.5">
                <i className="fa-solid fa-location-dot mt-1 w-3.5 text-muted-light" aria-hidden="true" />
                <span>24 Rue de l’Industrie, 69007 Lyon</span>
              </li>
              <li className="flex items-center gap-2.5">
                <i className="fa-solid fa-phone w-3.5 text-muted-light" aria-hidden="true" />
                <a href="tel:+33472184090" className="hover:text-ink transition-colors">
                  +33 4 72 18 40 90
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <i className="fa-solid fa-envelope w-3.5 text-muted-light" aria-hidden="true" />
                <a
                  href="mailto:sales@atelier-richard-mechano.com"
                  className="break-all hover:text-ink transition-colors"
                >
                  sales@atelier-richard-mechano.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <i className="fa-brands fa-instagram w-3.5 text-muted-light" aria-hidden="true" />
                <a
                  href="https://www.instagram.com/atelierrichard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink transition-colors"
                >
                  @atelierrichard
                </a>
              </li>
            </ul>
          </div>

          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h3 className="text-micro font-semibold uppercase tracking-[0.08em] text-muted">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-ink-soft transition-colors duration-150 hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Category chips */}
        <div className="mt-12 border-t border-line pt-8">
          <h3 className="text-micro font-semibold uppercase tracking-[0.08em] text-muted">
            {t.footer.byCategory}
          </h3>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {(
              [
                "Engine",
                "Brakes",
                "Electrical",
                "Transmission",
                "Suspension",
                "Filters",
                "Cooling",
                "Tools",
                "Rims",
                "WheelDrums",
                "Tires",
                "TailLights",
                "Headlights",
              ] as const
            ).map((category) => (
                <Link
                  key={category}
                  href={`/shop?category=${encodeURIComponent(category)}`}
                  className="rounded-pill border border-line bg-white px-3.5 py-1.5 text-[13px] text-ink-soft transition-all duration-150 hover:border-accent hover:text-accent active:scale-95"
                >
                  {categoryLabel(category, locale)}
                </Link>
              ),
            )}
          </div>
        </div>

        {/* Legal row */}
        <div className="mt-10 border-t border-line pt-8">
          <h3 className="text-micro font-semibold uppercase tracking-[0.08em] text-muted">
            {t.footer.legal}
          </h3>
          <ul className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_SLUGS.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/legal/${slug}`}
                  className="text-[13px] text-muted transition-colors hover:text-ink"
                >
                  {t.legal.pages[slug]}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent(COOKIE_MANAGE_EVENT))
                }
                className="text-[13px] text-muted transition-colors hover:text-ink"
              >
                <i className="fa-solid fa-cookie-bite mr-1.5 text-[11px]" aria-hidden="true" />
                {t.cookies.manage}
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <div className="section flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
          <p className="text-[13px] text-muted">
            © {year} {t.meta.siteName}. {t.footer.rights}
          </p>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <Link
              href="/admin"
              className="text-[13px] text-muted transition-colors hover:text-ink"
            >
              <i className="fa-solid fa-lock mr-1.5 text-[11px]" aria-hidden="true" />
              {t.admin.dashboard}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
