"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Category = { id: number; name: string; description: string | null; _count: { products: number } };

export default function CategoriesManager({ categories: initial }: { categories: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/categories", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ name: newName, description: newDesc }),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      setNewName(""); setNewDesc("");
      setCategories((prev) => [...prev, { ...data, _count: { products: 0 } }].sort((a,b) => a.name.localeCompare(b.name)));
      router.refresh();
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    await fetch(`/api/admin/categories/${editing.id}`, {
      method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ name: editName, description: editDesc }),
    });
    setSaving(false);
    setCategories((prev) => prev.map((c) => c.id === editing.id ? { ...c, name: editName, description: editDesc } : c));
    setEditing(null);
    router.refresh();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method:"DELETE" });
    if (!res.ok) { alert("Cannot delete: category has products"); return; }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    router.refresh();
  }

  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:"1.25rem" }}>
        {/* Table */}
        <div className="panel">
          <div className="panel-head">All Categories</div>
          {categories.length === 0 ? (
            <div style={{ textAlign:"center", padding:"2.5rem", fontSize:".8125rem", color:"var(--subtle)" }}>No categories yet.</div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table className="data-table">
                <thead><tr><th>Name</th><th>Description</th><th style={{ textAlign:"right" }}>Products</th><th></th></tr></thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id}>
                      <td className="fw-700" style={{ color:"var(--ink)" }}>{c.name}</td>
                      <td className="t-small">{c.description ?? "—"}</td>
                      <td style={{ textAlign:"right" }}>
                        <Link href={`/admin/products?categoryId=${c.id}`} className="fw-600" style={{ color:"var(--brand)" }}>{c._count.products}</Link>
                      </td>
                      <td>
                        <div style={{ display:"flex", gap:".375rem" }}>
                          <button
                            className="btn-ghost btn-sm"
                            onClick={() => { setEditing(c); setEditName(c.name); setEditDesc(c.description ?? ""); }}
                          >Edit</button>
                          {c._count.products === 0
                            ? <button className="btn-danger-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                            : <span className="t-small" style={{ color:"var(--subtle)", padding:".3rem .5rem" }} title="Has products — cannot delete">🔒</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add form */}
        <div className="panel">
          <div className="panel-head">Add New Category</div>
          <div style={{ padding:"1.25rem" }}>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom:"1rem" }}>
                <label className="form-label">Category Name *</label>
                <input type="text" required value={newName} onChange={e => setNewName(e.target.value)} className="form-control" placeholder="e.g. Frozen Foods" maxLength={100} />
              </div>
              <div style={{ marginBottom:"1rem" }}>
                <label className="form-label">Description (optional)</label>
                <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} className="form-control" rows={2} placeholder="Brief description…" />
              </div>
              <button type="submit" disabled={saving} className="btn-primary btn-full" style={{ justifyContent:"center" }}>
                {saving ? "Creating…" : "Create Category"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="cat-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setEditing(null); }}>
          <div className="cat-modal">
            <div className="cat-modal-head">
              Edit Category
              <button onClick={() => setEditing(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--muted)", fontSize:"1.2rem", lineHeight:1 }}>×</button>
            </div>
            <form onSubmit={handleEdit} style={{ padding:"1.25rem" }}>
              <div style={{ marginBottom:"1rem" }}>
                <label className="form-label">Category Name *</label>
                <input type="text" required value={editName} onChange={e => setEditName(e.target.value)} className="form-control" maxLength={100} />
              </div>
              <div style={{ marginBottom:"1.25rem" }}>
                <label className="form-label">Description (optional)</label>
                <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} className="form-control" rows={2} />
              </div>
              <div style={{ display:"flex", gap:".75rem" }}>
                <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving…" : "Save Changes"}</button>
                <button type="button" onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`@media(max-width:768px){div[style*="380px"]{grid-template-columns:1fr!important}}`}</style>
    </>
  );
}
