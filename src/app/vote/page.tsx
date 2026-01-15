"use client";

import { useEffect, useState } from "react";
import { isVotingOpen } from "@/lib/votingWindow";

type Crew = {
  id: number;
  name: string;
  image: string;
  color: string;
  description: string;
  votes: number;
};

type VoteState =
  | "loading"
  | "ready"
  | "checking"
  | "confirming"
  | "submitting"
  | "voted"
  | "error";

export default function VotePage() {
  // --- guards ---
  if (!isVotingOpen()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Voting is not open yet.</p>
      </div>
    );
  }

  // --- state ---
  const [crews, setCrews] = useState<Crew[]>([]);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);
  const [voteState, setVoteState] = useState<VoteState>("loading");
  const [error, setError] = useState<string>("");

  // --- 1) load fingerprint ---
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { getFingerprintHash } = await import("@/lib/fingerprint");
        const fp = await getFingerprintHash();
        if (!cancelled) setFingerprint(fp);
      } catch {
        if (!cancelled) {
          setError("Verification blocked.");
          setVoteState("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // --- 2) load crews ---
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/crews", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) {
          setCrews(data);
          setVoteState("ready");
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load crews.");
          setVoteState("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // --- 3) preflight vote check ---
  useEffect(() => {
    if (!fingerprint) return;

    let cancelled = false;

    (async () => {
      try {
        setVoteState("checking");

        const res = await fetch("/api/vote/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fingerprint }),
        });

        const data = await res.json();
        if (!cancelled && data?.canVote === false) {
          setVoteState("voted");
        } else if (!cancelled) {
          setVoteState("ready");
        }
      } catch {
        if (!cancelled) {
          setVoteState("ready"); // fail-open
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fingerprint]);

  // --- 4) submit vote ---
  async function submitVote() {
    if (!fingerprint || !selectedCrew) return;

    try {
      setVoteState("submitting");

      const { getArtilleryToken } = await import("@/lib/artillery");
      const artilleryToken = await getArtilleryToken();

      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crewId: String(selectedCrew.id),
          fingerprint,
          artilleryToken,
        }),
      });

      if (res.status === 409) {
        setVoteState("voted");
        return;
      }

      if (!res.ok) {
        throw new Error("Vote failed");
      }

      setVoteState("voted");
    } catch {
      setError("Vote submission failed.");
      setVoteState("error");
    }
  }

  // --- render ---
  if (voteState === "loading" || voteState === "checking") {
    return <p>Loading…</p>;
  }

  if (voteState === "error") {
    return <p>{error}</p>;
  }

  if (voteState === "voted") {
    return <p>✅ You have already voted. Thank you!</p>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Vote for your favorite crew</h1>

      <ul>
        {crews.map((crew) => (
          <li key={crew.id} style={{ marginBottom: 16 }}>
            <strong>{crew.name}</strong>
            <br />
            <button
              disabled={voteState === "submitting"}
              onClick={() => {
                setSelectedCrew(crew);
                submitVote();
              }}
            >
              Vote
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
