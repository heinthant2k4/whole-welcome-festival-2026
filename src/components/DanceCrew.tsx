"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Share2, Trophy, Users, Clock, TrendingUp } from "lucide-react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

type Crew = {
  id: number;
  name: string;
  image: string;
  color: string;
  description?: string;
  votes: number;
};

// Enhanced mobile fingerprinting
function generateFingerprint(): string {
  const components = {
    screen: `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`,
    timezone: dayjs.tz.guess(),
    timezoneOffset: dayjs().utcOffset(),
    language: navigator.language,
    platform: navigator.platform,
    touchPoints: navigator.maxTouchPoints || 0,
    userAgent: navigator.userAgent,
  };
  
  const str = JSON.stringify(components);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `fp_${Math.abs(hash).toString(36)}`;
}

const CrewCard = ({
  crew,
  index,
  hasVoted,
  votedFor,
  onVote,
  disabled,
  rank,
  totalVotes,
}: {
  crew: Crew;
  index: number;
  hasVoted: boolean;
  votedFor: number | null;
  onVote: (id: number) => void;
  disabled: boolean;
  rank: number;
  totalVotes: number;
}) => {
  const accent = crew.color;
  const isVotedFor = votedFor === crew.id;
  const percentage = totalVotes > 0 ? Math.round((crew.votes / totalVotes) * 100) : 0;
  const isLeader = rank === 1 && crew.votes > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="flex-shrink-0"
    >
      <div
        className={`relative w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shadow-xl bg-gray-900/80 border transition-all ${
          isVotedFor ? "scale-105 ring-2 ring-purple-500" : "hover:scale-105"
        }`}
        style={{
          border: `1px solid ${accent}33`,
          boxShadow: `0 10px 30px ${accent}22, inset 0 1px 0 rgba(255,255,255,0.02)`,
        }}
        role="group"
        aria-label={crew.name}
      >
        {/* Rank Badge */}
        {rank <= 3 && crew.votes > 0 && (
          <div
            className={`absolute top-3 left-3 z-20 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              rank === 1
                ? "bg-yellow-500 text-black"
                : rank === 2
                ? "bg-gray-300 text-black"
                : "bg-amber-600 text-white"
            }`}
          >
            {rank}
          </div>
        )}

        {/* Image */}
        <img
          src={crew.image}
          alt={crew.name}
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
          style={{
            background: `linear-gradient(180deg, ${accent}15 0%, transparent 30%, rgba(0,0,0,0.85) 100%)`,
          }}
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 z-10">
          {/* Crew Name */}
          <h3 className="text-xl font-bold text-white mb-1">{crew.name}</h3>

          {/* Vote Stats */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-white/90">
                {crew.votes} votes
              </span>
              <span className="text-xs text-white/70">{percentage}%</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  background: accent,
                }}
              />
            </div>
          </div>

          {/* Vote Button */}
          {isVotedFor ? (
            <div
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm"
              style={{
                background: `${accent}30`,
                border: `1px solid ${accent}50`,
                color: "white",
              }}
            >
              <CheckCircle2 className="w-4 h-4" />
              Your Vote
            </div>
          ) : (
            <button
              onClick={() => onVote(crew.id)}
              disabled={disabled || hasVoted}
              className={`py-2.5 px-4 rounded-xl font-medium text-sm transition-all ${
                disabled || hasVoted
                  ? "bg-white/10 text-white/40 cursor-not-allowed"
                  : "text-white hover:scale-105 active:scale-95"
              }`}
              style={
                !disabled && !hasVoted
                  ? {
                      background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                      boxShadow: `0 4px 15px ${accent}40`,
                    }
                  : {}
              }
            >
              {hasVoted ? "Already Voted" : "Vote Now"}
            </button>
          )}
        </div>

        {/* Leader Glow */}
        {isLeader && (
          <div
            className="pointer-events-none absolute -inset-1 rounded-2xl blur-xl opacity-50"
            style={{ background: `${accent}50` }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default function DanceCrewCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [crews, setCrews] = useState<Crew[]>([]);
  const [userFingerprint, setUserFingerprint] = useState<string>("");
  const [hasVoted, setHasVoted] = useState(false);
  const [votedFor, setVotedFor] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [votingClosed, setVotingClosed] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [votingError, setVotingError] = useState<string>("");

  const votingDeadline = dayjs.tz("2026-01-17 18:00", "Asia/Yangon");
  const votingStart = dayjs.tz("2026-01-10 00:00", "Asia/Yangon");

  useEffect(() => {
    initializeVoting();
    const interval = setInterval(loadCrews, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    let isPaused = false;

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollContainer.scrollLeft += 0.5;
        if (
          scrollContainer.scrollLeft >=
          scrollContainer.scrollWidth - scrollContainer.clientWidth
        ) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    const handleMouseEnter = () => (isPaused = true);
    const handleMouseLeave = () => (isPaused = false);

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [crews.length]);

  async function initializeVoting() {
    try {
      const fp = generateFingerprint();
      setUserFingerprint(fp);

      const now = dayjs();
      if (now.isBefore(votingStart)) {
        setVotingError(`Voting starts ${votingStart.fromNow()}`);
      }
      if (now.isAfter(votingDeadline)) {
        setVotingClosed(true);
      }

      // Check localStorage first (fast)
      const localVote = localStorage.getItem("dance_crew_vote");
      if (localVote) {
        setHasVoted(true);
        setVotedFor(parseInt(localVote));
      }

      // Load crews from database
      await loadCrews();

      // Check if fingerprint has voted
      const checkRes = await fetch("/api/vote/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprint: fp }),
      });

      if (checkRes.ok) {
        const data = await checkRes.json();
        if (data.hasVoted) {
          setHasVoted(true);
          setVotedFor(data.votedFor);
          localStorage.setItem("dance_crew_vote", data.votedFor.toString());
        }
      }
    } catch (error) {
      console.error("Error initializing:", error);
      setVotingError("Failed to load voting data");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadCrews() {
    try {
      const res = await fetch("/api/crews");
      if (res.ok) {
        const data = await res.json();
        setCrews(data);
      }
    } catch (error) {
      console.error("Error loading crews:", error);
    }
  }

 // In handleVote function, add optimistic update:
async function handleVote(crewId: number) {
  if (hasVoted || votingClosed || isLoading) return;

  // ✅ OPTIMISTIC UPDATE - Show success immediately
  setHasVoted(true);
  setVotedFor(crewId);
  localStorage.setItem("dance_crew_vote", crewId.toString());
  
  // Update UI immediately (optimistic)
  setCrews((current) =>
    current.map((crew) =>
      crew.id === crewId ? { ...crew, votes: crew.votes + 1 } : crew
    )
  );

  setShowSuccessModal(true);
  setTimeout(() => setShowSuccessModal(false), 3000);

  // ✅ Then do the actual API call in background
  try {
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        crewId,
        fingerprint: userFingerprint,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Rollback on error
      if (res.status === 409) {
        // Already voted - keep the optimistic state
        setVotedFor(data.votedFor);
      } else {
        // Other error - rollback
        setHasVoted(false);
        setVotedFor(null);
        localStorage.removeItem("dance_crew_vote");
        setCrews((current) =>
          current.map((crew) =>
            crew.id === crewId ? { ...crew, votes: crew.votes - 1 } : crew
          )
        );
        setVotingError(data.error || "Failed to vote");
        setTimeout(() => setVotingError(""), 3000);
      }
    }
  } catch (error) {
    // Network error - rollback
    console.error("Error voting:", error);
    setHasVoted(false);
    setVotedFor(null);
    localStorage.removeItem("dance_crew_vote");
    setCrews((current) =>
      current.map((crew) =>
        crew.id === crewId ? { ...crew, votes: crew.votes - 1 } : crew
      )
    );
    setVotingError("Failed to submit vote");
    setTimeout(() => setVotingError(""), 3000);
  }
}

  function shareVote() {
    const crew = crews.find((c) => c.id === votedFor);
    const text = `I just voted for ${crew?.name} in The Whole Welcome Festival! 🔥 Vote now!`;
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({ title: "Dance Crew Voting", text, url }).catch(() => {});
    } else {
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(shareUrl, "_blank");
    }
  }

  const totalVotes = crews.reduce((sum, crew) => sum + crew.votes, 0);
  const sortedCrews = [...crews].sort((a, b) => b.votes - a.votes);
  const topCrew = sortedCrews[0];

  if (isLoading && crews.length === 0) {
    return (
      <section id="lineup" className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center text-white">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
            <p className="mt-4">Loading dance crews...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="lineup" className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.18em] text-white/50 mb-3">
            Dance Competition
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Vote for Your Favorite Crew
          </h2>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-6">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Users className="w-4 h-4 text-purple-400" />
              <span>
                <strong className="text-white">{totalVotes}</strong> Votes
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{votingClosed ? "Closed" : `Ends ${votingDeadline.fromNow()}`}</span>
            </div>
            {topCrew && totalVotes > 0 && (
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>
                  Leading: <strong className="text-white">{topCrew.name}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Error/Voted Banner */}
          {votingError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm max-w-md mx-auto">
              {votingError}
            </div>
          )}

          {hasVoted && !votingError && (
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium text-sm">
                You voted for {crews.find((c) => c.id === votedFor)?.name}!
              </span>
              <button
                onClick={shareVote}
                className="ml-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Share2 className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto py-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {[...sortedCrews, ...sortedCrews].map((crew, index) => {
            const rank = sortedCrews.findIndex((c) => c.id === crew.id) + 1;
            return (
              <CrewCard
                key={`${crew.id}-${index}`}
                crew={crew}
                index={index}
                hasVoted={hasVoted}
                votedFor={votedFor}
                onVote={handleVote}
                disabled={votingClosed || isLoading}
                rank={rank}
                totalVotes={totalVotes}
              />
            );
          })}
        </div>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-3xl p-8 max-w-sm w-full text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Vote Recorded!</h3>
                <p className="text-white/70">Thank you for voting</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}