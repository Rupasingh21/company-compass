"use client";

import { useState } from "react";
import {
  jobStatuses,
  priorities,
  workArrangements,
  isApplicationStatus,
} from "@/lib/labels";
import type { Job } from "@/lib/types";
import { createJob, updateJob, type JobActionResult } from "@/app/actions/jobs";
import { ErrorBanner, Field, inputClassName, mutedClass, primaryButtonClass } from "@/components/ui";

const areaClass = `${inputClassName()} min-h-24`;

export function JobForm({
  job,
  companies,
  presetCompanyId,
}: {
  job?: Job;
  companies: { id: string; name: string }[];
  presetCompanyId?: string;
}) {
  const [status, setStatus] = useState(job?.status ?? "to_research");
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const showApplication = isApplicationStatus(status);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const result: JobActionResult | void = job
      ? await updateJob(formData)
      : await createJob(formData);
    setLoading(false);
    if (result?.warning) {
      setWarning(result.warning);
      return;
    }
    if (result?.error) {
      setError(result.error);
      setWarning(null);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {job ? <input type="hidden" name="id" value={job.id} /> : null}
      <ErrorBanner message={error ?? undefined} />
      {warning ? (
        <div className="rounded-xl border border-[#ead9c4] bg-[#f8f1e6] px-4 py-3 text-sm leading-relaxed text-[#4a341c]">
          <p>{warning}</p>
          <label className="mt-3 flex items-start gap-2">
            <input type="checkbox" name="confirm_similar" value="yes" className="mt-1" />
            <span>Save anyway. This is a different opening.</span>
          </label>
        </div>
      ) : null}
      <Field label="Job title">
        <input
          required
          name="title"
          defaultValue={job?.title ?? ""}
          className={inputClassName()}
          placeholder="Example: Business analyst"
        />
      </Field>
      <Field label="Company">
        <select
          required
          name="company_id"
          defaultValue={job?.company_id ?? presetCompanyId ?? ""}
          className={inputClassName()}
        >
          <option value="">Choose a company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Requisition ID" hint="Optional. Used to prevent a duplicate of the same opening.">
          <input
            name="requisition_id"
            defaultValue={job?.requisition_id ?? ""}
            className={inputClassName()}
          />
        </Field>
        <Field label="Status">
          <select
            name="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as Job["status"])}
            className={inputClassName()}
          >
            {jobStatuses.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Official posting URL" hint="Paste the link you verified. The app does not search for openings.">
        <input
          name="posting_url"
          type="url"
          defaultValue={job?.posting_url ?? ""}
          className={inputClassName()}
          placeholder="https://"
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Location">
          <input name="location" defaultValue={job?.location ?? ""} className={inputClassName()} />
        </Field>
        <Field label="Work arrangement">
          <select
            name="work_arrangement"
            defaultValue={job?.work_arrangement ?? "not_sure"}
            className={inputClassName()}
          >
            {workArrangements.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Posting date">
          <input name="posted_on" type="date" defaultValue={job?.posted_on ?? ""} className={inputClassName()} />
        </Field>
        <Field label="Application deadline">
          <input
            name="application_deadline"
            type="date"
            defaultValue={job?.application_deadline ?? ""}
            className={inputClassName()}
          />
        </Field>
        <Field label="Expected start date">
          <input
            name="expected_start_on"
            type="date"
            defaultValue={job?.expected_start_on ?? ""}
            className={inputClassName()}
          />
        </Field>
      </div>
      <Field label="Description or requirements notes">
        <textarea
          name="description_notes"
          defaultValue={job?.description_notes ?? ""}
          className={areaClass}
        />
      </Field>
      <Field label="Graduation eligibility">
        <textarea
          name="graduation_eligibility"
          defaultValue={job?.graduation_eligibility ?? ""}
          className={areaClass}
          placeholder="Example: May 2027 graduates welcome"
        />
      </Field>
      <Field label="Work authorization or sponsorship notes">
        <textarea
          name="work_authorization_notes"
          defaultValue={job?.work_authorization_notes ?? ""}
          className={areaClass}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Priority">
          <select name="priority" defaultValue={job?.priority ?? "medium"} className={inputClassName()}>
            {priorities.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Next action date">
          <input
            name="next_action_on"
            type="date"
            defaultValue={job?.next_action_on ?? ""}
            className={inputClassName()}
          />
        </Field>
      </div>
      <Field label="Fit notes">
        <textarea name="fit_notes" defaultValue={job?.fit_notes ?? ""} className={areaClass} />
      </Field>
      <Field label="Next action">
        <input name="next_action" defaultValue={job?.next_action ?? ""} className={inputClassName()} />
      </Field>
      <fieldset className="space-y-5 rounded-2xl border border-[#e6e0d6] bg-[#f4f0f8] p-4">
        <legend className="px-1 text-sm font-medium text-[#1c1917]">Application details</legend>
        <p className={mutedClass}>
          {showApplication
            ? "Optional. A cover letter is not required. Fill in only what you have."
            : "These fields stay optional. They are here when you mark the role Applied or later. A cover letter is not required."}
        </p>
        <div className={showApplication ? "space-y-5" : "hidden"}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Application date">
              <input name="applied_on" type="date" defaultValue={job?.applied_on ?? ""} className={inputClassName()} />
            </Field>
            <Field label="Confirmation or application ID">
              <input
                name="confirmation_id"
                defaultValue={job?.confirmation_id ?? ""}
                className={inputClassName()}
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Resume version">
              <input
                name="resume_version"
                defaultValue={job?.resume_version ?? ""}
                className={inputClassName()}
                placeholder="Example: Resume v3, analytics"
              />
            </Field>
            <Field label="Cover letter version">
              <input
                name="cover_letter_version"
                defaultValue={job?.cover_letter_version ?? ""}
                className={inputClassName()}
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Assessment date">
              <input
                name="assessment_on"
                type="date"
                defaultValue={job?.assessment_on ?? ""}
                className={inputClassName()}
              />
            </Field>
            <Field label="Interview date">
              <input
                name="interview_on"
                type="date"
                defaultValue={job?.interview_on ?? ""}
                className={inputClassName()}
              />
            </Field>
          </div>
          <Field label="Assessment notes">
            <textarea
              name="assessment_notes"
              defaultValue={job?.assessment_notes ?? ""}
              className={areaClass}
            />
          </Field>
          <Field label="Interview notes">
            <textarea
              name="interview_notes"
              defaultValue={job?.interview_notes ?? ""}
              className={areaClass}
            />
          </Field>
        </div>
      </fieldset>
      <button
        type="submit"
        disabled={loading}
        className={primaryButtonClass()}
      >
        {loading ? "Saving..." : job ? "Save changes" : "Save job"}
      </button>
    </form>
  );
}
