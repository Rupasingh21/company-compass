import { notFound } from "next/navigation";
import { updateContact } from "@/app/actions/contacts";
import { requireUser } from "@/lib/auth";
import type { Contact } from "@/lib/types";
import { ContactForm } from "@/components/forms";
import { ErrorBanner } from "@/components/ui";

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
      <h1 className="text-3xl font-semibold tracking-tight">Edit contact</h1>
      <ErrorBanner message={error} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
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
