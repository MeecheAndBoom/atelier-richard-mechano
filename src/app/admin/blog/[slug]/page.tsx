import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getPost } from "@/lib/blog";
import { BlogForm } from "@/components/admin/BlogForm";
import { BackLink } from "@/components/admin/AdminUi";

export const metadata: Metadata = {
  title: "Edit article",
  robots: { index: false, follow: false },
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <BackLink href="/admin/blog" label="Back to blog" />
      <div>
        <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
          Edit article
        </h1>
        <p className="mt-1 font-mono text-[14px] text-muted">/blog/{post.slug}</p>
      </div>
      <BlogForm post={post} />
    </>
  );
}
