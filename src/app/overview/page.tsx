import Link from "next/link";
import { requireUser, unnamedAccountLabel, visibleAccountName } from "@/lib/auth";
import {
  applicationStatuses,
  formatDate,
  isApplicationStatus,
  jobStatuses,
  labelFor,
  researchStatuses,
} from "@/lib/labels";
import type { Company, Contact, Job } from "@/lib/types";
import {
  EmptyState,
  Notice,
  PageHeader,
  StatusBadge,
  mutedClass,
  panelClass,
  textLinkClass,
} from "@/components/ui";

export default async function OverviewPage() {
  const { supabase, displayName } = await requireUser();
  const accountName = visibleAccountName(displayName);
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: companies }, { data: contacts }, { data: jobs }] = await Promise.all([
    supabase.from("companies").select("*").order("updated_at", { ascending: false }),
    supabase.from("contacts").select("*").order("next_follow_up_on", { ascending: true }),
    supabase.from("jobs").select("*, companies(name)").order("application_deadline", { ascending: true }),
  ]);

  const companyRows = (companies ?? []) as Company[];
  const contactRows = (contacts ?? []) as Contact[];
  const jobRows = (jobs ?? []) as (Job & {
    companies: { name: string } | { name: string }[] | null;
  })[];
  const researched = companyRows.filter((row) => row.research_status === "completed").length;
  const reachedOut = contactRows.filter((row) => row.outreach_status !== "not_started").length;
  const followUpsDue = contactRows.filter(
    (row) => row.next_follow_up_on && row.next_follow_up_on <= today,
  );
  const stillNeedResearch = companyRows.filter((row) => row.research_status !== "completed");
  const nextActions = companyRows.filter((row) => row.next_action);
  const upcoming = contactRows.filter(
    (row) => row.next_follow_up_on && row.next_follow_up_on > today,
  );
  const applications = jobRows.filter((job) => isApplicationStatus(job.status));
  const statusCounts = applicationStatuses.map((status) => ({
    status,
    label: labelFor(jobStatuses, status),
    count: applications.filter((job) => job.status === status).length,
  }));
  const activeDeadline = (job: Job) =>
    Boolean(job.application_deadline) &&
    job.status !== "rejected" &&
    job.status !== "withdrawn" &&
    job.status !== "closed";
  const upcomingDeadlines = jobRows.filter(
    (job) => activeDeadline(job) && job.application_deadline! >= today,
  );
  const overdueDeadlines = jobRows.filter(
    (job) => activeDeadline(job) && job.application_deadline! < today,
  );
  const jobFollowUps = jobRows.filter(
    (job) => job.next_action_on && job.next_action_on <= today,
  );

  function jobCompanyName(job: (typeof jobRows)[number]) {
    const value = job.companies;
    if (!value) return "Company";
    return Array.isArray(value) ? (value[0]?.name ?? "Company") : value.name;
  }

  const stats = [
    { label: "Companies", value: companyRows.length, hint: "Aim for 20 if that helps you focus.", wash: "bg-[#e6f3f1]" },
    { label: "Research completed", value: researched, hint: "Keep going, one company at a time.", wash: "bg-[#eef5ef]" },
    { label: "Contacts reached out to", value: reachedOut, hint: "You send the messages yourself.", wash: "bg-[#eef4f8]" },
    {
      label: "Follow-ups due",
      value: followUpsDue.length + jobFollowUps.length,
      hint: "Contacts and job next actions due today or earlier.",
      wash: "bg-[#f4f0f8]",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description={
          displayName
            ? `Hello, ${accountName}. Here is a snapshot of your research and outreach.`
            : `${unnamedAccountLabel} does not have a display name yet. Your research and outreach stay private to this account.`
        }
      />
      {!displayName ? (
        <Notice>
          <p>Add a display name so the header and this page can use it.</p>
          <Link className={`mt-2 inline-block ${textLinkClass()}`} href="/profile">
            Add your name
          </Link>
        </Notice>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-2xl border border-[#e6e0d6] p-4 shadow-[0_1px_2px_rgba(68,50,30,0.04)] ${stat.wash}`}>
            <p className="text-sm font-medium text-[#44403c]">{stat.label}</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">{stat.value}</p>
            <p className="mt-2 text-sm leading-relaxed text-[#44403c]">{stat.hint}</p>
          </div>
        ))}
      </div>
      {!companyRows.length ? (
        <EmptyState
          title="Add your first target company"
          body="Start with one organization you already care about. You can capture what it does, a next question, and people later."
          href="/companies/new"
          action="Add a company"
        />
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <section className={panelClass}>
            <h2 className="font-semibold">Still needs research</h2>
            <ul className="mt-4 space-y-3">
              {stillNeedResearch.length ? (
                stillNeedResearch.map((company) => (
                  <li key={company.id} className="flex flex-wrap items-center justify-between gap-2">
                    <Link className={textLinkClass()} href={`/companies/${company.id}`}>
                      {company.name}
                    </Link>
                    <StatusBadge
                      value={company.research_status}
                      label={labelFor(researchStatuses, company.research_status)}
                    />
                  </li>
                ))
              ) : (
                <p className={mutedClass}>Every company is marked complete. Nice work.</p>
              )}
            </ul>
          </section>
          <section className={panelClass}>
            <h2 className="font-semibold">Next actions you recorded</h2>
            <ul className="mt-4 space-y-3">
              {nextActions.length ? (
                nextActions.map((company) => (
                  <li key={company.id} className="rounded-xl bg-[#eef5ef] px-3 py-2">
                    <Link className={textLinkClass()} href={`/companies/${company.id}`}>
                      {company.name}
                    </Link>
                    <p className={`mt-1 ${mutedClass}`}>{company.next_action}</p>
                  </li>
                ))
              ) : (
                <p className={mutedClass}>Add a next action on a company to see it here.</p>
              )}
            </ul>
          </section>
          <section className={`${panelClass} lg:col-span-2`}>
            <h2 className="font-semibold">Follow-ups</h2>
            <ul className="mt-4 space-y-3">
              {followUpsDue.length || upcoming.length || jobFollowUps.length ? (
                <>
                  {jobFollowUps.map((job) => (
                    <li key={job.id} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#efeae2] pb-3 last:border-0 last:pb-0">
                      <Link className={textLinkClass()} href={`/jobs/${job.id}`}>
                        {job.title}
                        <span className="font-normal text-[#57534e]"> · {jobCompanyName(job)}</span>
                      </Link>
                      <span className="text-sm text-[#5c331f]">
                        Next action due {formatDate(job.next_action_on)}
                      </span>
                    </li>
                  ))}
                  {[...followUpsDue, ...upcoming].map((contact) => (
                    <li key={contact.id} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#efeae2] pb-3 last:border-0 last:pb-0">
                      <Link className={textLinkClass()} href={`/contacts/${contact.id}`}>
                        {contact.name}
                      </Link>
                      <span className="text-sm text-[#44403c]">
                        {contact.next_follow_up_on && contact.next_follow_up_on <= today
                          ? `Due ${formatDate(contact.next_follow_up_on)}`
                          : formatDate(contact.next_follow_up_on)}
                      </span>
                    </li>
                  ))}
                </>
              ) : (
                <p className={mutedClass}>No follow-up dates yet. Set one when you reach out or save a job next action.</p>
              )}
            </ul>
          </section>
          <section className={`${panelClass} lg:col-span-2`}>
            <h2 className="font-semibold">Applications</h2>
            <p className={`mt-1 ${mutedClass}`}>
              {applications.length} submitted. Roles still marked To research, Open, or Closed are not counted.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {statusCounts.map((item) => (
                <li key={item.status} className="flex items-center justify-between gap-3 rounded-xl border border-[#efeae2] bg-[#fbf8f3] px-3 py-3">
                  <StatusBadge value={item.status} label={item.label} />
                  <p className="text-2xl font-semibold">{item.count}</p>
                </li>
              ))}
            </ul>
          </section>
          <section className={`${panelClass} lg:col-span-2`}>
            <h2 className="font-semibold">Application deadlines</h2>
            <ul className="mt-4 space-y-3">
              {upcomingDeadlines.length || overdueDeadlines.length ? (
                <>
                  {overdueDeadlines.map((job) => (
                    <li key={job.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#f8eee8] px-3 py-2">
                      <Link className={textLinkClass()} href={`/jobs/${job.id}`}>
                        {job.title}
                        <span className="font-normal text-[#57534e]"> · {jobCompanyName(job)}</span>
                      </Link>
                      <span className="text-sm font-medium text-[#5c331f]">Overdue {formatDate(job.application_deadline)}</span>
                    </li>
                  ))}
                  {upcomingDeadlines.map((job) => (
                    <li key={job.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#eef4f8] px-3 py-2">
                      <Link className={textLinkClass()} href={`/jobs/${job.id}`}>
                        {job.title}
                        <span className="font-normal text-[#57534e]"> · {jobCompanyName(job)}</span>
                      </Link>
                      <span className="text-sm text-[#1a3d4d]">{formatDate(job.application_deadline)}</span>
                    </li>
                  ))}
                </>
              ) : (
                <p className={mutedClass}>No upcoming deadlines. Add a date when you save a posting.</p>
              )}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
