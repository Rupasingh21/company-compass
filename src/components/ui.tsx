import Link from "next/link";

export const panelClass =
  "rounded-2xl border border-[#e6e0d6] bg-[#fffcf8] p-5 shadow-[0_1px_2px_rgba(68,50,30,0.04),0_12px_32px_rgba(68,50,30,0.05)] sm:p-6";

export const listCardClass =
  "rounded-2xl border border-[#e6e0d6] bg-[#fffcf8] p-4 shadow-[0_1px_2px_rgba(68,50,30,0.04)]";

export const mutedClass = "text-sm leading-relaxed text-[#44403c]";

export function primaryButtonClass(extra = "") {
  return `inline-flex min-h-11 items-center justify-center rounded-full bg-[#0f766e] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#115e59] disabled:opacity-70 ${extra}`;
}

export function secondaryButtonClass(extra = "") {
  return `inline-flex min-h-11 items-center justify-center rounded-full border border-[#d9d2c5] bg-[#fffcf8] px-4 py-2.5 text-sm font-medium text-[#1c1917] shadow-sm hover:bg-[#f6f1e8] ${extra}`;
}

export function textLinkClass() {
  return "font-medium text-[#115e59] underline decoration-[#b7d4cf] underline-offset-2 hover:decoration-[#115e59]";
}

export function deleteButtonClass() {
  return "text-sm font-medium text-[#9f1239] underline decoration-[#e7c3cc] underline-offset-2";
}

const tones = {
  neutral: "bg-[#f3efe8] text-[#3f3a34] ring-[#e4ddd2]",
  blue: "bg-[#e7f1f6] text-[#1a3d4d] ring-[#d3e4ec]",
  sage: "bg-[#e7f0e8] text-[#1d3d2e] ring-[#d3e4d6]",
  lavender: "bg-[#efeaf6] text-[#3c3354] ring-[#e0d8ee]",
  teal: "bg-[#e6f3f1] text-[#134e4a] ring-[#cfe6e2]",
  warm: "bg-[#f8eee8] text-[#5c331f] ring-[#eddcd3]",
} as const;

function toneFor(value: string | null) {
  switch (value) {
    case "in_progress":
    case "open":
    case "reached_out":
    case "medium":
      return "blue";
    case "completed":
    case "applied":
    case "replied":
    case "offer":
      return "sage";
    case "assessment":
    case "high":
      return "lavender";
    case "interviewing":
      return "teal";
    case "rejected":
      return "warm";
    default:
      return "neutral";
  }
}

export function StatusBadge({ value, label }: { value: string | null; label: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${tones[toneFor(value)]}`}
    >
      {label}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-balance">{title}</h1>
        {description ? <p className={`mt-2 ${mutedClass}`}>{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function KeyFacts({
  items,
}: {
  items: { label: string; children: React.ReactNode; tone?: "plain" | "sage" | "blue" | "lavender" }[];
}) {
  const wash = {
    plain: "bg-[#fffcf8]",
    sage: "bg-[#eef5ef]",
    blue: "bg-[#eef4f8]",
    lavender: "bg-[#f4f0f8]",
  };
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-2xl border border-[#e6e0d6] p-4 shadow-[0_1px_2px_rgba(68,50,30,0.04)] ${wash[item.tone ?? "plain"]}`}
        >
          <p className="text-xs font-semibold tracking-wide text-[#57534e] uppercase">{item.label}</p>
          <div className="mt-2 text-sm leading-relaxed text-[#1c1917]">{item.children}</div>
        </div>
      ))}
    </div>
  );
}

export function DetailList({
  title,
  items,
}: {
  title?: string;
  items: { label: string; value: React.ReactNode; wide?: boolean }[];
}) {
  return (
    <section className={panelClass}>
      {title ? <h2 className="mb-4 text-lg font-semibold">{title}</h2> : null}
      <dl className="grid gap-5 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className={item.wide ? "sm:col-span-2" : undefined}>
            <dt className="text-xs font-semibold tracking-wide text-[#57534e] uppercase">{item.label}</dt>
            <dd className="mt-1 text-sm leading-relaxed whitespace-pre-wrap text-[#1c1917]">
              {item.value || "—"}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Notice({
  children,
  tone = "warm",
}: {
  children: React.ReactNode;
  tone?: "warm" | "sage";
}) {
  const style =
    tone === "sage"
      ? "border-[#cfe3d4] bg-[#eef5ef] text-[#1d3d2e]"
      : "border-[#ead9c4] bg-[#f8f1e6] text-[#4a341c]";
  return <div className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${style}`}>{children}</div>;
}

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
    <div className="rounded-2xl border border-dashed border-[#d9d2c5] bg-[#fffcf8] px-6 py-12 text-center shadow-[0_1px_2px_rgba(68,50,30,0.04)]">
      <h2 className="text-lg font-semibold text-[#1c1917]">{title}</h2>
      <p className={`mx-auto mt-2 max-w-md ${mutedClass}`}>{body}</p>
      <Link href={href} className={`mt-5 ${primaryButtonClass()}`}>
        {action}
      </Link>
    </div>
  );
}

export function ErrorBanner({ message }: { message?: string | string[] }) {
  const text = Array.isArray(message) ? message[0] : message;
  if (!text) return null;
  return (
    <p className="rounded-xl border border-[#e7c3cc] bg-[#fdf2f4] px-4 py-3 text-sm text-[#7f1d33]">
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
      <span className="text-sm font-medium text-[#1c1917]">{label}</span>
      {children}
      {hint ? <span className="block text-sm text-[#57534e]">{hint}</span> : null}
      {name ? null : null}
    </label>
  );
}

export function inputClassName() {
  return "w-full rounded-xl border border-[#d9d2c5] bg-white px-3 py-2.5 text-[#1c1917] shadow-sm";
}
