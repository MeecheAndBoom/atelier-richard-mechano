import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BlogForm } from "@/components/admin/BlogForm";
import { BackLink } from "@/components/admin/AdminUi";

export const metadata: Metadata = {
  title: "New article",
  robots: { index: false, follow: false },
};

export default async function NewPostPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <>
      <BackLink href="/admin/blog" label="Back to blog" />
      <div>
        <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
          New article
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Body supports headings, bold, lists, links and code blocks — plain markdown, no raw
          HTML.
        </p>
      </div>
      <BlogForm />
    </>
  );
}
