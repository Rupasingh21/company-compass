import { createCompany } from "@/app/actions/companies";
import { ErrorBanner } from "@/components/ui";
import { CompanyForm } from "@/components/forms";

export default async function NewCompanyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Add a company</h1>
        <p className="mt-2 text-slate-600">
          Capture what you know now. You can come back and fill in more as you research.
        </p>
      </div>
      <ErrorBanner message={error} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <CompanyForm action={createCompany} submitLabel="Save company" />
      </div>
    </div>
  );
}
