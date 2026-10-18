import { resolveCloudinaryCredentials } from "./settings";

/**
 * Direct-to-cloud signed uploads (reference pattern): the browser uploads
 * straight to Cloudinary with a short-lived signature, so image bytes never
 * touch our server. Returns null when Cloudinary isn't configured — callers
 * surface a clear "not configured" message instead of failing silently.
 */
export async function getCloudinarySignOptions(folder: string) {
  const creds = await resolveCloudinaryCredentials();
  if (!creds) return null;

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = await sign(paramsToSign, creds.apiSecret);

  return {
    url: `https://api.cloudinary.com/v1_1/${creds.cloudName}/auto/upload`,
    cloudName: creds.cloudName,
    apiKey: creds.apiKey,
    timestamp,
    folder,
    signature,
  };
}

async function sign(params: string, apiSecret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(apiSecret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(params));
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Server-side upload (used for payment proofs — small files, no browser SDK). */
export async function uploadToCloudinary(
  file: File,
  folder: string,
): Promise<{ url: string; publicId: string } | null> {
  const creds = await resolveCloudinaryCredentials();
  if (!creds) return null;

  const timestamp = Math.round(Date.now() / 1000);
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  form.append("api_key", creds.apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", await sign(`folder=${folder}&timestamp=${timestamp}`, creds.apiSecret));

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${creds.cloudName}/image/upload`,
    { method: "POST", body: form },
  );
  if (!res.ok) throw new Error(`Cloudinary upload failed (${res.status})`);
  const data = (await res.json()) as { secure_url: string; public_id: string };
  return { url: data.secure_url, publicId: data.public_id };
}

export function cloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}
