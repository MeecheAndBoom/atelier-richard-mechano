import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getTiles } from "@/lib/categories";
import { TileForm } from "@/components/admin/TileForm";
import { BackLink } from "@/components/admin/AdminUi";

export const metadata: Metadata = {
  title: "Edit tile",
  robots: { index: false, follow: false },
};

export default async function EditTilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const tiles = await getTiles();
  const tile = tiles.find((item) => item.id === id);
  if (!tile) notFound();

  return (
    <>
      <BackLink href="/admin/categories" label="Back to categories" />
      <div>
        <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
          Edit tile
        </h1>
        <p className="mt-1 font-mono text-[14px] text-muted">{tile.id}</p>
      </div>
      <TileForm tile={tile} />
    </>
  );
}
