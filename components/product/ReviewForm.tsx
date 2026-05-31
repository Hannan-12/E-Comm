"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewForm({ productId }: { productId: number }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) { setError("Please select a rating"); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, comment }),
    });
    setLoading(false);
    if (!res.ok) { const d = await res.json(); setError(d.error || "Failed to submit"); return; }
    router.refresh();
  }

  return (
    <div className="review-form-card">
      <h4 className="review-form-title">Write a Review</h4>
      {error && <p style={{ color:"var(--danger)", fontSize:".8125rem", marginBottom:".75rem" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="star-picker">
          {[1,2,3,4,5].map((s) => (
            <span
              key={s}
              className={`star-pick ${s <= (hover || rating) ? "star-pick-on" : ""}`}
              onClick={() => setRating(s)}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
            >★</span>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="review-textarea"
          placeholder="Share your thoughts about this product…"
          rows={3}
          maxLength={1000}
        />
        <button type="submit" disabled={loading || !rating} className="btn-primary btn-sm review-submit-btn">
          {loading ? "Posting…" : "Post Review"}
        </button>
      </form>
    </div>
  );
}
