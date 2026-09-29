import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteContact } from "@/app/actions/contacts";
import { requireUser } from "@/lib/auth";
import { alumOptions, formatDate, labelFor, outreachStatuses } from "@/lib/labels";
import type { Contact } from "@/lib/types";
import {
  DetailList,
  ErrorBanner,
  KeyFacts,
  StatusBadge,
  deleteButtonClass,
  secondaryButtonClass,
  textLinkClass,
} from "@/components/ui";

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
          <StatusBadge
            value={row.outreach_status}
            label={labelFor(outreachStatuses, row.outreach_status)}
          />
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{row.name}</h1>
        </div>
        <Link href={`/contacts/${row.id}/edit`} className={secondaryButtonClass()}>
          Edit
        </Link>
      </div>
      <KeyFacts
        items={[
          {
            label: "Next follow-up",
            tone: "blue",
            children: formatDate(row.next_follow_up_on),
          },
          {
            label: "Outreach status",
            tone: "sage",
            children: labelFor(outreachStatuses, row.outreach_status),
          },
        ]}
      />
      <DetailList
        items={[
          {
            label: "Company",
            value: company ? (
              <Link className={textLinkClass()} href={`/companies/${company.id}`}>
                {company.name}
              </Link>
            ) : (
              "—"
            ),
          },
          { label: "Role", value: row.role || "—" },
          { label: "UD alumnus", value: labelFor(alumOptions, row.is_ud_alum) },
          {
            label: "Profile URL",
            wide: true,
            value: row.profile_url ? (
              <a className={textLinkClass()} href={row.profile_url} target="_blank" rel="noreferrer">
                {row.profile_url}
              </a>
            ) : (
              "—"
            ),
          },
          { label: "How I found them", value: row.how_found || "—", wide: true },
          { label: "Last interaction", value: formatDate(row.last_interaction_on) },
          { label: "Next follow-up", value: formatDate(row.next_follow_up_on) },
          { label: "Private notes", value: row.notes || "—", wide: true },
        ]}
      />
      <form action={deleteContact}>
        <input type="hidden" name="id" value={row.id} />
        <button type="submit" className={deleteButtonClass()}>
          Delete this contact
        </button>
      </form>
    </div>
  );
}
