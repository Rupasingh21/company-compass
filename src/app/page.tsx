import Link from "next/link";
import { getOptionalUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getOptionalUser();

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-slate-900 px-6 py-12 text-white sm:px-10">
        <p className="text-sm font-medium uppercase tracking-wide text-teal-200">
          For focused job search
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Keep company research and outreach in one calm place.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-200">
          Company Compass helps you study the organizations you care about, remember
          the people you meet, and see what to do next. Built for students and
          early-career seekers working a short list of target companies.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {user ? (
            <Link
              href="/overview"
              className="rounded-full bg-teal-500 px-5 py-2.5 text-sm font-medium text-slate-950 hover:bg-teal-400"
            >
              Open my overview
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="rounded-full bg-teal-500 px-5 py-2.5 text-sm font-medium text-slate-950 hover:bg-teal-400"
              >
                Create a free account
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Target companies",
            body: "Save what a company does, why it stands out, roles you like, and one next research step.",
          },
          {
            title: "People and follow-ups",
            body: "Track alumni and other contacts. Record outreach yourself. The app does not send messages.",
          },
          {
            title: "A clear overview",
            body: "See how many companies you have researched and which follow-ups are due when you return.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.body}</p>
          </div>
        ))}
      </section>
      <p className="text-sm text-slate-500">
        Aim for 20 companies if that helps you stay focused. You can add more whenever you
        are ready.
      </p>
    </div>
  );
}
