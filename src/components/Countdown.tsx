"use client";

import { useEffect, useMemo, useState } from "react";

function clamp(n: number) {
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function getTimeLeft(targetMs: number) {
  const now = Date.now();
  const diff = clamp(targetMs - now);

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { diff, days, hours, minutes, seconds };
}

export default function Countdown({
  targetISO,
  title = "Starts in",
}: {
  targetISO: string;
  title?: string;
}) {
  const targetMs = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [mounted, setMounted] = useState(false);
  const [t, setT] = useState(() => getTimeLeft(targetMs));

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const id = window.setInterval(() => setT(getTimeLeft(targetMs)), 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  if (!mounted) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="mt-2 text-sm text-white/60">Loading countdown…</p>
      </div>
    );
  }

  const ended = t.diff === 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-white">{title}</p>
        <span className="text-xs text-white/60">Myanmar Time</span>
      </div>

      {ended ? (
        <p className="mt-3 text-sm text-white/70">
          It’s happening now
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-4 gap-2">
          <Chip label="Days" value={t.days} tint="pink" />
          <Chip label="Hours" value={t.hours} tint="cyan" />
          <Chip label="Min" value={t.minutes} tint="pink" />
          <Chip label="Sec" value={t.seconds} tint="cyan" />
        </div>
      )}
    </div>
  );
}

function Chip({ label, value, tint }: { label: string; value: number; tint: "pink" | "cyan" }) {
  const base =
  "rounded-2xl border bg-black/55 px-4 py-2.5 text-center backdrop-blur-xl";


  const glow =
  tint === "pink"
    ? "border-fuchsia-400/30 shadow-[0_0_14px_rgba(236,72,153,0.28)]"
    : "border-cyan-300/30 shadow-[0_0_14px_rgba(34,211,238,0.24)]";

  return (
    <div className={[base, glow].join(" ")}>
      <div className="text-lg font-semibold tabular-nums text-white">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-white/60">{label}</div>
    </div>
  );
}

