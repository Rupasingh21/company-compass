import { createContact } from "@/app/actions/contacts";
import { requireUser } from "@/lib/auth";
import { ContactForm } from "@/components/forms";
import { ErrorBanner } from "@/components/ui";

export default async function NewContactPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; companyId?: string }>;
}) {
  const { error, companyId } = await searchParams;
  const { supabase } = await requireUser();
  const { data } = await supabase.from("companies").select("id, name").order("name");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Add a contact</h1>
        <p className="mt-2 text-slate-600">
          Save enough to remember a thoughtful follow-up. You will send the message yourself.
        </p>
      </div>
      <ErrorBanner message={error} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <ContactForm
          action={createContact}
          submitLabel="Save contact"
          companies={data ?? []}
          presetCompanyId={companyId}
        />
      </div>
    </div>
  );
}
