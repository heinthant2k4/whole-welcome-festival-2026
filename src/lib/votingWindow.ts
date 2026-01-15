export const VOTING_START = new Date("2026-02-17T14:00:00+06:30"); // adjust

const DEV_FORCE_OPEN = process.env.NODE_ENV === "development";

export function isVotingOpen(now = Date.now()) {
  if (DEV_FORCE_OPEN) return true;
  return now >= VOTING_START.getTime();
}

export function getTimeRemaining(now = Date.now()) {
  const diff = VOTING_START.getTime() - now;
  if (diff <= 0) return null;

  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);

  return { hours, minutes };
}
