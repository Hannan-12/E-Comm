"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["PENDING","PAID","PROCESSING","SHIPPED","DELIVERED","CANCELLED"];

export default function OrderStatusUpdater({ orderId, currentStatus }: { orderId: number; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (status === currentStatus) return;
    setLoading(true);
    await fetch(`/api/admin/orders/${orderId}/status`, {
      method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleUpdate}>
      <div style={{ marginBottom:".75rem" }}>
        <label className="form-label">New Status</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="form-control"
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <button
        type="submit"
        disabled={loading || status === currentStatus}
        className="btn-primary btn-full btn-sm"
        style={{ justifyContent:"center" }}
      >
        {loading ? "Updating…" : "Update Status"}
      </button>
    </form>
  );
}
