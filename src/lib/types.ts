export type Profile = {
  id: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
};

export type Company = {
  id: string;
  user_id: string;
  name: string;
  website: string | null;
  industry: string | null;
  what_it_does: string | null;
  mission_or_principles: string | null;
  distinctive_products: string | null;
  recent_developments: string | null;
  roles_of_interest: string | null;
  research_status: "not_started" | "in_progress" | "completed";
  notes: string | null;
  next_action: string | null;
  created_at: string;
  updated_at: string;
};

export type Job = {
  id: string;
  user_id: string;
  company_id: string;
  title: string;
  requisition_id: string | null;
  posting_url: string | null;
  location: string | null;
  work_arrangement: "onsite" | "hybrid" | "remote" | "not_sure" | null;
  posted_on: string | null;
  application_deadline: string | null;
  expected_start_on: string | null;
  description_notes: string | null;
  graduation_eligibility: string | null;
  work_authorization_notes: string | null;
  priority: "low" | "medium" | "high";
  fit_notes: string | null;
  next_action: string | null;
  next_action_on: string | null;
  status:
    | "to_research"
    | "open"
    | "applied"
    | "assessment"
    | "interviewing"
    | "offer"
    | "rejected"
    | "withdrawn"
    | "closed";
  applied_on: string | null;
  confirmation_id: string | null;
  resume_version: string | null;
  cover_letter_version: string | null;
  assessment_notes: string | null;
  assessment_on: string | null;
  interview_notes: string | null;
  interview_on: string | null;
  created_at: string;
  updated_at: string;
};

export type Contact = {
  id: string;
  user_id: string;
  company_id: string | null;
  name: string;
  role: string | null;
  is_ud_alum: "yes" | "no" | "not_sure" | null;
  profile_url: string | null;
  how_found: string | null;
  outreach_status: "not_started" | "reached_out" | "replied" | "closed";
  last_interaction_on: string | null;
  next_follow_up_on: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
