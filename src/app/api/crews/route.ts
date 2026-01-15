// src/app/api/crews/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    return NextResponse.json(crewsWithVotes);
  } catch (error) {
    console.error("❌ Error fetching crews:", error);
    return NextResponse.json(
      { error: "Failed to fetch crews" },
      { status: 500 }
    );
  }
}