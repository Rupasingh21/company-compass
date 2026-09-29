import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import type { Job } from "@/lib/types";
import { PageHeader, panelClass } from "@/components/ui";
import { JobForm } from "@/components/job-form";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, userId } = await requireUser();
  const [{ data: job }, { data: companies }] = await Promise.all([
    supabase.from("jobs").select("*").eq("id", id).eq("user_id", userId).maybeSingle(),
    supabase.from("companies").select("id, name").order("name"),
  ]);

  if (!job) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Edit job" />
      <div className={panelClass}>
        <JobForm job={job as Job} companies={companies ?? []} />
      </div>
    </div>
  );
}
