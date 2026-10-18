import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getProduct } from "@/lib/products";
import { ProductForm } from "@/components/admin/ProductForm";
import { BackLink } from "@/components/admin/AdminUi";

export const metadata: Metadata = {
  title: "Edit part",
  robots: { index: false, follow: false },
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <>
      <BackLink href="/admin/products" label="Back to parts" />
      <div>
        <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
          Edit part
        </h1>
        <p className="mt-1 font-mono text-[14px] text-muted">
          {product.slug} · {product.partNumber}
        </p>
      </div>
      <ProductForm product={product} />
    </>
  );
}
