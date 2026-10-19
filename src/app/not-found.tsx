import Link from "next/link";
import { dictFor, getLocale } from "@/lib/i18n/server";

const SUGGESTIONS = [
  { href: "/shop", icon: "fa-bag-shopping" },
  { href: "/blog", icon: "fa-newspaper" },
  { href: "/guides", icon: "fa-book-open" },
  { href: "/contact", icon: "fa-paper-plane" },
] as const;

export default async function NotFound() {
  const locale = await getLocale();
  const t = dictFor(locale);

  return (
    <main
      id="main"
      className="relative grid min-h-[80vh] place-items-center overflow-hidden bg-white px-6 py-20"
    >
      {/* Soft blueprint grid + glow, echoing the workshop theme */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,#f7faff_0%,#ffffff_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5] bg-[linear-gradient(#e7ecf5_1px,transparent_1px),linear-gradient(90deg,#e7ecf5_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(120%_60%_at_50%_0%,#000,transparent_70%)]"
      />

      <div className="page-enter relative max-w-[620px] text-center">
        <div className="relative mx-auto grid h-24 w-24 place-items-center">
          <span className="absolute inset-0 rounded-full bg-sky" aria-hidden="true" />
          <span className="relative font-mono text-[40px] leading-none font-semibold text-accent tabular-nums">
            404
          </span>
        </div>

        <h1 className="mt-8 text-[34px] leading-[1.05] font-semibold tracking-[-0.03em] sm:text-[46px]">
          {t.notFound.title}
        </h1>
        <p className="mx-auto mt-4 max-w-[460px] text-[16.5px] leading-relaxed text-muted">
          {t.notFound.lead}
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary btn-lg">
            <i className="fa-solid fa-house text-[12px]" aria-hidden="true" />
            <span>{t.notFound.home}</span>
          </Link>
          <Link href="/shop" className="btn btn-ghost btn-lg">
            <i className="fa-solid fa-bag-shopping text-[12px]" aria-hidden="true" />
            <span>{t.notFound.shop}</span>
          </Link>
        </div>

        {/* Quick jumps to the most-visited sections */}
        <div className="mt-12 border-t border-line-soft pt-8">
          <p className="text-micro font-semibold uppercase tracking-[0.08em] text-muted-light">
            {locale === "en" ? "Popular destinations" : "Les plus consultés"}
          </p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2.5">
            {SUGGESTIONS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-pill border border-line bg-white px-4 py-2 text-[13.5px] text-ink-soft transition-all duration-150 hover:border-accent hover:text-accent active:scale-95"
                >
                  <i className={`fa-solid ${item.icon} text-[12px]`} aria-hidden="true" />
                  <span>{item.href.replace("/", "") || "home"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
