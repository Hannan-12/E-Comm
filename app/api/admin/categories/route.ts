import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function GET() {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });
  const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });
  const { name, description } = await req.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const cat = await prisma.category.create({ data: { name, description } });
  return NextResponse.json(cat, { status: 201 });
}
