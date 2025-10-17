import FooterNav from "../components/FooterNav"
import { useState,useEffect,useRef } from "react";
import { LayoutGrid, List, Music, Sparkles, Users } from "lucide-react"

import "../library.css";

export default function LibraryPage({onClose onNavigate}) {
     const [activeTab, setActiveTab] = useState(null);
     const [viewMode, setViewMode] = useState("list");
     const popupRef = useRef(null);

    useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

    const playlists = [
    {
      id: "temp1",
      name: "Morning Vibes",
      createdBy: "Andreas",
      isMine: true,
      type: "Sang",
      coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    },
    {
      id: "temp2",
      name: "Chill Evenings",
      createdBy: "Mathias",
      isMine: false,
      type: "Playliste",
      coverUrl: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
    }, 
     {
      id: "temp3",
      name: "Chill Evenings",
      createdBy: "Mathias",
      isMine: false,
      type: "Playliste",
      coverUrl: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
    }, 
     {
      id: "temp4",
      name: "Chill Evenings",
      createdBy: "Mathias",
      isMine: false,
      type: "Playliste",
      coverUrl: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
    },
  ];





  // ✅ Toggle-knapper
  const toggleTab = (tabName) => {
    setActiveTab((prev) => (prev === tabName ? null : tabName));
  };

  const filteredPlaylists =
    activeTab === "mine"
      ? playlists.filter((p) => p.isMine)
      : activeTab === "saved"
      ? playlists.filter((p) => !p.isMine)
      : playlists; // default vis alle
  
    return (
    <div className="library-page-container">
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
                <div className="playlist-btn-container">
                    <button className="create-playlist-btn">
                    <span>＋</span> Opret Playlist
                    </button>
                </div>

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
                <p>{playlist.type} - {playlist.createdBy}</p>
                </div>
            </div>
            ))}
        </div>

        </div>
        
             <div className="popup-overlay">
      <div ref={popupRef} className="popup-container">
        <button
          className="popup-item"
          onClick={() => onNavigate("/create-playlist")}
        >
          <div className="popup-icon">
            <Music size={20} />
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
            <Sparkles size={20} />
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
            <Users size={20} />
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

         <FooterNav />
    </div>    
        
  )
}

