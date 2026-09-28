import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getOptionalUser } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Company Compass",
  description:
    "A private workspace to research target companies and track professional outreach.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getOptionalUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900">
        <SiteHeader signedIn={Boolean(user)} email={user?.email} />
        <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
