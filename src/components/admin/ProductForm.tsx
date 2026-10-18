"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveProduct, type AdminActionResult } from "@/actions/admin";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Field } from "@/components/ui/FormBits";
import { PART_CATEGORIES, PART_CONDITIONS } from "@/lib/constants";
import type { Product } from "@/lib/types";

/**
 * Product create/edit form — French fields first, English variants beside
 * them. Lists submit as newline/comma-separated text (kept simple and
 * copy-paste friendly for an admin workflow).
 */
export function ProductForm({ product }: { product?: Product }) {
  const [state, formAction, pending] = useActionState<AdminActionResult | null, FormData>(
    saveProduct,
    null,
  );
  const [images, setImages] = useState<string[]>(product?.images ?? []);

  if (state?.ok) {
    return (
      <div className="rounded-card flex flex-col items-start gap-4 border border-[#cfe8d8] bg-[#eaf6ee] p-8">
        <p className="flex items-center gap-2.5 text-[16px] font-medium text-success">
          <i className="fa-solid fa-circle-check" aria-hidden="true" />
          Fiche enregistrée.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/admin/products" className="btn btn-primary btn-sm">
            <i className="fa-solid fa-arrow-left text-[12px]" aria-hidden="true" />
            <span>Retour aux pièces</span>
          </Link>
          <a href="/shop" className="btn btn-ghost btn-sm" target="_blank" rel="noreferrer">
            <i className="fa-solid fa-arrow-up-right-from-square text-[11px]" aria-hidden="true" />
            <span>Voir la boutique</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {state && !state.ok ? (
        <p role="alert" className="rounded-box bg-[#fdeeee] px-4 py-3 text-[14px] text-danger">
          {state.error}
        </p>
      ) : null}

      {product ? <input type="hidden" name="slug" value={product.slug} /> : null}

      {/* Identity */}
      <section className="rounded-card border border-line-soft p-6">
        <h2 className="mb-5 text-[17px] font-semibold">Identité</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Titre (FR)" htmlFor="title" required>
            <input id="title" name="title" required defaultValue={product?.title ?? ""} className="field" />
          </Field>
          <Field label="Titre (EN)" htmlFor="titleEn" optionalLabel="optionnel">
            <input id="titleEn" name="titleEn" defaultValue={product?.titleEn ?? ""} className="field" />
          </Field>
          <Field label="Référence atelier" htmlFor="partNumber" required hint="Gravée sur la pièce ou l’emballage.">
            <input id="partNumber" name="partNumber" required defaultValue={product?.partNumber ?? ""} className="field" />
          </Field>
          <Field label="SKU / code-barres" htmlFor="sku" optionalLabel="optionnel">
            <input id="sku" name="sku" defaultValue={product?.sku ?? ""} className="field" />
          </Field>
          <Field label="Marque (fabricant)" htmlFor="brand" required>
            <input id="brand" name="brand" required defaultValue={product?.brand ?? ""} className="field" placeholder="Bosch, Brembo…" />
          </Field>
          <Field label="État" htmlFor="condition" required>
            <select id="condition" name="condition" defaultValue={product?.condition ?? "new"} className="field">
              {PART_CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c === "new" ? "Neuf" : c === "refurb" ? "Reconditionné" : "Occasion"}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      {/* Fitment */}
      <section className="rounded-card border border-line-soft p-6">
        <h2 className="mb-5 text-[17px] font-semibold">Compatibilité</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Marque véhicule" htmlFor="make" required>
            <input id="make" name="make" required defaultValue={product?.make ?? ""} className="field" placeholder="Peugeot, VW…" />
          </Field>
          <Field label="Modèle" htmlFor="model" required>
            <input id="model" name="model" required defaultValue={product?.model ?? ""} className="field" placeholder="208, Golf…" />
          </Field>
          <Field label="Années" htmlFor="yearRange" hint="Format 2012–2019">
            <input id="yearRange" name="yearRange" defaultValue={product?.yearRange ?? ""} className="field" placeholder="2012–2019" />
          </Field>
        </div>
        <div className="mt-5">
          <Field
            label="Modèles compatibles (liste)"
            htmlFor="fitment"
            hint="Un modèle par ligne — affiché sur la fiche produit."
          >
            <textarea
              id="fitment"
              name="fitment"
              rows={3}
              defaultValue={product?.fitment?.join("\n") ?? ""}
              className="field resize-y"
            />
          </Field>
        </div>
      </section>

      {/* Commercial */}
      <section className="rounded-card border border-line-soft p-6">
        <h2 className="mb-5 text-[17px] font-semibold">Prix & stock</h2>
        <div className="grid gap-5 sm:grid-cols-4">
          <Field label="Prix (€)" htmlFor="price" required>
            <input id="price" name="price" type="number" step="0.01" min="0" required defaultValue={product?.price ?? ""} className="field" />
          </Field>
          <Field label="Prix barré (€)" htmlFor="listPrice" optionalLabel="optionnel">
            <input id="listPrice" name="listPrice" type="number" step="0.01" min="0" defaultValue={product?.listPrice ?? ""} className="field" />
          </Field>
          <Field label="Stock" htmlFor="stock" required>
            <input id="stock" name="stock" type="number" min="0" required defaultValue={product?.stock ?? 0} className="field" />
          </Field>
          <Field label="Poids (kg)" htmlFor="weightKg" optionalLabel="optionnel">
            <input id="weightKg" name="weightKg" type="number" step="0.1" min="0" defaultValue={product?.weightKg ?? ""} className="field" />
          </Field>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="Catégorie" htmlFor="category" required>
            <input id="category" name="category" required list="category-list" defaultValue={product?.category ?? ""} className="field" />
            <datalist id="category-list">
              {PART_CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <Field label="Sous-catégorie" htmlFor="subcategory" optionalLabel="optionnel">
            <input id="subcategory" name="subcategory" defaultValue={product?.subcategory ?? ""} className="field" />
          </Field>
        </div>
      </section>

      {/* Content */}
      <section className="rounded-card border border-line-soft p-6">
        <h2 className="mb-5 text-[17px] font-semibold">Contenu</h2>
        <div className="flex flex-col gap-5">
          <Field label="Description (FR)" htmlFor="description" required>
            <textarea id="description" name="description" rows={6} required defaultValue={product?.description ?? ""} className="field resize-y" />
          </Field>
          <Field label="Description (EN)" htmlFor="descriptionEn" optionalLabel="optionnel">
            <textarea id="descriptionEn" name="descriptionEn" rows={6} defaultValue={product?.descriptionEn ?? ""} className="field resize-y" />
          </Field>
          <Field label="Points forts (liste)" htmlFor="features" hint="Un point par ligne.">
            <textarea id="features" name="features" rows={4} defaultValue={product?.features?.join("\n") ?? ""} className="field resize-y" />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Tags SEO" htmlFor="tags" hint="Séparés par des virgules.">
              <input id="tags" name="tags" defaultValue={product?.tags?.join(", ") ?? ""} className="field" />
            </Field>
            <Field label="Numéros OEM" htmlFor="oemNumbers" hint="Séparés par des virgules.">
              <input id="oemNumbers" name="oemNumbers" defaultValue={product?.oemNumbers?.join(", ") ?? ""} className="field" />
            </Field>
          </div>
        </div>
      </section>

      {/* Media + status */}
      <section className="rounded-card border border-line-soft p-6">
        <h2 className="mb-5 text-[17px] font-semibold">Images & publication</h2>
        <input type="hidden" name="images" value={images.join("\n")} />
        <ImageUploader value={images} onChange={setImages} folder="atelier/products" />
        <div className="mt-6 flex flex-wrap items-end gap-6">
          <Field label="Statut" htmlFor="status" required>
            <select id="status" name="status" defaultValue={product?.status ?? "live"} className="field w-[160px]">
              <option value="live">En ligne</option>
              <option value="draft">Brouillon</option>
            </select>
          </Field>
          <label className="flex cursor-pointer items-center gap-2.5 pb-2.5 text-[14px] text-ink-soft">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product?.featured}
              className="h-4 w-4 accent-[var(--color-accent,#0071e3)]"
            />
            Pièce mise en avant
          </label>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? (
            <i className="fa-solid fa-circle-notch animate-spin text-[12px]" aria-hidden="true" />
          ) : (
            <i className="fa-solid fa-floppy-disk text-[12px]" aria-hidden="true" />
          )}
          <span>{pending ? "Enregistrement…" : "Enregistrer la fiche"}</span>
        </button>
        <Link href="/admin/products" className="btn btn-ghost">
          Annuler
        </Link>
      </div>
    </form>
  );
}
