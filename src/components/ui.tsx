import Link from "next/link";

export function EmptyState({
  title,
  body,
  href,
  action,
}: {
  title: string;
  body: string;
  href: string;
  action: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-slate-600">{body}</p>
      <Link
        href={href}
        className="mt-5 inline-flex rounded-full bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
      >
        {action}
      </Link>
    </div>
  );
}

export function ErrorBanner({ message }: { message?: string | string[] }) {
  const text = Array.isArray(message) ? message[0] : message;
  if (!text) return null;
  return (
    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {text}
    </p>
  );
}

export function Field({
  label,
  name,
  children,
  hint,
}: {
  label: string;
  name?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-slate-500">{hint}</span> : null}
      {name ? null : null}
    </label>
  );
}

export function inputClassName() {
  return "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none ring-teal-700/30 focus:ring-2";
}
