import { prisma } from "@/lib/prisma";
import { isVotingOpen } from "@/lib/votingWindow";

/**
 * Authoritative server-side voting gate.
 * This MUST be used by all vote-related APIs.
 */
export async function canVoteNow() {
  const state = await prisma.votingState.findUnique({
    where: { id: 1 },
    select: {
      paused: true,
      overrideSchedule: true,
    },
  });

  const paused = state?.paused === true;
  const override = state?.overrideSchedule === true;
  const scheduleOpen = isVotingOpen();

  return {
    allowed: !paused && (scheduleOpen || override),
    paused,
    override,
    scheduleOpen,
  };
}
