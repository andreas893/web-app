import { useState,useRef,useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import gsap from "gsap";
import BackButton from "./BackButton";

export default function StepDiscover({ onNext, onPrev }) {
  const [selected, setSelected] = useState("");
  const [status, setStatus] = useState("");
  const newRef = useRef(null);
  const favRef = useRef(null);

  useEffect(() => {
    if (selected === "discover" && newRef.current) {
      gsap.fromTo(
        newRef.current,
        { scale: 1, boxShadow: "0 0 0 rgba(155,92,255,0)" },
        {
          scale: 1.05,
          boxShadow: "0 0 25px rgba(155,92,255,0.4)",
          duration: 0.4,
          ease: "power2.out",
        }
      );
    } else if (selected === "favorites" && favRef.current) {
      gsap.fromTo(
        favRef.current,
        { scale: 1, boxShadow: "0 0 0 rgba(155,92,255,0)" },
        {
          scale: 1.05,
          boxShadow: "0 0 25px rgba(155,92,255,0.4)",
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
      await updateDoc(userDoc, { discoveryPreference: selected });
      setStatus("Dit valg er gemt 🎵");
    } catch (err) {
      console.error("Fejl ved gemning af æra:", err);
      setStatus("Noget gik galt. Prøv igen.");
    }

    if (onNext) onNext(selected);
  }

  return (
    <div className="discover-page">
      <h1>Er du typen, der konstant opdager nyt musik - eller lytter du helst til det du kender</h1>
      
       <div className="choice-container-discover">
        <button
          className={`choice-1 ${selected === "discover" ? "active" : ""}`}
          onClick={() => setSelected("discover")}>
          <h3>Nyt Musik</h3>
        </button>

        <button
          className={`choice-2 ${selected === "favorites" ? "active" : ""}`}
          onClick={() => setSelected("favorites")}>
          <h3>Mine Favoritter</h3>
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

