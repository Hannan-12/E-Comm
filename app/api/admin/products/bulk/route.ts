import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

  const { ids, action } = await req.json();
  if (!ids?.length) return NextResponse.json({ error: "No IDs" }, { status: 400 });

  if (action === "activate") {
    await prisma.product.updateMany({ where: { id: { in: ids } }, data: { isActive: true } });
  } else if (action === "deactivate") {
    await prisma.product.updateMany({ where: { id: { in: ids } }, data: { isActive: false } });
  } else if (action === "delete") {
    await prisma.product.deleteMany({ where: { id: { in: ids } } });
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
