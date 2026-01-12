// src/app/layout.tsx
import { Space_Grotesk, Sora } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";


const heading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const body = Sora({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "The Whole Welcome Festival 2026 | Jan 17 | Wyndham Grand Yangon",
  description:
    "The Whole Welcome Festival 2026. Jan 17, 2026 (10AM–6PM) at Wyndham Grand Yangon, Myanmar. Where University Life Begins.",
  openGraph: {
    title: "The Whole Welcome Festival 2026 | Jan 17 at Wyndham Grand Yangon",
    description:
    "The Whole Welcome Festival 2026 takes place on Jan 17 (10AM–6PM) at Wyndham Grand Yangon, Myanmar. A student and youth festival where university life begins.",
    url: "https://wwfest.vercel.app",
    siteName: "The Whole Welcome Festival 2026",
    images: [
      {
        url: "https://wwfest.vercel.app/hero/MainPoster2.JPG",
        width: 1200,
        height: 630,
        alt: "The Whole Welcome Festival 2026 poster",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${heading.variable} ${body.variable}`}>
      <body className="min-h-dvh">
        <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* blurred stage poster */}
        <img
          src="/hero/MainPoster.JPG"
          alt=""
          className="absolute inset-0 h-full w-full object-cover scale-110 blur-[18px] opacity-45"
        />

        {/* stronger dark wash */}
        <div className="absolute inset-0 bg-black/52" />

        {/* tighter vignette like reference */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.10),rgba(0,0,0,0.88))]" />

        {/* reduce neon fog intensity (keep subtle) */}
        <div className="absolute left-1/2 top-[-40%] h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-fuchsia-500/12 blur-3xl" />
        <div className="absolute bottom-[-45%] right-[-25%] h-[760px] w-[760px] rounded-full bg-cyan-400/10 blur-3xl" />
      </div>


        {children}
      </body>
    </html>
  );
}
