// src/app/api/admin/reset/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Delete all votes (this also resets vote counts)
    const result = await prisma.vote.deleteMany({});

    console.log(`🗑️ ADMIN RESET: Deleted ${result.count} votes`);

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
      message: "All votes have been reset",
    });
  } catch (error) {
    console.error("❌ Reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset votes" },
      { status: 500 }
    );
  }
}