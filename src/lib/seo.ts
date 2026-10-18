import type { Metadata } from "next";
import { SITE } from "./constants";
import type { Product, BlogPost } from "./types";
import type { Locale } from "./i18n/config";
import { dictionaries } from "./i18n/dictionaries";

export const SITE_KEYWORDS = [
  "pièces détachées",
  "spare parts",
  "atelier richard méchano",
  "pièces auto en ligne",
];

export function absoluteUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "https://www.atelier-richard-mechano.com";
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Localized product title — falls back to French when no EN variant exists. */
export function localizedTitle(product: Product, locale: Locale): string {
  return locale === "en" && product.titleEn ? product.titleEn : product.title;
}

export function localizedDescription(product: Product, locale: Locale): string {
  return locale === "en" && product.descriptionEn
    ? product.descriptionEn
    : product.description;
}

export function localizedPost(post: BlogPost, locale: Locale) {
  if (locale === "en" && post.titleEn) {
    return {
      title: post.titleEn,
      excerpt: post.excerptEn ?? post.excerpt,
      body: post.bodyEn ?? post.body,
    };
  }
  return { title: post.title, excerpt: post.excerpt, body: post.body };
}

export function productTitle(product: Product, locale: Locale = "fr"): string {
  const t = dictionaries[locale];
  return `${localizedTitle(product, locale)} | ${t.product.partNumber} ${product.partNumber} — ${t.meta.siteName}`;
}

export function productDescription(product: Product, locale: Locale = "fr"): string {
  const base = localizedDescription(product, locale);
  return base.length > 155 ? `${base.slice(0, 152).trimEnd()}…` : base;
}

export function productKeywords(product: Product): string[] {
  return [
    product.partNumber,
    product.brand,
    product.make,
    product.model,
    product.category,
    ...product.tags,
  ].filter(Boolean);
}

export function pageMetadata({
  title,
  description,
  path,
  locale,
  noIndex = false,
  image,
}: {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  noIndex?: boolean;
  image?: string;
}): Metadata {
  const t = dictionaries[locale];
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      title,
      description,
      url: absoluteUrl(path),
      siteName: t.meta.siteName,
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      images: [
        {
          url: image ?? "/atelier_richard_mecano_open_graph.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image ?? "/atelier_richard_mecano_open_graph.png"],
    },
  };
}

/* ── JSON-LD builders ─────────────────────────────────────────── */

export function organizationJsonLd(locale: Locale) {
  const t = dictionaries[locale];
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t.meta.siteName,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logo-icon.png"),
    email: SITE.email,
    telephone: SITE.phoneHref,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address,
      addressLocality: SITE.location,
      addressCountry: "FR",
    },
  };
}

export function productJsonLd(product: Product, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: localizedTitle(product, locale),
    sku: product.partNumber,
    description: productDescription(product, locale),
    brand: { "@type": "Brand", name: product.brand },
    category: product.category,
    image: product.images.map((img) => absoluteUrl(img)),
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "EUR",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/shop/${product.slug}`),
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
  locale: Locale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
    inLanguage: locale,
  };
}

export function faqJsonLd(
  faqs: { q: string; a: string }[],
  locale: Locale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
