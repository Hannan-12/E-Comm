import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: { user: true, orderItems: { include: { product: true } } },
  });
  if (!order) notFound();

  const user = order.user as { fullName?: string | null; email: string };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
        <Link href="/admin/orders" className="btn-ghost btn-sm">← Orders</Link>
        <h1 className="fw-800" style={{ fontSize:"1.5rem", letterSpacing:"-.025em", margin:0 }}>Order #{order.id}</h1>
        <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:"1.25rem" }}>
        {/* Items */}
        <div className="admin-panel-card">
          <div className="admin-panel-header">Items</div>
          <table className="admin-table">
            <thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr></thead>
            <tbody>
              {order.orderItems.map((item) => (
                <tr key={item.id}>
                  <td className="fw-600" style={{ color:"var(--ink)" }}>{item.product.name}</td>
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

        <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
          {/* Customer */}
          <div className="admin-panel-card">
            <div className="admin-panel-header">Customer</div>
            <div style={{ padding:".75rem 1rem", fontSize:".875rem", lineHeight:1.8 }}>
              <div className="fw-600" style={{ color:"var(--ink)" }}>{user.fullName ?? "—"}</div>
              <div className="t-small">{user.email}</div>
              <div style={{ marginTop:".5rem" }} className="t-small">Placed: {formatDate(order.orderDate)}</div>
              <div style={{ marginTop:".5rem" }}>
                <div className="t-label">Shipping address</div>
                <div style={{ marginTop:".25rem", color:"var(--muted)", fontWeight:500 }}>{order.shippingAddress}</div>
              </div>
            </div>
          </div>

          {/* Update status */}
          <div className="admin-panel-card">
            <div className="admin-panel-header">Update Status</div>
            <div style={{ padding:".75rem 1rem" }}>
              <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){div[style*="300px"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
