export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";

export default async function OrdersPage() {
  const session = await requireAuth();
  const orders = await prisma.order.findMany({
    where: { userId: session.user!.id! },
    include: { orderItems: { include: { product: true } } },
    orderBy: { orderDate: "desc" },
  });

  return (
    <div className="container-xl" style={{ padding:"2.5rem 1.5rem", maxWidth:"900px" }}>
      <h1 className="fw-800" style={{ fontSize:"1.8rem", letterSpacing:"-.03em", marginBottom:"1.5rem" }}>My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-state" style={{ padding:"6rem 1rem" }}>
          <div className="empty-icon">📦</div>
          <h4 style={{ fontSize:"1.1rem", fontWeight:700, color:"var(--muted)", marginBottom:".4rem" }}>No orders yet</h4>
          <p style={{ fontSize:".875rem" }}>Start shopping and your orders will appear here.</p>
          <Link href="/products" className="btn-primary btn-sm" style={{ marginTop:"1rem", display:"inline-flex" }}>Browse Products</Link>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:".75rem" }}>
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div style={{ display:"flex", alignItems:"center", gap:"1rem", flexWrap:"wrap" }}>
                  <span className="fw-700" style={{ color:"var(--ink)" }}>Order #{order.id}</span>
                  <span className="t-small">{formatDate(order.orderDate)}</span>
                  <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
                  <span className="fw-800" style={{ color:"var(--brand)", fontSize:"1.05rem" }}>{formatPrice(Number(order.totalAmount))}</span>
                  <Link href={`/orders/${order.id}`} className="btn-ghost btn-sm">View →</Link>
                </div>
              </div>
              <div className="order-card-body">
                <div style={{ display:"flex", flexWrap:"wrap", gap:".5rem" }}>
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="order-item-chip">
                      {item.product.name} <span className="t-small">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
