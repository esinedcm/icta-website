import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");

  // Check the secret token
  if (secret !== process.env.WP_PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  // If no slug is provided, we can just redirect to the homepage, but usually WP provides a slug.
  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  // Enable Draft Mode by setting the cookie
  (await draftMode()).enable();

  // Redirect to the path from the fetched post
  // We don't redirect to searchParams.slug as that might lead to open redirect vulnerabilities
  // We prepend a slash to make it an absolute path
  const redirectPath = `/${slug}`;
  redirect(redirectPath);
}
