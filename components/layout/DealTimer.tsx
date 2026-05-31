"use client";

import { useEffect, useState } from "react";

function getTarget() {
  const t = new Date();
  t.setHours(23, 59, 59, 999);
  return t.getTime();
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function DealTimer() {
  const [h, setH] = useState("--");
  const [m, setM] = useState("--");
  const [s, setS] = useState("--");

  useEffect(() => {
    let target = getTarget();
    function tick() {
      const diff = Math.max(0, target - Date.now());
      if (diff === 0) target = getTarget();
      setH(pad(Math.floor(diff / 3600000)));
      setM(pad(Math.floor((diff % 3600000) / 60000)));
      setS(pad(Math.floor((diff % 60000) / 1000)));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="deal-timer-col">
      <div className="deal-timer-label">Offer ends in</div>
      <div className="deal-clock">
        <div className="deal-unit">
          <span className="deal-num">{h}</span>
          <span className="deal-unit-label">Hours</span>
        </div>
        <span className="deal-colon">:</span>
        <div className="deal-unit">
          <span className="deal-num">{m}</span>
          <span className="deal-unit-label">Mins</span>
        </div>
        <span className="deal-colon">:</span>
        <div className="deal-unit">
          <span className="deal-num">{s}</span>
          <span className="deal-unit-label">Secs</span>
        </div>
      </div>
      <div className="deal-stock-bar">
        <div className="deal-stock-fill" style={{ width:"68%" }} />
      </div>
      <div className="deal-stock-label">🔥 68% claimed — only 32 left!</div>
    </div>
  );
}
