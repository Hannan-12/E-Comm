export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import CategoriesManager from "@/components/admin/CategoriesManager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div style={{ marginBottom:"1.5rem" }}>
        <div className="t-label" style={{ marginBottom:".25rem" }}>Catalog</div>
        <h1 className="fw-800" style={{ fontSize:"1.7rem", letterSpacing:"-.03em", margin:0 }}>Categories</h1>
        <p className="t-small" style={{ margin:0 }}>{categories.length} categories</p>
      </div>
      <CategoriesManager categories={categories} />
    </div>
  );
}
