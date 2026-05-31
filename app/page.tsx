export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import HeroSlider from "@/components/layout/HeroSlider";
import DealTimer from "@/components/layout/DealTimer";
import AddToCartButton from "@/components/product/AddToCartButton";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: "asc" },
      take: 12,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const dealProduct = featured[1] ?? featured[0];

  return (
    <div>
      {/* ── Hero Slider ── */}
      <HeroSlider />

      {/* ── Trust Marquee ── */}
      <div className="trust-marquee-wrap">
        <div className="trust-marquee">
          <div className="trust-track">
            <span className="trust-item-m">🚚 Free delivery over $50</span>
            <span className="trust-sep">·</span>
            <span className="trust-item-m">🌿 100% fresh guaranteed</span>
            <span className="trust-sep">·</span>
            <span className="trust-item-m">🔒 Secure checkout</span>
            <span className="trust-sep">·</span>
            <span className="trust-item-m">↩️ Easy returns</span>
            <span className="trust-sep">·</span>
            <span className="trust-item-m">⭐ 4.9 / 5 rating</span>
            <span className="trust-sep">·</span>
            <span className="trust-item-m">🥬 Farm-to-door freshness</span>
            <span className="trust-sep">·</span>
            <span className="trust-item-m">📦 Same-day dispatch</span>
            <span className="trust-sep">·</span>
            <span className="trust-item-m">🚚 Free delivery over $50</span>
            <span className="trust-sep">·</span>
            <span className="trust-item-m">🌿 100% fresh guaranteed</span>
            <span className="trust-sep">·</span>
            <span className="trust-item-m">🔒 Secure checkout</span>
            <span className="trust-sep">·</span>
            <span className="trust-item-m">↩️ Easy returns</span>
            <span className="trust-sep">·</span>
            <span className="trust-item-m">⭐ 4.9 / 5 rating</span>
            <span className="trust-sep">·</span>
            <span className="trust-item-m">🥬 Farm-to-door freshness</span>
            <span className="trust-sep">·</span>
            <span className="trust-item-m">📦 Same-day dispatch</span>
            <span className="trust-sep">·</span>
          </div>
        </div>
      </div>

      {/* ── Deal of the Day ── */}
      {dealProduct && (
        <section className="deal-section">
          <div className="container-xl">
            <div className="deal-banner">
              <div className="deal-img-col">
                <div className="deal-badge-float">🔥 Hot Deal</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dealProduct.imageUrl ?? "https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg"}
                  alt={dealProduct.name}
                  className="deal-img"
                />
              </div>
              <div className="deal-info-col">
                <div className="deal-eyebrow">Deal of the Day</div>
                <h2 className="deal-title">
                  {dealProduct.name} <span>— {dealProduct.category.name}</span>
                </h2>
                <p className="deal-desc">{dealProduct.description ?? "Hand-picked, farm-fresh quality — delivered straight to your door."}</p>
                <div className="deal-price-row">
                  <span className="deal-price">{formatPrice(Number(dealProduct.price))} <small>/ {dealProduct.unit}</small></span>
                  <span className="deal-save">Save 20%</span>
                </div>
                <div style={{ marginTop:"1rem" }}>
                  <AddToCartButton productId={dealProduct.id} stock={dealProduct.stock} label="Add to Cart →" size="lg" />
                </div>
              </div>
              <DealTimer />
            </div>
          </div>
        </section>
      )}

      {/* ── Categories ── */}
      <section className="fm-section">
        <div className="container-xl">
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:"1.5rem" }}>
            <div>
              <div className="section-label">Browse</div>
              <h2 className="section-title">Shop by <span>Category</span></h2>
            </div>
            <Link href="/products" className="btn-ghost btn-sm">View all →</Link>
          </div>
          <div className="snap-row">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?categoryId=${cat.id}`}
                className="cat-card snap-item"
              >
                <div className="cat-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.imageUrl ?? "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg"}
                    alt={cat.name}
                  />
                </div>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="fm-section fm-section--tinted">
        <div className="container-xl">
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:"1.5rem" }}>
            <div>
              <div className="section-label">Handpicked</div>
              <h2 className="section-title">Featured <span>Products</span></h2>
            </div>
            <Link href="/products" className="btn-ghost btn-sm">See all →</Link>
          </div>
          <div className="psnap-row">
            {featured.map((p) => (
              <div key={p.id} className="psnap-card">
                <Link href={`/products/${p.id}`} className="psnap-img-link">
                  <div className="psnap-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.imageUrl ?? "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg"}
                      alt={p.name}
                    />
                  </div>
                  <span className="psnap-badge">{p.category.name}</span>
                </Link>
                <div className="psnap-body">
                  <Link href={`/products/${p.id}`} className="psnap-name">{p.name}</Link>
                  <div className="psnap-unit">per {p.unit}</div>
                  <div className="psnap-footer">
                    <span className="psnap-price">{formatPrice(Number(p.price))}</span>
                    {p.stock > 0 ? (
                      <AddToCartButton productId={p.id} stock={p.stock} iconOnly />
                    ) : (
                      <span className="badge-oos">Out of stock</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="fm-section">
        <div className="container-xl">
          <div style={{ textAlign:"center", marginBottom:"3rem" }}>
            <div className="section-label">Why FreshMart</div>
            <h2 className="section-title">Everything you need,<br /><span>nothing you don&apos;t</span></h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"1.25rem" }}>
            {[
              { icon:"🚜", title:"From the Farm", body:"We work directly with local farms — no middlemen, no cold-store markup. Just fresh." },
              { icon:"⚡", title:"Same-Day Delivery", body:"Order before noon, delivered by 6pm. Freshness isn't a promise, it's our process." },
              { icon:"🔒", title:"100% Secure", body:"Stripe-powered checkout, end-to-end encryption. Your data and money are always safe." },
              { icon:"↩️", title:"Freshness Promise", body:"Not happy? Full refund within 24 hours. No questions asked." },
            ].map((w) => (
              <div key={w.title} className="why-card">
                <div className="why-icon">{w.icon}</div>
                <h4 className="why-title">{w.title}</h4>
                <p className="why-body">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <div className="cta-bg" />
        <div className="cta-orb cta-orb--1" />
        <div className="cta-orb cta-orb--2" />
        <div className="cta-inner">
          <div className="cta-badge">Join 12,000+ customers</div>
          <h2 className="cta-title">Ready to eat fresh?</h2>
          <p className="cta-sub">Create a free account and get your first delivery in minutes. No subscriptions required.</p>
          <Link href="/register" className="hs-btn-primary" style={{ fontSize:".9rem", padding:".78rem 2rem" }}>
            Create Free Account →
          </Link>
        </div>
      </section>
    </div>
  );
}
