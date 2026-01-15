"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isVotingOpen } from "@/lib/votingWindow";
import { motion } from "framer-motion";
import { track } from "@vercel/analytics";

type VoteState = { paused: boolean; overrideSchedule: boolean };

export default function VoteCTA() {
  const router = useRouter();
  const [paused, setPaused] = useState(false);
  const [overrideSchedule, setOverrideSchedule] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  useEffect(() => {
    setScheduleOpen(isVotingOpen());
  }, []);

  useEffect(() => {
    let cancelled = false;
    // Log the response from /api/vote/state for debugging
    const fetchState = async () => {
      try {
      const res = await fetch("/api/vote/state", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as VoteState;
      console.log("vote/state response", data);
      if (!cancelled) {
        setPaused(Boolean(data.paused));
        setOverrideSchedule(Boolean(data.overrideSchedule));
      }
      } catch {
      // silent fail: server enforces anyway
      }
    };

    fetchState();
    const id = setInterval(fetchState, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const canEnterVoting = !paused && (scheduleOpen || overrideSchedule);

  const label = paused
    ? "Voting Paused"
    : !scheduleOpen && !overrideSchedule
    ? "Voting Not Open"
    : "Submit Your Vote";

  return (
    <div className="mt-12 flex flex-col items-center gap-6">
      <div className="relative group">
        {canEnterVoting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-fuchsia-500 rounded-full blur-xl"
          />
        )}

        <motion.button
          disabled={!canEnterVoting}
          whileHover={canEnterVoting ? { scale: 1.05, letterSpacing: "0.25em" } : {}}
          whileTap={canEnterVoting ? { scale: 0.98 } : {}}
          onClick={() => {
            if (!canEnterVoting) return;
            track("vote_cta_click");
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("vote_cta_click"));
            }
            router.push("/vote");
          }}
          className={`
            relative overflow-hidden rounded-full px-12 py-5 text-sm font-black tracking-widest
            transition-all duration-500 uppercase shadow-2xl
            ${
              canEnterVoting
                ? "text-white ring-2 ring-white/20"
                : "bg-white/5 text-white/20 border border-white/10 cursor-not-allowed"
            }
          `}
        >
          {canEnterVoting && (
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 z-0 w-[300%] opacity-100"
              style={{
                background:
                  "linear-gradient(90deg, #d946ef 0%, #06b6d4 25%, #8b5cf6 50%, #d946ef 75%, #06b6d4 100%)",
                backgroundSize: "33% 100%",
              }}
            />
          )}

          {canEnterVoting && (
            <div className="absolute inset-0 z-10 bg-white/10 backdrop-blur-[1px] group-hover:bg-transparent transition-colors" />
          )}

          <span className="relative z-20 flex items-center gap-3 drop-shadow-md">
            {label}
            {canEnterVoting && (
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                →
              </motion.span>
            )}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
