import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import SessionProvider from "@/components/layout/SessionProvider";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "FreshMart — Premium Groceries Delivered",
  description: "Hand-picked produce, artisan dairy and premium meats sourced from trusted local farms.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ fontFamily: "var(--font-inter, 'Inter', system-ui, sans-serif)" }}>
        <SessionProvider>
          <Navbar />
          <main>{children}</main>

          <footer className="site-footer">
            <div className="container-xl">
              <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:"2rem" }}>
                <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"2rem" }}>
                  {/* Brand */}
                  <div>
                    <div className="footer-brand">🌿 FreshMart</div>
                    <p className="footer-desc">
                      Premium fresh groceries delivered fast. Farm-sourced, quality guaranteed every order.
                    </p>
                  </div>

                  {/* Shop */}
                  <div>
                    <div className="footer-heading">Shop</div>
                    <Link href="/products" className="footer-link">All Products</Link>
                    <Link href="/products?categoryId=1" className="footer-link">Fruits & Vegetables</Link>
                    <Link href="/products?categoryId=2" className="footer-link">Dairy & Eggs</Link>
                    <Link href="/products?categoryId=4" className="footer-link">Bakery</Link>
                  </div>

                  {/* Account */}
                  <div>
                    <div className="footer-heading">Account</div>
                    <Link href="/login" className="footer-link">Sign In</Link>
                    <Link href="/register" className="footer-link">Register</Link>
                    <Link href="/orders" className="footer-link">My Orders</Link>
                    <Link href="/cart" className="footer-link">Cart</Link>
                  </div>

                  {/* Info */}
                  <div>
                    <div className="footer-heading">Info</div>
                    <span className="footer-link" style={{ cursor:"default" }}>About Us</span>
                    <span className="footer-link" style={{ cursor:"default" }}>Privacy Policy</span>
                    <span className="footer-link" style={{ cursor:"default" }}>Terms of Service</span>
                  </div>
                </div>
              </div>

              <div className="footer-bottom">
                <span>© 2025 FreshMart. All rights reserved.</span>
                <span>Built with ❤️ for fresh food lovers</span>
              </div>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
