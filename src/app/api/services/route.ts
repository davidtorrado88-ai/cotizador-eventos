import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: { category: "asc" },
  });
  return NextResponse.json(services);
}
