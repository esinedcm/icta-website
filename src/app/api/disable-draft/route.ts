import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  // Disable Draft Mode by clearing the cookie
  (await draftMode()).disable();

  // Redirect back to the homepage (or whatever path they were on, but homepage is safer)
  redirect("/");
}
