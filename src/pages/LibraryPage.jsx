import FooterNav from "../components/FooterNav"
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import CreatePlaylistPopup from "../components/CreatePlaylistPopup";
import { LayoutGrid, List } from "lucide-react"
import "../library.css";

export default function LibraryPage() {
     const [activeTab, setActiveTab] = useState(null);
     const [viewMode, setViewMode] = useState("list");
     const [showPopup, setShowPopup] = useState(false);
     const [savedPlaylists, setSavedPlaylists] = useState([]);
    const navigate = useNavigate();
    

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
      createdBy: "andreas",
      isMine: true,
      coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    },
    {
      id: "temp2",
      name: "Chill Evenings",
      createdBy: "mathias",
      isMine: false,
      coverUrl: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
    }, 
     {
      id: "temp3",
      name: "Chill Evenings",
      createdBy: "mathias",
      isMine: false,
      coverUrl: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
    }, 
     {
      id: "temp4",
      name: "Chill Evenings",
      createdBy: "mathias",
      isMine: false,
      coverUrl: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
    },
  ];





  // ✅ Toggle-knapper
  const toggleTab = (tabName) => {
    setActiveTab((prev) => (prev === tabName ? null : tabName));
  };

    const combinedData = [...playlists, ...savedPlaylists.map((s) => ({
    id: s.id,
    name: s.song || s.name || "Ukendt titel",
    createdBy: s.user || "Ukendt bruger",
    isMine: false,
    coverUrl: s.imgUrl || s.coverUrl || "https://via.placeholder.com/150",
  }))];


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
             <button onClick={() => setShowPopup(true)} className="create-playlist-btn">
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
          <div key={playlist.id} className="library-playlist-card">
            <img src={playlist.coverUrl} alt={playlist.name} className="cover" />
            <div className="info">
              <h3>{playlist.name}</h3>
              <p>Af {playlist.createdBy}</p>
            </div>
          </div>
        ))}
      </div>
          
           {showPopup && (
        <CreatePlaylistPopup
          onClose={() => setShowPopup(false)}
          onNavigate={(path) => {
            setShowPopup(false);
            navigate(path);
          }}
        />
      )}

        <FooterNav />
    </div>
  )
}

