"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import {
  alumOptions,
  outreachStatuses,
  type AlumOption,
  type OutreachStatus,
} from "@/lib/labels";

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length ? value : null;
}

function outreachFrom(formData: FormData): OutreachStatus {
  const value = String(formData.get("outreach_status") ?? "not_started");
  return outreachStatuses.some((option) => option.value === value)
    ? (value as OutreachStatus)
    : "not_started";
}

function alumFrom(formData: FormData): AlumOption | null {
  const value = String(formData.get("is_ud_alum") ?? "not_sure");
  return alumOptions.some((option) => option.value === value)
    ? (value as AlumOption)
    : "not_sure";
}

function companyIdFrom(formData: FormData) {
  const value = String(formData.get("company_id") ?? "").trim();
  return value.length ? value : null;
}

export async function createContact(formData: FormData) {
  const { supabase, userId } = await requireUser();
  const name = text(formData, "name");
  if (!name) {
    redirect("/contacts/new?error=Please+add+a+name");
  }

  const { data, error } = await supabase
    .from("contacts")
    .insert({
      user_id: userId,
      company_id: companyIdFrom(formData),
      name,
      role: text(formData, "role"),
      is_ud_alum: alumFrom(formData),
      profile_url: text(formData, "profile_url"),
      how_found: text(formData, "how_found"),
      outreach_status: outreachFrom(formData),
      last_interaction_on: text(formData, "last_interaction_on"),
      next_follow_up_on: text(formData, "next_follow_up_on"),
      notes: text(formData, "notes"),
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect("/contacts/new?error=Could+not+save+the+contact");
  }

  revalidatePath("/overview");
  revalidatePath("/contacts");
  revalidatePath("/companies");
  redirect(`/contacts/${data.id}`);
}

export async function updateContact(formData: FormData) {
  const { supabase, userId } = await requireUser();
  const id = String(formData.get("id") ?? "");
  const name = text(formData, "name");
  if (!id || !name) {
    redirect("/contacts?error=Name+is+required");
  }

  const { error } = await supabase
    .from("contacts")
    .update({
      company_id: companyIdFrom(formData),
      name,
      role: text(formData, "role"),
      is_ud_alum: alumFrom(formData),
      profile_url: text(formData, "profile_url"),
      how_found: text(formData, "how_found"),
      outreach_status: outreachFrom(formData),
      last_interaction_on: text(formData, "last_interaction_on"),
      next_follow_up_on: text(formData, "next_follow_up_on"),
      notes: text(formData, "notes"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    redirect(`/contacts/${id}/edit?error=Could+not+save+changes`);
  }

  revalidatePath("/overview");
  revalidatePath("/contacts");
  revalidatePath("/companies");
  redirect(`/contacts/${id}`);
}

export async function deleteContact(formData: FormData) {
  const { supabase, userId } = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/contacts");

  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    redirect(`/contacts/${id}?error=Could+not+delete+this+contact`);
  }

  revalidatePath("/overview");
  revalidatePath("/contacts");
  revalidatePath("/companies");
  redirect("/contacts");
}
