import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { fingerprint } = await req.json();

  if (!fingerprint) {
    return NextResponse.json({ error: "Missing fingerprint" }, { status: 400 });
  }

  await prisma.vote.deleteMany({
    where: { fingerprint },
  });

  return NextResponse.json({ success: true });
}
