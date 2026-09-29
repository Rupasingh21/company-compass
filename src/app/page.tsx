import Link from "next/link";
import { getOptionalUser } from "@/lib/auth";
import { mutedClass, panelClass, primaryButtonClass, secondaryButtonClass } from "@/components/ui";

const features = [
  {
    title: "Target companies",
    body: "Save what a company does, why it stands out, roles you like, and one next research step.",
    wash: "bg-[#eef5ef]",
  },
  {
    title: "People and follow-ups",
    body: "Track alumni and other contacts. Record outreach yourself. The app does not send messages.",
    wash: "bg-[#eef4f8]",
  },
  {
    title: "A clear overview",
    body: "See how many companies you have researched and which follow-ups are due when you return.",
    wash: "bg-[#f4f0f8]",
  },
];

export default async function HomePage() {
  const user = await getOptionalUser();

  return (
    <div className="space-y-10">
      <section className={`${panelClass} px-6 py-12 sm:px-10`}>
        <p className="text-sm font-medium text-[#0f766e]">For focused job search</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Keep company research and outreach in one calm place.
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#44403c]">
          Company Compass helps you study the organizations you care about, remember
          the people you meet, and see what to do next. Built for students and
          early-career seekers working a short list of target companies.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {user ? (
            <Link href="/overview" className={primaryButtonClass()}>
              Open my overview
            </Link>
          ) : (
            <>
              <Link href="/signup" className={primaryButtonClass()}>
                Create a free account
              </Link>
              <Link href="/login" className={secondaryButtonClass()}>
                Log in
              </Link>
            </>
          )}
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {features.map((item) => (
          <div key={item.title} className={`rounded-2xl border border-[#e6e0d6] p-5 shadow-[0_1px_2px_rgba(68,50,30,0.04)] ${item.wash}`}>
            <h2 className="font-semibold text-[#1c1917]">{item.title}</h2>
            <p className={`mt-2 ${mutedClass}`}>{item.body}</p>
          </div>
        ))}
      </section>
      <p className={mutedClass}>
        Aim for 20 companies if that helps you stay focused. You can add more whenever you
        are ready.
      </p>
    </div>
  );
}
