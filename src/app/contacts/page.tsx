import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { formatDate, labelFor, outreachStatuses } from "@/lib/labels";
import { EmptyState, ErrorBanner } from "@/components/ui";

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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Contacts</h1>
          <p className="mt-2 text-slate-600">
            People you want to remember. Follow-ups are reminders for you, not automatic emails.
          </p>
        </div>
        <Link
          href="/contacts/new"
          className="rounded-full bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
        >
          Add contact
        </Link>
      </div>
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
            <li key={contact.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <Link href={`/contacts/${contact.id}`} className="text-lg font-semibold hover:underline">
                    {contact.name}
                  </Link>
                  <p className="text-sm text-slate-500">
                    {companyName(contact.companies)}
                    {contact.role ? ` · ${contact.role}` : ""}
                  </p>
                </div>
                <Link className="text-sm text-teal-800 hover:underline" href={`/contacts/${contact.id}/edit`}>
                  Edit
                </Link>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {labelFor(outreachStatuses, contact.outreach_status)}
                {contact.next_follow_up_on
                  ? ` · Follow up ${formatDate(contact.next_follow_up_on)}`
                  : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
