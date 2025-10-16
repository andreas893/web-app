import { useState } from "react";
import { doc, updateDoc  } from "firebase/firestore";
import { auth, db } from "../firebase";
import BackButton from "./BackButton";

const moods = [
  { name: "Glad", color: "#FFD633" },
  { name: "Vred", color: "#FF5C5C" },
  { name: "Trist", color: "#5C6373" },
  { name: "Chill", color: "#7ACBBE" },
  { name: "Energisk", color: "#FFB830" },
  { name: "Kreativ", color: "#A26BF2" },
  { name: "Forelsket", color: "#FF7F8C" },
  { name: "Fokuseret", color: "#2E4C8C" }
];

export default function StepGenre({ onNext, onPrev }) {
  const [selectedMoods, setSelectedMoods] = useState([]);

  function toggleMood(mood) {
    setSelectedMoods(prev => {
      if (prev.includes(mood)) {
        // fjern mood hvis den allerede er valgt
        return prev.filter(m => m !== mood);
      } 
      if (prev.length < 2) {
        // tilføj mood hvis der er plads
        return [...prev, mood];
      } 
      // hvis 2 allerede valgt → erstat den ældste
      return [prev[1], mood];
    });
  }


 async function handleContinue() {
    const user = auth.currentUser;
    if (!user) return;

    // 🔹 Gem valgene i Firebase
    const userDoc = doc(db, "users", user.uid);
     await updateDoc(userDoc, { moods: selectedMoods });

    // 🔹 Gå videre til næste step i onboarding
    if (onNext) onNext(selectedMoods);
  }

  return(
    <div className="mood-container">
      
      <div className="mood-heading">
        <h1>Hvilken stemning passer bedst til din musiksmag?</h1>
        <p>Er den rolig, kreativ, energisk eller lidt af det hele?</p>
      </div>

      <svg style={{ display: "none" }}>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  
                    0 1 0 0 0  
                    0 0 1 0 0  
                    0 0 0 18 -8"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>


      <div className="gooey-container">
        {moods.map((mood) => (
          <button
            key={mood.name}
            className={`blob ${selectedMoods.includes(mood.name) ? "selected" : ""}`}
            style={{ backgroundColor: mood.color }}
            onClick={() => toggleMood(mood.name)}
          >
            {mood.name}
          </button>
        ))}
      </div>

       <button
        className="next-btn"
        onClick={handleContinue}
        disabled={selectedMoods.length === 0}
      >
        Fortsæt
      </button>

         <BackButton onPrev={onPrev} /> 

    </div>
  );
}