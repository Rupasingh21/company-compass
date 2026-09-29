import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteJob } from "@/app/actions/jobs";
import { requireUser } from "@/lib/auth";
import {
  formatDate,
  isApplicationStatus,
  jobStatuses,
  labelFor,
  priorities,
  workArrangements,
} from "@/lib/labels";
import type { Job } from "@/lib/types";
import {
  DetailList,
  ErrorBanner,
  KeyFacts,
  StatusBadge,
  deleteButtonClass,
  primaryButtonClass,
  secondaryButtonClass,
  textLinkClass,
} from "@/components/ui";

export default async function JobDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const { supabase, userId } = await requireUser();
  const { data } = await supabase
    .from("jobs")
    .select("*, companies(id, name)")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) notFound();
  const row = data as Job & { companies: { id: string; name: string } | null };

  const fields = [
    ["Location", row.location],
    ["Work arrangement", labelFor(workArrangements, row.work_arrangement)],
    ["Posting date", formatDate(row.posted_on)],
    ["Application deadline", formatDate(row.application_deadline)],
    ["Expected start", formatDate(row.expected_start_on)],
    ["Requisition ID", row.requisition_id],
    ["Description or requirements", row.description_notes],
    ["Graduation eligibility", row.graduation_eligibility],
    ["Work authorization notes", row.work_authorization_notes],
    ["Priority", labelFor(priorities, row.priority)],
    ["Fit notes", row.fit_notes],
    ["Next action", row.next_action],
    ["Next action date", formatDate(row.next_action_on)],
  ] as const;

  const applicationFields = [
    ["Application date", formatDate(row.applied_on)],
    ["Confirmation or application ID", row.confirmation_id],
    ["Resume version", row.resume_version],
    ["Cover letter version", row.cover_letter_version],
    ["Assessment date", formatDate(row.assessment_on)],
    ["Assessment notes", row.assessment_notes],
    ["Interview date", formatDate(row.interview_on)],
    ["Interview notes", row.interview_notes],
  ] as const;

  return (
    <div className="space-y-6">
      <ErrorBanner message={error} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge value={row.status} label={labelFor(jobStatuses, row.status)} />
            <span className="text-sm text-[#44403c]">
              {isApplicationStatus(row.status) ? "Submitted application" : "Not an application yet"}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{row.title}</h1>
          {row.companies ? (
            <Link className={`mt-1 inline-block ${textLinkClass()}`} href={`/companies/${row.companies.id}`}>
              {row.companies.name}
            </Link>
          ) : null}
        </div>
        <Link href={`/jobs/${row.id}/edit`} className={secondaryButtonClass()}>
          Edit
        </Link>
      </div>
      <KeyFacts
        items={[
          {
            label: "Application deadline",
            tone: "blue",
            children: formatDate(row.application_deadline),
          },
          {
            label: "Next action",
            tone: "sage",
            children: row.next_action || "No next action recorded yet.",
          },
          {
            label: "Next action date",
            tone: "sage",
            children: formatDate(row.next_action_on),
          },
          {
            label: "Priority",
            tone: "lavender",
            children: (
              <StatusBadge value={row.priority} label={labelFor(priorities, row.priority)} />
            ),
          },
        ]}
      />
      {row.posting_url ? (
        <a className={primaryButtonClass()} href={row.posting_url} target="_blank" rel="noreferrer">
          Open official posting
        </a>
      ) : null}
      <DetailList
        title="Role details"
        items={fields.map(([label, value]) => ({
          label,
          value: value || "—",
          wide:
            label === "Description or requirements" ||
            label === "Graduation eligibility" ||
            label === "Work authorization notes" ||
            label === "Fit notes" ||
            label === "Next action",
        }))}
      />
      {isApplicationStatus(row.status) ? (
        <DetailList
          title="Application details"
          items={applicationFields.map(([label, value]) => ({
            label,
            value: value || "—",
            wide: label === "Assessment notes" || label === "Interview notes",
          }))}
        />
      ) : null}
      <form action={deleteJob}>
        <input type="hidden" name="id" value={row.id} />
        <button type="submit" className={deleteButtonClass()}>
          Delete this job
        </button>
      </form>
    </div>
  );
}
