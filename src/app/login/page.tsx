import { LoginForm } from "@/components/auth-forms";
import { ErrorBanner } from "@/components/ui";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-600">
        Log in with the same email and password you used to sign up. After you open the
        confirmation link in your email, come here to sign in.
      </p>
      <div className="mt-6 space-y-4">
        <ErrorBanner message={error} />
        <LoginForm />
      </div>
    </div>
  );
}
