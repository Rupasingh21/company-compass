import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { formatDate, labelFor, researchStatuses } from "@/lib/labels";
import type { Company, Contact } from "@/lib/types";
import { EmptyState } from "@/components/ui";

export default async function OverviewPage() {
  const { supabase } = await requireUser();
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: companies }, { data: contacts }] = await Promise.all([
    supabase.from("companies").select("*").order("updated_at", { ascending: false }),
    supabase.from("contacts").select("*").order("next_follow_up_on", { ascending: true }),
  ]);

  const companyRows = (companies ?? []) as Company[];
  const contactRows = (contacts ?? []) as Contact[];
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

  const stats = [
    { label: "Companies", value: companyRows.length, hint: "Aim for 20 if that helps you focus." },
    { label: "Research completed", value: researched, hint: "Keep going, one company at a time." },
    { label: "Contacts reached out to", value: reachedOut, hint: "You send the messages yourself." },
    { label: "Follow-ups due", value: followUpsDue.length, hint: "Due today or earlier." },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-2 text-slate-600">
          A snapshot of your research and outreach. Your notes stay private to this account.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-semibold">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-500">{stat.hint}</p>
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
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Still needs research</h2>
            <ul className="mt-3 space-y-3">
              {stillNeedResearch.length ? (
                stillNeedResearch.map((company) => (
                  <li key={company.id}>
                    <Link className="font-medium text-teal-800 hover:underline" href={`/companies/${company.id}`}>
                      {company.name}
                    </Link>
                    <p className="text-sm text-slate-500">
                      {labelFor(researchStatuses, company.research_status)}
                    </p>
                  </li>
                ))
              ) : (
                <p className="text-sm text-slate-600">Every company is marked complete. Nice work.</p>
              )}
            </ul>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Next actions you recorded</h2>
            <ul className="mt-3 space-y-3">
              {nextActions.length ? (
                nextActions.map((company) => (
                  <li key={company.id}>
                    <Link className="font-medium text-teal-800 hover:underline" href={`/companies/${company.id}`}>
                      {company.name}
                    </Link>
                    <p className="text-sm text-slate-600">{company.next_action}</p>
                  </li>
                ))
              ) : (
                <p className="text-sm text-slate-600">Add a next action on a company to see it here.</p>
              )}
            </ul>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
            <h2 className="font-semibold">Follow-ups</h2>
            <ul className="mt-3 space-y-3">
              {[...followUpsDue, ...upcoming].length ? (
                [...followUpsDue, ...upcoming].map((contact) => (
                  <li key={contact.id} className="flex flex-wrap items-baseline justify-between gap-2">
                    <Link className="font-medium text-teal-800 hover:underline" href={`/contacts/${contact.id}`}>
                      {contact.name}
                    </Link>
                    <span className="text-sm text-slate-500">
                      {contact.next_follow_up_on && contact.next_follow_up_on <= today
                        ? `Due ${formatDate(contact.next_follow_up_on)}`
                        : formatDate(contact.next_follow_up_on)}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-sm text-slate-600">No follow-up dates yet. Set one when you reach out.</p>
              )}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
