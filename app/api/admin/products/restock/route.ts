import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

  const { id, addStock } = await req.json();
  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: { stock: { increment: Number(addStock) } },
  });
  return NextResponse.json(product);
}
