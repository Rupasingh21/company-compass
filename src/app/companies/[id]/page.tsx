import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteCompany } from "@/app/actions/companies";
import { requireUser } from "@/lib/auth";
import { formatDate, isApplicationStatus, jobStatuses, labelFor, outreachStatuses, researchStatuses } from "@/lib/labels";
import type { Company, Contact, Job } from "@/lib/types";
import {
  DetailList,
  ErrorBanner,
  KeyFacts,
  StatusBadge,
  deleteButtonClass,
  listCardClass,
  mutedClass,
  primaryButtonClass,
  secondaryButtonClass,
  textLinkClass,
} from "@/components/ui";

export default async function CompanyDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const { supabase, userId } = await requireUser();
  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (!company) notFound();
  const row = company as Company;

  const [{ data: contacts }, { data: jobs }] = await Promise.all([
    supabase.from("contacts").select("*").eq("company_id", id).order("name"),
    supabase.from("jobs").select("*").eq("company_id", id).order("title"),
  ]);
  const people = (contacts ?? []) as Contact[];
  const roles = (jobs ?? []) as Job[];
  const considering = roles.filter((job) => !isApplicationStatus(job.status));
  const submitted = roles.filter((job) => isApplicationStatus(job.status));

  const fields = [
    ["Website", row.website],
    ["Industry", row.industry],
    ["What it does", row.what_it_does],
    ["Mission or principles", row.mission_or_principles],
    ["Distinctive products or approaches", row.distinctive_products],
    ["Recent growth or developments", row.recent_developments],
    ["Roles of interest", row.roles_of_interest],
    ["Notes", row.notes],
    ["Next action", row.next_action],
  ] as const;

  return (
    <div className="space-y-6">
      <ErrorBanner message={error} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <StatusBadge
            value={row.research_status}
            label={labelFor(researchStatuses, row.research_status)}
          />
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{row.name}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/companies/${row.id}/edit`} className={secondaryButtonClass()}>
            Edit
          </Link>
          <Link href={`/jobs/new?companyId=${row.id}`} className={secondaryButtonClass()}>
            Add job
          </Link>
          <Link href={`/contacts/new?companyId=${row.id}`} className={primaryButtonClass()}>
            Add contact
          </Link>
        </div>
      </div>
      <KeyFacts
        items={[
          {
            label: "Next action",
            tone: "sage",
            children: row.next_action || "No next action recorded yet.",
          },
          {
            label: "Research status",
            tone: "blue",
            children: labelFor(researchStatuses, row.research_status),
          },
        ]}
      />
      <DetailList
        title="Research notes"
        items={fields.map(([label, value]) => ({
          label,
          wide: true,
          value:
            label === "Website" && value ? (
              <a className={textLinkClass()} href={value} target="_blank" rel="noreferrer">
                {value}
              </a>
            ) : (
              value || "—"
            ),
        }))}
      />
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-xl font-semibold">Jobs</h2>
          <Link className={`text-sm ${textLinkClass()}`} href={`/jobs/new?companyId=${row.id}`}>
            Add a job for {row.name}
          </Link>
        </div>
        <JobGroup
          title="Roles I'm considering"
          empty="No roles saved for this company yet. Add one after you verify the posting."
          jobs={considering}
        />
        <JobGroup
          title="Applications I've submitted"
          empty="No submitted applications yet. A role stays in the group above until you mark it Applied or later."
          jobs={submitted}
        />
      </section>
      <section>
        <h2 className="text-xl font-semibold">People at this company</h2>
        <ul className="mt-3 space-y-3">
          {people.length ? (
            people.map((person) => (
              <li key={person.id} className={listCardClass}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link className={textLinkClass()} href={`/contacts/${person.id}`}>
                    {person.name}
                  </Link>
                  <StatusBadge
                    value={person.outreach_status}
                    label={labelFor(outreachStatuses, person.outreach_status)}
                  />
                </div>
                <p className={`mt-1 ${mutedClass}`}>
                  {person.role ?? "Role not recorded"}
                  {person.next_follow_up_on
                    ? ` · Follow up ${formatDate(person.next_follow_up_on)}`
                    : ""}
                </p>
              </li>
            ))
          ) : (
            <p className={mutedClass}>No contacts yet. Add an alum or another professional when you are ready.</p>
          )}
        </ul>
      </section>
      <form action={deleteCompany}>
        <input type="hidden" name="id" value={row.id} />
        <button
          type="submit"
          className={deleteButtonClass()}
        >
          Delete this company
        </button>
      </form>
    </div>
  );
}

function JobGroup({ title, empty, jobs }: { title: string; empty: string; jobs: Job[] }) {
  return (
    <div>
      <h3 className="font-medium text-[#1c1917]">{title}</h3>
      <ul className="mt-2 space-y-3">
        {jobs.length ? (
          jobs.map((job) => (
            <li key={job.id} className={listCardClass}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link className={textLinkClass()} href={`/jobs/${job.id}`}>
                  {job.title}
                </Link>
                <StatusBadge value={job.status} label={labelFor(jobStatuses, job.status)} />
              </div>
              <p className={`mt-1 ${mutedClass}`}>
                {job.application_deadline ? `Deadline ${formatDate(job.application_deadline)}` : "No deadline"}
              </p>
              {job.posting_url ? (
                <a
                  className={`mt-1 inline-block text-sm ${textLinkClass()}`}
                  href={job.posting_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Official posting
                </a>
              ) : null}
            </li>
          ))
        ) : (
          <p className={mutedClass}>{empty}</p>
        )}
      </ul>
    </div>
  );
}
