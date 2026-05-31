"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function QtyAddToCart({ productId, stock }: { productId: number; stock: number }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAdd() {
    if (!session) { router.push("/login"); return; }
    setLoading(true);
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: qty }),
    });
    setLoading(false);
    setAdded(true);
    router.refresh();
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="detail-atc-form">
      <div className="detail-qty-stepper">
        <button type="button" className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
        <input type="number" value={qty} readOnly className="qty-input" min={1} max={stock} />
        <button type="button" className="qty-btn" onClick={() => setQty(q => Math.min(stock, q + 1))}>+</button>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        disabled={loading}
        className={`btn-primary detail-atc-btn${added ? "" : ""}`}
        style={added ? { background:"var(--brand-dark)" } : undefined}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        {added ? "Added to Cart!" : loading ? "Adding…" : "Add to Cart"}
      </button>
    </div>
  );
}
