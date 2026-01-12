// src/app/page.tsx
import Hero from "@/components/Hero";
import About from "@/components/About";
import QuickInfoCards from "@/components/QuickInfo";
import Sponsorship from "@/components/Sponsor";
import ArtistSection from "@/components/Artist";
import DanceCrewSection from "@/components/DanceCrew";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/siteConfig";
import FeaturedActivity from "@/components/FeaturedActiviy";
import Navbar from "@/components/Navbar";
import EventActivityPartner from "@/components/EventActivityPartner";
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Event",
      name: "The Whole Welcome Festival 2026",
      startDate: "2026-01-17T10:00:00+06:30",
      endDate: "2026-01-17T18:00:00+06:30",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: "Wyndham Grand Yangon",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Yangon",
          addressCountry: "MM",
        },
      },
      organizer: {
        "@type": "Organization",
        name: "The Whole Welcome Festival",
      },
    }),
  }}
/>;

export default function Page() {
  return (
    <main className="min-h-dvh">
      <Navbar />
      <Hero config={siteConfig} />
      <QuickInfoCards config={siteConfig} />
      <About config={siteConfig} />
      <FeaturedActivity />
      <ArtistSection />
      <DanceCrewSection />
      <EventActivityPartner />
      <Sponsorship />
      <Footer config={siteConfig} />
    </main>
  );
}
