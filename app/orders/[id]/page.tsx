import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAuth();
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: { orderItems: { include: { product: true } } },
  });
  if (!order || order.userId !== session.user!.id) notFound();

  return (
    <div className="container-xl" style={{ padding:"2.5rem 1.5rem", maxWidth:"900px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
        <Link href="/orders" className="btn-ghost btn-sm">← My Orders</Link>
        <h1 className="fw-800" style={{ fontSize:"1.5rem", letterSpacing:"-.025em", margin:0 }}>Order #{order.id}</h1>
        <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:"1.5rem" }}>
        <div className="admin-panel-card">
          <div className="admin-panel-header">Items Ordered</div>
          <table className="admin-table">
            <thead>
              <tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              {order.orderItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link href={`/products/${item.productId}`} className="fw-600" style={{ color:"var(--ink)", textDecoration:"none" }}>
                      {item.product.name}
                    </Link>
                  </td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(Number(item.unitPrice))}</td>
                  <td className="fw-700" style={{ color:"var(--brand)" }}>{formatPrice(Number(item.unitPrice) * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ textAlign:"right" }} className="fw-800">Total</td>
                <td className="fw-800" style={{ color:"var(--brand)", fontSize:"1.05rem" }}>{formatPrice(Number(order.totalAmount))}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="admin-panel-card">
          <div className="admin-panel-header">Order Info</div>
          <div style={{ padding:"1rem", fontSize:".875rem", lineHeight:1.9 }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ color:"var(--muted)" }}>Date</span>
              <span className="fw-600">{formatDate(order.orderDate)}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ color:"var(--muted)" }}>Status</span>
              <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
            </div>
            <div style={{ marginTop:".75rem" }}>
              <p className="t-small" style={{ marginBottom:".25rem" }}>Shipping to:</p>
              <p className="fw-600" style={{ color:"var(--ink)", margin:0 }}>{order.shippingAddress}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){div[style*="280px"]{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}
