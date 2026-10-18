import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TileForm } from "@/components/admin/TileForm";
import { BackLink } from "@/components/admin/AdminUi";

export const metadata: Metadata = {
  title: "New tile",
  robots: { index: false, follow: false },
};

export default async function NewTilePage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <>
      <BackLink href="/admin/categories" label="Back to categories" />
      <div>
        <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
          New tile
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Category tiles link straight into the filtered shop grid.
        </p>
      </div>
      <TileForm />
    </>
  );
}
