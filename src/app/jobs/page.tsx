import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { formatDate, isApplicationStatus, jobStatuses, labelFor } from "@/lib/labels";
import type { Job } from "@/lib/types";
import {
  EmptyState,
  ErrorBanner,
  PageHeader,
  StatusBadge,
  inputClassName,
  listCardClass,
  mutedClass,
  panelClass,
  primaryButtonClass,
  secondaryButtonClass,
  textLinkClass,
} from "@/components/ui";

type JobListRow = Job & {
  companies: { name: string } | { name: string }[] | null;
};

function companyName(value: JobListRow["companies"]) {
  if (!value) return "Company";
  return Array.isArray(value) ? (value[0]?.name ?? "Company") : value.name;
}

const sorts = [
  { value: "deadline", label: "Deadline" },
  { value: "next_action", label: "Next action date" },
  { value: "company", label: "Company" },
  { value: "status", label: "Status" },
] as const;

function sortValue(job: JobListRow, sort: string) {
  if (sort === "company") return companyName(job.companies).toLowerCase();
  if (sort === "status") {
    const index = jobStatuses.findIndex((option) => option.value === job.status);
    return String(index).padStart(2, "0");
  }
  if (sort === "next_action") return job.next_action_on ?? "";
  return job.application_deadline ?? "";
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    company?: string;
    sort?: string;
    dir?: string;
    error?: string;
  }>;
}) {
  const {
    q = "",
    status = "all",
    company = "all",
    sort = "deadline",
    dir = "asc",
    error,
  } = await searchParams;
  const { supabase } = await requireUser();
  const [{ data: jobs }, { data: companies }] = await Promise.all([
    supabase.from("jobs").select("*, companies(name)"),
    supabase.from("companies").select("id, name").order("name"),
  ]);

  const query = q.trim().toLowerCase();
  const rows = ((jobs ?? []) as JobListRow[])
    .filter((job) => (status === "all" ? true : job.status === status))
    .filter((job) => (company === "all" ? true : job.company_id === company))
    .filter((job) => {
      if (!query) return true;
      const haystack = [
        job.title,
        job.requisition_id,
        job.location,
        companyName(job.companies),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    })
    .sort((a, b) => {
      const left = sortValue(a, sort);
      const right = sortValue(b, sort);
      if (!left && !right) return a.title.localeCompare(b.title);
      if (!left) return 1;
      if (!right) return -1;
      const compared = left.localeCompare(right);
      return dir === "desc" ? -compared : compared;
    });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        description="Roles you are considering and applications you submit yourself. Nothing is imported automatically."
        action={
          <Link href="/jobs/new" className={primaryButtonClass()}>
            Add job
          </Link>
        }
      />
      <ErrorBanner message={error} />
      <form className={`${panelClass} grid gap-3 sm:grid-cols-2 lg:grid-cols-3`}>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Search</span>
          <input name="q" defaultValue={q} placeholder="Title, company, or ID" className={inputClassName()} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Company</span>
          <select name="company" defaultValue={company} className={inputClassName()}>
            <option value="all">All companies</option>
            {(companies ?? []).map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Status</span>
          <select name="status" defaultValue={status} className={inputClassName()}>
            <option value="all">All statuses</option>
            {jobStatuses.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Sort</span>
          <select name="sort" defaultValue={sorts.some((item) => item.value === sort) ? sort : "deadline"} className={inputClassName()}>
            {sorts.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Direction</span>
          <select name="dir" defaultValue={dir === "desc" ? "desc" : "asc"} className={inputClassName()}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
        <button type="submit" className={secondaryButtonClass("w-full self-end sm:w-auto")}>
          Apply
        </button>
      </form>
      {!rows.length ? (
        <EmptyState
          title={q || status !== "all" || company !== "all" ? "No matches" : "No jobs yet"}
          body={
            q || status !== "all" || company !== "all"
              ? "Try a different search, company, or status."
              : "Add a posting you have already verified. Company Compass will not invent openings for you."
          }
          href="/jobs/new"
          action="Add a job"
        />
      ) : (
        <ul className="space-y-3">
          {rows.map((job) => (
            <li key={job.id} className={listCardClass}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <Link href={`/jobs/${job.id}`} className="text-lg font-semibold hover:underline">
                    {job.title}
                  </Link>
                  <p className={`mt-1 ${mutedClass}`}>
                    {companyName(job.companies)}
                    {isApplicationStatus(job.status) ? "" : " · Not submitted"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge value={job.status} label={labelFor(jobStatuses, job.status)} />
                  <Link className={`text-sm ${textLinkClass()}`} href={`/jobs/${job.id}/edit`}>
                    Edit
                  </Link>
                </div>
              </div>
              <p className={`mt-3 ${mutedClass}`}>
                {job.application_deadline ? `Deadline ${formatDate(job.application_deadline)}` : "No deadline"}
                {job.next_action_on ? ` · Next action ${formatDate(job.next_action_on)}` : ""}
              </p>
              {job.posting_url ? (
                <a
                  className={`mt-2 inline-block text-sm ${textLinkClass()}`}
                  href={job.posting_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Official posting
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
