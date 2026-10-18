"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { savePost, type AdminActionResult } from "@/actions/admin";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Field } from "@/components/ui/FormBits";
import { BLOG_CATEGORIES } from "@/lib/constants";
import type { BlogPost } from "@/lib/types";

/** Blog create/edit form — FR body first, EN body beside it. */
export function BlogForm({ post }: { post?: BlogPost }) {
  const [state, formAction, pending] = useActionState<AdminActionResult | null, FormData>(
    savePost,
    null,
  );
  const [images, setImages] = useState<string[]>(post?.image ? [post.image] : []);

  if (state?.ok) {
    return (
      <div className="rounded-card flex flex-col items-start gap-4 border border-[#cfe8d8] bg-[#eaf6ee] p-8">
        <p className="flex items-center gap-2.5 text-[16px] font-medium text-success">
          <i className="fa-solid fa-circle-check" aria-hidden="true" />
          Article enregistré.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/admin/blog" className="btn btn-primary btn-sm">
            <i className="fa-solid fa-arrow-left text-[12px]" aria-hidden="true" />
            <span>Retour aux articles</span>
          </Link>
          <a href="/blog" className="btn btn-ghost btn-sm" target="_blank" rel="noreferrer">
            <i className="fa-solid fa-arrow-up-right-from-square text-[11px]" aria-hidden="true" />
            <span>Voir le blog</span>
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

      {post ? <input type="hidden" name="slug" value={post.slug} /> : null}
      <input type="hidden" name="image" value={images[0] ?? ""} />

      <section className="rounded-card border border-line-soft p-6">
        <h2 className="mb-5 text-[17px] font-semibold">Métadonnées</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Titre (FR)" htmlFor="title" required>
            <input id="title" name="title" required defaultValue={post?.title ?? ""} className="field" />
          </Field>
          <Field label="Titre (EN)" htmlFor="titleEn" optionalLabel="optionnel">
            <input id="titleEn" name="titleEn" defaultValue={post?.titleEn ?? ""} className="field" />
          </Field>
          <Field label="Chapeau (FR)" htmlFor="excerpt" required hint="2 phrases maximum — affiché en carte.">
            <textarea id="excerpt" name="excerpt" rows={3} required defaultValue={post?.excerpt ?? ""} className="field resize-y" />
          </Field>
          <Field label="Chapeau (EN)" htmlFor="excerptEn" optionalLabel="optionnel">
            <textarea id="excerptEn" name="excerptEn" rows={3} defaultValue={post?.excerptEn ?? ""} className="field resize-y" />
          </Field>
          <Field label="Catégorie" htmlFor="category" required>
            <input id="category" name="category" required list="blog-category-list" defaultValue={post?.category ?? "Guides"} className="field" />
            <datalist id="blog-category-list">
              {BLOG_CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <Field label="Auteur" htmlFor="author" optionalLabel="optionnel">
            <input id="author" name="author" defaultValue={post?.author ?? ""} className="field" />
          </Field>
          <Field label="Date" htmlFor="date" required hint="AAAA-MM-JJ">
            <input
              id="date"
              name="date"
              required
              type="date"
              defaultValue={post?.date ?? new Date().toISOString().slice(0, 10)}
              className="field"
            />
          </Field>
          <Field label="Tags" htmlFor="tags" hint="Séparés par des virgules.">
            <input id="tags" name="tags" defaultValue={post?.tags?.join(", ") ?? ""} className="field" />
          </Field>
        </div>
      </section>

      <section className="rounded-card border border-line-soft p-6">
        <h2 className="mb-5 text-[17px] font-semibold">Contenu</h2>
        <div className="flex flex-col gap-5">
          <Field
            label="Corps (FR)"
            htmlFor="body"
            required
            hint="Markdown accepté : ## titres, **gras**, listes avec tiret."
          >
            <textarea
              id="body"
              name="body"
              rows={14}
              required
              defaultValue={post?.body ?? ""}
              className="field resize-y font-mono text-[13.5px]"
            />
          </Field>
          <Field
            label="Corps (EN)"
            htmlFor="bodyEn"
            optionalLabel="optionnel"
            hint="Laissez vide pour conserver le texte français."
          >
            <textarea
              id="bodyEn"
              name="bodyEn"
              rows={14}
              defaultValue={post?.bodyEn ?? ""}
              className="field resize-y font-mono text-[13.5px]"
            />
          </Field>
        </div>
      </section>

      <section className="rounded-card border border-line-soft p-6">
        <h2 className="mb-5 text-[17px] font-semibold">Image & publication</h2>
        <ImageUploader value={images} onChange={setImages} max={1} folder="atelier/blog" />
        <div className="mt-6 flex flex-wrap items-end gap-6">
          <Field label="Statut" htmlFor="status" required>
            <select id="status" name="status" defaultValue={post?.status ?? "live"} className="field w-[160px]">
              <option value="live">En ligne</option>
              <option value="draft">Brouillon</option>
            </select>
          </Field>
          <label className="flex cursor-pointer items-center gap-2.5 pb-2.5 text-[14px] text-ink-soft">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={post?.featured}
              className="h-4 w-4 accent-[var(--color-accent,#0071e3)]"
            />
            Mettre en avant sur l’accueil
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
          <span>{pending ? "Enregistrement…" : "Enregistrer l’article"}</span>
        </button>
        <Link href="/admin/blog" className="btn btn-ghost">
          Annuler
        </Link>
      </div>
    </form>
  );
}
