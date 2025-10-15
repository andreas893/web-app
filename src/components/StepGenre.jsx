import { useState } from "react";

export default function StepGenre({ onNext }) {
  const allGenres = [
    "Pop", "Hip Hop", "Rap", "Rock", "Indie", "R&B", "Jazz", "Classical",
    "Electronic", "Metal", "Country", "Funk", "Soul", "House", "Techno",
    "Disco", "Folk", "Reggae", "K-Pop", "Afrobeat"
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);

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

  return (
    <div className="step step-genre">
      <h2>Hvilke genrer lytter du mest til?</h2>
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
        onClick={() => onNext(selected)}
        disabled={selected.length === 0}
      >
        Fortsæt
      </button>
    </div>
  );
}
