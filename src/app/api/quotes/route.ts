import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const quotes = await prisma.quote.findMany({
    include: {
      eventType: true,
      package: true,
      services: { include: { service: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(quotes);
}

export async function POST(request: Request) {
  const body = await request.json();

  const {
    clientName,
    clientEmail,
    clientPhone,
    eventDate,
    eventLocation,
    guestCount,
    budgetMin,
    budgetMax,
    eventTypeId,
    packageId,
    serviceIds,
    totalPrice,
  } = body;

  const quote = await prisma.quote.create({
    data: {
      clientName,
      clientEmail,
      clientPhone,
      eventDate,
      eventLocation,
      guestCount: Number(guestCount),
      budgetMin: Number(budgetMin),
      budgetMax: Number(budgetMax),
      eventTypeId: Number(eventTypeId),
      packageId: Number(packageId),
      totalPrice: Number(totalPrice),
      services: {
        create: (serviceIds as number[]).map((id: number) => ({
          serviceId: id,
        })),
      },
    },
    include: {
      eventType: true,
      package: true,
      services: { include: { service: true } },
    },
  });

  return NextResponse.json(quote, { status: 201 });
}
