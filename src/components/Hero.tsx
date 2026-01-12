"use client";

import Image from "next/image";
import type { SiteConfig } from "@/lib/siteConfig";
import Countdown from "@/components/Countdown";
import { Badge } from "@/components/ui/badge";
import GradientButton from "./GradientButton";
import ScrollReveal from "./ScrollReveal";


export default function Hero({ config }: { config: SiteConfig }) {
  return (
    <section className="px-5 pt-10 pb-10 sm:px-8 sm:pt-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* LEFT: Poster (split glow frame) */}
                    <ScrollReveal direction="left" delay={0.2}>

          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/5 p-4 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
              {/* split neon rim */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
              {/* SPLIT NEON GLOW (strong + directional) */}
              <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[36px]
              bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.55),transparent_60%)]
              blur-3xl" />

              <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[36px]
              bg-[radial-gradient(circle_at_80%_80%,rgba(34,211,238,0.45),transparent_60%)]
              blur-3xl" />

              <Image
                src="/hero/MainPoster.JPG"
                alt="The Whole Welcome Festival 2026 poster"
                width={1200}
                height={1200}
                priority
                className="h-auto w-full rounded-2xl object-cover"
              />
              {/* split rim */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl
              bg-gradient-to-br from-fuchsia-400/25 via-transparent to-cyan-400/25" />

              {/* subtle gloss */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_30%_15%,rgba(255,255,255,0.10),transparent_45%)]" />
            </div>
          </div>
          </ScrollReveal>

          {/* RIGHT: Glass info card */}
                    <ScrollReveal direction="right" delay={0.4}>

          <div className="relative overflow-hidden Founded-3xl border border-white/12 bg-black/45 p-6 backdrop-blur-xl shadow-[0_22px_80px_rgba(0,0,0,0.60)] sm:p-8">
            {/* top-left glass highlight */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.12),transparent_45%)]" />

            {/* edge tint (subtle, like reference) */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-cyan-400/10" />

            {/* crisp inner rim */}
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />

            {/* content */}
            <div className="space-y-5">

              <Countdown targetISO={config.startISO} title="Starts in" />

              <div className="pt-1">
                <GradientButton href={config.ctaHref}>
                  {config.ctaLabel}
                </GradientButton>
              </div>

              {config.partnerLine ? (
                <p className="text-sm text-white/60">{config.partnerLine}</p>
              ) : null}
            </div>
          </div>
                    </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
