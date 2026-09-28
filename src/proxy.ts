import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/update-session";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const proxyConfig = {
  matcher: [
    "/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff2?)$).*)",
  ],
};
