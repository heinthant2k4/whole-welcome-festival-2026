import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type AdminVotingStateResponse = {
  paused: boolean;
  overrideSchedule: boolean;
  updatedAt: string | null;
};

export async function GET() {
  const state = await prisma.votingState.findUnique({
    where: { id: 1 },
    select: { paused: true, overrideSchedule: true, updatedAt: true },
  });

  const body: AdminVotingStateResponse = {
    paused: state?.paused ?? false,
    overrideSchedule: state?.overrideSchedule ?? false,
    updatedAt: state?.updatedAt ? state.updatedAt.toISOString() : null,
  };

  return NextResponse.json(body, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const paused = (payload as any)?.paused;
  const overrideSchedule = (payload as any)?.overrideSchedule;

  if (typeof paused !== "boolean" && typeof overrideSchedule !== "boolean") {
    return NextResponse.json(
      {
        error:
          "Invalid payload: expected { paused?: boolean, overrideSchedule?: boolean }",
      },
      { status: 400 }
    );
  }

  const updated = await prisma.votingState.upsert({
    where: { id: 1 },
    update: {
      ...(typeof paused === "boolean" ? { paused } : {}),
      ...(typeof overrideSchedule === "boolean"
        ? { overrideSchedule }
        : {}),
    },
    create: {
      id: 1,
      paused: typeof paused === "boolean" ? paused : false,
      overrideSchedule:
        typeof overrideSchedule === "boolean" ? overrideSchedule : false,
    },
    select: { paused: true, overrideSchedule: true, updatedAt: true },
  });

  const body: AdminVotingStateResponse = {
    paused: updated.paused,
    overrideSchedule: updated.overrideSchedule,
    updatedAt: updated.updatedAt.toISOString(),
  };

  return NextResponse.json(body, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
