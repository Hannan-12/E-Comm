import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { orderItems: { include: { product: true } } },
    orderBy: { orderDate: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { shippingAddress } = await req.json();
  if (!shippingAddress) return NextResponse.json({ error: "Shipping address required" }, { status: 400 });

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  if (!cartItems.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

  const total = cartItems.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      shippingAddress,
      totalAmount: total,
      status: "PENDING",
      orderItems: {
        create: cartItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.product.price,
        })),
      },
    },
    include: { orderItems: { include: { product: true } } },
  });

  await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });

  return NextResponse.json(order, { status: 201 });
}
