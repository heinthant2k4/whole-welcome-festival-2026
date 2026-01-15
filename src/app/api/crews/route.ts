// src/app/api/crews/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Enable caching - data refreshes every 10 seconds
export const revalidate = 10; // ISR: Incremental Static Regeneration

export async function GET() {
  try {
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

    const crewsWithVotes = crews.map((crew) => ({
      id: crew.id,
      name: crew.name,
      image: crew.image,
      color: crew.color,
      description: crew.description,
      votes: crew._count.votes,
    }));

    return NextResponse.json(crewsWithVotes, {
      headers: {
        // Add cache headers
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20",
      },
    });
  } catch (error) {
    console.error("❌ Error fetching crews:", error);
    return NextResponse.json(
      { error: "Failed to fetch crews" },
      { status: 500 }
    );
  }
}