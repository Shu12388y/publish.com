import Link from "next/link";
import type { ReactElement } from "react";

const features = [
  {
    number: "01",
    title: "Write without distractions",
    description:
      "A calm, focused editor designed to help your best ideas make it to the page.",
  },
  {
    number: "02",
    title: "Own your audience",
    description:
      "Build a direct relationship with readers through beautiful newsletters and memberships.",
  },
  {
    number: "03",
    title: "Understand what works",
    description:
      "Simple, meaningful analytics that show you where your work is making an impact.",
  },
];

const adminUrl = (process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:5173").replace(/\/$/, "");
const adminSignInUrl = `${adminUrl}/sign-in`;
const adminSignUpUrl = `${adminUrl}/sign-up`;

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

function LogoMark() {
  return (
    <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-sm font-bold !text-white">
      P
    </span>
  );
}

export default function Home(): ReactElement {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link className="flex items-center gap-2 font-semibold tracking-tight" href="/">
          <LogoMark />
          Publish.com
        </Link>
        <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a className="transition-colors hover:text-foreground" href="#platform">
            Platform
          </a>
          <a className="transition-colors hover:text-foreground" href="#features">
            Features
          </a>
          <a className="transition-colors hover:text-foreground" href="#creators">
            For creators
          </a>
        </div>
        <div className="flex items-center gap-3">
          <a
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block"
            href={adminSignInUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Log in
          </a>
          <a
            className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium !text-white shadow-sm transition-opacity hover:opacity-85"
            href={adminSignUpUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Get started
            <ArrowUpRight />
          </a>
        </div>
      </nav>

      <section className="mx-auto grid w-full max-w-7xl gap-14 px-6 pb-20 pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:pb-32 lg:pt-24">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            The home for independent publishing
          </div>
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-7xl">
            Your ideas
            <br />
            <span className="text-muted-foreground">deserve a home.</span>
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-muted-foreground">
            Publish your work, grow your audience, and build a sustainable
            creative business—all in one thoughtful place.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-foreground px-6 text-sm font-medium !text-white shadow-lg transition-transform hover:-translate-y-0.5"
              href={adminSignUpUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Start publishing
              <ArrowUpRight />
            </a>
            <a
              className="inline-flex h-12 items-center justify-center rounded-md border bg-card px-6 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
              href="#platform"
            >
              See how it works
            </a>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Free to start · No credit card required
          </p>
        </div>

        <div className="relative" id="platform">
          <div className="absolute -inset-10 -z-10 bg-[radial-gradient(circle_at_center,oklch(0.9_0.08_80),transparent_65%)]" />
          <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-2">
                <LogoMark />
                <span className="text-sm font-medium">Your workspace</span>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                Live
              </span>
            </div>
            <div className="grid min-h-[380px] grid-cols-[130px_1fr]">
              <div className="hidden border-r bg-muted/40 p-4 sm:block">
                <div className="space-y-2">
                  {["Overview", "Writing", "Audience", "Analytics"].map((item, index) => (
                    <div
                      className={`rounded-md px-3 py-2 text-xs font-medium ${
                        index === 0 ? "bg-foreground !text-white" : "text-muted-foreground"
                      }`}
                      key={item}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-32 border-t pt-4 text-[10px] text-muted-foreground">
                  Publish.com
                </div>
              </div>
              <div className="p-5 sm:p-7">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Sunday, October 25</p>
                    <h2 className="mt-1 text-xl font-semibold tracking-tight">Good morning, Alex</h2>
                  </div>
                  <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                    AM
                  </div>
                </div>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {[
                    ["48,295", "Total views", "+12.5%"],
                    ["18,642", "Subscribers", "+8.2%"],
                  ].map(([value, label, change]) => (
                    <div className="rounded-xl border p-4" key={label}>
                      <p className="text-2xl font-semibold tracking-tight">{value}</p>
                      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                        <span>{label}</span>
                        <span className="text-emerald-600">{change}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Audience activity</p>
                    <p className="text-[11px] text-muted-foreground">Last 7 days</p>
                  </div>
                  <div className="mt-6 flex h-28 items-end gap-2">
                    {[38, 55, 45, 72, 58, 86, 68, 92, 76, 84, 70, 95].map((height, index) => (
                      <div
                        className={`flex-1 rounded-t-sm ${index === 7 ? "bg-foreground" : "bg-foreground/15"}`}
                        key={index}
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/35" id="features">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-muted-foreground">Everything in one place</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              Less platform.
              <br />
              More publishing.
            </h2>
          </div>
          <div className="mt-16 grid gap-0 border-y md:grid-cols-3 md:divide-x">
            {features.map((feature) => (
              <article className="py-8 md:px-8 md:first:pl-0 md:last:pr-0" key={feature.number}>
                <p className="text-xs font-medium text-muted-foreground">{feature.number}</p>
                <h3 className="mt-12 text-xl font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28" id="creators">
        <div className="rounded-2xl bg-foreground p-8 text-background sm:p-12">
          <p className="text-sm text-background/60">For the independent</p>
          <h2 className="mt-5 max-w-lg text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
            Make work you&apos;re proud to put your name on.
          </h2>
          <p className="mt-6 max-w-md leading-7 text-background/65">
            You bring the point of view. Publish.com gives you the tools to
            turn it into something lasting.
          </p>
          <a
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
            href={adminSignUpUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Create your publication
            <ArrowUpRight />
          </a>
        </div>
        <div className="space-y-8 lg:pl-12">
          <div className="border-b pb-8">
            <p className="text-4xl font-semibold tracking-tight">10k+</p>
            <p className="mt-2 text-sm text-muted-foreground">independent voices building on Publish.com</p>
          </div>
          <div className="border-b pb-8">
            <p className="text-4xl font-semibold tracking-tight">1.2m</p>
            <p className="mt-2 text-sm text-muted-foreground">readers discovering something new every month</p>
          </div>
          <div>
            <p className="text-4xl font-semibold tracking-tight">100%</p>
            <p className="mt-2 text-sm text-muted-foreground">ownership of your audience and your work</p>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <LogoMark />
            Publish.com
          </div>
          <p>© 2026 Publish.com. Built for people with something to say.</p>
          <div className="flex gap-5">
            <a className="hover:text-foreground" href="#privacy">Privacy</a>
            <a className="hover:text-foreground" href="#terms">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
