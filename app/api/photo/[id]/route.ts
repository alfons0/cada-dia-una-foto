import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";
import { fetchFileBinary } from "@/lib/google-drive";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const valid = await verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!valid) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;

  try {
    const { body, contentType } = await fetchFileBinary(id);
    return new Response(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "error";
    return new Response(msg, { status: 500 });
  }
}
