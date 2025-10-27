import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Music, Sparkles, Users, Pin, Share2, Trash2, PinOff, AlertTriangle, Plus } from "lucide-react";
import { updateDoc, doc, arrayUnion, arrayRemove, getDoc, deleteDoc, addDoc, serverTimestamp, collection } from "firebase/firestore";
import { db, auth } from "../firebase";
import DetailsPopup from "../components/DetailsPopup"
import { useNavigate } from "react-router";

export default function CreatePlaylistPopup({ type = "create", onClose, playlist, onShare, context="playlist", song }) {
  const popupRef = useRef(null);
  const [isPinned, setIsPinned] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [createType, setCreateType] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const dummyFriends = [
  { id: "1", name: "Andreas", avatar: "/img/andreas.jpg" },
  { id: "2", name: "Mathias", avatar: "/img/mathias.jpg" },
  { id: "3", name: "Sofie", avatar: "/img/sofie.jpg" },
];

console.log("Origin:", location.state);
console.log("🎧 Playlist objekt i popup:", playlist);

  // tjek om playliste/sang er pinned
  useEffect(() => {
  const checkPinned = async () => {
    const user = auth.currentUser;
    if (!user || !playlist) return;
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const pinned = snap.data().pinned || [];
      // her er forskellen ↓
      const isThisPinned = pinned.some((p) => p.id === playlist.id);
      setIsPinned(isThisPinned);
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
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return;
        const userData = userSnap.data();
        const currentPins = userData.pinned || [];

        // check om playlist allerede er pinned (ud fra id)
        const alreadyPinned = currentPins.some((p) => p.id === playlist.id);

        // fjern pin
        if (alreadyPinned) {
          const updatedPins = currentPins.filter((p) => p.id !== playlist.id);
          await updateDoc(userRef, { pinned: updatedPins });
          console.log("📌 Fjernet pin:", playlist.name);
          setIsPinned(false);
          onClose();
          return;
        }

        // check max 4 pinned
        if (currentPins.length >= 4) {
          alert("Du kan maks have 4 pinned sange/playlister.");
          return;
        }

       // vælg gyldig image-url (ingen fallback hvis der findes et billede)
        const resolvedImg =
          typeof playlist.imgUrl === "string" && playlist.imgUrl.trim() !== ""
            ? playlist.imgUrl
            : typeof playlist.image === "string" && playlist.image.trim() !== ""
            ? playlist.image
            : "/img/fallback.jpg"; // fallback kun hvis begge er tomme

        // find korrekt brugernavn
        const resolvedUser =
          playlist.user ||
          playlist.userName ||
          playlist.createdBy ||
          user.displayName ||
          user.email?.split("@")[0] ||
          "Ukendt bruger";

        const pinnedData = {
          id: playlist.id,
          name: playlist.name || playlist.songName || "Ukendt titel",
          imgUrl: resolvedImg,
          user: resolvedUser,
          source: context || "playlist",
          timestamp: new Date().toISOString(),
        };

        // tilføj pin
        const updatedPins = [...currentPins, pinnedData];
        await updateDoc(userRef, { pinned: updatedPins });

        console.log("📌 Tilføjet pin:", pinnedData.name);
        setIsPinned(true);
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


  async function handleCreatePlaylist({ name, cover }, type) {
  const user = auth.currentUser;
  if (!user) return alert("Du skal være logget ind for at oprette en playliste!");

  const newPlaylist = {
    userId: user.uid,
    user: user.displayName || user.email.split("@")[0],
    name: name?.trim(),
    imgUrl: cover || "/img/fallback.jpg",
    type,
    songs: [],
    timestamp: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "playlists"), newPlaylist);

   const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        playlists: arrayUnion({
          id: docRef.id,
          name: newPlaylist.name,
          user: newPlaylist.user,
          imgUrl: newPlaylist.imgUrl,
          type: newPlaylist.type,
        }),
    });

  navigate(`/playlist/${docRef.id}`, { state: { origin: "created" } });
}

  function handleCreateClick(type) {
    setCreateType(type);
    setShowDetails(true);
  }


  return (
    <div className="popup-overlay">
      <div ref={popupRef} className="popup-container">
        {type === "create" && (
  <>
    {/* CREATE PLAYLIST */}
           <div className="popup-handle"></div>
          <button className="popup-item" onClick={() => handleCreateClick("/choose-mood")}>
          <div className="popup-icon"><Sparkles size={25} /></div>
          <div className="popup-text">
            <h3>Moodlist</h3>
            <p>Opret en playliste ud fra dit humør</p>
          </div>
        </button>

    <button className="popup-item" onClick={() => handleCreateClick("manual")}>
      <div className="popup-icon"><Music size={25} /></div>
      <div className="popup-text">
        <h3>Playliste</h3>
        <p>Opret en playliste med sange du selv tilføjer</p>
      </div>
    </button>


    <button className="popup-item" onClick={() => handleCreateClick("/shared-playlist")}>
      <div className="popup-icon"><Users size={25} /></div>
      <div className="popup-text">
        <h3>Fælles playliste</h3>
        <p>Opret en playliste sammen med dine venner</p>
      </div>
    </button>
  </>
)}

  {showDetails && (
      <DetailsPopup
        type={createType}
        onClose={() => setShowDetails(false)}
        onConfirm={(data) => handleCreatePlaylist(data, createType)}
      />
    )}

{type === "options" && (
  <>
    {context === "playlist" && (
      <>
         <div className="popup-handle"></div>
        <button className="popup-item" onClick={togglePin}>
          <div className="popup-icon">
            {isPinned ? <PinOff size={25} /> : <Pin size={25} />}
          </div>
          <div className="popup-text">
            <h3>{isPinned ? "Fjern pin" : "Pin playliste"}</h3>
            <p>{isPinned ? "Fjern playlisten fra dine pinned" : "Fastgør denne playliste på profil"}</p>
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
            <p>Gem denne sang på en anden playliste</p>
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
     <div className="popup-handle"></div>
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
