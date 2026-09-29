import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { labelFor, researchStatuses } from "@/lib/labels";
import type { Company } from "@/lib/types";
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
      <PageHeader
        title="Companies"
        description="Your target list. Search by name or filter by research status."
        action={
          <Link href="/companies/new" className={primaryButtonClass()}>
            Add company
          </Link>
        }
      />
      <ErrorBanner message={error} />
      <form className={`${panelClass} flex flex-col gap-3 sm:flex-row sm:items-end`}>
        <label className="block min-w-0 flex-1 space-y-1.5">
          <span className="text-sm font-medium">Search</span>
          <input
            name="q"
            defaultValue={q}
            placeholder="Company name"
            className={inputClassName()}
          />
        </label>
        <label className="block min-w-0 space-y-1.5 sm:w-56">
          <span className="text-sm font-medium">Research status</span>
          <select name="status" defaultValue={status} className={inputClassName()}>
            <option value="all">All statuses</option>
            {researchStatuses.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className={secondaryButtonClass("w-full sm:w-auto")}
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
            <li key={company.id} className={listCardClass}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <Link href={`/companies/${company.id}`} className="text-lg font-semibold hover:underline">
                    {company.name}
                  </Link>
                  {company.industry ? <p className={`mt-1 ${mutedClass}`}>{company.industry}</p> : null}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge
                    value={company.research_status}
                    label={labelFor(researchStatuses, company.research_status)}
                  />
                  <Link className={`text-sm ${textLinkClass()}`} href={`/companies/${company.id}/edit`}>
                    Edit
                  </Link>
                </div>
              </div>
              {company.next_action ? (
                <p className="mt-3 rounded-xl bg-[#eef5ef] px-3 py-2 text-sm text-[#1d3d2e]">
                  Next: {company.next_action}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
