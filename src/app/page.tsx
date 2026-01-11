// src/app/page.tsx
import Hero from "@/components/Hero";
import About from "@/components/About";
//import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/siteConfig";

export default function Page() {
  return (
    <main className="min-h-dvh">
      <Hero config={siteConfig} />
      <About config={siteConfig} />
      {/* <Footer config={siteConfig} /> */}
    </main>
  );
}
