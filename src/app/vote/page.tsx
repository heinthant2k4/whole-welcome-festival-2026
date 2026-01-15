"use client";

import { useRouter } from "next/navigation"; // Import useRouter
import { useEffect, useState } from "react";
import { isVotingOpen } from "@/lib/votingWindow";


import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Loader2 } from "lucide-react";

type Crew = {
  id: number; //FIXED
  name: string;
  image: string;
  color: string;
  description: string;
  votes: number;
};

type VoteState = "idle" | "confirming" | "submitting" | "voted" | "error";

export default function VotePage() {
  // State for votingPaused and overrideSchedule
  const [votingPaused, setVotingPaused] = useState(false);
  const [overrideSchedule, setOverrideSchedule] = useState(false);
  const [stateLoaded, setStateLoaded] = useState(false);

  // Poll voting state from server
  useEffect(() => {
    let cancelled = false;

    const fetchState = async () => {
      try {
        const res = await fetch("/api/vote/state", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setVotingPaused(Boolean(data?.paused));
          setOverrideSchedule(Boolean(data?.overrideSchedule));
          setStateLoaded(true);
        }
      } catch {
        // If fetch fails, keep stateLoaded false or set it true with safe defaults
      }
    };

    fetchState();
    const id = setInterval(fetchState, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const router = useRouter(); // Initialize the router
  const [crews, setCrews] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(true);

  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [canVote, setCanVote] = useState<boolean>(true);
  const [voteState, setVoteState] = useState<VoteState>("idle");
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);
  const [error, setError] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);



  /* -------------------------
     1️⃣ Load fingerprint
  -------------------------- */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { getFingerprintHash } = await import("@/lib/fingerprint");
        const fp = await getFingerprintHash();
        if (!cancelled) setFingerprint(fp);
        if (process.env.NODE_ENV === "development") {
            (window as any).__fp = fp;}
      } catch {
        if (!cancelled) {
          setError("Your browser’s privacy settings block device verification. To vote, please use Chrome/Firefox/Edge or disable strict tracking protection.");
          setVoteState("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* -------------------------
     2️⃣ Load crews
  -------------------------- */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/crews", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setCrews(data);
      } catch {
        if (!cancelled) {
          setError("Failed to load voting catalogue.");
          setVoteState("error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* -------------------------
     3️⃣ Pre-flight vote check
  -------------------------- */
  useEffect(() => {
    if (!fingerprint) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/vote/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fingerprint }),
        });

        const data = await res.json();
        if (!cancelled && data?.canVote === false) {
          setCanVote(false);
          setVoteState("voted");
        }
      } catch {
        // silent fail: real lock is on submit
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fingerprint]);


  /* -------------------------
     Vote submission
  -------------------------- */
  async function submitVote() {
    if (!fingerprint || !selectedCrew) return;

    const scheduleOpen = isVotingOpen();
    const canVoteNow = !votingPaused && (scheduleOpen || overrideSchedule);

    if (!canVoteNow) {
      setError(votingPaused ? "Voting is currently paused." : "Voting is not open yet.");
      setVoteState("error");
      return;
    }

    try {
      setVoteState("submitting");

      const { getArtilleryToken } = await import("@/lib/artillery");
      const artilleryToken = await getArtilleryToken();

      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crewId: selectedCrew.id,
          fingerprint,
          artilleryToken,
        }),
      });

      if (res.status === 403) {
        const msg = (await res.json().catch(() => null))?.error;
        setError(msg || "Voting is not available right now.");
        setVoteState("error");
        setSelectedCrew(null);
        return;
      }

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.success !== true) {
        throw new Error("Vote rejected");
      }

      // Update local crews to show new vote count
      setCrews((prevCrews) =>
        prevCrews.map((c) =>
        c.id === selectedCrew.id ? { ...c, votes: c.votes + 1 } : c
      )
      );

      setVoteState("voted");
      setSelectedCrew(null);
    } catch (err) {
      setError("This vote could not be submitted.");
      setVoteState("error");
    }
  }

  /* -------------------------
     Render
  -------------------------- */
  const scheduleOpen = isVotingOpen();
  const canVoteNow = !votingPaused && (scheduleOpen || overrideSchedule);

  if (!stateLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-white/70">Checking voting status...</p>
      </div>
    );
  }

  if (votingPaused) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-white/70">
          Voting is currently paused. Please check back later.
        </p>
      </div>
    );
  }

  if (!scheduleOpen && !overrideSchedule) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-white/70">
          Voting is not open yet. Please check back during the event.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a0000] via-black to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          <p className="text-white/70 text-sm">Loading voting catalogue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
                    from-[#1a0000] via-black to-black text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            Vote for Your Favorite Crew
            </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto">
            Choose wisely. Each device gets one vote.
          </p>
        </div>

      {votingPaused && (
        <div className="mb-8 mx-auto max-w-2xl">
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm p-4">
            <p className="text-yellow-300 font-medium">Voting is currently paused.</p>
            <p className="text-yellow-200/70 text-sm mt-1">
              You can still view crews, but voting is temporarily disabled. Please check back soon.
            </p>
          </div>
        </div>
      )}

        {/* Status Messages */}
        {voteState === "voted" && (
          <div className="mb-8 mx-auto max-w-2xl">
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 backdrop-blur-sm p-4 flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-green-400 font-medium">Vote Recorded!</p>
                <p className="text-green-300/70 text-sm">Thank you for participating.</p>
              </div>
            </div>
          </div>
        )}

        {error && voteState === "error" && (
          <div className="mb-8 mx-auto max-w-2xl">
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm p-4">
              <p className="text-red-400 font-medium">{error}</p>
              {voteState === "error" && (
                <button
                  className="mt-4 text-sm text-white/60 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/50 transition"
                  onClick={() => setHelpOpen(true)}
                >
                  Having trouble voting?
                </button>
              )}
            </div>
          </div>
        )}

        {/* Crew Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {crews.map((crew) => (
            <div
              key={crew.id}
              className="group relative rounded-2xl border bg-black/40 backdrop-blur-xl transition-all duration-300
                         hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(255,0,0,0.2)]"
              style={{ borderColor: crew.color }}
            >
              {/* Neon glow layer */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                style={{ boxShadow: `0 0 60px ${crew.color}` }}
              />
              <div className="relative flex h-full flex-col p-4 gap-4">
                {/* Image */}
                <div className="relative overflow-hidden rounded-xl aspect-[4/5]">
                  <img
                    src={crew.image}
                    alt={crew.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>
                {/* Name & Description */}
                <div className="flex-1">
                  <h3
                    className="text-xl font-bold tracking-wide mb-2"
                    style={{ color: crew.color }}
                  >
                    {crew.name}
                  </h3>
                  <p className="text-white/60 text-sm line-clamp-2">
                    {crew.description}
                  </p>
                </div>
                {/* Vote button */}
                <button
                  disabled={
                    !canVoteNow ||
                    !canVote ||
                    voteState === "submitting" ||
                    voteState === "voted"
                  }
                  onClick={() => {
                    if (!canVoteNow) return;
                    setSelectedCrew(crew);
                    setVoteState("confirming");
                  }}
                  className={`
                    w-full rounded-full py-3.5 text-sm font-bold tracking-widest
                    transition-all duration-300 relative overflow-hidden
                    ${
                      voteState === "voted"
                        ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/10"
                        : "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 text-black hover:shadow-[0_0_40px_rgba(255,0,255,0.7)] active:scale-95"
                    }
                  `}
                >
                  {voteState === "voted" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      VOTED
                    </span>
                  ) : votingPaused ? (
                    "PAUSED"
                  ) : ("VOTE NOW")}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* -------------------------
            Confirm Modal - FIXED
        -------------------------- */}
        <Dialog
          open={voteState === "confirming" || voteState === "submitting" || votingPaused}
          onOpenChange={(open) => {
            if (!open && voteState === "confirming") {
              setVoteState("idle");
              setSelectedCrew(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-md bg-black/95 border-red-500/40 text-white backdrop-blur-xl">
            {/* Gradient border glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-lg"
              style={{
              boxShadow: selectedCrew
                ? `0 0 0 1px ${selectedCrew.color}, 0 0 60px ${selectedCrew.color}`
                : "0 0 0 1px rgba(239,68,68,0.5), 0 0 60px rgba(239,68,68,0.2)",
              }}
            />

            {/* Content */}
            <div className="relative">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold tracking-wide">
                  Confirm Your Vote
                </DialogTitle>
              </DialogHeader>

              {selectedCrew && (
                <div className="mt-6 mb-6">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <img
                      src={selectedCrew.image}
                      alt={selectedCrew.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold" style={{ color: selectedCrew.color }}>
                        {selectedCrew.name}
                      </p>
                      <p className="text-sm text-white/60 mt-1">
                        {selectedCrew.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm text-white/70 mb-6">
                You can vote <span className="text-white font-semibold">once per device</span>.
                This action cannot be undone.
              </p>

              <DialogFooter className="flex gap-3 sm:gap-3">
                <button
                  className="
                    flex-1 rounded-full py-3 text-sm font-medium
                    bg-white/5 text-white/70
                    border border-white/20
                    hover:bg-white/10 hover:text-white transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  onClick={() => {
                    setVoteState("idle");
                    setSelectedCrew(null);
                  }}
                  disabled={voteState === "submitting"}
                >
                  Cancel
                </button>

                <button
                  className="
                  flex-1 rounded-full py-3 text-sm font-bold tracking-widest
                  text-black
                  hover:shadow-[0_0_40px_rgba(239,68,68,0.6)]
                  transition-all
                  disabled:opacity-70 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                  "
                  style={{
                  background: `linear-gradient(to right, #ff00ff, ${selectedCrew?.color || '#ff00ff'})`,
                  }}
                  onClick={submitVote
                    
                  }
                  disabled={voteState === "submitting"}
                >
                  {voteState === "submitting" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    SUBMITTING...
                  </>
                  ) : (
                  "CONFIRM VOTE"
                  )}
                </button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
        {/* -------------------------
            Help Modal - Troubleshooting
        -------------------------- */}
        <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
          <DialogContent
            className="sm:max-w-lg bg-black/95 border-fuchsia-500/40 text-white backdrop-blur-xl p-4 sm:p-6"
          >
            {/* Cyberpunk rim glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-lg"
              style={{
                boxShadow: `
                  0 0 0 1px rgba(232,121,249,0.55),
                  0 0 0 2px rgba(34,211,238,0.4),
                  0 0 50px rgba(232,121,249,0.25),
                  0 0 80px rgba(34,211,238,0.2)
                `,
              }}
            />
            {/* Soft gradient wash */}
            <div
              className="pointer-events-none absolute inset-0 rounded-lg"
              style={{
                background:
                  "linear-gradient(90deg, rgba(232,121,249,0.07), rgba(34,211,238,0.08))",
              }}
            />
            <div className="relative z-10">
              <DialogHeader>  
                <DialogTitle className="text-lg sm:text-2xl font-bold tracking-wide bg-gradient-to-r from-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
                  Trouble voting?
                </DialogTitle>
              </DialogHeader>
              <div className="my-3 h-px bg-gradient-to-r from-fuchsia-500/40 to-cyan-400/40" />
              <p className="text-xs sm:text-sm text-white/75">
                Some browsers or privacy extensions block device verification. To keep voting fair,
                we may ask you to adjust your settings or switch browsers.
              </p>
              <div className="mt-4 space-y-3 text-xs sm:text-sm">
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="font-semibold text-white mb-2">Quick fixes (recommended)</p>
                  <ul className="list-disc pl-5 space-y-1 text-white/70">
                    <li>Try Chrome, Edge, or normal Firefox mode.</li>
                    <li>Turn off strict tracking protection for this site.</li>
                    <li>Disable privacy extensions (CanvasBlocker / anti-fingerprint tools) and reload.</li>
                    <li>Try another browser or an Incognito window.</li>
                  </ul>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4">
                    <p className="font-semibold text-white mb-1">Firefox</p>
                    <p className="text-white/70">
                      Shield icon → set Enhanced Tracking Protection to <span className="text-white">Standard</span> for this site.
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4">
                    <p className="font-semibold text-white mb-1">Brave</p>
                    <p className="text-white/70">
                      Brave Shields → lower protection for this page, then reload.
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4">
                  <p className="font-semibold text-white mb-1">Still stuck?</p>
                  <p className="text-white/70">
                    Ask staff for help, or scan the QR again using a different browser.
                  </p>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <button
                  className="
                    relative inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-bold tracking-widest text-white
                    bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-400
                    shadow-[0_10px_30px_rgba(0,0,0,0.45)]
                    hover:shadow-[0_0_40px_rgba(34,211,238,0.6)]
                    transition-all active:scale-95
                  "
                  onClick={() => setHelpOpen(false)}
                >
                  <span className="relative z-10">GOT IT</span>
                  <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/15" />
                </button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}