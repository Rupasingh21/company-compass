import { createContact } from "@/app/actions/contacts";
import { requireUser } from "@/lib/auth";
import { ContactForm } from "@/components/forms";
import { ErrorBanner, PageHeader, panelClass } from "@/components/ui";

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
      <PageHeader
        title="Add a contact"
        description="Save enough to remember a thoughtful follow-up. You will send the message yourself."
      />
      <ErrorBanner message={error} />
      <div className={panelClass}>
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
