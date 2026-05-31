export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/product/AddToCartButton";

const PAGE_SIZE = 12;

const CAT_EMOJI: Record<string, string> = {
  "Fruits & Vegetables": "🥦",
  "Dairy & Eggs": "🥛",
  "Meat & Poultry": "🥩",
  "Bakery": "🍞",
  "Beverages": "🧃",
  "Pantry": "🫙",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string; search?: string; sort?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const categoryId = sp.categoryId ? Number(sp.categoryId) : undefined;
  const search = sp.search?.trim() || undefined;
  const sort = sp.sort || "";
  const page = Math.max(1, Number(sp.page) || 1);

  const where = {
    isActive: true,
    ...(categoryId ? { categoryId } : {}),
    ...(search ? { OR: [{ name: { contains: search, mode: "insensitive" as const } }, { description: { contains: search, mode: "insensitive" as const } }] } : {}),
  };

  const orderBy =
    sort === "price_asc" ? { price: "asc" as const } :
    sort === "price_desc" ? { price: "desc" as const } :
    sort === "newest" ? { createdAt: "desc" as const } :
    { name: "asc" as const };

  const [products, totalCount, categories] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true }, orderBy, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (categoryId) params.set("categoryId", String(categoryId));
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);
    params.set("page", String(p));
    return `/products?${params}`;
  }

  const selectedCat = categories.find((c) => c.id === categoryId);
  const pageTitle = search
    ? `Results for "${search}"`
    : selectedCat
    ? selectedCat.name
    : "All Products";

  return (
    <div className="container-xl" style={{ padding:"2.5rem 1.5rem" }}>
      <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", gap:"2rem", alignItems:"start" }}>

        {/* ── Sidebar ── */}
        <aside>
          {/* Search */}
          <form method="GET" style={{ marginBottom:"1rem" }}>
            <div className="search-wrap">
              <input type="text" name="search" defaultValue={search} placeholder="Search products…" />
              {categoryId && <input type="hidden" name="categoryId" value={categoryId} />}
              {sort && <input type="hidden" name="sort" value={sort} />}
              <button type="submit">Search</button>
            </div>
          </form>

          {/* Category filter */}
          <div className="filter-panel">
            <div className="filter-panel-head">Categories</div>
            <Link
              href={`/products${sort ? `?sort=${sort}` : ""}`}
              className={`filter-link${!categoryId ? " active" : ""}`}
            >
              🛒 All Products
              <span style={{ marginLeft:"auto", background:"var(--surface)", color:"var(--subtle)", borderRadius:"999px", padding:".12rem .6rem", fontSize:".72rem", fontWeight:600 }}>
                {totalCount}
              </span>
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?categoryId=${cat.id}${search ? `&search=${search}` : ""}${sort ? `&sort=${sort}` : ""}`}
                className={`filter-link${categoryId === cat.id ? " active" : ""}`}
              >
                {CAT_EMOJI[cat.name] ?? "🛒"} {cat.name}
              </Link>
            ))}
          </div>
        </aside>

        {/* ── Main grid ── */}
        <div>
          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem", flexWrap:"wrap", gap:"1rem" }}>
            <div>
              <h4 style={{ fontSize:"1.35rem", fontWeight:800, letterSpacing:"-.025em", color:"var(--ink)", margin:0 }}>
                {search
                  ? <>Results for &ldquo;<span style={{ color:"var(--brand)" }}>{search}</span>&rdquo;</>
                  : selectedCat
                  ? selectedCat.name
                  : <>All <span style={{ color:"var(--brand)" }}>Products</span></>
                }
              </h4>
              <p style={{ fontSize:".8125rem", color:"var(--muted)", margin:0 }}>
                {totalCount} item{totalCount !== 1 ? "s" : ""} — page {page} of {totalPages || 1}
              </p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <form method="GET" style={{ display:"flex", alignItems:"center", gap:"8px", margin:0 }}>
                {categoryId && <input type="hidden" name="categoryId" value={categoryId} />}
                {search && <input type="hidden" name="search" value={search} />}
                <label style={{ fontSize:".8125rem", fontWeight:600, color:"var(--muted)", whiteSpace:"nowrap" }}>Sort by</label>
                <select name="sort" defaultValue={sort} onChange={undefined}
                  className="sort-select"
                  style={{ border:"1.5px solid var(--line)", borderRadius:"8px", padding:".4rem .75rem", fontSize:".82rem", fontWeight:600, color:"var(--ink)", background:"var(--white)", cursor:"pointer", outline:"none" }}
                >
                  <option value="">Name A–Z</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="newest">Newest</option>
                </select>
                <noscript><button type="submit" className="btn-ghost btn-sm">Go</button></noscript>
              </form>
              {(categoryId || search) && (
                <Link href="/products" className="btn-ghost btn-sm">✕ Clear</Link>
              )}
            </div>
          </div>

          {/* Products grid */}
          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h4 style={{ fontSize:"1.1rem", fontWeight:700, color:"var(--muted)", marginBottom:".4rem" }}>No products found</h4>
              <p style={{ fontSize:".875rem" }}>Try a different search term or browse all categories.</p>
              <Link href="/products" className="btn-primary btn-sm" style={{ marginTop:"1rem", display:"inline-flex" }}>Browse All Products</Link>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"1.25rem" }}>
              {products.map((p) => (
                <div key={p.id} className="product-card">
                  <Link href={`/products/${p.id}`} style={{ display:"block", textDecoration:"none" }}>
                    <div className="product-img-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.imageUrl ?? "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg"}
                        alt={p.name}
                      />
                    </div>
                  </Link>
                  <div className="product-body">
                    <span className="product-badge">{p.category.name}</span>
                    <Link href={`/products/${p.id}`} className="product-name">{p.name}</Link>
                    <div className="product-unit">per {p.unit}</div>
                    <div className="product-footer">
                      <span className="product-price">{formatPrice(Number(p.price))}</span>
                      {p.stock > 0 ? (
                        <AddToCartButton productId={p.id} stock={p.stock} size="sm" />
                      ) : (
                        <span className="badge-oos">Out of stock</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav style={{ display:"flex", flexWrap:"wrap", gap:".375rem", justifyContent:"center", marginTop:"2.5rem" }}>
              <Link href={pageUrl(page - 1)} className={`page-btn${!hasPrev ? " page-btn--disabled" : ""}`}
                aria-disabled={!hasPrev}>← Prev</Link>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                if (pg === page) return <span key={pg} className="page-btn page-btn--active">{pg}</span>;
                if (pg === 1 || pg === totalPages || (pg >= page - 2 && pg <= page + 2)) {
                  return <Link key={pg} href={pageUrl(pg)} className="page-btn">{pg}</Link>;
                }
                if (pg === page - 3 || pg === page + 3) {
                  return <span key={pg} className="page-btn" style={{ borderColor:"transparent", background:"transparent", pointerEvents:"none" }}>…</span>;
                }
                return null;
              })}

              <Link href={pageUrl(page + 1)} className={`page-btn${!hasNext ? " page-btn--disabled" : ""}`}
                aria-disabled={!hasNext}>Next →</Link>
            </nav>
          )}
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          div[style*="grid-template-columns:260px"] { grid-template-columns:1fr !important }
          aside { display:none }
        }
        @media(max-width:900px){
          div[style*="repeat(3, 1fr)"] { grid-template-columns:repeat(2,1fr) !important }
        }
      `}</style>
      <script dangerouslySetInnerHTML={{ __html: `
        document.querySelector('select[name="sort"]')?.addEventListener('change',function(){this.closest('form').submit();});
      `}} />
    </div>
  );
}
