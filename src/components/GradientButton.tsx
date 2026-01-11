"use client";

import { Button } from "@/components/ui/button";

export default function GradientButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Button asChild size="lg" className="w-full p-0 border-0">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={[
        "relative inline-flex w-full items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium text-white",
        "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-400",
        "shadow-[0_10px_30px_rgba(0,0,0,0.45)]",
        "transition-transform hover:scale-[1.01]",
      ].join(" ")}
      >
        {/* TEXT */}
        <span className="relative z-10">{children}</span>

        {/* INNER GLOW RING (still ONE child overall) */}
        <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/15" />

      </a>
    </Button>
  );
}
