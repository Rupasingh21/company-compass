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
