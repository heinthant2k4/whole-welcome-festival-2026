type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type Entry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Entry>();

export async function rateLimit({
  key,
  limit,
  windowMs,
}: RateLimitOptions) {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (entry.count >= limit) {
    return { ok: false, resetAt: entry.resetAt };
  }

  entry.count += 1;
  store.set(key, entry);
  return { ok: true };
}
