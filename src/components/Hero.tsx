"use client";

import Countdown from "@/components/Countdown";
import type { SiteConfig } from "@/lib/siteConfig";

export default function Hero({ config }: { config: SiteConfig }) {
  return (
    <section className="px-5 pt-10 pb-8 sm:px-8">
      <div className="mx-auto max-w-xl">
        <p className="text-sm opacity-80">{config.tagline}</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {config.eventTitle}
        </h1>

        <div className="mt-4 space-y-1 text-sm opacity-90">
          <p>
            <span className="font-medium">Date:</span> Jan 17, 2026
          </p>
          <p>
            <span className="font-medium">Time:</span> 10:00 AM – 6:00 PM
          </p>
          <p>
            <span className="font-medium">Venue:</span> {config.venueFull}
          </p>
        </div>

        {config.partnerLine ? (
          <p className="mt-4 text-sm opacity-80">{config.partnerLine}</p>
        ) : null}

        <div className="mt-6">
          <a
            href={config.ctaHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium"
          >
            {config.ctaLabel}
          </a>
          <p className="mt-2 text-xs opacity-70">
            Opens TikTok in a new tab
          </p>
        </div>

        <div className="mt-6">
          <Countdown targetISO={config.startISO} />
        </div>
      </div>
    </section>
  );
}
