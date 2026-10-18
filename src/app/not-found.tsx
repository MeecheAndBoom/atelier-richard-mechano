import Link from "next/link";
import { dictFor, getLocale } from "@/lib/i18n/server";

export default async function NotFound() {
  const t = dictFor(await getLocale());

  return (
    <main id="main" className="grid min-h-[80vh] place-items-center bg-white px-6 py-20">
      <div className="page-enter max-w-[560px] text-center">
        <p className="font-mono text-[80px] leading-none font-semibold text-line tabular-nums">
          404
        </p>
        <h1 className="mt-5 text-[32px] leading-tight font-semibold tracking-[-0.03em] sm:text-[40px]">
          {t.notFound.title}
        </h1>
        <p className="mt-3 text-[16.5px] leading-relaxed text-muted">{t.notFound.lead}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            <i className="fa-solid fa-house text-[12px]" aria-hidden="true" />
            <span>{t.notFound.home}</span>
          </Link>
          <Link href="/shop" className="btn btn-ghost">
            <i className="fa-solid fa-bag-shopping text-[12px]" aria-hidden="true" />
            <span>{t.notFound.shop}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
