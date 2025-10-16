import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore"; 
import { auth, db } from "../firebase";
import BackButton from "./BackButton";

export default function StepGenre({ onNext, onPrev }) {
  const allGenres = [
    "Pop", "Hip Hop", "Rap", "Rock", "Indie", "R&B", "Jazz", "Classical",
    "Electronic", "Metal", "Country", "Funk", "Soul", "House", "Techno",
    "Disco", "Folk", "Reggae", "K-Pop", "Afrobeat"
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);
    const [status, setStatus] = useState("");

  const filteredGenres = allGenres.filter(
    g => g.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selected.includes(g)
  );

  const toggleGenre = (genre) => {
    if (selected.includes(genre)) {
      setSelected(selected.filter(g => g !== genre));
    } else if (selected.length < 5) {
      setSelected([...selected, genre]);
      setSearchTerm(""); // ryd søgefeltet
    }
  };

  const removeGenre = (genre) => {
    setSelected(selected.filter(g => g !== genre));
  };

   async function handleContinue() {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, {genres: selected });
      setStatus("Dine genrer er gemt 🎶");
    } catch (error) {
      console.error("Fejl ved gemning af genrer:", error);
      setStatus("Der opstod en fejl. Prøv igen.");
    }

    // Gå videre til næste step
    if (onNext) onNext(selected);
  }

  return (
    <div className="step step-genre">
      <h1>Hvilke genrer lytter du mest til?</h1>
      <p>Vælg de 5 genrer du aldrig bliver træt af</p>

      {/* Søgefelt med chips */}
      <div className="multi-select">
        <div className="chips-container">
          {selected.map((genre) => (
            <div key={genre} className="chip">
              {genre}
              <button onClick={() => removeGenre(genre)}>×</button>
            </div>
          ))}
          <input
            type="text"
            placeholder={selected.length ? "" : "Søg eller vælg genre..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={selected.length >= 5}
          />
        </div>

        {/* Dropdown-liste */}
        {searchTerm && filteredGenres.length > 0 && (
          <div className="dropdown">
            {filteredGenres.map((genre) => (
              <div
                key={genre}
                className="dropdown-item"
                onClick={() => toggleGenre(genre)}
              >
                {genre}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        className="next-btn"
        onClick={handleContinue}
        disabled={selected.length === 0}
      >
        Fortsæt
      </button>

        <BackButton onPrev={onPrev} /> 

        {status && <p className="status-text">{status}</p>}
    </div>
  );
}
