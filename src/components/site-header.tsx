import Link from "next/link";
import { signOut } from "@/app/actions/auth";

type Props = {
  email?: string | null;
  signedIn: boolean;
};

const nav = [
  { href: "/overview", label: "Overview" },
  { href: "/companies", label: "Companies" },
  { href: "/contacts", label: "Contacts" },
];

export function SiteHeader({ email, signedIn }: Props) {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href={signedIn ? "/overview" : "/"} className="font-semibold tracking-tight text-slate-900">
            Company Compass
          </Link>
          {!signedIn ? (
            <div className="flex gap-2 sm:hidden">
              <Link className="rounded-full px-3 py-1.5 text-sm text-slate-700" href="/login">
                Log in
              </Link>
              <Link
                className="rounded-full bg-teal-700 px-3 py-1.5 text-sm text-white"
                href="/signup"
              >
                Sign up
              </Link>
            </div>
          ) : null}
        </div>
        {signedIn ? (
          <nav className="flex flex-wrap items-center gap-2 text-sm">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-1.5 text-slate-700 hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
            <span className="hidden text-slate-500 sm:inline">{email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
              >
                Sign out
              </button>
            </form>
          </nav>
        ) : (
          <div className="hidden gap-2 sm:flex">
            <Link className="rounded-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" href="/login">
              Log in
            </Link>
            <Link
              className="rounded-full bg-teal-700 px-4 py-2 text-sm text-white hover:bg-teal-800"
              href="/signup"
            >
              Create an account
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
