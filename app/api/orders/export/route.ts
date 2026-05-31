import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;

  const orders = await prisma.order.findMany({
    where: status ? { status: status as never } : {},
    include: { user: true, orderItems: { include: { product: true } } },
    orderBy: { orderDate: "desc" },
  });

  const rows = [
    ["Order ID", "Date", "Customer", "Email", "Status", "Items", "Total", "Shipping Address"],
    ...orders.map((o) => [
      o.id,
      o.orderDate.toISOString().slice(0, 10),
      o.user.fullName ?? "",
      o.user.email,
      o.status,
      o.orderItems.map((i) => `${i.product.name} x${i.quantity}`).join("; "),
      Number(o.totalAmount).toFixed(2),
      `"${o.shippingAddress.replace(/"/g, '""')}"`,
    ]),
  ];

  const csv = rows.map((r) => r.join(",")).join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="orders-${Date.now()}.csv"`,
    },
  });
}
