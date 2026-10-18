"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LanguageToggle } from "@/components/i18n/LanguageToggle";
import { useCart, cartCount } from "@/store/cart";

const NAV_LINKS = [
  { href: "/shop", key: "shop" },
  { href: "/blog", key: "blog" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
  { href: "/track", key: "track" },
] as const;

/**
 * Fixed translucent top bar (apple.com pattern). Mobile menu slides down
 * under the bar; cart badge counts from the persisted store.
 */
export function Nav() {
  const { t } = useLocale();
  const pathname = usePathname();
  const lines = useCart((s) => s.lines);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the mobile menu when the route changes (adjust-state-during-render
  // pattern — no cascading effect run).
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const count = cartCount(lines);

  return (
    <header
      className={`nav-blur fixed inset-x-0 top-0 z-50 border-b transition-colors duration-[240ms] ${
        scrolled || open ? "border-line" : "border-transparent"
      }`}
    >
      <nav
        aria-label="Main"
        className="section flex h-[52px] items-center justify-between gap-6"
      >
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label={t.meta.siteName}
        >
          <Image
            src="/full-logo.png"
            alt={t.meta.siteName}
            width={836}
            height={285}
            priority
            className="h-[26px] w-auto sm:h-[28px]"
          />
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative text-[13.5px] transition-colors duration-150 after:absolute after:-bottom-1.5 after:left-0 after:h-[1.5px] after:bg-accent after:transition-all after:duration-200 hover:text-ink ${
                    active
                      ? "text-ink after:w-full"
                      : "text-muted after:w-0 hover:after:w-full"
                  }`}
                >
                  {t.nav[link.key]}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <LanguageToggle className="hidden sm:flex" />

          <Link
            href="/cart"
            className="relative grid h-9 w-9 place-items-center rounded-pill text-ink transition-all duration-150 hover:bg-alt active:scale-95"
            aria-label={t.nav.cart}
          >
            <i className="fa-solid fa-bag-shopping text-[15px]" aria-hidden="true" />
            {count > 0 ? (
              <span
                className="absolute -top-0.5 -right-0.5 grid h-[17px] min-w-[17px] place-items-center rounded-pill bg-accent px-1 text-[10px] font-semibold text-white tabular-nums"
                aria-hidden="true"
              >
                {count > 9 ? "9+" : count}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid h-9 w-9 place-items-center rounded-pill text-ink transition-all duration-150 hover:bg-alt active:scale-95 md:hidden"
            aria-label={open ? t.nav.close : t.nav.menu}
          >
            <i
              className={`fa-solid ${open ? "fa-xmark" : "fa-bars"} text-[15px]`}
              aria-hidden="true"
            />
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        className={`nav-blur overflow-hidden border-b border-line transition-[max-height,opacity] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0 border-b-transparent"
        }`}
      >
        <ul className="section flex flex-col gap-1 py-4">
          {[...NAV_LINKS, { href: "/help", key: "help" as const }].map((link, i) => (
            <li
              key={link.href}
              className="transition-all duration-300"
              style={{
                transitionDelay: open ? `${60 + i * 40}ms` : "0ms",
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(-6px)",
              }}
            >
              <Link
                href={link.href}
                className="block rounded-box px-3 py-3 text-[17px] font-medium text-ink transition-colors hover:bg-alt"
              >
                {t.nav[link.key]}
              </Link>
            </li>
          ))}
          <li className="mt-3 flex items-center justify-between border-t border-line-soft pt-4">
            <span className="text-[13px] text-muted">{t.nav.language}</span>
            <LanguageToggle />
          </li>
        </ul>
      </div>
    </header>
  );
}
