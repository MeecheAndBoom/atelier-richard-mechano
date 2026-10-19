import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { listOrders } from "@/lib/orders";
import { listEnquiries } from "@/lib/enquiries";
import { getProducts } from "@/lib/products";
import { getReviews } from "@/lib/reviews";
import { money, dateTime } from "@/lib/format";
import { AdminHead, StatCard, Pill } from "@/components/admin/AdminUi";
import { STATUS_TONE } from "./orders/tone";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? (value[0] ?? "") : (value ?? "");

/** Filters orders down to a day / month / year window (default: all time). */
function withinRange(iso: string | undefined, range: string): boolean {
  if (range === "all" || !iso) return true;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return true;
  const now = new Date();
  if (range === "day") {
    return date.toDateString() === now.toDateString();
  }
  if (range === "month") {
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }
  if (range === "year") {
    return date.getFullYear() === now.getFullYear();
  }
  return true;
}

const RANGES = [
  { value: "day", label: "Today" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
  { value: "all", label: "All time" },
] as const;

export default async function AdminOverviewPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const sp = await searchParams;
  const range = first(sp.range) || "all";

  const [allOrders, enquiries, products, reviews] = await Promise.all([
    listOrders(),
    listEnquiries(),
    getProducts(),
    getReviews(),
  ]);

  const orders = allOrders.filter((o) => withinRange(o.createdAt, range));

  const revenue = orders
    .filter((o) => o.payment.status === "received")
    .reduce((sum, o) => sum + o.total, 0);
  const proofQueue = orders.filter(
    (o) => o.payment.proof && !o.payment.proof.decision,
  );
  const unhandled = enquiries.filter((e) => !e.handled);
  const recent = orders.slice(0, 6);

  return (
    <>
      <AdminHead
        title="Overview"
        subtitle="Orders, payment proofs and live inventory at a glance."
      />

      {/* Range filter — day / month / year / all time */}
      <nav aria-label="Filter by period" className="flex flex-wrap items-center gap-2">
        {RANGES.map((r) => {
          const active = range === r.value;
          return (
            <Link
              key={r.value}
              href={r.value === "all" ? "/admin" : `/admin?range=${r.value}`}
              aria-current={active ? "page" : undefined}
              className={`rounded-pill border px-4 py-2 text-[13.5px] transition-all duration-150 active:scale-95 ${
                active
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-white text-ink-soft hover:border-accent hover:text-accent"
              }`}
            >
              {r.label}
            </Link>
          );
        })}
      </nav>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Orders" value={String(orders.length)} icon="fa-bag-shopping" />
        <StatCard
          label="Revenue (paid)"
          value={money(revenue)}
          icon="fa-euro-sign"
          tone="success"
        />
        <StatCard
          label="Proofs to review"
          value={String(proofQueue.length)}
          icon="fa-file-invoice-dollar"
          tone={proofQueue.length ? "warning" : "alt"}
        />
        <StatCard
          label="Open enquiries"
          value={String(unhandled.length)}
          icon="fa-envelope"
          tone={unhandled.length ? "warning" : "alt"}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Parts live" value={String(products.length)} icon="fa-gears" tone="alt" />
        <StatCard
          label="Reviews published"
          value={String(reviews.filter((r) => r.published).length)}
          icon="fa-star"
          tone="alt"
        />
        <StatCard
          label="Drafts (parts + posts)"
          value={String(products.filter((p) => p.status === "draft").length)}
          icon="fa-pen-ruler"
          tone="alt"
        />
      </div>

      {/* Payment proof queue */}
      {proofQueue.length ? (
        <section className="rounded-card border border-[#f3dfbc] bg-[#fff9f0] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2.5 text-[18px] font-semibold tracking-[-0.01em]">
              <i className="fa-solid fa-hourglass-half text-[15px] text-warning" aria-hidden="true" />
              Payment proofs waiting
            </h2>
            <span className="badge bg-white text-warning">{proofQueue.length}</span>
          </div>
          <ul className="mt-4 flex flex-col gap-2.5">
            {proofQueue.map((order) => (
              <li key={order.reference}>
                <Link
                  href={`/admin/orders/${order.reference}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-box bg-white px-4 py-3 text-[14.5px] transition-colors hover:border-accent"
                >
                  <span className="font-mono font-semibold">{order.reference}</span>
                  <span className="text-muted">{order.customer.name}</span>
                  <span className="font-medium tabular-nums">{money(order.total)}</span>
                  <i className="fa-solid fa-arrow-right text-[11px] text-muted-light" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        {/* Recent orders */}
        <section className="rounded-card bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[18px] font-semibold tracking-[-0.01em]">Recent orders</h2>
            <Link href="/admin/orders" className="text-[14px] text-accent hover:underline">
              All orders →
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-6 text-[14.5px] text-muted">
              No orders yet — they land here right after checkout.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col">
              {recent.map((order) => (
                <li key={order.reference}>
                  <Link
                    href={`/admin/orders/${order.reference}`}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft py-3 text-[14.5px] transition-colors last:border-0 hover:text-accent"
                  >
                    <span className="font-mono font-medium">{order.reference}</span>
                    <span className="min-w-0 flex-1 truncate text-muted">
                      {order.customer.name}
                    </span>
                    <Pill tone={STATUS_TONE[order.status] ?? "neutral"}>
                      {order.status}
                    </Pill>
                    <span className="font-medium tabular-nums">{money(order.total)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Open enquiries */}
        <section className="rounded-card bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[18px] font-semibold tracking-[-0.01em]">Open enquiries</h2>
            <Link href="/admin/enquiries" className="text-[14px] text-accent hover:underline">
              All enquiries →
            </Link>
          </div>
          {unhandled.length === 0 ? (
            <p className="mt-6 text-[14.5px] text-muted">Inbox zero — nothing waiting.</p>
          ) : (
            <ul className="mt-4 flex flex-col">
              {unhandled.slice(0, 6).map((enquiry) => (
                <li
                  key={enquiry.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft py-3 text-[14.5px] last:border-0"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">{enquiry.name}</span>
                    <span className="truncate text-[13px] text-muted">{enquiry.email}</span>
                  </span>
                  <Pill tone="accent">{enquiry.kind}</Pill>
                  <span className="text-[13px] text-muted-light tabular-nums">
                    {enquiry.createdAt ? dateTime(enquiry.createdAt) : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
