export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";

const STATUSES = ["PENDING","PAID","PROCESSING","SHIPPED","DELIVERED","CANCELLED"];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const status = sp.status || undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const PAGE_SIZE = 25;

  const where = status ? { status: status as never } : {};
  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, include: { user: true, orderItems: true }, orderBy: { orderDate: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.order.count({ where }),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    params.set("page", String(p));
    return `/admin/orders?${params}`;
  }

  return (
    <div>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"1.5rem", flexWrap:"wrap", gap:"1rem" }}>
        <div>
          <div className="t-label" style={{ marginBottom:".25rem" }}>Fulfillment</div>
          <h1 className="fw-800" style={{ fontSize:"1.7rem", letterSpacing:"-.03em", margin:0 }}>Orders</h1>
          <p className="t-small" style={{ margin:0 }}>{total} order{total !== 1 ? "s" : ""}</p>
        </div>
        <a href={`/api/orders/export${status ? `?status=${status}` : ""}`} className="btn-ghost btn-sm" style={{ display:"inline-flex", alignItems:"center", gap:"6px" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </a>
      </div>

      {/* Status filter */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:".5rem", marginBottom:"1.25rem" }}>
        <Link href="/admin/orders" className={`status-filter-pill${!status ? " active" : ""}`}>All</Link>
        {STATUSES.map((s) => (
          <Link key={s} href={`/admin/orders?status=${s}`} className={`status-filter-pill${status === s ? " active" : ""}`}>{s}</Link>
        ))}
      </div>

      <div className="panel">
        {orders.length === 0 ? (
          <div style={{ textAlign:"center", padding:"2.5rem", fontSize:".8125rem", color:"var(--subtle)" }}>No orders found.</div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table className="data-table">
              <thead><tr><th>#</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="fw-700" style={{ color:"var(--ink)" }}>#{o.id}</td>
                    <td>{(o.user as { email: string }).email}</td>
                    <td>{formatDate(o.orderDate)}</td>
                    <td className="fw-700" style={{ color:"var(--brand)" }}>{formatPrice(Number(o.totalAmount))}</td>
                    <td><span className={`status-badge status-${o.status.toLowerCase()}`}>{o.status}</span></td>
                    <td><Link href={`/admin/orders/${o.id}`} className="btn-ghost btn-sm">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <nav style={{ display:"flex", flexWrap:"wrap", gap:".375rem", marginTop:"1.25rem" }}>
          <Link href={pageUrl(page - 1)} className={`page-btn${page === 1 ? " page-btn--disabled" : ""}`}>← Prev</Link>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
            if (pg === page) return <span key={pg} className="page-btn page-btn--active">{pg}</span>;
            if (pg === 1 || pg === totalPages || (pg >= page - 2 && pg <= page + 2))
              return <Link key={pg} href={pageUrl(pg)} className="page-btn">{pg}</Link>;
            if (pg === page - 3 || pg === page + 3)
              return <span key={pg} className="page-btn" style={{ border:"none", background:"transparent", pointerEvents:"none" }}>…</span>;
            return null;
          })}
          <Link href={pageUrl(page + 1)} className={`page-btn${page === totalPages ? " page-btn--disabled" : ""}`}>Next →</Link>
        </nav>
      )}
    </div>
  );
}
