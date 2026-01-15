// src/app/api/vote/check/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fingerprint } = body;

    if (!fingerprint) {
      return NextResponse.json(
        { error: "Missing fingerprint" },
        { status: 400 }
      );
    }

    const vote = await prisma.vote.findUnique({
      where: { fingerprint },
      select: {
        crewId: true,
        timestamp: true,
      },
    });

    if (vote) {
      return NextResponse.json({
        hasVoted: true,
        votedFor: vote.crewId,
        votedAt: vote.timestamp,
      });
    }

    return NextResponse.json({ hasVoted: false });
  } catch (error) {
    console.error("❌ Error checking vote:", error);
    return NextResponse.json(
      { error: "Failed to check vote" },
      { status: 500 }
    );
  }
}