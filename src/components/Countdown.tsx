"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Clamps a given number to ensure it is non-negative.
 * 
 * This function takes a number as input and ensures that it is at least 0.
 * If the input is not a finite number (e.g., NaN, Infinity, or -Infinity),
 * the function will return 0. Otherwise, it will return the greater of the
 * input number or 0.
 * 
 * @param n - The number to be clamped.
 * @returns The clamped number, which is guaranteed to be a non-negative finite value.
 */
function clamp(n: number) {
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

/** A function to count the remaining time. */
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

export default function Countdown({ targetISO }: { targetISO: string }) {
  const targetMs = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [mounted, setMounted] = useState(false);
  const [t, setT] = useState(() => getTimeLeft(targetMs));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setT(getTimeLeft(targetMs));
    }, 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  if (!mounted) {
    return (
      <div className="rounded-xl border p-4 text-sm opacity-80">
        Loading countdown…
      </div>
    );
  }

  const ended = t.diff === 0;

  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm font-medium">
        {ended ? "It’s happening now (or already ended) 🎉" : "Starts in"}
      </p>

      {!ended ? (
        <div className="mt-3 grid grid-cols-4 gap-2 text-center">
          <Box label="Days" value={t.days} />
          <Box label="Hours" value={t.hours} />
          <Box label="Min" value={t.minutes} />
          <Box label="Sec" value={t.seconds} />
        </div>
      ) : (
        <p className="mt-2 text-sm opacity-80">
          See the latest updates on the Visit Page link.
        </p>
      )}
    </div>
  );
}

function Box({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border px-2 py-2">
      <div className="text-lg font-semibold tabular-nums">{value}</div>
      <div className="text-xs opacity-70">{label}</div>
    </div>
  );
}
