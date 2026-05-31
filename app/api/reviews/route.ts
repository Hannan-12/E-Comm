import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, rating, comment } = await req.json();
  if (!productId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const existing = await prisma.review.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });
  if (existing) return NextResponse.json({ error: "Already reviewed" }, { status: 409 });

  const review = await prisma.review.create({
    data: { userId: session.user.id, productId, rating, comment: comment?.trim() || null },
  });

  return NextResponse.json(review, { status: 201 });
}
