import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });
  const { id } = await params;
  const { status } = await req.json();
  const order = await prisma.order.update({ where: { id: Number(id) }, data: { status } });
  return NextResponse.json(order);
}
