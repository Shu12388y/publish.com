"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

const newsletters = [
  {
    title: "The creator economy is entering its thoughtful era",
    description:
      "A closer look at the people, products, and ideas shaping independent publishing.",
    date: "October 18, 2026",
    readTime: "6 min read",
  },
  {
    title: "Five ideas worth carrying into the week",
    description:
      "A compact collection of essays, tools, and observations for curious minds.",
    date: "October 11, 2026",
    readTime: "4 min read",
  },
  {
    title: "Notes on making work that lasts",
    description:
      "What consistency, clarity, and a little patience can teach us about creative work.",
    date: "October 4, 2026",
    readTime: "5 min read",
  },
];

function ArrowUpRight() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
        <Link className="flex items-center gap-2 font-semibold tracking-tight" href="/">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
            P
          </span>
          Publish.com
        </Link>
        <a
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          href="#archive"
        >
          Read the archive
        </a>
      </nav>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-16 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-16">
        <div>
          <div className="mb-6 inline-flex items-center rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            The Publish.com newsletter
          </div>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl">
            Good ideas,
            <br />
            <span className="text-muted-foreground">delivered weekly.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
            A thoughtful digest of stories, tools, and perspectives for people
            building the future of independent publishing.
          </p>

          <div className="mt-8 max-w-md">
            {subscribed ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                <p className="font-medium">You&apos;re on the list.</p>
                <p className="mt-1 text-emerald-700">
                  We&apos;ll send the next issue to {email}.
                </p>
              </div>
            ) : (
              <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
                <input
                  aria-label="Email address"
                  className="h-11 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                />
                <button
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  type="submit"
                >
                  Subscribe
                  <ArrowUpRight />
                </button>
              </form>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              No spam. Just one useful email every Sunday. Unsubscribe anytime.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border bg-card shadow-lg">
          <Image
            alt="Abstract editorial illustration for the Publish.com newsletter"
            className="h-full min-h-[340px] w-full object-cover"
            height={700}
            priority
            src="/newsletter-banner.svg"
            width={800}
          />
          <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/30 bg-black/25 p-4 text-white backdrop-blur-md">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">
              This week
            </p>
            <p className="mt-1 text-lg font-medium">
              Make space for better work.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30" id="archive">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-primary">From the archive</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Previous newsletters
              </h2>
              <p className="mt-2 text-muted-foreground">
                Catch up on the ideas our readers loved most.
              </p>
            </div>
            <a
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              href="#archive"
            >
              View all issues
              <ArrowUpRight />
            </a>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {newsletters.map((newsletter) => (
              <article
                className="group rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                key={newsletter.title}
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{newsletter.date}</span>
                  <span>{newsletter.readTime}</span>
                </div>
                <h3 className="mt-8 text-xl font-semibold leading-snug tracking-tight">
                  {newsletter.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {newsletter.description}
                </p>
                <a
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:underline"
                  href="#read"
                >
                  Read issue
                  <ArrowUpRight />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>© 2026 Publish.com. Made for independent creators.</p>
        <div className="flex gap-5">
          <a className="hover:text-foreground" href="#privacy">
            Privacy
          </a>
          <a className="hover:text-foreground" href="#contact">
            Contact
          </a>
        </div>
      </footer>
    </main>
  );
}
