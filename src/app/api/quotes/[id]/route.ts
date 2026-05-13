import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const quote = await prisma.quote.findUnique({
    where: { id: Number(id) },
    include: {
      eventType: true,
      package: true,
      services: { include: { service: true } },
    },
  });

  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(quote);
}
