import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { BackLink } from "@/components/admin/AdminUi";

export const metadata: Metadata = {
  title: "New part",
  robots: { index: false, follow: false },
};

export default async function NewProductPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <>
      <BackLink href="/admin/products" label="Back to parts" />
      <div>
        <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
          New part
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          French fields are required, English variants improve the EN storefront.
        </p>
      </div>
      <ProductForm />
    </>
  );
}
