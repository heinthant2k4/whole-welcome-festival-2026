import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = await prisma.votingState.findUnique({
    where: { id: 1 },
    select: { paused: true, overrideSchedule: true },
  });

  return NextResponse.json(
    {
      paused: state?.paused ?? false,
      overrideSchedule: state?.overrideSchedule ?? false,
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
