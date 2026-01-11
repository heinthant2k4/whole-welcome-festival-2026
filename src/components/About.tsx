import type { SiteConfig } from "@/lib/siteConfig";

export default function About({ config }: { config: SiteConfig }) {
  return (
    <section className="px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-xl">
        <h2 className="text-xl font-semibold">About</h2>
        <p className="mt-3 text-sm leading-6 opacity-85">
          {config.tagline}. A festival-style welcome experience for students and
          youth, bringing community, activities, and a fresh start together.
        </p>
      </div>
    </section>
  );
}
