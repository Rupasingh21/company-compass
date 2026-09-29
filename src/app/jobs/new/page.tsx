import { requireUser } from "@/lib/auth";
import { PageHeader, panelClass } from "@/components/ui";
import { JobForm } from "@/components/job-form";

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string }>;
}) {
  const { companyId } = await searchParams;
  const { supabase } = await requireUser();
  const { data } = await supabase.from("companies").select("id, name").order("name");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Add a job"
        description="Enter a posting you have checked yourself. Dates and application details can wait until you know them."
      />
      <div className={panelClass}>
        <JobForm companies={data ?? []} presetCompanyId={companyId} />
      </div>
    </div>
  );
}
