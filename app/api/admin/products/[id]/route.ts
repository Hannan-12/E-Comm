import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id: Number(id) }, include: { category: true } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });
  const { id } = await params;
  const data = await req.json();
  const product = await prisma.product.update({ where: { id: Number(id) }, data });
  return NextResponse.json(product);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });
  const { id } = await params;
  await prisma.product.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
