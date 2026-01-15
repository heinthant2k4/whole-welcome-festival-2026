// src/app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const [totalVotes, lastAgg, grouped, crews] = await Promise.all([
    prisma.vote.count(),
    prisma.vote.aggregate({
      _max: { timestamp: true }, // ✅ createdAt (NOT updatedAt)
    }),
    prisma.vote.groupBy({
      by: ["crewId"],
      _count: { _all: true },
    }),
    prisma.danceCrew.findMany({
      select: { id: true, name: true },
    }),
  ]);

  const countsByCrewId = new Map<number, number>();
  for (const g of grouped) countsByCrewId.set(g.crewId, g._count._all);

  const crewsBreakdown = crews
    .map((c) => {
      const votes = countsByCrewId.get(c.id) ?? 0;
      const percentage = totalVotes === 0 ? 0 : (votes / totalVotes) * 100;
      return { id: c.id, name: c.name, votes, percentage };
    })
    .sort((a, b) => b.votes - a.votes);

  const lastUpdated =
    lastAgg?._max?.timestamp ? lastAgg._max.timestamp.toISOString() : null;

  return NextResponse.json(
    {
      totalVotes,
      lastUpdated,
      crews: crewsBreakdown,
      generatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
