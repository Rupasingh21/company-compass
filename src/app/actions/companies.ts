"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { researchStatuses, type ResearchStatus } from "@/lib/labels";

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length ? value : null;
}

function statusFrom(formData: FormData): ResearchStatus {
  const value = String(formData.get("research_status") ?? "not_started");
  return researchStatuses.some((option) => option.value === value)
    ? (value as ResearchStatus)
    : "not_started";
}

export async function createCompany(formData: FormData) {
  const { supabase, userId } = await requireUser();
  const name = text(formData, "name");
  if (!name) {
    redirect("/companies/new?error=Please+add+a+company+name");
  }

  const { data, error } = await supabase
    .from("companies")
    .insert({
      user_id: userId,
      name,
      website: text(formData, "website"),
      industry: text(formData, "industry"),
      what_it_does: text(formData, "what_it_does"),
      mission_or_principles: text(formData, "mission_or_principles"),
      distinctive_products: text(formData, "distinctive_products"),
      recent_developments: text(formData, "recent_developments"),
      roles_of_interest: text(formData, "roles_of_interest"),
      research_status: statusFrom(formData),
      notes: text(formData, "notes"),
      next_action: text(formData, "next_action"),
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect("/companies/new?error=Could+not+save+the+company");
  }

  revalidatePath("/overview");
  revalidatePath("/companies");
  redirect(`/companies/${data.id}`);
}

export async function updateCompany(formData: FormData) {
  const { supabase, userId } = await requireUser();
  const id = String(formData.get("id") ?? "");
  const name = text(formData, "name");
  if (!id || !name) {
    redirect("/companies?error=Company+name+is+required");
  }

  const { error } = await supabase
    .from("companies")
    .update({
      name,
      website: text(formData, "website"),
      industry: text(formData, "industry"),
      what_it_does: text(formData, "what_it_does"),
      mission_or_principles: text(formData, "mission_or_principles"),
      distinctive_products: text(formData, "distinctive_products"),
      recent_developments: text(formData, "recent_developments"),
      roles_of_interest: text(formData, "roles_of_interest"),
      research_status: statusFrom(formData),
      notes: text(formData, "notes"),
      next_action: text(formData, "next_action"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    redirect(`/companies/${id}/edit?error=Could+not+save+changes`);
  }

  revalidatePath("/overview");
  revalidatePath("/companies");
  revalidatePath(`/companies/${id}`);
  redirect(`/companies/${id}`);
}

export async function deleteCompany(formData: FormData) {
  const { supabase, userId } = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/companies");

  const { error } = await supabase
    .from("companies")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    redirect(`/companies/${id}?error=Could+not+delete+this+company`);
  }

  revalidatePath("/overview");
  revalidatePath("/companies");
  revalidatePath("/contacts");
  revalidatePath("/jobs");
  redirect("/companies");
}
