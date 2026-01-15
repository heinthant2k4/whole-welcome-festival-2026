import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const fingerprint =
      typeof body?.fingerprint === "string" ? body.fingerprint : "";

    if (!fingerprint) {
      return NextResponse.json(
        { canVote: false },
        { status: 400 }
      );
    }

    const existingVote = await prisma.vote.findFirst({
      where: { fingerprint },
      select: { id: true },
    });

    return NextResponse.json(
      { canVote: !existingVote },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ vote/check error:", error);

    // Fail-open: submit route is the real lock
    return NextResponse.json(
      { canVote: true },
      { status: 200 }
    );
  }
}
