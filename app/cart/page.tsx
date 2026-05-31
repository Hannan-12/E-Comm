"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

type CartItem = {
  id: number; quantity: number;
  product: { id: number; name: string; price: string; imageUrl: string | null; unit: string | null; stock: number };
};

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/cart");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateQty(id: number, quantity: number) {
    await fetch(`/api/cart/${id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ quantity }) });
    load(); router.refresh();
  }

  async function remove(id: number) {
    await fetch(`/api/cart/${id}`, { method:"DELETE" });
    load(); router.refresh();
  }

  async function clear() {
    await fetch("/api/cart", { method:"DELETE" });
    setItems([]); router.refresh();
  }

  const subtotal = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);
  const deliveryFee = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + deliveryFee;

  if (loading) return <div className="container-xl" style={{ padding:"4rem 1.5rem", textAlign:"center", color:"var(--muted)" }}>Loading cart…</div>;

  return (
    <div className="container-xl" style={{ padding:"2.5rem 1.5rem", maxWidth:"1100px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.5rem" }}>
        <h1 className="fw-800" style={{ fontSize:"1.8rem", letterSpacing:"-.03em", margin:0 }}>Your Cart</h1>
        {items.length > 0 && (
          <span className="cart-count-badge">{items.length} item{items.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="empty-state" style={{ padding:"6rem 1rem" }}>
          <div className="empty-icon">🛒</div>
          <h4 style={{ fontSize:"1.1rem", fontWeight:700, color:"var(--muted)", marginBottom:".4rem" }}>Your cart is empty</h4>
          <p style={{ fontSize:".875rem" }}>Add some fresh groceries to get started.</p>
          <Link href="/products" className="btn-primary btn-sm" style={{ marginTop:"1rem", display:"inline-flex" }}>Browse Products</Link>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:"1.5rem", alignItems:"start" }}>
          {/* Cart items */}
          <div>
            <div className="cart-table">
              <div className="cart-table-head">
                <span className="fw-600" style={{ fontSize:".8125rem", color:"var(--muted)" }}>{items.length} item{items.length !== 1 ? "s" : ""}</span>
                <button className="btn-link-muted" onClick={clear}>Remove all</button>
              </div>
              {items.map((item) => (
                <div key={item.id} className="cart-row">
                  <div className="cart-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {item.product.imageUrl && <img src={item.product.imageUrl} alt={item.product.name} />}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <Link href={`/products/${item.product.id}`} className="cart-name">{item.product.name}</Link>
                    <p className="t-small" style={{ margin:0 }}>Per {item.product.unit} · {formatPrice(Number(item.product.price))} each</p>
                  </div>
                  <div className="qty-stepper">
                    <button className="qty-stepper-btn" onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button className="qty-stepper-btn" disabled={item.quantity >= item.product.stock} onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div className="cart-subtotal">{formatPrice(Number(item.product.price) * item.quantity)}</div>
                  <button className="cart-remove" onClick={() => remove(item.id)} title="Remove item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))}
            </div>
            <div style={{ marginTop:"1rem" }}>
              <Link href="/products" className="btn-ghost btn-sm">← Continue Shopping</Link>
            </div>
          </div>

          {/* Summary */}
          <div className="summary-card">
            <div className="fw-800" style={{ fontSize:".95rem", paddingBottom:".9rem", borderBottom:"1.5px solid var(--line-2)", marginBottom:"1rem" }}>Order Summary</div>
            <div className="summary-row"><span>Subtotal</span><span className="fw-600">{formatPrice(subtotal)}</span></div>
            <div className="summary-row">
              <span>Delivery</span>
              <span className="fw-600">{deliveryFee === 0 ? <span style={{ color:"var(--brand)" }}>FREE</span> : formatPrice(deliveryFee)}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="free-hint">Add {formatPrice(50 - subtotal)} more for free delivery</div>
            )}
            <div className="summary-divider" />
            <div className="summary-row summary-total">
              <span>Total</span>
              <span style={{ color:"var(--brand)" }}>{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" className="btn-primary btn-full" style={{ borderRadius:"var(--r-sm)", padding:".82rem", marginTop:"1rem", justifyContent:"center" }}>
              Checkout →
            </Link>
            <div className="perks-list">
              <div className="perk-row">🔒 Secure SSL checkout</div>
              <div className="perk-row">🌿 100% fresh guarantee</div>
              <div className="perk-row">↩️ Easy returns</div>
            </div>
          </div>
        </div>
      )}

      <style>{`@media(max-width:768px){div[style*="340px"]{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}
