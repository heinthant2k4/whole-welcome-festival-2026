// app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

export async function GET() {
  try {
    // Get all crews with vote counts
    const crews = await prisma.danceCrew.findMany({
      include: {
        _count: {
          select: { votes: true },
        },
      },
      orderBy: {
        votes: {
          _count: "desc",
        },
      },
    });

    const totalVotes = await prisma.vote.count();
    
    const uniqueIPs = await prisma.vote.groupBy({
      by: ["ipAddress"],
      _count: true,
    });

    const today = dayjs().startOf("day").toDate();
    const votesToday = await prisma.vote.count({
      where: {
        timestamp: {
          gte: today,
        },
      },
    });

    const crewsWithStats = crews.map((crew) => ({
      id: crew.id,
      name: crew.name,
      votes: crew._count.votes,
      percentage: totalVotes > 0 
        ? ((crew._count.votes / totalVotes) * 100).toFixed(1)
        : 0,
    }));

    return NextResponse.json({
      totalVotes,
      uniqueIPs: uniqueIPs.length,
      votesToday,
      crews: crewsWithStats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}