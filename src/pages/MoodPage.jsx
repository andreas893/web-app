import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, addDoc, collection, serverTimestamp, arrayUnion } from "firebase/firestore";
import { auth, db } from "../firebase";
import "../moodPage.css"

const moods = [
  { name: "Glad", color: "#FFD633" },
  { name: "Vred", color: "#FF5C5C" },
  { name: "Trist", color: "#5C6373" },
  { name: "Chill", color: "#7ACBBE" },
  { name: "Energisk", color: "#FFB830" },
  { name: "Kreativ", color: "#A26BF2" },
  { name: "Forelsket", color: "#FF7F8C" },
  { name: "Fokuseret", color: "#2E4C8C" },
];

export default function StepGenre() {
  const [selectedMood, setSelectedMood] = useState(null);
  const navigate = useNavigate();

   // Brugeren kan kun vælge ét mood
  function toggleMood(mood) {
    setSelectedMood((prev) => (prev === mood ? null : mood));
  }

  async function handleContinue() {
    const user = auth.currentUser;
    if (!user) return alert("Du skal være logget ind for at fortsætte!");

    try {
      // 🔹 1. Opret playlisten i Firestore
      const newPlaylist = {
        userId: user.uid,
        user: user.displayName || user.email.split("@")[0],
        name: `${selectedMood} Moodlist`,
        mood: selectedMood,
        type: "mood",
        imgUrl: "/img/mood-cover.jpg",
        songs: [
          { id: 1, title: "Evening Reflections", artist: "Soft Haze", duration: "3:42" },
          { id: 2, title: "Waves of Calm", artist: "Lucid Dreams", duration: "4:10" },
          { id: 3, title: "Slow Motion", artist: "Cloud Tapes", duration: "3:59" },
          { id: 4, title: "Drift Apart", artist: "Numa", duration: "3:37" },
          { id: 5, title: "Still Water", artist: "Eclipse Flow", duration: "2:58" },
        ],
        timestamp: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "playlists"), newPlaylist);

      // 🔹 2. Gem i brugerens library
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        playlists: arrayUnion({
          id: docRef.id,
          name: newPlaylist.name,
          user: newPlaylist.user,
          imgUrl: newPlaylist.imgUrl,
          mood: newPlaylist.mood,
          type: newPlaylist.type,
        }),
      });

      // 🔹 3. Navigér til playlistens side
      navigate(`/playlist/${docRef.id}`, { state: { origin: "created" } });
    } catch (err) {
      console.error("Fejl ved oprettelse af moodlist:", err);
      alert("Der opstod en fejl — prøv igen.");
    }
  }

  function handleBack() {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  }

  return (
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
            className={`blob ${selectedMood === mood.name ? "selected" : ""}`}
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
        disabled={!selectedMood}
      >
        Opret Moodlist
      </button>

     <button className="back-btn" onClick={handleBack}>
        Annullér
     </button>
    </div>
  );
}
