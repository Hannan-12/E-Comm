import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: { include: { category: true } } },
    orderBy: { addedAt: "asc" },
  });

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, quantity = 1 } = await req.json();
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const qty = Math.max(1, Math.min(quantity, product.stock));

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: Math.min(existing.quantity + qty, product.stock) },
    });
    return NextResponse.json(updated);
  }

  const item = await prisma.cartItem.create({
    data: { userId: session.user.id, productId, quantity: qty },
  });
  return NextResponse.json(item, { status: 201 });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });
  return NextResponse.json({ ok: true });
}
