export function shouldBypassVoteLock() {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.DEV_VOTE_BYPASS === "true"
  );
}
