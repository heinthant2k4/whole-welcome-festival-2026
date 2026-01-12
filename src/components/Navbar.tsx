"use client";

import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = { id: string; label: string; href: string };

export default function Navbar() {
  const navItems: NavItem[] = useMemo(
    () => [
      { id: "about", label: "About", href: "#about" },
      { id: "activity", label: "Activity", href: "#activity" },
      { id: "lineup", label: "Line-up", href: "#lineup" },
    ],
    []
  );

  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("about");
  const [progress, setProgress] = useState(0);

  // Reveal on scroll + active section detection
  useEffect(() => {
  const sectionIds = navItems.map((n) => n.id);
  let raf = 0;

  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;

      // show navbar after scroll
      setShown(window.scrollY > 96);

      // progress (0 → 1)
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setProgress(Math.min(1, Math.max(0, p)));

      // active section detection
      const probeY = 140;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;

        const r = el.getBoundingClientRect();
        if (r.top <= probeY && r.bottom >= probeY) {
          setActive(id);
          break;
        }
      }
    });
  };

      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onScroll);
      };
  }, [navItems]);


  // ESC close + body scroll lock while menu is open
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    if (open) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const jump = (href: string) => {
    setOpen(false);

    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", href);
  };

  return (
    <>
      <header
        className={[
          "fixed left-0 right-0 top-0 z-50",
          "transition-all duration-300",
          shown
            ? "translate-y-0 opacity-100"
            : "-translate-y-3 opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          {/* Neon framed pill */}
          <div className="relative mt-4"
           style={
              {
                // 0..1
                ["--p" as any]: progress,
                // convert to percentage for gradients
                ["--px" as any]: `${Math.round(progress * 100)}%`,
              } as React.CSSProperties
            }>
            {/* Outer neon glow */}
            <div
              className="
                pointer-events-none absolute -inset-1 rounded-full blur-md
                opacity-90 transition-opacity duration-300
              "
              style={{
                background:
                  "radial-gradient(120% 140% at var(--px) 50%, rgba(34,211,238,0.55), rgba(34,211,238,0.18) 35%, rgba(236,72,153,0.22) 70%, transparent 100%)",
              }}
            />
            {/* Inner rim */}
            <div
              className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset"
              style={{
                boxShadow: "inset 0 0 0 1px rgba(34,211,238,0.18)",
              }}
            />
            {/* Actual bar */}
            <div
              className={[
                "relative flex items-center justify-between rounded-full",
                "bg-black/45 px-4 py-2.5 backdrop-blur-2xl",
                "border border-white/10",
                "shadow-[0_12px_50px_rgba(0,0,0,0.60)]",
              ].join(" ")}
            >
              {/* Brand */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-[13px] font-semibold text-white/90 hover:text-white transition-colors"
                aria-label="Back to top"
              >
                The Whole Welcome Festival
              </button>

              {/* Desktop nav */}
              <nav className="hidden items-center gap-6 md:flex">
                {navItems.map((item) => {
                  const isActive = active === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => jump(item.href)}
                      className={[
                        "relative text-[13px] transition-colors",
                        isActive
                          ? "text-cyan-300"
                          : "text-white/70 hover:text-white",
                      ].join(" ")}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                      {/* Active underline */}
                      {isActive ? (
                        <span className="absolute -bottom-1 left-0 h-px w-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.85)]" />
                      ) : null}
                    </button>
                  );
                })}
              </nav>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-white/80 hover:text-white hover:bg-white/5"
                  onClick={() => setOpen((v) => !v)}
                  aria-label="Open menu"
                  aria-expanded={open}
                >
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay + sheet */}
      <div
        className={[
          "fixed inset-0 z-40 md:hidden",
          "transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      >
        {/* Backdrop (tap outside closes) */}
        <button
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        />

        {/* Sheet */}
        <div className="absolute left-0 right-0 top-4 mx-auto max-w-6xl px-5 sm:px-8">
          <div className="relative">
            {/* Neon glow for sheet */}
            <div className="pointer-events-none absolute -inset-1 rounded-2xl blur-md bg-gradient-to-r from-cyan-300/40 via-cyan-400/18 to-fuchsia-400/25" />
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-cyan-300/25" />

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-[0_18px_70px_rgba(0,0,0,0.65)]">
              <div className="p-2">
                {navItems.map((item) => {
                  const isActive = active === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => jump(item.href)}
                      className={[
                        "w-full rounded-xl px-4 py-3 text-left text-sm transition-colors",
                        isActive
                          ? "bg-cyan-400/10 text-cyan-300"
                          : "text-white/85 hover:bg-white/5",
                      ].join(" ")}
                    >
                      <span className="flex items-center justify-between">
                        <span>{item.label}</span>
                        {isActive ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-white/10 px-4 py-3">
                <button
                  onClick={() => {
                    setOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-xs text-white/60 hover:text-white/80 transition-colors"
                >
                  Back to top
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
