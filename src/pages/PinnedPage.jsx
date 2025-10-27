import { useState, useEffect } from "react";
import { ArrowLeft, MinusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, onSnapshot, updateDoc, arrayRemove } from "firebase/firestore";
import FooterNav from "../components/FooterNav";
import "../profile.css";


export default function PinnedPage() {
    const navigate = useNavigate();
    const [pins, setPins] = useState([]);
    const user = auth.currentUser;


     // Hent pinned fra Firestore
    useEffect(() => {
        if (!user) return;
        const userRef = doc(db, "users", user.uid);
        const unsub = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
            const data = snap.data();
            setPins(data.pinned || []);
        }
        });
        return () => unsub();
    }, [user]);


    // Fjern et pinned element
  const handleRemovePin = async (pin) => {
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        pinned: arrayRemove(pin),
      });
    } catch (err) {
      console.error("Fejl ved fjernelse af pin:", err);
    }
  };

   // Gem ændringer (her kan du evt. tilføje feedback)
  const handleSave = () => {
    navigate("/profile")
  };


    return(
        <div className="pinned-page">
           <div className="pinned-header">
                <div className="pin-arrow">
                    <ArrowLeft className="back-arrow" onClick={() => navigate(-1)} />
                </div>
                
                <div className="pin-text">
                    <h1 className="pinned-title">Pinned</h1>
                    <p className="pinned-subtitle">
                        Vælg de albums eller playlister, der repræsenterer dig bedst.
                    </p>
                </div>
                
            </div>

            <div className="pins-section">
                <h2>Dine pinned ({pins.length}/4)</h2>

                {pins.length === 0 ? (
                <p className="no-pins-text">Du har ingen pins endnu!</p>
                ) : (
                <div className="active-pins-grid">
                    {pins.map((pin, index) => (
                        <div key={index} className="pin-card">
                            <img src={pin.imgUrl} alt={pin.name} />
                            <button
                            className="remove-pin-btn"
                            onClick={() => handleRemovePin(pin)}
                            >
                            <MinusCircle />
                            </button>
                        </div>
                    ))}
                </div>
                )}

                {pins.length > 0 && (
                <div className="save-btn">
                    <button onClick={handleSave}>Færdig</button>
                </div>
                )}
            </div>
            
            <FooterNav />
        </div>
    );
};