"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BulkActions({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleChange(e: Event) {
      const target = e.target as HTMLInputElement;
      if (target.id === "select-all") {
        const checkboxes = document.querySelectorAll<HTMLInputElement>(".product-checkbox");
        const ids = Array.from(checkboxes).map((c) => Number(c.value));
        checkboxes.forEach((c) => (c.checked = target.checked));
        setSelected(target.checked ? ids : []);
      } else if (target.classList.contains("product-checkbox")) {
        const id = Number(target.value);
        setSelected((prev) => target.checked ? [...prev, id] : prev.filter((i) => i !== id));
      }
    }
    document.addEventListener("change", handleChange);
    return () => document.removeEventListener("change", handleChange);
  }, []);

  async function handleBulk(action: string) {
    if (!selected.length) return;
    if (action === "delete" && !confirm(`Delete ${selected.length} products?`)) return;
    setLoading(true);
    await fetch("/api/admin/products/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selected, action }),
    });
    setLoading(false);
    setSelected([]);
    router.refresh();
  }

  return (
    <div>
      {selected.length > 0 && (
        <div className="flex items-center gap-3 mb-3 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
          <span className="text-sm text-gray-300">{selected.length} selected</span>
          <button onClick={() => handleBulk("activate")} disabled={loading} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition disabled:opacity-60">Activate</button>
          <button onClick={() => handleBulk("deactivate")} disabled={loading} className="text-xs bg-yellow-600 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-700 transition disabled:opacity-60">Deactivate</button>
          <button onClick={() => handleBulk("delete")} disabled={loading} className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition disabled:opacity-60">Delete</button>
          <button onClick={() => setSelected([])} className="text-xs text-gray-400 hover:text-white ml-auto">Clear</button>
        </div>
      )}
      {children}
    </div>
  );
}
