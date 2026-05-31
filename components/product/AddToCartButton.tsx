"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  productId: number;
  stock: number;
  iconOnly?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function AddToCartButton({ productId, stock, iconOnly = false, label, size = "md" }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAdd() {
    if (!session) { router.push("/login"); return; }
    if (stock === 0) return;
    setLoading(true);
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    setLoading(false);
    setAdded(true);
    router.refresh();
    setTimeout(() => setAdded(false), 2000);
  }

  if (stock === 0) {
    if (iconOnly) return <span className="badge-oos">Out of stock</span>;
    return (
      <button disabled className="btn-add" style={{ opacity:.5, cursor:"not-allowed" }}>
        Out of stock
      </button>
    );
  }

  if (iconOnly) {
    return (
      <button onClick={handleAdd} disabled={loading} className="psnap-add-btn" aria-label="Add to cart">
        {added ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
        )}
      </button>
    );
  }

  const sizeClass = size === "lg" ? "btn-lg" : size === "sm" ? "btn-sm" : "";
  const text = added ? "Added!" : loading ? "Adding…" : (label ?? "Add to Cart");

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className={`btn-add ${sizeClass}`}
      style={added ? { background:"var(--brand-dark)" } : undefined}
    >
      {!added && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
      )}
      {text}
    </button>
  );
}
