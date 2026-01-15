"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isVotingOpen, getTimeRemaining } from "@/lib/votingWindow";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@vercel/analytics";

export default function VoteCTA() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState<ReturnType<typeof getTimeRemaining>>(null);

  useEffect(() => {
    const tick = () => {
      setOpen(isVotingOpen());
      setRemaining(getTimeRemaining());
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-12 flex flex-col items-center gap-6">
      <div className="relative group">
        {/* Outer Glow - Follows the button shape */}
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-fuchsia-500 rounded-full blur-xl"
          />
        )}

        <motion.button
          disabled={!open}
          whileHover={open ? { scale: 1.05, letterSpacing: "0.25em" } : {}}
          whileTap={open ? { scale: 0.98 } : {}}
          onClick={() => {
            track("vote_cta_click");
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("vote_cta_click"));
            }
            router.push("/vote");
          }}
          className={`
            relative overflow-hidden rounded-full px-12 py-5 text-sm font-black tracking-widest
            transition-all duration-500 uppercase shadow-2xl
            ${open 
              ? "text-white ring-2 ring-white/20" 
              : "bg-white/5 text-white/20 border border-white/10 cursor-not-allowed"}
          `}
        >
          {/* THE WAVE GRADIENT LAYER */}
          {open && (
            <motion.div
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 z-0 w-[300%] opacity-100"
              style={{
                background: "linear-gradient(90deg, #d946ef 0%, #06b6d4 25%, #8b5cf6 50%, #d946ef 75%, #06b6d4 100%)",
                backgroundSize: "33% 100%",
              }}
            />
          )}

          {/* Glass Overlay for depth */}
          {open && (
            <div className="absolute inset-0 z-10 bg-white/10 backdrop-blur-[1px] group-hover:bg-transparent transition-colors" />
          )}

          {/* Button Text */}
          <span className="relative z-20 flex items-center gap-3 drop-shadow-md">
            {open ? "Submit Your Vote" : "Voting Paused"}
            {open && (
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            )}
          </span>
        </motion.button>
      </div>

      {/* Countdown Timer */}
      <AnimatePresence>
        {!open && remaining && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">Coming Soon</p>
            <p className="text-xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
              {String(remaining.hours).padStart(2, '0')}:
              {String(remaining.minutes).padStart(2, '0')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}