export const VOTING_START = new Date("2026-02-17T14:00:00+06:30");
// optional future use
// export const VOTING_END = new Date("2026-02-14T22:00:00+07:00");

export function isVotingOpen(now = Date.now()) {
  return now >= VOTING_START.getTime();
}
