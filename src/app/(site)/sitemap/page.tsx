import type { Metadata } from "next";
import Link from "next/link";
import { getDict, getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { LEGAL_PAGES, legalTitle } from "@/lib/legal";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDict();
  return pageMetadata({
    title: t.sitemapPage.title,
    description: t.sitemapPage.lead,
    path: "/sitemap",
    locale,
  });
}

type LinkItem = { label: string; href: string };

export default async function SitemapPage() {
  const t = await getDict();
  const locale = await getLocale();

  const main: LinkItem[] = [
    { label: t.nav.shop, href: "/shop" },
    { label: t.nav.blog, href: "/blog" },
    { label: t.nav.about, href: "/about" },
    { label: t.nav.contact, href: "/contact" },
    { label: t.nav.track, href: "/track" },
    { label: t.nav.help, href: "/help" },
  ];
  const shop: LinkItem[] = [
    { label: t.footer.allParts, href: "/shop" },
    { label: t.testimonials.title, href: "/testimonials" },
    { label: t.resources.title, href: "/resources" },
    { label: t.whyBuy.title, href: "/why-buy-from-us" },
    { label: t.firstTime.title, href: "/first-time-buyers" },
  ];
  const orders: LinkItem[] = [
    { label: t.nav.cart, href: "/cart" },
    { label: t.checkout.title, href: "/checkout" },
    { label: t.nav.track, href: "/track" },
    { label: t.retrieveQuote.title, href: "/retrieve-quote" },
    { label: t.affiliate.title, href: "/affiliate-program" },
  ];
  const help: LinkItem[] = [
    { label: t.help.title, href: "/help" },
    { label: t.contact.title, href: "/contact" },
    { label: t.nav.track, href: "/track" },
  ];
  const legal: LinkItem[] = LEGAL_PAGES.map((page) => ({
    label: legalTitle(page, locale),
    href: `/legal/${page.slug}`,
  }));
  const company: LinkItem[] = [
    { label: t.about.title, href: "/about" },
    { label: t.blog.title, href: "/blog" },
    { label: t.home.ctaButton, href: "/contact" },
  ];

  const groups: { title: string; links: LinkItem[] }[] = [
    { title: t.sitemapPage.main, links: main },
    { title: t.sitemapPage.shop, links: dedupe(shop) },
    { title: t.sitemapPage.account, links: dedupe(orders) },
    { title: t.sitemapPage.helpCenter, links: dedupe(help) },
    { title: t.sitemapPage.legalPages, links: legal },
    { title: t.sitemapPage.company, links: dedupe(company) },
  ];

  return (
    <div>
      <PageHeader title={t.sitemapPage.title} lead={t.sitemapPage.lead} />
      <section className="section grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, i) => (
          <Reveal key={group.title} delay={i * 50}>
            <nav aria-label={group.title} className="card-flat h-full p-7">
              <h2 className="text-[17px] font-semibold tracking-[-0.01em]">{group.title}</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="group flex items-center justify-between gap-3 text-[15px] text-muted transition-colors hover:text-accent"
                    >
                      <span>{link.label}</span>
                      <i
                        className="fa-solid fa-arrow-right text-[10px] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        ))}
      </section>
    </div>
  );
}

function dedupe(links: LinkItem[]): LinkItem[] {
  const seen = new Set<string>();
  return links.filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}
