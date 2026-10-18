import Link from "next/link";

/** Page title row shared by every admin screen. */
export function AdminHead({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
          {title}
        </h1>
        {subtitle ? <p className="mt-1 text-[15px] text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

/** Headline metric card. */
export function StatCard({
  label,
  value,
  icon,
  tone = "sky",
}: {
  label: string;
  value: string;
  icon: string;
  tone?: "sky" | "alt" | "success" | "warning";
}) {
  const tones = {
    sky: "bg-sky text-accent",
    alt: "bg-alt text-ink-soft",
    success: "bg-[#eaf6ee] text-success",
    warning: "bg-[#fff4e6] text-warning",
  } as const;
  return (
    <div className="rounded-card bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] text-muted">{label}</p>
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[13px] ${tones[tone]}`}>
          <i className={`fa-solid ${icon}`} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-[clamp(1.6rem,2.6vw,2.1rem)] font-semibold tracking-[-0.02em] text-ink tabular-nums">
        {value}
      </p>
    </div>
  );
}

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  align?: "left" | "right";
  className?: string;
};

/**
 * Data list that renders as a real table on desktop and as stacked tiles on
 * mobile (no tables on small screens — master prompt §14).
 */
export function ResponsiveList<T>({
  rows,
  getKey,
  columns,
  tile,
  empty,
}: {
  rows: T[];
  getKey: (row: T) => string;
  columns: Column<T>[];
  tile: (row: T) => React.ReactNode;
  empty: string;
}) {
  if (!rows.length) {
    return (
      <p className="rounded-card bg-white px-6 py-14 text-center text-[15px] text-muted">
        {empty}
      </p>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-card bg-white md:block">
        <table className="w-full border-collapse text-[14.5px]">
          <thead>
            <tr className="border-b border-line-soft text-left">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-5 py-3.5 text-[12.5px] font-medium tracking-[0.04em] text-muted uppercase ${
                    column.align === "right" ? "text-right" : ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={getKey(row)}
                className="border-b border-line-soft transition-colors last:border-0 hover:bg-alt/60"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-5 py-4 align-middle ${column.align === "right" ? "text-right" : ""} ${column.className ?? ""}`}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile tiles */}
      <ul className="flex flex-col gap-3 md:hidden">{rows.map((row) => <li key={getKey(row)}>{tile(row)}</li>)}</ul>
    </>
  );
}

/** Small status pill with consistent tones across admin screens. */
export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "accent";
}) {
  const tones = {
    neutral: "bg-alt text-muted",
    success: "bg-[#eaf6ee] text-success",
    warning: "bg-[#fff4e6] text-warning",
    danger: "bg-[#fdeeee] text-danger",
    accent: "bg-sky text-accent",
  } as const;
  return <span className={`badge ${tones[tone]}`}>{children}</span>;
}

/** Back link used at the top of detail screens. */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-[14px] text-accent transition-colors hover:underline"
    >
      <i className="fa-solid fa-arrow-left text-[11px]" aria-hidden="true" />
      {label}
    </Link>
  );
}
