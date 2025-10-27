import { useEffect, useRef } from "react";
import { LogOut, UserCog, Trash2, Palette } from "lucide-react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import "../profile.css";


export default function ProfileOptionsPopup({onClose, onEdit}) {
    const user = auth.currentUser;
    const overlayRef = useRef(null);
    const startY = useRef(0);
    const deltaY = useRef(0);
        
    
    async function handleLogout() {
    await signOut(auth);
    window.location.href = "/"; // redirect til login eller landing
  }

  async function handleDelete() {
    const confirm = window.confirm("Er du sikker på, at du vil slette din konto?");
    if (!confirm) return;
    await deleteDoc(doc(db, "users", user.uid));
    await user.delete();
    window.location.href = "/";
  }


  // luk ved klik udenfor
  useEffect(() => {
    function handleClickOutside(e) {
      if (overlayRef.current && e.target === overlayRef.current) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

    // luk ved drag ned
  function handleTouchStart(e) {
    startY.current = e.touches[0].clientY;
  }

   function handleTouchMove(e) {
    deltaY.current = e.touches[0].clientY - startY.current;
  }

   function handleTouchEnd() {
    if (deltaY.current > 100) onClose(); // 100px swipe threshold
  }


    return (
    <div
      className="popup-overlay"
      ref={overlayRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="popup-container">
        {/* Redigér profil */}
        <button className="popup-item" onClick={onEdit}>
          <div className="popup-icon">
            <UserCog size={26} />
          </div>
          <div className="popup-text">
            <h3>Redigér profil</h3>
            <p>Ændr dit navn, coverbillede eller bio</p>
          </div>
        </button>

        {/* Tema */}
        <button className="popup-item">
          <div className="popup-icon">
            <Palette size={26} />
          </div>
          <div className="popup-text">
            <h3>Tilpas tema</h3>
            <p>Vælg dit tema</p>
          </div>
        </button>

        {/* Log ud */}
        <button className="popup-item" onClick={handleLogout}>
          <div className="popup-icon">
            <LogOut size={26} />
          </div>
          <div className="popup-text">
            <h3>Log ud</h3>
            <p>Afslut din session</p>
          </div>
        </button>

        {/* Slet konto */}
        <button className="popup-item" onClick={handleDelete}>
          <div className="popup-icon">
            <Trash2 size={26} />
          </div>
          <div className="popup-text">
            <h3>Slet konto</h3>
            <p>Slet din konto permanent</p>
          </div>
        </button>

        {/* Annuller */}
        <button className="popup-cancel" onClick={onClose}>
          Annuller
        </button>
      </div>
    </div>
  );
};