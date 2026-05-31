import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import AdminBulkActions from "@/components/admin/BulkActions";

const PAGE_SIZE = 25;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; categoryId?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const search = sp.search?.trim() || undefined;
  const categoryId = sp.categoryId ? Number(sp.categoryId) : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const where = {
    ...(categoryId ? { categoryId } : {}),
    ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
  };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true }, orderBy: { name: "asc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", String(categoryId));
    params.set("page", String(p));
    return `/admin/products?${params}`;
  }

  return (
    <div>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"1.5rem", flexWrap:"wrap", gap:"1rem" }}>
        <div>
          <div className="t-label" style={{ marginBottom:".25rem" }}>Catalog</div>
          <h1 className="fw-800" style={{ fontSize:"1.7rem", letterSpacing:"-.03em", margin:0 }}>Products</h1>
          <p className="t-small" style={{ margin:0 }}>{total} total</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary btn-sm">+ New Product</Link>
      </div>

      {/* Filters */}
      <form method="GET" style={{ display:"flex", flexWrap:"wrap", gap:".5rem", marginBottom:"1.25rem", alignItems:"center" }}>
        <input type="text" name="search" defaultValue={search} placeholder="Search products…" className="sort-select" style={{ minWidth:"200px" }} />
        <select name="categoryId" defaultValue={categoryId ?? ""} className="sort-select" onChange={undefined}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button type="submit" className="btn-ghost btn-sm">Search</button>
        {(search || categoryId) && <Link href="/admin/products" className="btn-ghost btn-sm">✕ Clear</Link>}
        <script dangerouslySetInnerHTML={{ __html: `document.querySelector('select[name="categoryId"]')?.addEventListener('change',function(){this.closest('form').submit();});` }} />
      </form>

      <AdminBulkActions>
        <div className="panel">
          <div style={{ overflowX:"auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width:"36px" }}><input type="checkbox" id="selectAll" className="bulk-check" /></th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td><input type="checkbox" name="ids" value={p.id} className="bulk-check product-checkbox" /></td>
                    <td>
                      <div className="fw-700" style={{ color:"var(--ink)", fontSize:".9rem" }}>{p.name}</div>
                      <div className="t-small">{p.unit}</div>
                    </td>
                    <td>{p.category.name}</td>
                    <td className="fw-700" style={{ color:"var(--brand)" }}>{formatPrice(Number(p.price))}</td>
                    <td>
                      {p.stock === 0
                        ? <span className="t-small" style={{ color:"var(--danger)", fontWeight:700 }}>0</span>
                        : <span>{p.stock}</span>}
                    </td>
                    <td>
                      <span className={`status-badge ${p.isActive ? "status-paid" : "status-cancelled"}`}>
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:"flex", gap:".5rem" }}>
                        <Link href={`/admin/products/${p.id}/edit`} className="btn-ghost btn-sm">Edit</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AdminBulkActions>

      {totalPages > 1 && (
        <nav style={{ display:"flex", flexWrap:"wrap", gap:".375rem", marginTop:"1.25rem" }}>
          <Link href={pageUrl(page - 1)} className={`page-btn${!hasPrev ? " page-btn--disabled" : ""}`}>← Prev</Link>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
            if (pg === page) return <span key={pg} className="page-btn page-btn--active">{pg}</span>;
            if (pg === 1 || pg === totalPages || (pg >= page - 2 && pg <= page + 2))
              return <Link key={pg} href={pageUrl(pg)} className="page-btn">{pg}</Link>;
            if (pg === page - 3 || pg === page + 3)
              return <span key={pg} className="page-btn" style={{ borderColor:"transparent", background:"transparent", pointerEvents:"none" }}>…</span>;
            return null;
          })}
          <Link href={pageUrl(page + 1)} className={`page-btn${!hasNext ? " page-btn--disabled" : ""}`}>Next →</Link>
        </nav>
      )}
    </div>
  );
}
