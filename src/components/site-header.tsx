"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { primaryButtonClass, secondaryButtonClass } from "@/components/ui";

type Props = {
  accountName?: string | null;
  signedIn: boolean;
};

const nav = [
  { href: "/overview", label: "Overview" },
  { href: "/companies", label: "Companies" },
  { href: "/jobs", label: "Jobs" },
  { href: "/contacts", label: "Contacts" },
  { href: "/profile", label: "Profile" },
];

function itemClass(active: boolean) {
  return active
    ? "inline-flex min-h-11 items-center rounded-full bg-[#e6f3f1] px-3 text-sm font-medium text-[#115e59]"
    : "inline-flex min-h-11 items-center rounded-full px-3 text-sm text-[#44403c] hover:bg-[#efeae2]";
}

export function SiteHeader({ accountName, signedIn }: Props) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-[#e6e0d6] bg-[#fbf8f3]/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={signedIn ? "/overview" : "/"}
            className="font-semibold tracking-tight text-[#1c1917]"
          >
            Company Compass
          </Link>
          {!signedIn ? (
            <div className="flex gap-2 sm:hidden">
              <Link className={secondaryButtonClass("px-3")} href="/login">
                Log in
              </Link>
              <Link className={primaryButtonClass("px-3")} href="/signup">
                Sign up
              </Link>
            </div>
          ) : null}
        </div>
        {signedIn ? (
          <nav className="flex flex-wrap items-center gap-1 text-sm" aria-label="Main">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={item.href} href={item.href} className={itemClass(active)} aria-current={active ? "page" : undefined}>
                  {item.label}
                </Link>
              );
            })}
            <Link href="/profile" className={`${secondaryButtonClass("px-3")} ml-1`}>
              {accountName}
            </Link>
            <form action={signOut}>
              <button type="submit" className={secondaryButtonClass("px-3")}>
                Sign out
              </button>
            </form>
          </nav>
        ) : (
          <div className="hidden gap-2 sm:flex">
            <Link className={secondaryButtonClass()} href="/login">
              Log in
            </Link>
            <Link className={primaryButtonClass()} href="/signup">
              Create an account
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
