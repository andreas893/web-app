import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function StepSummary({ onNext }) {
  const [showSecond, setShowSecond] = useState(false);
  const firstRef = useRef(null);
  const secondRef = useRef(null);

  // 🔹 Start animationen når komponenten vises
  useEffect(() => {
    // Første tekst fader ind
    gsap.fromTo(firstRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1 });

    // Efter 5 sekunder: fade ud, skift tekst
    const timeout = setTimeout(() => {
      gsap.to(firstRef.current, {
        opacity: 0,
        y: -20,
        duration: 1,
        onComplete: () => setShowSecond(true),
      });
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  // 🔹 Når anden tekst bliver vist – fade den ind
  useEffect(() => {
    if (showSecond && secondRef.current) {
      gsap.fromTo(secondRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1 });
    }
  }, [showSecond]);

  return (
    <div className="summary-page">
      {/* Første del af animationen */}
      {!showSecond && (
        <div ref={firstRef} className="summary-text-1">
          <h1>Tak for at joine os!</h1>
          <p className="p-first">Vi glæder os til at lære din musiksmag endnu bedre at kende.</p>
          <p>Din første playliste er snart klar.</p>
        </div>
      )}

      {/* Anden del med “kom i gang”-knap */}
      {showSecond && (
        <div ref={secondRef} className="summary-text-2">
          <h1>Vælg dit humør, vi finder musikken</h1>
          <button className="next-btn" onClick={onNext}>
            Kom i gang!
          </button>
          <div className="arrow-down">↓</div>
        </div>
      )}
    </div>
  );
}
