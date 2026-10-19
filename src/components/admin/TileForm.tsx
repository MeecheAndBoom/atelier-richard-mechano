"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveTile, type AdminActionResult } from "@/actions/admin";
import { Field } from "@/components/ui/FormBits";
import type { TaxonomyTile } from "@/lib/types";

const TILE_TYPES = [
  { id: "category", label: "Category" },
  { id: "make", label: "Vehicle make" },
  { id: "brand", label: "Part brand" },
  { id: "model", label: "Model" },
] as const;

/** Create/edit tile for the shop taxonomy grids (homepage + shop headers). */
export function TileForm({ tile }: { tile?: TaxonomyTile }) {
  const [state, formAction, pending] = useActionState<AdminActionResult | null, FormData>(
    saveTile,
    null,
  );

  if (state?.ok) {
    return (
      <div className="rounded-card flex items-center gap-3 border border-[#cfe8d8] bg-[#eaf6ee] p-6">
        <i className="fa-solid fa-circle-check text-success" aria-hidden="true" />
        <p className="text-[15px] font-medium text-success">Tile saved.</p>
        <Link href="/admin/categories" className="btn btn-ghost btn-sm ml-auto">
          Back to categories
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-card bg-white p-6 sm:p-8">
      {tile ? <input type="hidden" name="id" value={tile.id} /> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Name" htmlFor="tile-name" required>
            <input
              id="tile-name"
              name="name"
              required
              defaultValue={tile?.name ?? ""}
              placeholder="Freinage"
              className="field"
            />
          </Field>
        </div>

        <div>
          <label htmlFor="tile-type" className="field-label">
            Type
          </label>
          <select
            id="tile-type"
            name="type"
            defaultValue={tile?.type ?? "category"}
            className="field cursor-pointer"
          >
            {TILE_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <Field
          label="Custom link"
          htmlFor="tile-href"
          hint="Optional — defaults to a filtered shop link."
        >
          <input
            id="tile-href"
            name="href"
            defaultValue={tile?.href ?? ""}
            placeholder="/shop?category=brakes"
            className="field"
          />
        </Field>

        <div className="sm:col-span-2">
          <Field
            label="Image URL"
            htmlFor="tile-image"
            hint="Public path or Cloudinary URL. Falls back to the generic part placeholder."
          >
            <input
              id="tile-image"
              name="image"
              defaultValue={tile?.image ?? ""}
              placeholder="/images/categories/brakes.jpg"
              className="field"
            />
          </Field>
        </div>
      </div>

      {tile?.image ? (
        <div className="mt-5 overflow-hidden rounded-box border border-line-soft bg-alt">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tile.image} alt="" className="aspect-[16/6] w-full object-cover" />
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="btn btn-primary btn-sm">
          {pending ? (
            <i className="fa-solid fa-circle-notch animate-spin text-[12px]" aria-hidden="true" />
          ) : (
            <i className="fa-solid fa-floppy-disk text-[12px]" aria-hidden="true" />
          )}
          <span>{pending ? "Saving…" : tile ? "Save tile" : "Create tile"}</span>
        </button>
        {state && !state.ok ? (
          <span role="alert" className="text-[13.5px] text-danger">
            {state.error}
          </span>
        ) : null}
      </div>
    </form>
  );
}
