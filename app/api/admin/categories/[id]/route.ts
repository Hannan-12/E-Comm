import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });
  const { id } = await params;
  const { name, description } = await req.json();
  const cat = await prisma.category.update({ where: { id: Number(id) }, data: { name, description } });
  return NextResponse.json(cat);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });
  const { id } = await params;
  const count = await prisma.product.count({ where: { categoryId: Number(id) } });
  if (count > 0) return NextResponse.json({ error: "Category has products" }, { status: 409 });
  await prisma.category.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
