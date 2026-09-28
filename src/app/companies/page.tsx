import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { labelFor, researchStatuses } from "@/lib/labels";
import type { Company } from "@/lib/types";
import { EmptyState, ErrorBanner, inputClassName } from "@/components/ui";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; error?: string }>;
}) {
  const { q = "", status = "all", error } = await searchParams;
  const { supabase } = await requireUser();
  let query = supabase.from("companies").select("*").order("name");
  if (q.trim()) {
    query = query.ilike("name", `%${q.trim()}%`);
  }
  if (status !== "all") {
    query = query.eq("research_status", status);
  }
  const { data } = await query;
  const companies = (data ?? []) as Company[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Companies</h1>
          <p className="mt-2 text-slate-600">Your target list. Search by name or filter by research status.</p>
        </div>
        <Link
          href="/companies/new"
          className="rounded-full bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
        >
          Add company
        </Link>
      </div>
      <ErrorBanner message={error} />
      <form className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by company name"
          className={inputClassName()}
        />
        <select name="status" defaultValue={status} className={inputClassName()}>
          <option value="all">All statuses</option>
          {researchStatuses.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
        >
          Filter
        </button>
      </form>
      {!companies.length ? (
        <EmptyState
          title={q || status !== "all" ? "No matches" : "No companies yet"}
          body={
            q || status !== "all"
              ? "Try a different name or status."
              : "Add the first organization on your shortlist."
          }
          href="/companies/new"
          action="Add a company"
        />
      ) : (
        <ul className="space-y-3">
          {companies.map((company) => (
            <li key={company.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <Link href={`/companies/${company.id}`} className="text-lg font-semibold hover:underline">
                    {company.name}
                  </Link>
                  <p className="text-sm text-slate-500">
                    {labelFor(researchStatuses, company.research_status)}
                    {company.industry ? ` · ${company.industry}` : ""}
                  </p>
                </div>
                <Link className="text-sm text-teal-800 hover:underline" href={`/companies/${company.id}/edit`}>
                  Edit
                </Link>
              </div>
              {company.next_action ? (
                <p className="mt-2 text-sm text-slate-600">Next: {company.next_action}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
