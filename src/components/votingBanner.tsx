"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function VotingPausedBanner({
  paused,
  className,
}: {
  paused: boolean;
  className?: string;
}) {
  if (!paused) return null;

  return (
    <div
      className={cn(
        "rounded-lg border bg-muted p-4 flex gap-3 items-start",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <AlertTriangle className="h-5 w-5 text-muted-foreground mt-0.5" />
      <div className="space-y-1">
        <div className="font-medium">Voting is currently paused</div>
        <div className="text-sm text-muted-foreground">
          Please check back later. The leaderboard can still be viewed.
        </div>
      </div>
    </div>
  );
}
