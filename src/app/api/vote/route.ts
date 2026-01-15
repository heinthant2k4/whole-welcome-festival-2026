// src/app/api/vote/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";

// In-memory cache for recent fingerprints (expires after 1 hour)
const recentVotes = new Map<string, { crewId: number; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [fingerprint, data] of recentVotes.entries()) {
    if (now - data.timestamp > CACHE_TTL) {
      recentVotes.delete(fingerprint);
    }
  }
}, 300000);

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(request, {
    windowMs: 60000,
    maxRequests: 5,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again later.",
        resetIn: Math.ceil(rateLimit.resetIn / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rateLimit.resetIn / 1000).toString(),
        },
      }
    );
  }
  try {
    const body = await request.json();
    const { crewId, fingerprint } = body;

    // Validation
    if (!crewId || !fingerprint) {
      return NextResponse.json(
        { error: "Missing crewId or fingerprint" },
        { status: 400 }
      );
    }

    // ✅ FAST CHECK: Check in-memory cache first (no DB hit!)
    const cachedVote = recentVotes.get(fingerprint);
    if (cachedVote) {
      return NextResponse.json(
        {
          error: "You have already voted",
          votedFor: cachedVote.crewId,
        },
        { status: 409 }
      );
    }

    // ✅ Check database (only if not in cache)
    const existingVote = await prisma.vote.findUnique({
      where: { fingerprint },
      select: { crewId: true }, // Only fetch what we need
    });

    if (existingVote) {
      // Add to cache for future fast lookups
      recentVotes.set(fingerprint, {
        crewId: existingVote.crewId,
        timestamp: Date.now(),
      });

      return NextResponse.json(
        {
          error: "You have already voted",
          votedFor: existingVote.crewId,
        },
        { status: 409 }
      );
    }

    // Get IP and user agent
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // ✅ Use transaction for atomic operations
    const [vote, crew] = await prisma.$transaction([
      prisma.vote.create({
        data: {
          crewId,
          fingerprint,
          ipAddress,
          userAgent,
        },
      }),
      prisma.danceCrew.findUnique({
        where: { id: crewId },
        select: { name: true },
      }),
    ]);

    if (!crew) {
      return NextResponse.json({ error: "Crew not found" }, { status: 404 });
    }

    // Add to cache
    recentVotes.set(fingerprint, {
      crewId,
      timestamp: Date.now(),
    });

    // Get updated vote count (cached query)
    const voteCount = await prisma.vote.count({
      where: { crewId },
    });

    console.log(`✅ Vote recorded: ${crew.name} (${voteCount} total votes)`);

    return NextResponse.json(
      {
        success: true,
        vote: {
          id: vote.id,
          crewId: vote.crewId,
          timestamp: vote.timestamp,
        },
        voteCount,
      },
      {
        headers: {
          "Cache-Control": "no-store", // Don't cache vote responses
        },
      }
    );
  } catch (error) {
    console.error("❌ Error creating vote:", error);
    return NextResponse.json(
      { error: "Failed to record vote" },
      { status: 500 }
    );
  }
}
