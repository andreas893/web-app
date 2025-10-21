import { useState, useEffect, useRef } from "react";
import { Music, Sparkles, Users, Pin, Share2, Trash2, PinOff, AlertTriangle, Plus } from "lucide-react";
import { updateDoc, doc, arrayUnion, arrayRemove, getDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function CreatePlaylistPopup({ type = "create", onClose, onNavigate, playlist, onShare, context="playlist", song }) {
  const popupRef = useRef(null);
  const [isPinned, setIsPinned] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);


  const dummyFriends = [
  { id: "1", name: "Andreas", avatar: "/img/andreas.jpg" },
  { id: "2", name: "Mathias", avatar: "/img/mathias.jpg" },
  { id: "3", name: "Sofie", avatar: "/img/sofie.jpg" },
];

  // tjek om playliste/sang er pinned
  useEffect(() => {
  const checkPinned = async () => {
    const user = auth.currentUser;
    if (!user || !playlist) return;
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const pinned = snap.data().pinned || [];
      setIsPinned(pinned.includes(playlist.id));
    }
  };
  checkPinned();
}, [playlist]);

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

  // Gemmer pinned i databasen
  const togglePin = async () => {
  const user = auth.currentUser;
  if (!user || !playlist) return;

  try {
    const userRef = doc(db, "users", user.uid);

    if (isPinned) {
      await updateDoc(userRef, {
        pinned: arrayRemove(playlist.id),
      });
      console.log("📌 Fjernet pin:", playlist.name);
      setIsPinned(false);
    } else {
      await updateDoc(userRef, {
        pinned: arrayUnion(playlist.id),
      });
      console.log("📌 Tilføjet pin:", playlist.name);
      setIsPinned(true);
    }

    onClose();
  } catch (err) {
    console.error("Fejl ved toggle pin:", err);
  }
  };


  // Delete funktion
const handleDelete = async () => {
  const user = auth.currentUser;
  if (!user || !playlist) return;

  if (playlist.userId !== user.uid) {
    alert("Du kan kun slette dine egne playlister.");
    return;
  }

  try {
    await deleteDoc(doc(db, "playlists", playlist.id));

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      playlists: arrayRemove(playlist.id),
      pinned: arrayRemove(playlist.id),
    });

    console.log("🗑️ Playlist slettet:", playlist.name);
    setShowConfirm(false);
    onClose();
  } catch (err) {
    console.error("Fejl ved sletning:", err);
  }
};

  // Toggle til del/venneliste
  const toggleFriend = (friendId) => {
  setSelectedFriends((prev) =>
    prev.includes(friendId)
      ? prev.filter((id) => id !== friendId)
      : [...prev, friendId]
  );
};

