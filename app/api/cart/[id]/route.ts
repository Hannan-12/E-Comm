import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { quantity } = await req.json();
  const item = await prisma.cartItem.findUnique({ where: { id: Number(id) }, include: { product: true } });
  if (!item || item.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: item.id } });
    return NextResponse.json({ deleted: true });
  }

  const updated = await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity: Math.min(quantity, item.product.stock) },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const item = await prisma.cartItem.findUnique({ where: { id: Number(id) } });
  if (!item || item.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.cartItem.delete({ where: { id: item.id } });
  return NextResponse.json({ ok: true });
}
