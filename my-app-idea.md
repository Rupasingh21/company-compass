# My App Idea: Company Compass

## The problem
I am an international graduate student at the University of Delaware graduating in May 2027. I have already shortlisted 20 companies for early-career opportunities. I want to research each organization thoroughly and make genuine connections with University of Delaware alumni and other professionals there. Right now it is hard to keep what I learn, whom I contact, and what to do next organized in one place.

## Who this helps
Students and early-career job seekers who are doing focused company research and professional outreach. The first version is a private workspace for each signed-in user.

## Core idea
Company Compass helps me maintain my list of target companies, record meaningful research about each organization, and track outreach to people at those companies. On the overview page, I can see how many of my 20 companies I have researched and which contacts need a follow-up. Each company has a clear next research or outreach action.

## Core features for the first version

### 1. Target companies
I can add, view, edit, and delete companies. For each company I record its name, website, industry or area of work, what it does, mission or principles, distinctive products or approaches, recent growth or developments, roles I may be interested in, research status, my own notes, and my next action. I can filter or search my list by company name and research status. The initial goal is 20 companies, but I can add more later.

### 2. People and outreach
I can add, view, edit, and delete contacts associated with a company. For each person I record their name, role, whether they are a UD alumnus (if I know), a profile URL, how I found them, outreach status, date of my last interaction, next follow-up date, and private notes about our conversation. The app helps me remember thoughtful follow-ups, but it does not send messages automatically.

### 3. Overview
Show counts for total companies, companies with research completed, contacts reached out to, and upcoming follow-ups. Show which companies still need research and the next actions I have recorded. The data should persist after logout and login and remain private to my account.

## Data model (keep it small)
- Authenticated users are managed by Supabase Auth.
- `companies`: a row belongs to one user and contains the company profile, research fields, status, notes, and next action.
- `contacts`: a row belongs to one user, optionally references one of that user's companies, and contains outreach details and follow-up notes.

These are **two application tables**, plus Supabase's built-in authentication. Enable Row Level Security so every user can create, read, update, and delete only their own records. A contact may reference only a company owned by the same user.

## Typical user journey
I sign in, add one of my 20 target companies, write what I learned about its work and principles, and note one question I still need to research. Then I add a UD alum who works there, record a personal reason to reach out, mark the outreach as sent when I send it myself, and set a follow-up date. When I return, I see my progress and next actions in the overview.

## Design and technology for this bootcamp
Build a clean, responsive web app using Next.js App Router, Tailwind CSS, Supabase email-and-password authentication and database, and Vercel for deployment. Explain the workflow in beginner-friendly terms. The app should support create, read, update, and delete for companies and contacts. Use Supabase email confirmation links, not a code form.

## Future ideas, outside the first version
Job application tracking, resume and cover-letter files, automatic company research, AI-generated messages, reminders, and visa sponsorship tracking. I will verify organization details and immigration-related claims using current reliable sources before relying on them. The first version should not claim to determine sponsorship eligibility or send messages on my behalf.
