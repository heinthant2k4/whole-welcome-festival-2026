export const VOTING_START = new Date("2026-02-17T14:00:00+06:30");

const DEV_BYPASS =
  typeof process !== "undefined" &&
  process.env &&
  process.env.NODE_ENV === "development" &&
  process.env.DEV_VOTE_BYPASS === "true";

export function isVotingOpen(now = Date.now()) {
  if (DEV_BYPASS) return true;
  return now >= VOTING_START.getTime();
}
