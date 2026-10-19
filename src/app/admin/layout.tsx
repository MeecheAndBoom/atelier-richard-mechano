import Link from "next/link";
import Image from "next/image";
import { getSession, destroySession } from "@/lib/auth";
import { AdminGuard } from "@/components/admin/AdminGuard";

/**
 * Admin chrome — English by design (the back office isn't translated), the
 * public site carries the FR/EN toggle. Login renders without the shell.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  const nav = [
    { href: "/admin", label: "Overview", icon: "fa-chart-line" },
    { href: "/admin/orders", label: "Orders", icon: "fa-bag-shopping" },
    { href: "/admin/products", label: "Parts", icon: "fa-gears" },
    { href: "/admin/blog", label: "Blog", icon: "fa-newspaper" },
    { href: "/admin/categories", label: "Categories", icon: "fa-table-cells-large" },
    { href: "/admin/reviews", label: "Reviews", icon: "fa-star" },
    { href: "/admin/enquiries", label: "Enquiries", icon: "fa-envelope" },
    { href: "/admin/settings", label: "Settings", icon: "fa-gear" },
  ];

  return (
    <AdminGuard>
      {session ? (
        <div className="min-h-screen bg-alt">
          <header className="nav-blur sticky top-0 z-40 border-b border-line-soft bg-white/85">
            <div className="section flex h-14 items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-5">
                <Link href="/admin" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em]">
                  <Image
                    src="/full-logo.png"
                    alt="Atelier Richard Méchano"
                    width={836}
                    height={285}
                    priority
                    className="h-7 w-auto sm:h-8"
                  />
                  <span className="hidden text-muted sm:block">— Admin</span>
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  target="_blank"
                  className="btn btn-ghost btn-sm hidden sm:inline-flex"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square text-[11px]" aria-hidden="true" />
                  <span>View site</span>
                </Link>
                <span className="hidden text-[13px] text-muted lg:block">{session.email}</span>
                <form
                  action={async () => {
                    "use server";
                    await destroySession();
                  }}
                  className="m-0"
                >
                  <button type="submit" className="btn btn-sm btn-ghost">
                    <i className="fa-solid fa-right-from-bracket text-[11px]" aria-hidden="true" />
                    <span>Sign out</span>
                  </button>
                </form>
              </div>
            </div>
          </header>

          <div className="section grid gap-8 pb-20 pt-8 lg:grid-cols-[210px_1fr] lg:gap-12">
            <aside className="h-fit rounded-card bg-white p-4 lg:sticky lg:top-20">
              <nav aria-label="Admin sections" className="grid grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-1">
                {nav.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2.5 rounded-box px-3 py-2.5 text-[14.5px] text-ink-soft transition-colors hover:bg-alt hover:text-ink"
                  >
                    <i className={`fa-solid ${link.icon} w-4 text-center text-[13px] text-muted`} aria-hidden="true" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </nav>
            </aside>
            <main className="flex min-w-0 flex-col gap-8">{children}</main>
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </AdminGuard>
  );
}
