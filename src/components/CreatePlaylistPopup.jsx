import { useEffect, useRef } from "react";
import { Music, Sparkles, Users } from "lucide-react";

export default function CreatePlaylistPopup({ onClose, onNavigate }) {
  const popupRef = useRef(null);

  // Luk ved klik udenfor
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="popup-overlay">
      <div ref={popupRef} className="popup-container">
        <button
          className="popup-item"
          onClick={() => onNavigate("/create-playlist")}
        >
          <div className="popup-icon">
            <Music size={25} />
          </div>
          <div className="popup-text">
            <h3>Playliste</h3>
            <p>Opret en playliste med sange du selv tilføjer</p>
          </div>
        </button>

        <button
          className="popup-item"
          onClick={() => onNavigate("/moodlist")}
        >
          <div className="popup-icon">
            <Sparkles size={25} />
          </div>
          <div className="popup-text">
            <h3>Moodlist</h3>
            <p>Opret en playliste ud fra dit humør</p>
          </div>
        </button>

        <button
          className="popup-item"
          onClick={() => onNavigate("/shared-playlist")}
        >
          <div className="popup-icon">
            <Users size={25} />
          </div>
          <div className="popup-text">
            <h3>Fælles playliste</h3>
            <p>Opret en playliste sammen med dine venner</p>
          </div>
        </button>

        <button className="popup-cancel" onClick={onClose}>
          Annuller
        </button>
      </div>
    </div>
  );
}
