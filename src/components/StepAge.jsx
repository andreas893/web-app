import { useState,useRef,useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import gsap from "gsap";
import BackButton from "./BackButton";

export default function StepAge({ onNext,onPrev }) {
  const [selected, setSelected] = useState("");
  const [status, setStatus] = useState("");
  const oldRef = useRef(null);
  const newRef = useRef(null);
  

   useEffect(() => {
    if (selected === "old" && oldRef.current) {
      gsap.fromTo(
        oldRef.current,
        { scale: 1, boxShadow: "0 0 0px rgba(155,92,255,0)" },
        {
          scale: 1.05,
          boxShadow: "0 0 30px rgba(155,92,255,0.4)",
          duration: 0.4,
          ease: "power2.out",
        }
      );
    } else if (selected === "new" && newRef.current) {
      gsap.fromTo(
        newRef.current,
        { scale: 1, boxShadow: "0 0 0px rgba(155,92,255,0)" },
        {
          scale: 1.05,
          boxShadow: "0 0 30px rgba(155,92,255,0.4)",
          duration: 0.4,
          ease: "power2.out",
        }
      );
    }
  }, [selected]);


   async function handleContinue() {
    const user = auth.currentUser;
    if (!user || !selected) return;

    try {
      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, { eraPreference: selected });
      setStatus("Dit valg er gemt 🎵");
    } catch (err) {
      console.error("Fejl ved gemning af æra:", err);
      setStatus("Noget gik galt. Prøv igen.");
    }

    if (onNext) onNext(selected);
  }

  return (
      <div className="step step-era">
      <h1>Nyt eller nostalgisk?</h1>
      <p>
        Er du mest til nye hits eller gamle klassikere?
      </p>
      <p className="p-small">Vælg hvad du oftest vender tilbage til, når du lytter.</p>

      <div className="choice-container">
        <button
          className={`choice ${selected === "old" ? "active" : ""}`}
          onClick={() => setSelected("old")}>
          <h3>Klassisk & nostalgisk</h3>
          <p>Du elsker de tidløse favoritter og retro vibes.</p>
        </button>

        <button
          className={`choice ${selected === "new" ? "active" : ""}`}
          onClick={() => setSelected("new")}>
          <h3>Nyt & moderne</h3>
          <p>Du er altid på jagt efter de nyeste hits og trends.</p>
        </button>
      </div>

      <button
        className="next-btn"
        onClick={handleContinue}
        disabled={!selected}>
        Fortsæt
      </button>

       <BackButton onPrev={onPrev} /> 

      {status && <p className="status-text">{status}</p>}
    </div>
  
  )
}

