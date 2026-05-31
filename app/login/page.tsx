"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) { setError("Invalid email or password"); return; }
    router.push("/"); router.refresh();
  }

  return (
    <div className="auth-shell">
      <div style={{ width:"100%", maxWidth:"440px", margin:"0 auto", padding:"0 1rem" }}>
        <div className="auth-card">
          <div className="auth-logo">🌿 FreshMart</div>
          <h2 style={{ textAlign:"center", fontWeight:800, marginBottom:".25rem", fontSize:"1.35rem", color:"var(--ink)", letterSpacing:"-.02em" }}>Welcome back</h2>
          <p className="t-small" style={{ textAlign:"center", marginBottom:"1.5rem" }}>Sign in to your account</p>

          {error && <div className="alert-error" style={{ marginBottom:"1rem", borderRadius:"var(--r-sm)" }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:"1rem" }}>
              <label className="form-label">Email address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="form-control" placeholder="you@example.com" autoComplete="email" />
            </div>
            <div style={{ marginBottom:"1.5rem" }}>
              <label className="form-label">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="form-control" placeholder="••••••••" autoComplete="current-password" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary btn-full" style={{ borderRadius:"var(--r-sm)", padding:".8rem", justifyContent:"center" }}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <div style={{ textAlign:"center", fontSize:".875rem", color:"var(--muted)" }}>
            Don&apos;t have an account? <Link href="/register" style={{ color:"var(--brand)", fontWeight:600 }}>Create one free</Link>
          </div>
        </div>
        <p style={{ textAlign:"center", marginTop:".75rem", fontSize:".72rem", color:"var(--subtle)" }}>
          Admin demo: admin@freshmart.com / Admin123!
        </p>
      </div>
    </div>
  );
}
