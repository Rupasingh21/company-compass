import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteContact } from "@/app/actions/contacts";
import { requireUser } from "@/lib/auth";
import { alumOptions, formatDate, labelFor, outreachStatuses } from "@/lib/labels";
import type { Contact } from "@/lib/types";
import { ErrorBanner } from "@/components/ui";

export default async function ContactDetailPage({
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
    .from("contacts")
    .select("*, companies(id, name)")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) notFound();
  const row = data as Contact & { companies: { id: string; name: string } | null };
  const company = row.companies;

  return (
    <div className="space-y-6">
      <ErrorBanner message={error} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">
            {labelFor(outreachStatuses, row.outreach_status)}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{row.name}</h1>
        </div>
        <Link
          href={`/contacts/${row.id}/edit`}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-white"
        >
          Edit
        </Link>
      </div>
      <dl className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <div>
          <dt className="text-sm font-medium text-slate-500">Company</dt>
          <dd className="mt-1">
            {company ? (
              <Link className="text-teal-800 underline" href={`/companies/${company.id}`}>
                {company.name}
              </Link>
            ) : (
              "—"
            )}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Role</dt>
          <dd className="mt-1">{row.role || "—"}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">UD alumnus</dt>
          <dd className="mt-1">{labelFor(alumOptions, row.is_ud_alum)}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Profile URL</dt>
          <dd className="mt-1">
            {row.profile_url ? (
              <a className="text-teal-800 underline" href={row.profile_url} target="_blank" rel="noreferrer">
                {row.profile_url}
              </a>
            ) : (
              "—"
            )}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">How I found them</dt>
          <dd className="mt-1 whitespace-pre-wrap">{row.how_found || "—"}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Last interaction</dt>
          <dd className="mt-1">{formatDate(row.last_interaction_on)}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Next follow-up</dt>
          <dd className="mt-1">{formatDate(row.next_follow_up_on)}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Private notes</dt>
          <dd className="mt-1 whitespace-pre-wrap">{row.notes || "—"}</dd>
        </div>
      </dl>
      <form action={deleteContact}>
        <input type="hidden" name="id" value={row.id} />
        <button type="submit" className="text-sm text-red-700 underline">
          Delete this contact
        </button>
      </form>
    </div>
  );
}
