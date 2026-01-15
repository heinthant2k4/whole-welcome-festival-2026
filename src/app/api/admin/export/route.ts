// app/api/admin/export/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function toCsv(rows: Array<{ name: string; votes: number; percentage: number }>) {
  const header = "crew,votes,percentage";
  const lines = rows.map((r) => {
    const safeName = `"${String(r.name).replaceAll('"', '""')}"`;
    return `${safeName},${r.votes},${r.percentage.toFixed(4)}`;
  });
  return [header, ...lines].join("\n");
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const format = (url.searchParams.get("format") ?? "csv").toLowerCase();

  const [totalVotes, grouped, crews] = await Promise.all([
    prisma.vote.count(),
    prisma.vote.groupBy({ by: ["crewId"], _count: { _all: true } }),
    prisma.danceCrew.findMany({ select: { id: true, name: true } }),
  ]);

  const countsByCrew = new Map<number, number>();
  for (const g of grouped) countsByCrew.set(g.crewId, g._count._all);

  const rows = crews
    .map((c) => {
      const votes = countsByCrew.get(c.id) ?? 0;
      const percentage = totalVotes === 0 ? 0 : (votes / totalVotes) * 100;
      return { name: c.name, votes, percentage };
    })
    .sort((a, b) => b.votes - a.votes);

  if (format === "json") {
    return NextResponse.json(
      { totalVotes, crews: rows, generatedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  const csv = toCsv(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="votes_export.csv"`,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
