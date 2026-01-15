import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

import { isVotingOpen } from "@/lib/votingWindow";
import { shouldBypassVoteLock } from "@/lib/votePolicy";

const DEV_BYPASS_VOTE_LOCK = process.env.NODE_ENV !== "production";

function getIP(req: Request) {
  const xff = req.headers.get("x-forwarded-for");
  return xff ? xff.split(",")[0].trim() : "unknown";
}

async function verifyArtilleryToken(_token: string) {
  // placeholder for now
  return true;
}

export async function POST(req: Request) {
  try {
    const ip = getIP(req);

    const rl = await rateLimit({
      key: `vote:${ip}`,
      limit: 30,
      windowMs: 5 * 60 * 1000,
    });

    if (!rl.ok) {
      return NextResponse.json(
        { success: false, error: "Rate limited" },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));

    const crewId = typeof body?.crewId === "number" ? body.crewId : null;
    const fingerprint =
      typeof body?.fingerprint === "string" ? body.fingerprint : "";
    const artilleryToken =
      typeof body?.artilleryToken === "string"
        ? body.artilleryToken
        : "";

    if (!crewId || !fingerprint || !artilleryToken) {
      return NextResponse.json(
        { success: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    // Check if voting is open
    if (!isVotingOpen()) {
      return NextResponse.json(
        { success: false, error: "Voting is not open yet" },
        { status: 403 }
      );
    }

    // Validate the crewId
    const crew = await prisma.danceCrew.findUnique({
      where: { id: crewId },
    });

    if (!crew) {
      console.error("❌ Invalid crewId received:", crewId);
      return NextResponse.json(
        { success: false, error: "Invalid crewId" },
        { status: 400 }
      );
    }

    const ok = await verifyArtilleryToken(artilleryToken);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Bot rejected" },
        { status: 403 }
      );
    }

    // Check if the user has already voted
    const alreadyVoted = await prisma.vote.findUnique({
      where: { fingerprint },
    });

    if (alreadyVoted && !shouldBypassVoteLock()) {
      return NextResponse.json(
        { success: false, error: "Already voted" },
        { status: 409 }
      );
    }

    try {
      await prisma.vote.create({
        data: {
          crewId,
          fingerprint,
        },
      });
    } catch (err: any) {
      if (err?.code === "P2002") {
        return NextResponse.json(
          { success: false, error: "Already voted" },
          { status: 409 }
        );
      }
      throw err;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ vote submit error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
