import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteCompany } from "@/app/actions/companies";
import { requireUser } from "@/lib/auth";
import { formatDate, labelFor, outreachStatuses, researchStatuses } from "@/lib/labels";
import type { Company, Contact } from "@/lib/types";
import { ErrorBanner } from "@/components/ui";

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

  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .eq("company_id", id)
    .order("name");
  const people = (contacts ?? []) as Contact[];

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
          <p className="text-sm text-slate-500">
            {labelFor(researchStatuses, row.research_status)}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{row.name}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/companies/${row.id}/edit`}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-white"
          >
            Edit
          </Link>
          <Link
            href={`/contacts/new?companyId=${row.id}`}
            className="rounded-full bg-teal-700 px-4 py-2 text-sm text-white hover:bg-teal-800"
          >
            Add contact
          </Link>
        </div>
      </div>
      <dl className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt className="text-sm font-medium text-slate-500">{label}</dt>
            <dd className="mt-1 whitespace-pre-wrap text-slate-800">
              {label === "Website" && value ? (
                <a className="text-teal-800 underline" href={value} target="_blank" rel="noreferrer">
                  {value}
                </a>
              ) : (
                value || "—"
              )}
            </dd>
          </div>
        ))}
      </dl>
      <section>
        <h2 className="text-xl font-semibold">People at this company</h2>
        <ul className="mt-3 space-y-3">
          {people.length ? (
            people.map((person) => (
              <li key={person.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <Link className="font-medium text-teal-800 hover:underline" href={`/contacts/${person.id}`}>
                  {person.name}
                </Link>
                <p className="text-sm text-slate-500">
                  {person.role ?? "Role not recorded"} ·{" "}
                  {labelFor(outreachStatuses, person.outreach_status)}
                  {person.next_follow_up_on
                    ? ` · Follow up ${formatDate(person.next_follow_up_on)}`
                    : ""}
                </p>
              </li>
            ))
          ) : (
            <p className="text-sm text-slate-600">No contacts yet. Add an alum or another professional when you are ready.</p>
          )}
        </ul>
      </section>
      <form action={deleteCompany}>
        <input type="hidden" name="id" value={row.id} />
        <button
          type="submit"
          className="text-sm text-red-700 underline"
        >
          Delete this company
        </button>
      </form>
    </div>
  );
}
