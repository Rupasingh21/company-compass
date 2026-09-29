"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import {
  jobStatuses,
  priorities,
  workArrangements,
  type Priority,
  type WorkArrangement,
} from "@/lib/labels";

export type JobActionResult = { error?: string; warning?: string };

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length ? value : null;
}

function choice<T extends string>(
  formData: FormData,
  key: string,
  options: readonly { value: T }[],
  fallback: T,
) {
  const value = String(formData.get(key) ?? "");
  return options.some((option) => option.value === value) ? (value as T) : fallback;
}

function normalizeUrl(value: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  try {
    const url = new URL(trimmed);
    url.hash = "";
    const path = url.pathname.replace(/\/$/, "") || "";
    return `${url.origin}${path}${url.search}`.toLowerCase();
  } catch {
    return trimmed.toLowerCase().replace(/\/$/, "");
  }
}

function fieldsFrom(formData: FormData) {
  const status = choice(formData, "status", jobStatuses, "to_research");
  return {
    company_id: text(formData, "company_id"),
    title: text(formData, "title"),
    requisition_id: text(formData, "requisition_id"),
    posting_url: text(formData, "posting_url"),
    location: text(formData, "location"),
    work_arrangement: choice<WorkArrangement>(
      formData,
      "work_arrangement",
      workArrangements,
      "not_sure",
    ),
    posted_on: text(formData, "posted_on"),
    application_deadline: text(formData, "application_deadline"),
    expected_start_on: text(formData, "expected_start_on"),
    description_notes: text(formData, "description_notes"),
    graduation_eligibility: text(formData, "graduation_eligibility"),
    work_authorization_notes: text(formData, "work_authorization_notes"),
    priority: choice<Priority>(formData, "priority", priorities, "medium"),
    fit_notes: text(formData, "fit_notes"),
    next_action: text(formData, "next_action"),
    next_action_on: text(formData, "next_action_on"),
    status,
    applied_on: text(formData, "applied_on"),
    confirmation_id: text(formData, "confirmation_id"),
    resume_version: text(formData, "resume_version"),
    cover_letter_version: text(formData, "cover_letter_version"),
    assessment_notes: text(formData, "assessment_notes"),
    assessment_on: text(formData, "assessment_on"),
    interview_notes: text(formData, "interview_notes"),
    interview_on: text(formData, "interview_on"),
  };
}

async function validateJob(formData: FormData, currentId?: string) {
  const { supabase, userId } = await requireUser();
  const row = fieldsFrom(formData);
  if (!row.title) return { ok: false as const, error: "Add a job title." };
  if (!row.company_id) return { ok: false as const, error: "Choose a company from your list." };

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("id", row.company_id)
    .eq("user_id", userId)
    .maybeSingle();
  if (!company) return { ok: false as const, error: "Choose a company from your list." };

  const { data: existing } = await supabase
    .from("jobs")
    .select("id, title, requisition_id, posting_url")
    .eq("user_id", userId)
    .eq("company_id", row.company_id);

  const others = (existing ?? []).filter((job) => job.id !== currentId);
  const requisition = row.requisition_id?.toLowerCase() ?? null;
  if (
    requisition &&
    others.some((job) => job.requisition_id?.trim().toLowerCase() === requisition)
  ) {
    return {
      ok: false as const,
      error: "You already saved a role at this company with that requisition ID.",
    };
  }

  const posting = normalizeUrl(row.posting_url);
  const similar = !requisition
    ? others.find((job) => posting && normalizeUrl(job.posting_url) === posting)
    : undefined;
  const confirmed = String(formData.get("confirm_similar") ?? "") === "yes";
  if (similar && !confirmed) {
    return {
      ok: false as const,
      warning: `Another role at this company already uses this posting link (${similar.title}). Check the box below if this is a different opening, then save again.`,
    };
  }

  return {
    ok: true as const,
    userId,
    supabase,
    row: { ...row, company_id: row.company_id, title: row.title },
  };
}

function revalidateJobs(companyId: string) {
  revalidatePath("/overview");
  revalidatePath("/jobs");
  revalidatePath(`/companies/${companyId}`);
}

export async function createJob(formData: FormData): Promise<JobActionResult | void> {
  const checked = await validateJob(formData);
  if (!checked.ok) return { error: checked.error, warning: checked.warning };

  const { data, error } = await checked.supabase
    .from("jobs")
    .insert({ ...checked.row, user_id: checked.userId })
    .select("id")
    .single();

  if (error || !data) {
    if (error?.code === "23505") {
      return { error: "You already saved a role at this company with that requisition ID." };
    }
    return { error: "Could not save this job." };
  }

  revalidateJobs(checked.row.company_id);
  redirect(`/jobs/${data.id}`);
}

export async function updateJob(formData: FormData): Promise<JobActionResult | void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "This job could not be found." };
  const checked = await validateJob(formData, id);
  if (!checked.ok) return { error: checked.error, warning: checked.warning };

  const { error } = await checked.supabase
    .from("jobs")
    .update({ ...checked.row, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", checked.userId);

  if (error) {
    if (error.code === "23505") {
      return { error: "You already saved a role at this company with that requisition ID." };
    }
    return { error: "Could not save these changes." };
  }

  revalidateJobs(checked.row.company_id);
  revalidatePath(`/jobs/${id}`);
  redirect(`/jobs/${id}`);
}

export async function deleteJob(formData: FormData) {
  const { supabase, userId } = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/jobs");

  const { data: existing } = await supabase
    .from("jobs")
    .select("company_id")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  const { error } = await supabase.from("jobs").delete().eq("id", id).eq("user_id", userId);
  if (error) redirect(`/jobs/${id}?error=Could+not+delete+this+job`);

  revalidatePath("/overview");
  revalidatePath("/jobs");
  revalidatePath("/companies");
  if (existing?.company_id) revalidatePath(`/companies/${existing.company_id}`);
  redirect("/jobs");
}
