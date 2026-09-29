"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

const maxLength = 80;

export async function updateDisplayName(formData: FormData) {
  const { supabase, userId } = await requireUser();
  const displayName = String(formData.get("display_name") ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim();

  if (displayName.length > maxLength) {
    redirect("/profile?error=Use+80+characters+or+fewer");
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      display_name: displayName.length ? displayName : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    redirect("/profile?error=Could+not+save+your+name");
  }

  revalidatePath("/", "layout");
  revalidatePath("/overview");
  revalidatePath("/profile");
  redirect(displayName.length ? "/profile?saved=1" : "/profile");
}
