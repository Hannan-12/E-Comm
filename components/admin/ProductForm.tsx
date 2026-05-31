"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: number; name: string };
type Product = { id: number; name: string; description: string | null; price: unknown; imageUrl: string | null; stock: number; isActive: boolean; unit: string | null; categoryId: number };

export default function ProductForm({ categories, product }: { categories: Category[]; product?: Product }) {
  const router = useRouter();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product ? String(Number(product.price)) : "",
    imageUrl: product?.imageUrl ?? "",
    stock: product?.stock ?? 0,
    unit: product?.unit ?? "",
    isActive: product?.isActive ?? true,
    categoryId: product?.categoryId ?? (categories[0]?.id ?? 0),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = { ...form, price: Number(form.price), stock: Number(form.stock), categoryId: Number(form.categoryId) };

    const res = isEdit
      ? await fetch(`/api/admin/products/${product!.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      : await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

    setLoading(false);
    if (!res.ok) { setError("Failed to save product"); return; }
    router.push("/admin/products");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${product!.id}`, { method: "DELETE" });
    router.push("/admin/products");
    router.refresh();
  }

  const inputCls = "w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl bg-gray-800 rounded-2xl border border-gray-700 p-6 space-y-5">
      {error && <p className="text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Name *</label>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Category *</label>
          <select required value={form.categoryId} onChange={(e) => set("categoryId", Number(e.target.value))} className={inputCls}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Price *</label>
          <input required type="number" step="0.01" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Stock</label>
          <input type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Unit (e.g. kg, litre)</label>
          <input value={form.unit} onChange={(e) => set("unit", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Image URL</label>
          <input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} className={inputCls} placeholder="https://..." />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Description</label>
        <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className={inputCls} />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="rounded" />
        <label htmlFor="isActive" className="text-sm text-gray-300">Active (visible to customers)</label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-60">
          {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
        </button>
        <button type="button" onClick={() => router.back()} className="text-sm text-gray-400 hover:text-white transition">Cancel</button>
        {isEdit && (
          <button type="button" onClick={handleDelete} className="ml-auto text-sm text-red-400 hover:text-red-300 transition">Delete Product</button>
        )}
      </div>
    </form>
  );
}
