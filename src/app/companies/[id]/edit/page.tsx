import { notFound } from "next/navigation";
import { updateCompany } from "@/app/actions/companies";
import { requireUser } from "@/lib/auth";
import type { Company } from "@/lib/types";
import { CompanyForm } from "@/components/forms";
import { ErrorBanner, PageHeader, panelClass } from "@/components/ui";

export default async function EditCompanyPage({
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
    .from("companies")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Edit company" />
      <ErrorBanner message={error} />
      <div className={panelClass}>
        <CompanyForm
          company={data as Company}
          action={updateCompany}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
