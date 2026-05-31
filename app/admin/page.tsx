export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import RestockForm from "@/components/admin/RestockForm";

export default async function AdminDashboard() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const [totalOrders, revenueAgg, totalUsers, totalProducts, statusCounts, lowStock, dailyRaw, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ where: { status: { not: "CANCELLED" } }, _sum: { totalAmount: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
    prisma.product.findMany({ where: { stock: { lte: 10 }, isActive: true }, include: { category: true }, orderBy: { stock: "asc" }, take: 8 }),
    prisma.order.findMany({ where: { orderDate: { gte: thirtyDaysAgo }, status: { not: "CANCELLED" } }, select: { orderDate: true, totalAmount: true } }),
    prisma.order.findMany({ include: { user: true }, orderBy: { orderDate: "desc" }, take: 8 }),
  ]);

  const totalRevenue = Number(revenueAgg._sum.totalAmount ?? 0);
  const statusMap = Object.fromEntries(statusCounts.map((s) => [s.status, s._count]));

  const dailyMap: Record<string, { count: number; revenue: number }> = {};
  for (const o of dailyRaw) {
    const key = o.orderDate.toISOString().slice(0, 10);
    if (!dailyMap[key]) dailyMap[key] = { count: 0, revenue: 0 };
    dailyMap[key].count++;
    dailyMap[key].revenue += Number(o.totalAmount);
  }
  const dailyRevenue = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    return { date: d, key, ...(dailyMap[key] ?? { count: 0, revenue: 0 }) };
  });
  const maxRevenue = Math.max(...dailyRevenue.map((d) => d.revenue), 1);
  const today = new Date().toISOString().slice(0, 10);

  const STATUS_ROWS = [
    { label:"Pending",    key:"PENDING",    color:"#f59e0b", cls:"status-pending" },
    { label:"Paid",       key:"PAID",       color:"#22c55e", cls:"status-paid" },
    { label:"Processing", key:"PROCESSING", color:"#3b82f6", cls:"status-processing" },
    { label:"Shipped",    key:"SHIPPED",    color:"#8b5cf6", cls:"status-shipped" },
    { label:"Delivered",  key:"DELIVERED",  color:"#10b981", cls:"status-delivered" },
    { label:"Cancelled",  key:"CANCELLED",  color:"#ef4444", cls:"status-cancelled" },
  ];

  const safeTotal = totalOrders > 0 ? totalOrders : 1;

  return (
    <div>
      <div style={{ marginBottom:"1.5rem" }}>
        <div className="t-label" style={{ marginBottom:".25rem" }}>Overview</div>
        <h1 className="fw-800" style={{ fontSize:"1.7rem", letterSpacing:"-.03em", margin:0 }}>Dashboard</h1>
      </div>

      {/* KPI tiles */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem", marginBottom:"1.5rem" }}>
        {[
          { icon:"📦", val:totalProducts.toString(),          label:"Total Products",   bg:"#f0fdf4", fg:"#15803d" },
          { icon:"🛒", val:totalOrders.toString(),            label:"Total Orders",     bg:"#eff6ff", fg:"#1d4ed8" },
          { icon:"👤", val:totalUsers.toString(),             label:"Registered Users", bg:"#faf5ff", fg:"#7c3aed" },
          { icon:"💰", val:"$"+totalRevenue.toLocaleString(), label:"Revenue",          bg:"#fff7ed", fg:"#c2410c" },
        ].map((k) => (
          <div key={k.label} className="stat-tile">
            <div className="stat-icon" style={{ background:k.bg, color:k.fg }}>{k.icon}</div>
            <div>
              <div className="stat-val">{k.val}</div>
              <div className="stat-label">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="panel" style={{ marginBottom:"1.5rem" }}>
        <div className="panel-head">
          Revenue – Last 30 Days
          <span className="t-small fw-600" style={{ color:"var(--muted)", textTransform:"none", letterSpacing:0 }}>excludes cancelled orders</span>
        </div>
        <div style={{ padding:"1.25rem" }}>
          <div className="rev-chart">
            {dailyRevenue.map((day) => {
              const pct = (day.revenue / maxRevenue) * 100;
              const isToday = day.key === today;
              return (
                <div key={day.key} className="rev-bar-col" title={`${day.date.toLocaleDateString("en-US",{month:"short",day:"numeric"})}: ${formatPrice(day.revenue)} (${day.count} order${day.count!==1?"s":""})`}>
                  <div className="rev-bar-wrap">
                    <div className={`rev-bar${isToday?" rev-bar--today":""}`} style={{ height:`${Math.max(pct, day.revenue > 0 ? 2 : 0)}%` }} />
                  </div>
                  <div className="rev-bar-label">
                    {(day.date.getDate() === 1 || isToday) ? (isToday ? "Today" : day.date.toLocaleDateString("en-US",{month:"short",day:"numeric"})) : ""}
                  </div>
                </div>
              );
            })}
          </div>
          {!dailyRevenue.some(d => d.revenue > 0) && (
            <div style={{ textAlign:"center", fontSize:".8125rem", color:"var(--subtle)", paddingTop:".75rem" }}>No orders in the last 30 days yet.</div>
          )}
        </div>
      </div>

      {/* Status + Low stock */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem", marginBottom:"1.5rem" }}>
        {/* Orders by status */}
        <div className="panel">
          <div className="panel-head">
            Orders by Status
            <Link href="/admin/orders" className="btn-ghost btn-sm">View all →</Link>
          </div>
          <div style={{ padding:".75rem 1rem" }}>
            {STATUS_ROWS.map((s) => {
              const count = statusMap[s.key] ?? 0;
              const pct = Math.round(count * 100 / safeTotal);
              return (
                <div key={s.key} className="dash-status-row">
                  <Link href={`/admin/orders?status=${s.key}`} className="dash-status-label">
                    <span className={`status-badge ${s.cls}`}>{s.label}</span>
                  </Link>
                  <div className="dash-status-bar-wrap">
                    <div className="dash-status-bar" style={{ width:`${pct}%`, background:s.color }} />
                  </div>
                  <span className="dash-status-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low stock */}
        <div className="panel">
          <div className="panel-head">
            {lowStock.length > 0 ? <span style={{ color:"var(--warning)" }}>⚠ Low Stock</span> : <span>Stock Levels</span>}
            <Link href="/admin/products" className="btn-ghost btn-sm">Manage →</Link>
          </div>
          {lowStock.length === 0 ? (
            <div style={{ textAlign:"center", padding:"1.5rem", fontSize:".8125rem", color:"var(--subtle)" }}>
              <div style={{ fontSize:"2rem", marginBottom:".5rem" }}>✅</div>
              All products are well stocked.
            </div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table className="data-table">
                <thead><tr><th>Product</th><th>Stock</th><th>Restock</th></tr></thead>
                <tbody>
                  {lowStock.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <Link href={`/admin/products/${p.id}/edit`} className="fw-600" style={{ color:"var(--ink)", fontSize:".875rem" }}>{p.name}</Link>
                        <div className="t-small">{p.category.name}</div>
                      </td>
                      <td>
                        {p.stock === 0
                          ? <span className="fw-700" style={{ color:"var(--danger)" }}>Out of stock</span>
                          : <span className="fw-700" style={{ color:"var(--warning)" }}>{p.stock} left</span>}
                      </td>
                      <td><RestockForm productId={p.id} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginBottom:"1.5rem" }}>
        {[
          { href:"/admin/products",   icon:"📦", title:"Manage Products",   sub:"Add, edit, deactivate" },
          { href:"/admin/orders",     icon:"🛒", title:"Manage Orders",     sub:`${statusMap["PENDING"]??0} pending` },
          { href:"/admin/users",      icon:"👤", title:"Manage Users",      sub:`${totalUsers} registered` },
        ].map((q) => (
          <Link key={q.href} href={q.href} className="quick-link">
            <span className="ql-icon">{q.icon}</span>
            <div><div className="ql-title">{q.title}</div><div className="ql-sub">{q.sub}</div></div>
            <svg style={{ marginLeft:"auto", flexShrink:0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="panel">
        <div className="panel-head">
          Recent Orders
          <Link href="/admin/orders" className="btn-ghost btn-sm">View all →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div style={{ textAlign:"center", padding:"2.5rem", fontSize:".8125rem", color:"var(--subtle)" }}>No orders yet.</div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table className="data-table">
              <thead><tr><th>#</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {recentOrders.map((o) => (
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

      <style>{`@media(max-width:900px){
        div[style*="repeat(4,1fr)"]{grid-template-columns:repeat(2,1fr)!important}
        div[style*="1fr 1fr"]{grid-template-columns:1fr!important}
        div[style*="repeat(3,1fr)"]{grid-template-columns:1fr!important}
      }`}</style>
    </div>
  );
}
