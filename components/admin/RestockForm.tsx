"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RestockForm({ productId }: { productId: number }) {
  const router = useRouter();
  const [qty, setQty] = useState(50);
  const [loading, setLoading] = useState(false);

  async function handleRestock() {
    setLoading(true);
    await fetch("/api/admin/products/restock", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ id: productId, addStock: qty }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div style={{ display:"flex", gap:".25rem", alignItems:"center" }}>
      <input
        type="number"
        value={qty}
        min={1}
        max={9999}
        onChange={e => setQty(Number(e.target.value))}
        className="restock-input"
        style={{ width:"62px" }}
      />
      <button onClick={handleRestock} disabled={loading} className="btn-primary btn-sm" style={{ whiteSpace:"nowrap" }}>
        + Add
      </button>
    </div>
  );
}
