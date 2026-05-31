"use client";

import { useEffect, useRef, useState } from "react";

const slides = [
  {
    cls: "hs-slide--green",
    eyebrow: "✦ Premium Grocery Delivery",
    titleHtml: "Farm Fresh.<br>Delivered<br><em>to Your Door.</em>",
    subtitle: "Hand-picked produce, artisan dairy, and premium meats — sourced from trusted local farms and delivered same day.",
    btn: "Shop Now",
    btnHref: "/products",
    stats: [{ n:"500+", l:"Fresh Products" }, { n:"12k+", l:"Happy Customers" }, { n:"Same Day", l:"Delivery" }],
    mockupImg: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?w=500&h=400&fit=crop",
    mockupTag: "🌿 Today's Top Picks",
    mockupItems: [
      { img:"https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?w=56&h=56&fit=crop", name:"Organic Apples", unit:"per kg", price:"$2.99" },
      { img:"https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?w=56&h=56&fit=crop", name:"Fresh Bananas", unit:"per bunch", price:"$1.49" },
      { img:"https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?w=56&h=56&fit=crop", name:"Cherry Tomatoes", unit:"per punnet", price:"$2.29" },
    ],
    mockupFooter: "🚚 Free delivery over $50",
    mockupBadge: "In Stock",
  },
  {
    cls: "hs-slide--teal",
    eyebrow: "🥛 Dairy & Organic",
    titleHtml: "Pure. Fresh.<br><em>Organic Dairy.</em>",
    subtitle: "From grass-fed cows to your table — pasteurised, chilled, and delivered fresh every morning.",
    btn: "Shop Dairy",
    btnHref: "/products",
    stats: [{ n:"100%", l:"Organic" }, { n:"6am", l:"Fresh Delivery" }, { n:"Cold Chain", l:"Guaranteed" }],
    mockupImg: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?w=500&h=400&fit=crop",
    mockupTag: "🥛 Fresh Dairy Range",
    mockupItems: [
      { img:"https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?w=56&h=56&fit=crop", name:"Whole Milk", unit:"per litre", price:"$1.89" },
      { img:"https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?w=56&h=56&fit=crop", name:"Free-Range Eggs", unit:"12 pack", price:"$3.99" },
      { img:"https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?w=56&h=56&fit=crop", name:"Cheddar Cheese", unit:"250g", price:"$4.49" },
    ],
    mockupFooter: "❄️ Cold chain guaranteed",
    mockupBadge: "Fresh Today",
  },
  {
    cls: "hs-slide--amber",
    eyebrow: "🍞 Fresh Bakery",
    titleHtml: "Baked Fresh.<br><em>Every Morning.</em>",
    subtitle: "Artisan sourdoughs, wholegrain loaves, and sweet pastries — baked at dawn and at your door by breakfast.",
    btn: "Shop Bakery",
    btnHref: "/products",
    stats: [{ n:"4am", l:"Baked Daily" }, { n:"No", l:"Preservatives" }, { n:"20+", l:"Varieties" }],
    mockupImg: "https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg?w=500&h=400&fit=crop",
    mockupTag: "🍞 Baked This Morning",
    mockupItems: [
      { img:"https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?w=56&h=56&fit=crop", name:"Sourdough Loaf", unit:"per loaf", price:"$3.99" },
      { img:"https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?w=56&h=56&fit=crop", name:"Croissants", unit:"4 pack", price:"$2.49" },
      { img:"https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg?w=56&h=56&fit=crop", name:"Blueberry Muffins", unit:"4 pack", price:"$3.99" },
    ],
    mockupFooter: "⏰ Baked fresh at 4am",
    mockupBadge: "No Preservatives",
  },
];

export default function HeroSlider() {
  const [cur, setCur] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function goTo(idx: number) {
    setCur((idx + slides.length) % slides.length);
  }

  useEffect(() => {
    timerRef.current = setInterval(() => setCur((c) => (c + 1) % slides.length), 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  function resetTimer(idx: number) {
    if (timerRef.current) clearInterval(timerRef.current);
    goTo(idx);
    timerRef.current = setInterval(() => setCur((c) => (c + 1) % slides.length), 5000);
  }

  return (
    <section className="hero-slider" style={{ background:"#14532d" }}>
      <div className="hs-track" style={{ transform:`translateX(-${cur * 100}%)` }}>
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`hs-slide ${slide.cls}${cur === idx ? " hs-active" : ""}`}
            style={{ flex:"0 0 100%", width:"100%", minWidth:"100%" }}
          >
            <div className="hs-noise" />
            <div className="hs-inner container-xl">
              <div className="hs-content">
                <div className="hs-eyebrow">{slide.eyebrow}</div>
                <h1
                  className="hs-title"
                  style={{ transitionDelay:".08s" }}
                  dangerouslySetInnerHTML={{ __html: slide.titleHtml }}
                />
                <p className="hs-subtitle" style={{ transitionDelay:".16s" }}>
                  {slide.subtitle}
                </p>
                <div className="hs-actions" style={{ transitionDelay:".24s" }}>
                  <a href={slide.btnHref} className="hs-btn-primary">
                    {slide.btn}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                  <a href="/register" className="hs-btn-ghost">Join Free</a>
                </div>
              </div>

              <div className="hs-visual" style={{ transitionDelay:".1s" }}>
                <div className="hs-mockup">
                  <div className="hs-mockup-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={slide.mockupImg} alt="Fresh products" />
                  </div>
                  <div className="hs-mockup-body">
                    <div className="hs-mockup-tag">{slide.mockupTag}</div>
                    <div className="hs-mockup-items">
                      {slide.mockupItems.map((item, i) => (
                        <div key={i} className="hs-mockup-item">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.img} alt={item.name} />
                          <div className="hs-mockup-item-info">
                            <span>{item.name}</span>
                            <small>{item.unit}</small>
                          </div>
                          <span className="hs-mockup-price">{item.price}</span>
                        </div>
                      ))}
                    </div>
                    <div className="hs-mockup-footer">
                      <span>{slide.mockupFooter}</span>
                      <span className="hs-mockup-badge">{slide.mockupBadge}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hs-stats-bar">
              <div className="container-xl">
                <div className="hs-stats">
                  {slide.stats.map((s, i) => (
                    <div key={i} style={{ display:"contents" }}>
                      {i > 0 && <div className="hs-stat-div" />}
                      <div className="hs-stat">
                        <span className="hs-stat-n">{s.n}</span>
                        <span className="hs-stat-l">{s.l}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="hs-arrow hs-arrow--prev" onClick={() => resetTimer(cur - 1)} aria-label="Previous">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      </button>
      <button className="hs-arrow hs-arrow--next" onClick={() => resetTimer(cur + 1)} aria-label="Next">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>

      <div className="hs-dots">
        {slides.map((_, i) => (
          <button key={i} className={`hs-dot${cur === i ? " active" : ""}`} onClick={() => resetTimer(i)} />
        ))}
      </div>
    </section>
  );
}
