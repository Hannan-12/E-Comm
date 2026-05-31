import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";


export async function GET(req: Request) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || undefined;
  const categoryId = searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : undefined;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const PAGE_SIZE = 25;

  const where = {
    ...(categoryId ? { categoryId } : {}),
    ...(search ? { OR: [{ name: { contains: search, mode: "insensitive" as const } }] } : {}),
  };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true }, orderBy: { name: "asc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return NextResponse.json({ products, total, categories, page, totalPages: Math.ceil(total / PAGE_SIZE) });
}

export async function POST(req: Request) {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

  const data = await req.json();
  const product = await prisma.product.create({ data });
  return NextResponse.json(product, { status: 201 });
}
