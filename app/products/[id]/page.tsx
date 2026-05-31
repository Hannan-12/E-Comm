import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { getSession } from "@/lib/session";
import AddToCartButton from "@/components/product/AddToCartButton";
import ReviewForm from "@/components/product/ReviewForm";
import QtyAddToCart from "@/components/product/QtyAddToCart";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();

  const product = await prisma.product.findUnique({
    where: { id: Number(id), isActive: true },
    include: { category: true },
  });
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    prisma.review.findMany({
      where: { productId: product.id },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { categoryId: product.categoryId, id: { not: product.id }, isActive: true },
      take: 4,
    }),
  ]);

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const userHasReviewed = session?.user?.id ? reviews.some((r) => r.userId === session.user!.id) : false;

  return (
    <div className="container-xl" style={{ padding:"2.5rem 1.5rem" }}>

      {/* Breadcrumb */}
      <nav style={{ marginBottom:"1.5rem" }}>
        <ol style={{ display:"flex", alignItems:"center", gap:".5rem", listStyle:"none", margin:0, padding:0, fontSize:".8rem", color:"var(--subtle)" }}>
          <li><Link href="/" style={{ color:"var(--brand)" }}>Home</Link></li>
          <li style={{ opacity:.4 }}>/</li>
          <li><Link href="/products" style={{ color:"var(--brand)" }}>Shop</Link></li>
          <li style={{ opacity:.4 }}>/</li>
          <li><Link href={`/products?categoryId=${product.categoryId}`} style={{ color:"var(--brand)" }}>{product.category.name}</Link></li>
          <li style={{ opacity:.4 }}>/</li>
          <li style={{ color:"var(--subtle)" }}>{product.name}</li>
        </ol>
      </nav>

      {/* Main detail card */}
      <div className="detail-card">
        <div className="detail-card-grid">

          {/* Image panel */}
          <div className="detail-img-panel">
            <div className="detail-img-main">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.imageUrl ?? "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg"} alt={product.name} id="mainImg" />
              {product.stock > 0 && <span className="detail-freshbadge">✓ Fresh Today</span>}
            </div>
            <div className="detail-thumbs">
              <div className="detail-thumb active">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.imageUrl ?? "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg"} alt={product.name} />
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div className="detail-info-panel">
            <span className="product-badge" style={{ marginBottom:".5rem", display:"inline-block" }}>{product.category.name}</span>
            <h1 className="detail-title">{product.name}</h1>
            <p className="detail-unit">Per {product.unit}</p>

            <div className="detail-price-row">
              <span className="detail-price">{formatPrice(Number(product.price))}</span>
              {product.stock > 0 ? (
                <span className="stock-ok">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  In Stock
                </span>
              ) : (
                <span className="stock-out">Out of Stock</span>
              )}
            </div>

            {product.description && <p className="detail-desc">{product.description}</p>}

            {product.stock > 0 && (
              <>
                <QtyAddToCart productId={product.id} stock={product.stock} />
                <p className="detail-stock-note">{product.stock} units left in stock</p>
              </>
            )}

            <div className="detail-perks">
              <div className="detail-perk">
                <span className="detail-perk-icon">🚚</span>
                <div><strong>Free Delivery</strong><small>On orders over $50</small></div>
              </div>
              <div className="detail-perk">
                <span className="detail-perk-icon">🌿</span>
                <div><strong>100% Fresh</strong><small>Freshness guaranteed</small></div>
              </div>
              <div className="detail-perk">
                <span className="detail-perk-icon">↩️</span>
                <div><strong>Easy Returns</strong><small>Hassle-free policy</small></div>
              </div>
            </div>

            <Link href={`/products?categoryId=${product.categoryId}`} className="btn-ghost btn-sm" style={{ marginTop:"1.5rem", display:"inline-flex" }}>
              ← Back to {product.category.name}
            </Link>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="reviews-section">
        <div className="reviews-header">
          <div>
            <h2 className="reviews-title">Customer Reviews</h2>
            {reviews.length > 0 && (
              <div className="reviews-summary">
                <div className="reviews-avg">{avg.toFixed(1)}</div>
                <div>
                  <div className="star-row">
                    {[1,2,3,4,5].map((s) => (
                      <span key={s} className={`star ${s <= Math.round(avg) ? "star-on" : "star-off"}`}>★</span>
                    ))}
                  </div>
                  <div className="reviews-count">Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {session ? (
          userHasReviewed ? (
            <div className="review-already">✓ You&apos;ve already reviewed this product.</div>
          ) : (
            <ReviewForm productId={product.id} />
          )
        ) : (
          <div className="review-login-prompt">
            <Link href="/login">Sign in</Link> to leave a review.
          </div>
        )}

        {reviews.length > 0 ? (
          <div className="review-list">
            {reviews.map((rv) => (
              <div key={rv.id} className="review-card">
                <div className="review-card-top">
                  <div className="review-avatar">{(rv.user.fullName?.[0] ?? rv.user.email[0]).toUpperCase()}</div>
                  <div className="review-meta">
                    <span className="review-name">{rv.user.fullName ?? rv.user.email}</span>
                    <span className="review-date">{formatDate(rv.createdAt)}</span>
                  </div>
                  <div className="star-row" style={{ marginLeft:"auto" }}>
                    {[1,2,3,4,5].map((s) => (
                      <span key={s} className={`star ${s <= rv.rating ? "star-on" : "star-off"}`}>★</span>
                    ))}
                  </div>
                </div>
                {rv.comment && <p className="review-comment">{rv.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="review-empty">No reviews yet. Be the first to review this product!</div>
        )}
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="related-section">
          <h2 className="related-title">More from <span style={{ color:"var(--brand)" }}>{product.category.name}</span></h2>
          <div className="related-grid">
            {related.map((r) => (
              <div key={r.id} className="product-card">
                <Link href={`/products/${r.id}`} style={{ display:"block", textDecoration:"none" }}>
                  <div className="product-img-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.imageUrl ?? "https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg"} alt={r.name} />
                  </div>
                </Link>
                <div className="product-body">
                  <span className="product-badge">{product.category.name}</span>
                  <Link href={`/products/${r.id}`} className="product-name">{r.name}</Link>
                  <div className="product-unit">per {r.unit}</div>
                  <div className="product-footer">
                    <span className="product-price">{formatPrice(Number(r.price))}</span>
                    {r.stock > 0 ? <AddToCartButton productId={r.id} stock={r.stock} size="sm" /> : <span className="badge-oos">Out of stock</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
