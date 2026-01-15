export const VOTING_START = new Date("2026-02-17T10:00:00+06:30");
export const VOTING_END = new Date("2026-02-17T13:30:00+06:30");

const DEV_BYPASS =
  typeof process !== "undefined" &&
  process.env?.NODE_ENV === "development" &&
  process.env?.DEV_VOTE_BYPASS === "true";

export function isVotingOpen(now: number = Date.now()): boolean {
  if (DEV_BYPASS) return true;
  return now >= VOTING_START.getTime() && now <= VOTING_END.getTime();
}
