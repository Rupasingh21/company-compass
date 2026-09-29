import { notFound } from "next/navigation";
import { updateContact } from "@/app/actions/contacts";
import { requireUser } from "@/lib/auth";
import type { Contact } from "@/lib/types";
import { ContactForm } from "@/components/forms";
import { ErrorBanner, PageHeader, panelClass } from "@/components/ui";

export default async function EditContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const { supabase, userId } = await requireUser();
  const [{ data: contact }, { data: companies }] = await Promise.all([
    supabase.from("contacts").select("*").eq("id", id).eq("user_id", userId).maybeSingle(),
    supabase.from("companies").select("id, name").order("name"),
  ]);

  if (!contact) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Edit contact" />
      <ErrorBanner message={error} />
      <div className={panelClass}>
        <ContactForm
          contact={contact as Contact}
          companies={companies ?? []}
          action={updateContact}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
