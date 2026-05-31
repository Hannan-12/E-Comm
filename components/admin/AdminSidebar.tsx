"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const links = [
  { href:"/admin",            label:"Dashboard", icon:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href:"/admin/products",   label:"Products",  icon:"M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { href:"/admin/orders",     label:"Orders",    icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href:"/admin/users",      label:"Users",     icon:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { href:"/admin/categories", label:"Categories",icon:"M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  const initials = (session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? "A").toUpperCase();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-inner">
        {/* Brand */}
        <Link href="/" className="admin-brand" style={{ textDecoration:"none" }}>
          <span style={{ fontSize:"1.6rem", lineHeight:1 }}>🌿</span>
          <div>
            <div className="admin-brand-name">FreshMart</div>
            <div className="admin-brand-sub">Admin Panel</div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="admin-nav">
          <div className="admin-nav-label">Main Menu</div>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`admin-nav-link${isActive(link.href) ? " admin-nav-link--active" : ""}`}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
              </svg>
              {link.label}
            </Link>
          ))}

          <div style={{ height:"1px", background:"rgba(255,255,255,.07)", margin:".75rem 1rem" }} />
          <div className="admin-nav-label">Store</div>
          <Link href="/" className="admin-nav-link" target="_blank">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Storefront
          </Link>
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-chip" style={{ marginBottom:".75rem" }}>
            <div className="admin-user-avatar">{initials}</div>
            <div>
              <div className="admin-user-name">{session?.user?.name ?? session?.user?.email?.split("@")[0] ?? "Admin"}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
          </div>
          <button className="admin-signout-btn" onClick={() => signOut({ callbackUrl:"/" })}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
