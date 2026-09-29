import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { formatDate, labelFor, outreachStatuses } from "@/lib/labels";
import {
  EmptyState,
  ErrorBanner,
  PageHeader,
  StatusBadge,
  listCardClass,
  mutedClass,
  primaryButtonClass,
  textLinkClass,
} from "@/components/ui";

type ContactRow = {
  id: string;
  name: string;
  role: string | null;
  outreach_status: string;
  next_follow_up_on: string | null;
  companies: { name: string } | { name: string }[] | null;
};

function companyName(value: ContactRow["companies"]) {
  if (!value) return "No company linked";
  return Array.isArray(value) ? value[0]?.name ?? "No company linked" : value.name;
}

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("contacts")
    .select("id, name, role, outreach_status, next_follow_up_on, companies(name)")
    .order("name");
  const contacts = (data ?? []) as ContactRow[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts"
        description="People you want to remember. Follow-ups are reminders for you, not automatic emails."
        action={
          <Link href="/contacts/new" className={primaryButtonClass()}>
            Add contact
          </Link>
        }
      />
      <ErrorBanner message={error} />
      {!contacts.length ? (
        <EmptyState
          title="No contacts yet"
          body="Add a University of Delaware alum or another professional when you have a name and a reason to reach out."
          href="/contacts/new"
          action="Add a contact"
        />
      ) : (
        <ul className="space-y-3">
          {contacts.map((contact) => (
            <li key={contact.id} className={listCardClass}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <Link href={`/contacts/${contact.id}`} className="text-lg font-semibold hover:underline">
                    {contact.name}
                  </Link>
                  <p className={`mt-1 ${mutedClass}`}>
                    {companyName(contact.companies)}
                    {contact.role ? ` · ${contact.role}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge
                    value={contact.outreach_status}
                    label={labelFor(outreachStatuses, contact.outreach_status)}
                  />
                  <Link className={`text-sm ${textLinkClass()}`} href={`/contacts/${contact.id}/edit`}>
                    Edit
                  </Link>
                </div>
              </div>
              {contact.next_follow_up_on ? (
                <p className="mt-3 rounded-xl bg-[#eef4f8] px-3 py-2 text-sm text-[#1a3d4d]">
                  Follow up {formatDate(contact.next_follow_up_on)}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
