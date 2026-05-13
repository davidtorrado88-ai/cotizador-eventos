import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const eventTypes = await prisma.eventType.findMany({
    include: { packages: true },
  });
  return NextResponse.json(eventTypes);
}
