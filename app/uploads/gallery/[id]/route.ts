import { getGalleryUpload } from "@/lib/repo";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/uploads/gallery/[id]">,
) {
  const { id } = await ctx.params;
  const upload = getGalleryUpload(Number(id));
  if (!upload) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(upload.data), {
    headers: {
      "Content-Type": upload.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}