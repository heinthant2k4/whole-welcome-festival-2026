import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 10;

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

    const result = crews.map((crew) => ({
      id: crew.id,
      name: crew.name,
      image: crew.image,
      color: crew.color,
      description: crew.description,
      votes: crew._count.votes,
    }));

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20",
      },
    });
  } catch (error) {
    console.error("❌ crews GET error:", error);
    return NextResponse.json(
      { error: "Failed to load crews" },
      { status: 500 }
    );
  }
}
