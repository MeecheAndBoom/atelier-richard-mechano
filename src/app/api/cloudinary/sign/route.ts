import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCloudinarySignOptions } from "@/lib/cloudinary";

/**
 * Returns a short-lived signed-upload payload for direct-to-cloud uploads.
 * Session-gated: only the logged-in admin can mint signatures.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  let folder = "atelier/products";
  try {
    const body = (await request.json()) as { folder?: string };
    if (body.folder && /^[a-z0-9/_-]+$/i.test(body.folder)) {
      folder = body.folder;
    }
  } catch {
    /* keep default folder */
  }

  const options = await getCloudinarySignOptions(folder);
  if (!options) {
    return NextResponse.json(
      {
        error:
          "Cloudinary non configuré — ajoutez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json(options, { headers: { "Cache-Control": "no-store" } });
}
