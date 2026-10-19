import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTiles } from "@/lib/categories";
import { CATEGORY_LABELS } from "@/lib/constants";
import { AdminHead, Pill } from "@/components/admin/AdminUi";
import { ConfirmAction } from "@/components/admin/DeleteButton";
import { deleteTileAction } from "@/actions/admin";

export const metadata: Metadata = {
  title: "Categories",
  robots: { index: false, follow: false },
};

export default async function AdminCategoriesPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const tiles = await getTiles();

  return (
    <>
      <AdminHead
        title="Categories & taxonomy"
        subtitle="Tiles that drive the homepage and shop browse grids."
        action={
          <Link href="/admin/categories/new" className="btn btn-primary btn-sm">
            <i className="fa-solid fa-plus text-[12px]" aria-hidden="true" />
            <span>New tile</span>
          </Link>
        }
      />

      {tiles.length === 0 ? (
        <p className="rounded-card bg-white px-6 py-14 text-center text-[15px] text-muted">
          No tiles yet — the homepage falls back to the built-in category chips until you add
          some.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tiles.map((tile) => (
            <div key={tile.id} className="rounded-card bg-white p-5">
              <div className="flex gap-4">
                <span className="h-14 w-14 shrink-0 overflow-hidden rounded-box border border-line-soft bg-alt">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tile.image || "/images/placeholder.jpg"}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate text-[15px] font-medium">
                    {CATEGORY_LABELS[tile.name as keyof typeof CATEGORY_LABELS]?.fr ?? tile.name}
                  </span>
                  <span className="font-mono text-[12.5px] text-muted">{tile.name}</span>
                  <span className="pt-1">
                    <Pill tone="accent">{tile.type}</Pill>
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-line-soft pt-3">
                <Link
                  href={`/admin/categories/${tile.id}`}
                  className="btn btn-ghost btn-sm text-accent"
                >
                  <i className="fa-solid fa-pen text-[11px]" aria-hidden="true" />
                  <span>Edit</span>
                </Link>
                <ConfirmAction
                  action={deleteTileAction}
                arg={tile.id}
                  label="Delete"
                  confirmLabel="Confirm"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
