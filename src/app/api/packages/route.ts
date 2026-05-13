import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventTypeId = searchParams.get("eventTypeId");

  const packages = await prisma.package.findMany({
    where: eventTypeId ? { eventTypeId: Number(eventTypeId) } : undefined,
    include: { eventType: true },
  });
  return NextResponse.json(packages);
}
