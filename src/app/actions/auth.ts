"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SignUpState = { error?: string; ok?: boolean } | null;

export async function signUp(
  _prev: SignUpState,
  formData: FormData,
): Promise<NonNullable<SignUpState>> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const repeat = String(formData.get("repeat_password") ?? "");

  if (!email || !password) {
    return { error: "Please enter an email and a password." };
  }
  if (password.length < 6) {
    return { error: "Use at least 6 characters for your password." };
  }
  if (password !== repeat) {
    return { error: "Passwords do not match." };
  }

  const headerStore = await headers();
  const origin =
    headerStore.get("origin") ??
    `${headerStore.get("x-forwarded-proto") ?? "http"}://${headerStore.get("x-forwarded-host") ?? headerStore.get("host")}`;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { ok: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
