import { motion, AnimatePresence } from "framer-motion";
import { UserCog, Palette, LogOut, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import "../profile.css";

export default function ProfileOptionsPopup({ onClose, onEdit }) {
  // 🔒 Lås scroll bag popup
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = original);
  }, []);

  async function handleLogout() {
    await signOut(auth);
    window.location.href = "/";
  }

  async function handleDelete() {
    const confirm = window.confirm("Er du sikker på, at du vil slette din konto?");
    if (!confirm) return;
    await deleteDoc(doc(db, "users", auth.currentUser.uid));
    await auth.currentUser.delete();
    window.location.href = "/";
  }

  return (
    <AnimatePresence>
      <motion.div
        className="popup-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.3}
          dragMomentum={false}
          onDragEnd={(e, info) => {
            // hvis brugeren trækker mere end 120px ned, luk popup'en
            if (info.offset.y > 120) {
              onClose();
            }
          }}
          className="popup-container"
          onClick={(e) => e.stopPropagation()}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
        >
          {/* lille drag-handle */}
          <div className="popup-handle"></div>

          <button className="popup-item" onClick={onEdit}>
            <div className="popup-icon">
              <UserCog size={22} />
            </div>
            <div className="popup-text">
              <h3>Redigér profil</h3>
              <p>Ændr dit navn, bio eller cover-billede</p>
            </div>
          </button>

          <button className="popup-item">
            <div className="popup-icon">
              <Palette size={22} />
            </div>
            <div className="popup-text">
              <h3>Tilpas tema</h3>
              <p>Vælg dit farvetema</p>
            </div>
          </button>

          <button className="popup-item" onClick={handleLogout}>
            <div className="popup-icon">
              <LogOut size={22} />
            </div>
            <div className="popup-text">
              <h3>Log ud</h3>
              <p>Afslut din session</p>
            </div>
          </button>

          <button className="popup-item" onClick={handleDelete}>
            <div className="popup-icon">
              <Trash2 size={22} />
            </div>
            <div className="popup-text">
              <h3>Slet konto</h3>
              <p>Slet din konto permanent</p>
            </div>
          </button>

          <button className="popup-cancel" onClick={onClose}>
            Annuller
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
