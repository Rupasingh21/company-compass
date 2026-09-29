import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const unnamedAccountLabel = "My account";

export function visibleAccountName(displayName: string | null | undefined) {
  const name = displayName?.trim() ?? "";
  return name.length ? name : unnamedAccountLabel;
}

async function loadDisplayName(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { data } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .maybeSingle();
  const name = typeof data?.display_name === "string" ? data.display_name.trim() : "";
  return name.length ? name : null;
}

export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/login");
  }

  const userId = data.claims.sub;
  return {
    supabase,
    userId,
    displayName: await loadDisplayName(supabase, userId),
  };
}

export async function getOptionalUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (!userId) {
    return null;
  }

  return {
    userId,
    displayName: await loadDisplayName(supabase, userId),
  };
}
