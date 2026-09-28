export const researchStatuses = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Research completed" },
] as const;

export const outreachStatuses = [
  { value: "not_started", label: "Not started" },
  { value: "reached_out", label: "Reached out" },
  { value: "replied", label: "Replied" },
  { value: "closed", label: "Closed" },
] as const;

export const alumOptions = [
  { value: "not_sure", label: "Not sure" },
  { value: "yes", label: "Yes, UD alum" },
  { value: "no", label: "No" },
] as const;

export type ResearchStatus = (typeof researchStatuses)[number]["value"];
export type OutreachStatus = (typeof outreachStatuses)[number]["value"];
export type AlumOption = (typeof alumOptions)[number]["value"];

export function labelFor(
  options: readonly { value: string; label: string }[],
  value: string | null,
) {
  return options.find((option) => option.value === value)?.label ?? "—";
}

export function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
