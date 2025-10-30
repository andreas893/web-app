import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Check } from "lucide-react";
import { auth, db } from "../firebase";
import { doc, onSnapshot, addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function SharePlaylist() {
  const [playlists, setPlaylists] = useState([]);
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Hent brugerens playlister i realtid (inkl. cover)
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const unsub = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setPlaylists(data.playlists || []);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleSelect = (index) => {
    setSelected((prev) => (prev === index ? null : index));
  };

  // 🔹 Del valgt playliste til “posts”
  const handleShare = async () => {
    if (selected === null) return alert("Vælg en playliste først!");
    const user = auth.currentUser;
    const playlist = playlists[selected];

    try {
      await addDoc(collection(db, "posts"), {
        type: "playlist",
        playlistId: playlist.id || null,
        playlistName: playlist.name || "Ukendt navn",
        imgUrl: playlist.imgUrl || playlist.coverUrl || "",
        userId: user.uid,
        username: user.displayName || "Ukendt bruger",
        comment: comment.trim(),
        timestamp: serverTimestamp(),
      });

      alert("✅ Playliste delt!");
      navigate("/home");
    } catch (err) {
      console.error("Fejl ved deling af playliste:", err);
    }
  };

 return (
  <div className="bg-[#121212] text-white min-h-screen flex flex-col relative pb-[40px]">
    {/* Luk-knap */}
    <button
      className="absolute right-5 top-5 text-gray-400 hover:text-white"
      onClick={() => navigate(-1)}
    >
      <X size={24} />
    </button>

    <div className="px-5 pt-14 pb-[160px] flex-1 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-2">Del en af dine playlister</h1>
      <p className="text-gray-400 mb-6">Vælg hvilken playliste du vil dele.</p>

      {/*  Loader / Indhold */}
      {loading ? (
        <p className="text-gray-400">Indlæser dine playlister...</p>
      ) : playlists.length === 0 ? (
        <p className="text-gray-400">Du har ingen playlister endnu.</p>
      ) : (
        <div className="space-y-3">
          {playlists.map((pl, i) => (
            <div
              key={i}
              onClick={() => handleSelect(i)}
              className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition ${
                selected === i
                  ? "bg-[#4D00FF]"
                  : "bg-[#23262C] hover:bg-[#2A2A2A]"
              }`}
            >
              <div className="flex items-center gap-3">
               <img
                src={
                  pl.imgUrl?.trim()
                    ? pl.imgUrl
                    : pl.coverUrl?.trim()
                    ? pl.coverUrl
                    : "/images/default-cover.png"
                }
                onError={(e) => (e.currentTarget.src = "/images/default-cover.png")}
                alt={pl.name || "Playliste"}
                className="w-[80px] h-[80px] rounded-[18px] object-cover"
              />
                <div>
                  <p className="font-semibold text-sm">{pl.name || "Ukendt titel"}</p>
                  <p className="text-gray-400 text-xs">{pl.tracks?.length || 0} sange</p>
                </div>
              </div>
              {selected === i && <Check size={20} className="text-white" />}
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Fixed kommentarboks + knap */}
    <div className="fixed bottom-0 left-0 w-full bg-[#121212] px-5 pb-6 pt-3 border-t rounded-[18px] shadow-[0_-4px_12px_rgba(0,0,0,0.4)] border-[#2A2A2A]">
      <textarea
        placeholder="Skriv kommentar..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full bg-[#23262c] text-white placeholder-gray-400 text-sm rounded-2xl p-3 outline-none resize-none h-20 mb-3"
      ></textarea>

      <button
        onClick={handleShare}
        disabled={selected === null}
        className="bg-[#4D00FF] w-full py-3 rounded-2xl font-semibold disabled:opacity-50"
      >
        Del
      </button>
    </div>
  </div>
);
}
