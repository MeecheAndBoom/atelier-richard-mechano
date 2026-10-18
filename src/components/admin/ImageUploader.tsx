"use client";

import { useState } from "react";

type SignResponse = {
  url: string;
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
};

/**
 * Direct-to-Cloudinary uploader (reference pattern): fetch a short-lived
 * signature from /api/cloudinary/sign, then POST the file straight to the
 * cloud. Surfaces a clear message when Cloudinary isn't configured.
 */
export function ImageUploader({
  folder = "atelier/products",
  value = [],
  onChange,
  max = 6,
}: {
  folder?: string;
  value?: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    setBusy(true);
    try {
      const urls = [...value];
      for (const file of Array.from(files)) {
        if (urls.length >= max) break;

        const signRes = await fetch("/api/cloudinary/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder }),
        });
        if (!signRes.ok) {
          const body = (await signRes.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(body.error ?? "Upload unavailable");
        }
        const sign = (await signRes.json()) as SignResponse;

        const form = new FormData();
        form.append("file", file);
        form.append("folder", sign.folder);
        form.append("api_key", sign.apiKey);
        form.append("timestamp", String(sign.timestamp));
        form.append("signature", sign.signature);

        const upload = await fetch(sign.url, { method: "POST", body: form });
        if (!upload.ok) throw new Error(`Cloudinary ${upload.status}`);
        const data = (await upload.json()) as { secure_url: string };
        urls.push(data.secure_url);
      }
      onChange(urls);
    } catch (err) {
      setError(
        err instanceof Error && err.message.includes("unavailable")
          ? "Cloudinary n’est pas configuré — renseignez les identifiants dans Settings."
          : "Échec de l’envoi. Réessayez.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div
            key={url + i}
            className="relative h-20 w-20 overflow-hidden rounded-box border border-line-soft bg-alt"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute top-0.5 right-0.5 grid h-5 w-5 place-items-center rounded-full bg-ink/80 text-white transition-colors hover:bg-danger"
              aria-label={`Supprimer l’image ${i + 1}`}
            >
              <i className="fa-solid fa-xmark text-[10px]" aria-hidden="true" />
            </button>
          </div>
        ))}
        {value.length < max ? (
          <label className="grid h-20 w-20 cursor-pointer place-items-center rounded-box border border-dashed border-line text-muted transition-colors hover:border-accent hover:text-accent">
            <i
              className={`fa-solid ${busy ? "fa-circle-notch animate-spin" : "fa-cloud-arrow-up"} text-[16px]`}
              aria-hidden="true"
            />
            <span className="sr-only">Ajouter une image</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              disabled={busy}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        ) : null}
      </div>
      {error ? (
        <p role="alert" className="text-[13px] font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
