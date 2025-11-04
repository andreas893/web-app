import FooterNav from "../components/FooterNav"
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

import { useNavigate } from "react-router-dom";
import CreatePlaylistPopup from "../components/CreatePlaylistPopup";
import { LayoutGrid, List, EllipsisVertical } from "lucide-react"
import "../library.css";
import { getImageUrl } from "../utils/getImageUrl";

export default function LibraryPage() {
     const [activeTab, setActiveTab] = useState(null);
     const [viewMode, setViewMode] = useState("list");
     const [savedPlaylists, setSavedPlaylists] = useState([]);
     const [activePlaylist, setActivePlaylist] = useState(null);
     const [popupType, setPopupType] = useState(null);
    const navigate = useNavigate();
    
    // Luk når man klikker uden for popup create
    useEffect(() => {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  // Realtime listener så library opdateres straks når der gemmes/fjernes
  const unsub = onSnapshot(userRef, (snap) => {
    if (snap.exists()) {
      setSavedPlaylists(snap.data().playlists || []);
    }
  });

  return () => unsub();
}, []);


    const playlists = [
    {
      id: "temp1",
      name: "Morning Vibes",
      username: "test5",
      isMine: true,
      imgUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    },
    {
      id: "temp2",
      name: "Chill Evenings",
      username: "mathias",
      isMine: false,
      imgUrl: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
    }, 
     {
      id: "temp3",
      name: "Chill Evenings",
      username: "mathias",
      isMine: false,
      imgUrl: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
    }, 
     {
      id: "temp4",
      name: "Chill Evenings",
      username: "mathias",
      isMine: false,
      imgUrl: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
    },
  ];





  // ✅ Toggle-knapper
  const toggleTab = (tabName) => {
    setActiveTab((prev) => (prev === tabName ? null : tabName));
  };

    const user = auth.currentUser;
   const combinedData = [
  ...playlists.map((p) => ({
    ...p,
    isMine: p.userId === user?.uid || p.username === user?.displayName || false,
  })),
  ...savedPlaylists.map((s) => ({
    id: s.id,
    name: s.name || "Ukendt titel",
    userId: s.userId,
    username: s.username || s.user || "Ukendt bruger",
    imgUrl: s.imgUrl || s.coverUrl || "https://via.placeholder.com/150",
    isMine: s.userId === user?.uid, // tjek ejerskab for gemte
  })),
];


 const filteredPlaylists =
    activeTab === "mine"
      ? combinedData.filter((p) => p.isMine)
      : activeTab === "saved"
      ? combinedData.filter((p) => !p.isMine)
      : combinedData;
  
    return (
    <div className={`library-page ${viewMode}-view`}>
        <h1>Dit bibliotek</h1>
        
             <div className="library-nav">
            <button
            className={activeTab === "mine" ? "active" : ""}
            onClick={() => toggleTab("mine")}
            >
            Dine Playlister
            </button>
            <button
            className={activeTab === "saved" ? "active" : ""}
            onClick={() => toggleTab("saved")}
            >
            Gemte
            </button>
      </div>
        
        
        <div className="view-options">
             <button onClick={() => setPopupType("create")} className="create-playlist-btn">
           <span>＋</span> Opret Playlist
             </button>

          {viewMode === "list" ? (
            <LayoutGrid
              className="icon"
              onClick={() => setViewMode("grid")}
              title="Skift til grid"
            />
          ) : (
            <List
              className="icon"
              onClick={() => setViewMode("list")}
              title="Skift til liste"
            />
          )}
        </div>

         <div className={`playlist-list ${viewMode}`}>
        {filteredPlaylists.map((playlist) => (
          <div key={playlist.id} className="library-playlist-card" onClick={() => navigate(`/playlist/${playlist.id}`, { state: { origin: "library" } })}>
            <img  src={playlist.imgUrl || getImageUrl("images/default-cover.png")} alt={playlist.name} onError={(e) => (e.currentTarget.src = getImageUrl("images/default-cover.png"))} className="cover" />
            
            <div className="info">
              <h3>{playlist.name}</h3>
              <p>
                  {playlist.type === "song"
                  ? `Sang af ${playlist.username || "Ukendt bruger"}`
                  : `Playliste af ${playlist.username || "Ukendt bruger"}`}
              </p>
            </div>

            <button
                className="playlist-options-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    setActivePlaylist(playlist);
                    setPopupType("options");
                }}
                >
                    <EllipsisVertical />
            </button>
            
          </div>
        ))}
      </div>
          
         {popupType === "create" && (
        <CreatePlaylistPopup
            type="create"
            onClose={() => setPopupType(null)}
            onNavigate={(path) => {
            setPopupType(null);
            navigate(path);
            }}
        />
        )}

        {popupType === "options" && (
        <CreatePlaylistPopup
            type="options"
            playlist={activePlaylist}
            onClose={() => setPopupType(null)}
            onShare={() => { setPopupType(null); setTimeout(() => setPopupType("share"), 200);
        }}
        />
        )}

        {popupType === "share" && (
        <CreatePlaylistPopup
            type="share"
            playlist={activePlaylist}
            onClose={() => setPopupType(null)}
        />
        )}

        <FooterNav />
    </div>
  )
}

