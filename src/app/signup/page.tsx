import { SignUpForm } from "@/components/auth-forms";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Create your workspace</h1>
      <p className="mt-2 text-sm text-slate-600">
        Use email and password. You will get a confirmation email with a link. After you
        open that link, log in with this same password. There is no code to type.
      </p>
      <div className="mt-6">
        <SignUpForm initialError={error} />
      </div>
    </div>
  );
}
