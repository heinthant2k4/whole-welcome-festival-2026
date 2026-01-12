// src/app/page.tsx
import Hero from "@/components/Hero";
import About from "@/components/About";
import QuickInfoCards from "@/components/QuickInfo";
import Sponsorship from "@/components/Sponsor";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/siteConfig";

export default function Page() {
  return (
    <main className="min-h-dvh">
      <Hero config={siteConfig} />
      <QuickInfoCards config={siteConfig} />
      <About config={siteConfig} />
      <Sponsorship />
      <Footer config={siteConfig} />
    </main>
  );
}