const handleShare = async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Du skal være logget ind for at dele!");
    return;
  }

  if (selectedFriends.length === 0) {
    alert("Vælg mindst én ven at dele med.");
    return;
  }

  try {
    for (const friendId of selectedFriends) {
      await updateDoc(doc(db, "users", friendId), {
        sharedWithMe: arrayUnion({
          from: user.uid,
          fromName: user.displayName || user.email.split("@")[0],
          context,
          item: context === "song" ? song : playlist,
          timestamp: new Date().toISOString(),
        }),
      });
    }
    console.log("✅ Delt med:", selectedFriends);
    onClose();
  } catch (err) {
    console.error("Fejl ved deling:", err);
  }
};


  return (
    <div className="popup-overlay">
      <div ref={popupRef} className="popup-container">
        {type === "create" && (
  <>
    {/* CREATE PLAYLIST */}
    <button className="popup-item" onClick={() => onNavigate("/create-playlist")}>
      <div className="popup-icon"><Music size={25} /></div>
      <div className="popup-text">
        <h3>Playliste</h3>
        <p>Opret en playliste med sange du selv tilføjer</p>
      </div>
    </button>

    <button className="popup-item" onClick={() => onNavigate("/moodlist")}>
      <div className="popup-icon"><Sparkles size={25} /></div>
      <div className="popup-text">
        <h3>Moodlist</h3>
        <p>Opret en playliste ud fra dit humør</p>
      </div>
    </button>

    <button className="popup-item" onClick={() => onNavigate("/shared-playlist")}>
      <div className="popup-icon"><Users size={25} /></div>
      <div className="popup-text">
        <h3>Fælles playliste</h3>
        <p>Opret en playliste sammen med dine venner</p>
      </div>
    </button>
  </>
)}

{type === "options" && (
  <>
    {context === "playlist" && (
      <>
        <button className="popup-item" onClick={togglePin}>
          <div className="popup-icon">
            {isPinned ? <PinOff size={25} /> : <Pin size={25} />}
          </div>
          <div className="popup-text">
            <h3>{isPinned ? "Fjern pin" : "Pin playliste"}</h3>
            <p>{isPinned ? "Fjern playlisten fra dine pinned" : "Fastgør denne playliste øverst"}</p>
          </div>
        </button>

        <button className="popup-item" onClick={onShare}>
          <div className="popup-icon"><Share2 size={25} /></div>
          <div className="popup-text">
            <h3>Del playliste</h3>
            <p>Kopier link eller del med venner</p>
          </div>
        </button>

        <button className="popup-item" onClick={() => setShowConfirm(true)}>
          <div className="popup-icon"><Trash2 size={25} /></div>
          <div className="popup-text">
            <h3>Slet playliste</h3>
            <p>Fjern denne playliste permanent</p>
          </div>
        </button>
      </>
    )}

    {context === "song" && (
      <>
        <button className="popup-item" onClick={onShare}>
          <div className="popup-icon"><Share2 size={25} /></div>
          <div className="popup-text">
            <h3>Del sang</h3>
            <p>Send sangen til dine venner</p>
          </div>
        </button>

        <button className="popup-item">
          <div className="popup-icon"><Plus size={25} /></div>
          <div className="popup-text">
            <h3>Tilføj til anden playliste</h3>
            <p>Gem denne sang et andet sted</p>
          </div>
        </button>

        <button className="popup-item">
          <div className="popup-icon"><Trash2 size={25} /></div>
          <div className="popup-text">
            <h3>Fjern fra denne playliste</h3>
            <p>Slet sangen fra playlisten</p>
          </div>
        </button>
      </>
    )}
  </>
)}

{type === "share" && (
  <>
    <h3 className="share-title">
      {context === "song" ? "Del sang" : "Del playliste"}
    </h3>
    <p className="share-subtitle">
      {context === "song"
        ? `Vælg dem du vil sende sangen "${song?.title}" til:`
        : `Vælg hvem du vil dele playlisten "${playlist?.name}" med:`}
    </p>

    <div className="friends-list">
      {dummyFriends.map((friend) => (
        <div
          key={friend.id}
          className={`friend-item ${selectedFriends.includes(friend.id) ? "selected" : ""}`}
          onClick={() => toggleFriend(friend.id)}
        >
          <img src={friend.avatar} alt={friend.name} className="avatar" />
          <span>{friend.name}</span>
        </div>
      ))}
    </div>

    <button
      className="share-send"
      disabled={selectedFriends.length === 0}
      onClick={handleShare}
    >
      Send til {selectedFriends.length || 0} ven
      {selectedFriends.length !== 1 && "ner"}
    </button>

    <button className="popup-cancel" onClick={onClose}>
      Annuller
    </button>
  </>
)}
      </div>


       {/* Bekræft slet-popup */}
      {showConfirm && (
        <div className="popup-overlay confirm-overlay">
          <div className="confirm-popup">
            <AlertTriangle size={42} color="#ff4d4d" />
            <h3>Er du sikker på, at du vil slette?</h3>
            <p>{playlist?.name}</p>

            <div className="confirm-buttons">
              <button className="cancel" onClick={() => setShowConfirm(false)}>
                Annuller
              </button>
              <button className="delete" onClick={handleDelete}>
                Slet
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
