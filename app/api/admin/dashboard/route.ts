import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const [totalOrders, totalRevenue, totalUsers, totalProducts, statusCounts, lowStock, dailyRaw] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ where: { status: { not: "CANCELLED" } }, _sum: { totalAmount: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
    prisma.product.findMany({ where: { stock: { lte: 10 }, isActive: true }, include: { category: true }, orderBy: { stock: "asc" }, take: 8 }),
    prisma.order.findMany({
      where: { orderDate: { gte: thirtyDaysAgo }, status: { not: "CANCELLED" } },
      select: { orderDate: true, totalAmount: true },
    }),
  ]);

  const dailyMap: Record<string, { count: number; revenue: number }> = {};
  for (const o of dailyRaw) {
    const key = o.orderDate.toISOString().slice(0, 10);
    if (!dailyMap[key]) dailyMap[key] = { count: 0, revenue: 0 };
    dailyMap[key].count++;
    dailyMap[key].revenue += Number(o.totalAmount);
  }

  const dailyRevenue = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    return { date: key, ...( dailyMap[key] ?? { count: 0, revenue: 0 }) };
  });

  const recentOrders = await prisma.order.findMany({
    include: { user: true },
    orderBy: { orderDate: "desc" },
    take: 6,
  });

  return NextResponse.json({
    totalOrders,
    totalRevenue: Number(totalRevenue._sum.totalAmount ?? 0),
    totalUsers,
    totalProducts,
    statusCounts: Object.fromEntries(statusCounts.map((s) => [s.status, s._count])),
    lowStock,
    dailyRevenue,
    recentOrders,
  });
}
