import type { Metadata, Viewport } from "next";
import "./globals.css";
import { dictFor, getLocale } from "@/lib/i18n/server";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { absoluteUrl, organizationJsonLd, SITE_KEYWORDS } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = dictFor(locale);

  return {
    metadataBase: absoluteUrl("/"),
    title: {
      default: t.meta.siteName,
      template: `%s — ${t.meta.siteName}`,
    },
    description: t.meta.description,
    keywords: [...t.meta.keywords, ...SITE_KEYWORDS],
    alternates: {
      canonical: absoluteUrl("/"),
      languages: { fr: absoluteUrl("/"), en: absoluteUrl("/") },
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      siteName: t.meta.siteName,
      title: t.meta.siteName,
      description: t.meta.description,
      url: absoluteUrl("/"),
      images: [{ url: "/og.png", width: 1200, height: 630, alt: t.meta.siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.siteName,
      description: t.meta.shortDescription,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const t = dictFor(locale);

  return (
    <html lang={locale}>
      <body className="bg-white text-ink antialiased">
        <a href="#main" className="skip-link">
          {t.nav.skipToContent}
        </a>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd(locale)),
          }}
        />
      </body>
    </html>
  );
}
