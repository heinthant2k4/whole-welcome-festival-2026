"use client";

import * as React from "react";

type VoteState = { paused: boolean };

export function useVoteState(pollMs: number = 5000) {
  const [paused, setPaused] = React.useState<boolean | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const fetchState = React.useCallback(async () => {
    try {
      const res = await fetch("/api/vote/state", { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch vote state (${res.status})`);
      const json = (await res.json()) as VoteState;
      setPaused(Boolean(json.paused));
      setError(null);
    } catch (e: any) {
      // Fail "open" visually (don’t block voting just because state check failed),
      // but keep an error if you want to show a subtle message.
      setError(e?.message ?? "Failed to fetch vote state");
      if (paused === null) setPaused(false);
    }
  }, [paused]);

  React.useEffect(() => {
    fetchState();
    const t = setInterval(fetchState, pollMs);
    return () => clearInterval(t);
  }, [fetchState, pollMs]);

  return { paused, error, refresh: fetchState };
}
