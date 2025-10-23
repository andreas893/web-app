import { useState, useRef } from "react";
import { X, ImagePlus } from "lucide-react";
import "../library.css"

export default function CreatePlaylistDetailsPopup({ onClose, onConfirm }) {
  const [name, setName] = useState("");
  const [cover, setCover] = useState(null);
  const fileInputRef = useRef();

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCover(reader.result);
      reader.readAsDataURL(file);
    }
  }

  function handleSubmit() {
    if (!name.trim()) return alert("Indtast et navn til din playliste");
    onConfirm({ name, cover }); // sender data tilbage til parent
  }

  return (
    <div className="popup-overlay details-overlay">
      <div className="popup-container details-container">
        <button className="close-btn" onClick={onClose}><X /></button>
        
        <div className="cover-picker">
          {cover ? (
            <img src={cover} alt="Preview" className="cover-preview" />
          ) : (
            <div className="cover-placeholder" onClick={() => fileInputRef.current.click()}>
              <ImagePlus size={100} />
              <p>Vælg selv et billede</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>
        
        
        <h2>Giv din playliste et navn</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Min playliste"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>


        <button className="confirm-btn" onClick={handleSubmit}>Opret</button>
      </div>
    </div>
  );
}
