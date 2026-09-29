import { createCompany } from "@/app/actions/companies";
import { ErrorBanner, PageHeader, panelClass } from "@/components/ui";
import { CompanyForm } from "@/components/forms";

export default async function NewCompanyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Add a company"
        description="Capture what you know now. You can come back and fill in more as you research."
      />
      <ErrorBanner message={error} />
      <div className={panelClass}>
        <CompanyForm action={createCompany} submitLabel="Save company" />
      </div>
    </div>
  );
}
