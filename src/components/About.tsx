import type { SiteConfig } from "@/lib/siteConfig";

export default function About({ config }: { config: SiteConfig }) {
  return (
    <section className="px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-xl">
        <h2 className="text-lg font-semibold tracking-tight">About</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {config.tagline}. A festival-style welcome experience for students and
          youth, bringing community, activities, and a fresh start together.
        </p>
      </div>
    </section>
  );
}
