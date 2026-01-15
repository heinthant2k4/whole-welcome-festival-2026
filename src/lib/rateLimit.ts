// lib/rateLimit.ts
import { NextRequest } from "next/server";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const requestCounts = new Map<string, RateLimitRecord>();

// Clean up old records every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 60000);

export function checkRateLimit(
  request: NextRequest,
  options = {
    windowMs: 60000, // 1 minute
    maxRequests: 10, // 10 requests per minute
  }
): { allowed: boolean; remaining: number; resetIn: number } {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const record = requestCounts.get(ip);

  // Clean up expired record
  if (record && now > record.resetTime) {
    requestCounts.delete(ip);
  }

  const current = requestCounts.get(ip);

  if (!current) {
    // First request
    const resetTime = now + options.windowMs;
    requestCounts.set(ip, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetIn: options.windowMs,
    };
  }

  if (current.count >= options.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: current.resetTime - now,
    };
  }

  current.count++;
  return {
    allowed: true,
    remaining: options.maxRequests - current.count,
    resetIn: current.resetTime - now,
  };
}