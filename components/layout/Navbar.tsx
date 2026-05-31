"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (session) {
      fetch("/api/cart/count").then(r => r.json()).then(d => setCartCount(d.count ?? 0)).catch(() => {});
    } else {
      setCartCount(0);
    }
  }, [session, pathname]);

  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";

  return (
    <nav className="site-nav">
      <div className="container-xl">
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:"62px" }}>
          {/* Brand */}
          <Link href="/" className="nav-brand">
            🌿 FreshMart
          </Link>

          {/* Desktop nav links */}
          <ul style={{ display:"flex", alignItems:"center", gap:"4px", listStyle:"none", margin:0, padding:0 }} className="desktop-nav">
            <li><Link href="/" className="nav-link">Home</Link></li>
            <li><Link href="/products" className="nav-link">Shop</Link></li>
          </ul>

          {/* Right side */}
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            {isAdmin && (
              <Link href="/admin" className="nav-admin-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                Admin
              </Link>
            )}

            {session && (
              <Link href="/cart" className="nav-cart-pill">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                Cart
                {cartCount > 0 && <span className="nav-cart-count">{cartCount > 9 ? "9+" : cartCount}</span>}
              </Link>
            )}

            {session ? (
              <div className="nav-dropdown" style={{ display:"none" }} id="user-dropdown-desktop">
                <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:".875rem", fontWeight:500, color:"var(--muted)", padding:".45rem .8rem", borderRadius:"var(--r-sm)" }}>
                  {session.user?.name?.split(" ")[0] ?? session.user?.email?.split("@")[0]}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft:4 }}><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <div className="nav-dropdown-menu">
                  <Link href="/orders" className="nav-dropdown-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight:6, display:"inline" }}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z"/></svg>
                    My Orders
                  </Link>
                  <div className="nav-dropdown-divider" />
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="nav-dropdown-item" style={{ width:"100%", textAlign:"left", background:"none", border:"none", cursor:"pointer", color:"var(--danger)", display:"block" }}>
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="nav-link" style={{ display:"none" }} id="signin-desktop">Sign In</Link>
                <Link href="/register" className="nav-cta btn-pill" style={{ display:"none" }} id="register-desktop">Get Started</Link>
              </>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background:"none", border:"none", color:"var(--muted)", cursor:"pointer", padding:".35rem .5rem" }}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {mobileOpen ? <path d="M6 18L18 6M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ borderTop:"1px solid var(--line)", padding:".75rem 0 1rem" }}>
            <Link href="/" className="nav-link" style={{ display:"block", marginBottom:2 }} onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/products" className="nav-link" style={{ display:"block", marginBottom:2 }} onClick={() => setMobileOpen(false)}>Shop</Link>
            {session ? (
              <>
                <Link href="/cart" className="nav-link" style={{ display:"block", marginBottom:2 }} onClick={() => setMobileOpen(false)}>
                  Cart {cartCount > 0 && <span className="nav-cart-count">{cartCount}</span>}
                </Link>
                <Link href="/orders" className="nav-link" style={{ display:"block", marginBottom:2 }} onClick={() => setMobileOpen(false)}>My Orders</Link>
                {isAdmin && <Link href="/admin" className="nav-admin-link" style={{ display:"flex", marginBottom:2 }} onClick={() => setMobileOpen(false)}>Admin</Link>}
                <button onClick={() => signOut({ callbackUrl: "/" })} className="nav-link" style={{ display:"block", background:"none", border:"none", cursor:"pointer", color:"var(--danger)", textAlign:"left", width:"100%" }}>Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-link" style={{ display:"block", marginBottom:2 }} onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link href="/register" className="nav-cta btn-pill" style={{ display:"inline-block", marginTop:8 }} onClick={() => setMobileOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @media(min-width:992px) {
          .desktop-nav { display:flex !important }
          #user-dropdown-desktop { display:block !important }
          #signin-desktop, #register-desktop { display:inline-block !important }
        }
        @media(max-width:991px) {
          .desktop-nav { display:none !important }
        }
      `}</style>
    </nav>
  );
}
