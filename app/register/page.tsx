"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/auth/register", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ email, password, fullName }),
    });
    setLoading(false);
    if (!res.ok) { const d = await res.json(); setError(d.error || "Registration failed"); return; }
    router.push("/login");
  }

  return (
    <div className="auth-shell">
      <div style={{ width:"100%", maxWidth:"440px", margin:"0 auto", padding:"0 1rem" }}>
        <div className="auth-card">
          <div className="auth-logo">🌿 FreshMart</div>
          <h2 style={{ textAlign:"center", fontWeight:800, marginBottom:".25rem", fontSize:"1.35rem", color:"var(--ink)", letterSpacing:"-.02em" }}>Create your account</h2>
          <p className="t-small" style={{ textAlign:"center", marginBottom:"1.5rem" }}>Free forever. No credit card required.</p>

          {error && <div className="alert-error" style={{ marginBottom:"1rem", borderRadius:"var(--r-sm)" }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:"1rem" }}>
              <label className="form-label">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="form-control" placeholder="John Smith" autoComplete="name" />
            </div>
            <div style={{ marginBottom:"1rem" }}>
              <label className="form-label">Email address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="form-control" placeholder="you@example.com" autoComplete="email" />
            </div>
            <div style={{ marginBottom:"1rem" }}>
              <label className="form-label">Password</label>
              <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="form-control" placeholder="Min. 6 characters" autoComplete="new-password" />
            </div>
            <div style={{ marginBottom:"1.5rem" }}>
              <label className="form-label">Confirm Password</label>
              <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} className="form-control" placeholder="Repeat password" autoComplete="new-password" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary btn-full" style={{ borderRadius:"var(--r-sm)", padding:".8rem", justifyContent:"center" }}>
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <div style={{ textAlign:"center", fontSize:".875rem", color:"var(--muted)" }}>
            Already have an account? <Link href="/login" style={{ color:"var(--brand)", fontWeight:600 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
