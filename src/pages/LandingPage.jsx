import { useState } from "react";
import SoundForYou from "../components/SoundForYou";
import Feed from "../components/Feed";
import Wrapped from "../components/Wrapped";
import FooterNav from "../components/FooterNav";
import CreatePlaylistPopup from "../components/CreatePlaylistPopup";

export default function LandingPage() {
  const [popupType, setPopupType] = useState(null);
  return (
    <div className="bg-[#121212] min-h-screen flex flex-col font-inter relative">
      <main className="flex-1 pb-20 overflow-y-auto hide-scroll px-4">
        <div className="logo-header">
        <img src={`${import.meta.env.BASE_URL}images/chord-logo.png`} alt="Chord logo" />
           <button onClick={() => setPopupType("create")} className="create-playlist-btn landing-btn">
           <span>＋</span>
             </button>
        </div>
        <Feed />
        <SoundForYou />
        <Wrapped />
      </main>
       {popupType === "create" && (
        <CreatePlaylistPopup
          type="create"
          onClose={() => setPopupType(null)}
        />
      )}
      <FooterNav />
    </div>
  );
}
