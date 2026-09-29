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

export const jobStatuses = [
  { value: "to_research", label: "To research" },
  { value: "open", label: "Open" },
  { value: "applied", label: "Applied" },
  { value: "assessment", label: "Assessment" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
  { value: "closed", label: "Closed" },
] as const;

export const applicationStatuses = [
  "applied",
  "assessment",
  "interviewing",
  "offer",
  "rejected",
  "withdrawn",
] as const;

export const workArrangements = [
  { value: "not_sure", label: "Not sure" },
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
  { value: "remote", label: "Remote" },
] as const;

export const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const;

export type ResearchStatus = (typeof researchStatuses)[number]["value"];
export type OutreachStatus = (typeof outreachStatuses)[number]["value"];
export type AlumOption = (typeof alumOptions)[number]["value"];
export type JobStatus = (typeof jobStatuses)[number]["value"];
export type WorkArrangement = (typeof workArrangements)[number]["value"];
export type Priority = (typeof priorities)[number]["value"];

export function isApplicationStatus(status: string) {
  return (applicationStatuses as readonly string[]).includes(status);
}

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
