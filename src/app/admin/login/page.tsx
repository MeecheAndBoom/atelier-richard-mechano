import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Left: brand panel */}
      <section className="relative hidden overflow-hidden bg-graphite lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_20%_10%,rgba(0,113,227,0.22),transparent_60%)]"
        />
        <img
          src="/logo-icon.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 bottom-[-40px] h-[420px] w-[420px] object-contain opacity-[0.08]"
        />
        <Link href="/" className="relative flex items-center gap-3">
          <Image
            src="/full-logo.png"
            alt="Atelier Richard Méchano"
            width={836}
            height={285}
            priority
            className="h-9 w-auto brightness-0 invert"
          />
        </Link>
        <div className="relative max-w-[420px]">
          <h1 className="text-[34px] leading-[1.1] font-semibold tracking-[-0.03em] text-white">
            The workshop back office.
          </h1>
          <p className="mt-4 text-[15.5px] leading-relaxed text-white/70">
            Orders, parts, content and payment proofs — all in one place, kept
            in sync with the storefront.
          </p>
          <ul className="mt-8 flex flex-col gap-3 text-[14.5px] text-white/80">
            {[
              { icon: "fa-bag-shopping", text: "Live order and payment-proof queue" },
              { icon: "fa-gears", text: "Parts inventory with stock alerts" },
              { icon: "fa-newspaper", text: "Blog, guides and category tiles" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-[13px] text-white">
                  <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-[13px] text-white/45">
          © {new Date().getFullYear()} Atelier Richard Méchano
        </p>
      </section>

      {/* Right: form panel */}
      <section className="flex items-center justify-center bg-alt px-6 py-14 sm:px-10">
        <div className="page-enter w-full max-w-[400px]">
          {/* Mobile logo */}
          <Link href="/" className="mb-10 flex items-center gap-3 lg:hidden">
            <Image
              src="/full-logo.png"
              alt="Atelier Richard Méchano"
              width={836}
              height={285}
              priority
              className="h-8 w-auto"
            />
          </Link>

          <h2 className="text-[28px] font-semibold tracking-[-0.02em]">Sign in</h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
            Back office for orders, parts, content and payment proofs.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 text-[13.5px] text-muted transition-colors hover:text-ink"
          >
            <i className="fa-solid fa-arrow-left text-[11px]" aria-hidden="true" />
            Back to site
          </Link>
        </div>
      </section>
    </main>
  );
}
