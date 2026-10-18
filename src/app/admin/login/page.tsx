import type { Metadata } from "next";
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
    <main className="grid min-h-screen place-items-center bg-alt px-6 py-16">
      <div className="page-enter flex w-full flex-col items-center gap-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-[15px] text-white">
            <i className="fa-solid fa-wrench" aria-hidden="true" />
          </span>
          <span className="text-[17px] font-semibold tracking-[-0.01em]">
            Atelier Richard Méchano
          </span>
        </Link>

        <div className="w-full rounded-card border border-line-soft bg-white p-8 sm:p-10">
          <h1 className="text-[24px] font-semibold tracking-[-0.02em]">Admin sign in</h1>
          <p className="mt-2 mb-7 text-[14.5px] text-muted">
            Back office for orders, parts, content and payment proofs.
          </p>
          <LoginForm />
          <p className="mt-6 border-t border-line-soft pt-5 text-[13px] leading-relaxed text-muted-light">
            Credentials come from <span className="font-medium text-muted">ADMIN_EMAIL</span> /{" "}
            <span className="font-medium text-muted">ADMIN_PASSWORD</span> in{" "}
            <span className="font-mono">.env.local</span> when MongoDB is not connected.
          </p>
        </div>
      </div>
    </main>
  );
}
