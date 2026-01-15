// src/app/api/vote/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
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

    // Check if already voted
    const existingVote = await prisma.vote.findUnique({
      where: { fingerprint },
    });

    if (existingVote) {
      return NextResponse.json(
        {
          error: "You have already voted",
          votedFor: existingVote.crewId,
        },
        { status: 409 }
      );
    }

    // Verify crew exists
    const crew = await prisma.danceCrew.findUnique({
      where: { id: crewId },
    });

    if (!crew) {
      return NextResponse.json({ error: "Crew not found" }, { status: 404 });
    }

    // Get IP and user agent
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Create vote
    const vote = await prisma.vote.create({
      data: {
        crewId,
        fingerprint,
        ipAddress,
        userAgent,
      },
    });

    // Get updated vote count
    const voteCount = await prisma.vote.count({
      where: { crewId },
    });

    console.log(`✅ Vote recorded: ${crew.name} (${voteCount} total votes)`);

    return NextResponse.json({
      success: true,
      vote: {
        id: vote.id,
        crewId: vote.crewId,
        timestamp: vote.timestamp,
      },
      voteCount,
    });
  } catch (error) {
    console.error("❌ Error creating vote:", error);
    return NextResponse.json(
      { error: "Failed to record vote" },
      { status: 500 }
    );
  }
}