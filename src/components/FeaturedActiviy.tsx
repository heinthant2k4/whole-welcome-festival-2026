"use client";

import GradientButton from "@/components/GradientButton";
import { siteConfig } from "@/lib/siteConfig";
import ScrollReveal from "./ScrollReveal";


export default function FeaturedActivity() {
  return (
    <section className="px-5 py-16 sm:px-8" id="activity">
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
                <ScrollReveal direction="up" delay={0.1}>

        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-white/50">
            Featured Activity
          </p>
            <div className="relative flex items-center justify-center">
              {/* Left curved neon red string */}
              <svg
              className="absolute left-0 h-6 w-1/4"
              viewBox="0 0 100 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              >
              <path
                d="M0 5 C30 0, 70 10, 100 5"
                stroke="url(#leftGradient)"
                strokeWidth="2"
                fill="none"
              />
              <defs>
                <linearGradient id="leftGradient" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#f87171" />
                <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              </svg>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Red String of Fate
            </h2>

              {/* Right curved neon red string */}
              <svg
              className="absolute right-0 h-6 w-1/4"
              viewBox="0 0 100 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              >
              <path
                d="M0 5 C30 10, 70 0, 100 5"
                stroke="url(#rightGradient)"
                strokeWidth="2"
                fill="none"
              />
              <defs>
                <linearGradient id="rightGradient" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#f87171" />
                <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              </svg>
            </div>
          <p className="mt-3 text-sm text-white/60">
            A symbolic social activity inspired by connection, chance, and new
            beginnings.
          </p>
        </div>
        </ScrollReveal>

        {/* Activity card */}
                <ScrollReveal direction="up" delay={0.3}>

        <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-black/40 p-6 backdrop-blur-xl shadow-[0_22px_80px_rgba(0,0,0,0.55)] sm:p-10">
          {/* glass highlights */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.12),transparent_45%)]" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-cyan-400/10" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />

          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            {/* LEFT: content */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white">
                Meet Someone New
              </h3>

              <p className="text-sm leading-7 text-white/70">
                Inspired by the idea that people are connected in unexpected
                ways, Red String of Fate is a guided social experience designed
                to help students meet new people, start conversations, and form
                meaningful connections in a fun and respectful environment.
              </p>

              {/* reassurance chips */}
              <div className="flex flex-wrap gap-2">
                <Chip label="Friendship-first" />
                <Chip label="Open to all students" />
                <Chip label="Guided & respectful" />
                <Chip label="Symbolic & fun" />
              </div>

              {/* CTA */}
              <div className="pt-2">
                <GradientButton href={siteConfig.venueLink || "#"}>
                  Join on-site
                </GradientButton>
                <p className="mt-2 text-xs text-white/55">
                  Details announced at the festival
                </p>
              </div>
            </div>

            {/* RIGHT: abstract visual */}
            <div className="relative flex h-[220px] items-center justify-center sm:h-[260px]">
              {/* glow */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.25),transparent_60%)] blur-3xl" />

              {/* image */}
              <img
                src="/activity/activity.PNG"
                alt="Red String of Fate activity illustration"
                className="relative z-10 max-h-full max-w-full object-contain"
              />
              {/* soft gloss */}
              <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_45%)]" />
                <div className="pointer-events-none absolute -inset-6 bg-[radial-gradient(circle_at_80%_70%,rgba(34,211,238,0.18),transparent_55%)] blur-3xl" />
            </div>
          </div>
        </div>
                </ScrollReveal>

      </div>
    </section>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
      {label}
    </span>
  );
}
