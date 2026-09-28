"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { ErrorBanner, Field, inputClassName } from "@/components/ui";

export function CheckEmailNotice() {
  return (
    <div className="space-y-4 text-center">
      <h2 className="text-xl font-semibold text-slate-900">Check your email</h2>
      <p className="text-sm text-slate-600">
        We sent a confirmation link. Open that link, then log in with the same password.
        There is no code to type on this page.
      </p>
      <Link
        href="/login"
        className="inline-flex rounded-full bg-teal-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-800"
      >
        Go to log in
      </Link>
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    const next = new URLSearchParams(window.location.search).get("next");
    router.push(next?.startsWith("/") && !next.startsWith("/_next") ? next : "/overview");
    router.refresh();
  }

  return (
    <form method="post" onSubmit={onSubmit} className="space-y-4">
      <ErrorBanner message={error ?? undefined} />
      <Field label="Email">
        <input required name="email" type="email" autoComplete="email" className={inputClassName()} />
      </Field>
      <Field label="Password">
        <input
          required
          name="password"
          type="password"
          autoComplete="current-password"
          className={inputClassName()}
        />
      </Field>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-teal-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-70"
      >
        {loading ? "Signing in..." : "Log in"}
      </button>
      <p className="text-center text-sm text-slate-600">
        New here?{" "}
        <Link className="font-medium text-teal-800 underline" href="/signup">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function SignUpForm({ initialError }: { initialError?: string }) {
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signUp(null, new FormData(event.currentTarget));
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setDone(true);
  }

  if (done) {
    return <CheckEmailNotice />;
  }

  return (
    <form method="post" onSubmit={onSubmit} className="space-y-4">
      <ErrorBanner message={error ?? undefined} />
      <Field label="Email">
        <input required name="email" type="email" autoComplete="email" className={inputClassName()} />
      </Field>
      <Field label="Password">
        <input
          required
          minLength={6}
          name="password"
          type="password"
          autoComplete="new-password"
          className={inputClassName()}
        />
      </Field>
      <Field label="Repeat password">
        <input
          required
          minLength={6}
          name="repeat_password"
          type="password"
          autoComplete="new-password"
          className={inputClassName()}
        />
      </Field>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-teal-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-70"
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>
      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link className="font-medium text-teal-800 underline" href="/login">
          Log in
        </Link>
      </p>
    </form>
  );
}
