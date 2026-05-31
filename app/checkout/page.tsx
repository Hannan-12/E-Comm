"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

type CartItem = {
  id: number; quantity: number;
  product: { id: number; name: string; price: string; imageUrl: string | null; unit: string | null };
};

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/cart").then(r => r.json()).then(setItems).finally(() => setLoading(false));
  }, []);

  const subtotal = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);
  const deliveryFee = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + deliveryFee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) { setError("Please enter a shipping address"); return; }
    setSubmitting(true); setError("");
    const res = await fetch("/api/orders", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ shippingAddress: address }),
    });
    setSubmitting(false);
    if (!res.ok) { const d = await res.json(); setError(d.error || "Failed to place order"); return; }
    const order = await res.json();
    router.push(`/orders/${order.id}`);
  }

  if (loading) return <div className="container-xl" style={{ padding:"4rem 1.5rem", textAlign:"center", color:"var(--muted)" }}>Loading…</div>;
  if (!items.length) { router.replace("/cart"); return null; }

  return (
    <div className="container-xl" style={{ padding:"2.5rem 1.5rem", maxWidth:"1100px" }}>
      <h1 className="fw-800" style={{ fontSize:"1.8rem", letterSpacing:"-.03em", marginBottom:"1.5rem" }}>Checkout</h1>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 420px", gap:"1.5rem", alignItems:"start" }}>
        {/* Form */}
        <form onSubmit={handleSubmit}>
          {error && <div className="alert-error" style={{ marginBottom:"1rem", borderRadius:"var(--r-sm)" }}>{error}</div>}

          {/* Shipping */}
          <div className="checkout-block" style={{ marginBottom:"1rem" }}>
            <div className="checkout-block-head">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Shipping Address
            </div>
            <div className="checkout-block-body">
              <label className="form-label">Delivery address *</label>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="form-control"
                rows={3}
                placeholder="123 Main St, Apt 4B, New York, NY 10001"
                required
              />
            </div>
          </div>

          {/* Payment */}
          <div className="checkout-block" style={{ marginBottom:"1.5rem" }}>
            <div className="checkout-block-head">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              Payment
            </div>
            <div className="checkout-block-body">
              <div style={{ padding:"1rem", borderRadius:"var(--r-sm)", background:"var(--brand-xlight)", border:"1.5px dashed var(--brand-light)" }}>
                <div className="fw-700" style={{ fontSize:".875rem", color:"var(--brand)", marginBottom:".25rem" }}>🔧 Demo Mode — Payment Skipped</div>
                <p className="t-small" style={{ margin:0, color:"var(--brand-dark)" }}>
                  Orders will be placed and tracked without a real payment. Add Stripe keys to enable real payments.
                </p>
              </div>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary btn-full btn-lg" style={{ borderRadius:"var(--r-sm)", justifyContent:"center" }}>
            {submitting ? "Placing Order…" : `Place Order — ${formatPrice(total)}`}
          </button>
          <p className="t-small" style={{ textAlign:"center", marginTop:".5rem", color:"var(--subtle)" }}>🔒 Your payment info is encrypted and secure</p>
        </form>

        {/* Summary */}
        <div className="summary-card">
          <div className="fw-800" style={{ fontSize:".875rem", paddingBottom:".85rem", borderBottom:"1.5px solid var(--line-2)", marginBottom:"1rem" }}>
            Order Summary ({items.length} item{items.length !== 1 ? "s" : ""})
          </div>
          {items.map((item) => (
            <div key={item.id} style={{ display:"flex", justifyContent:"space-between", marginBottom:".5rem", fontSize:".875rem" }}>
              <span><span className="fw-600">{item.product.name}</span> <span className="t-small">×{item.quantity}</span></span>
              <span className="fw-600">{formatPrice(Number(item.product.price) * item.quantity)}</span>
            </div>
          ))}
          <div className="summary-divider" />
          <div className="summary-row"><span>Subtotal</span><span className="fw-600">{formatPrice(subtotal)}</span></div>
          <div className="summary-row">
            <span>Delivery</span>
            <span className="fw-600">{deliveryFee === 0 ? <span style={{ color:"var(--brand)" }}>FREE</span> : formatPrice(deliveryFee)}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span style={{ color:"var(--brand)" }}>{formatPrice(total)}</span>
          </div>
          <div className="perks-list">
            <div className="perk-row">🔒 Secured with 256-bit SSL</div>
            <div className="perk-row">🌿 100% fresh guarantee</div>
            <div className="perk-row">↩️ Easy returns</div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){div[style*="420px"]{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}
