import Link from "next/link";

/**
 * Shared page masthead — one big statement (no eyebrows, per spec), a short
 * lead and optional actions, sitting on the alt surface with a hairline rule.
 */
export function PageHeader({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-line-soft bg-alt">
      <div className="section page-enter pt-14 pb-12 sm:pt-20 sm:pb-16">
        <h1 className="max-w-[900px] text-[36px] leading-[1.04] font-semibold tracking-[-0.03em] text-ink sm:text-[52px]">
          {title}
        </h1>
        {lead ? (
          <p className="mt-5 max-w-[640px] text-[17px] leading-[1.65] text-muted sm:text-[18px]">
            {lead}
          </p>
        ) : null}
        {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </header>
  );
}

/** Breadcrumb rail under the header — plain links, hairline separators. */
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="section flex flex-wrap items-center gap-2 pt-6 text-[13px] text-muted">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-2">
          {i > 0 ? <span aria-hidden="true" className="text-muted-light">/</span> : null}
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-accent">
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-ink-soft">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
