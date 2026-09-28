import {
  alumOptions,
  outreachStatuses,
  researchStatuses,
} from "@/lib/labels";
import type { Company } from "@/lib/types";
import { Field, inputClassName } from "@/components/ui";

const areaClass = `${inputClassName()} min-h-24`;

export function CompanyForm({
  company,
  action,
  submitLabel,
}: {
  company?: Company;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      {company ? <input type="hidden" name="id" value={company.id} /> : null}
      <Field label="Company name">
        <input
          required
          name="name"
          defaultValue={company?.name ?? ""}
          className={inputClassName()}
          placeholder="Example: Acme Analytics"
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Website">
          <input
            name="website"
            type="url"
            defaultValue={company?.website ?? ""}
            className={inputClassName()}
            placeholder="https://"
          />
        </Field>
        <Field label="Industry or area of work">
          <input
            name="industry"
            defaultValue={company?.industry ?? ""}
            className={inputClassName()}
            placeholder="Finance, healthcare, software..."
          />
        </Field>
      </div>
      <Field label="What it does">
        <textarea
          name="what_it_does"
          defaultValue={company?.what_it_does ?? ""}
          className={areaClass}
        />
      </Field>
      <Field label="Mission or principles">
        <textarea
          name="mission_or_principles"
          defaultValue={company?.mission_or_principles ?? ""}
          className={areaClass}
        />
      </Field>
      <Field label="Distinctive products or approaches">
        <textarea
          name="distinctive_products"
          defaultValue={company?.distinctive_products ?? ""}
          className={areaClass}
        />
      </Field>
      <Field label="Recent growth or developments">
        <textarea
          name="recent_developments"
          defaultValue={company?.recent_developments ?? ""}
          className={areaClass}
        />
      </Field>
      <Field label="Roles I may be interested in">
        <textarea
          name="roles_of_interest"
          defaultValue={company?.roles_of_interest ?? ""}
          className={areaClass}
        />
      </Field>
      <Field label="Research status">
        <select
          name="research_status"
          defaultValue={company?.research_status ?? "not_started"}
          className={inputClassName()}
        >
          {researchStatuses.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="My notes">
        <textarea name="notes" defaultValue={company?.notes ?? ""} className={areaClass} />
      </Field>
      <Field
        label="Next action"
        hint="One small next step, such as a question to research or a person to find."
      >
        <input
          name="next_action"
          defaultValue={company?.next_action ?? ""}
          className={inputClassName()}
        />
      </Field>
      <button
        type="submit"
        className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-800"
      >
        {submitLabel}
      </button>
    </form>
  );
}

export function ContactForm({
  action,
  submitLabel,
  companies,
  contact,
  presetCompanyId,
}: {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  companies: { id: string; name: string }[];
  presetCompanyId?: string;
  contact?: {
    id: string;
    company_id: string | null;
    name: string;
    role: string | null;
    is_ud_alum: string | null;
    profile_url: string | null;
    how_found: string | null;
    outreach_status: string;
    last_interaction_on: string | null;
    next_follow_up_on: string | null;
    notes: string | null;
  };
}) {
  return (
    <form action={action} className="space-y-5">
      {contact ? <input type="hidden" name="id" value={contact.id} /> : null}
      <Field label="Name">
        <input
          required
          name="name"
          defaultValue={contact?.name ?? ""}
          className={inputClassName()}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Role">
          <input name="role" defaultValue={contact?.role ?? ""} className={inputClassName()} />
        </Field>
        <Field label="Company">
          <select
            name="company_id"
            defaultValue={contact?.company_id ?? presetCompanyId ?? ""}
            className={inputClassName()}
          >
            <option value="">Not linked yet</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="UD alumnus?">
          <select
            name="is_ud_alum"
            defaultValue={contact?.is_ud_alum ?? "not_sure"}
            className={inputClassName()}
          >
            {alumOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Outreach status">
          <select
            name="outreach_status"
            defaultValue={contact?.outreach_status ?? "not_started"}
            className={inputClassName()}
          >
            {outreachStatuses.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Profile URL">
        <input
          name="profile_url"
          type="url"
          defaultValue={contact?.profile_url ?? ""}
          className={inputClassName()}
          placeholder="https://"
        />
      </Field>
      <Field label="How I found them">
        <textarea
          name="how_found"
          defaultValue={contact?.how_found ?? ""}
          className={`${inputClassName()} min-h-20`}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Last interaction">
          <input
            name="last_interaction_on"
            type="date"
            defaultValue={contact?.last_interaction_on ?? ""}
            className={inputClassName()}
          />
        </Field>
        <Field label="Next follow-up date">
          <input
            name="next_follow_up_on"
            type="date"
            defaultValue={contact?.next_follow_up_on ?? ""}
            className={inputClassName()}
          />
        </Field>
      </div>
      <Field label="Private notes">
        <textarea
          name="notes"
          defaultValue={contact?.notes ?? ""}
          className={`${inputClassName()} min-h-24`}
        />
      </Field>
      <button
        type="submit"
        className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-800"
      >
        {submitLabel}
      </button>
    </form>
  );
}
