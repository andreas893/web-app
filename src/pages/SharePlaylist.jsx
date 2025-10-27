import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Check } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import ShareSuccess from "../components/ShareSuccess";

export default function SharePlaylist() {
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // 🎨 Random gradients
  const gradients = [
    "linear-gradient(135deg, #FF6B6B 0%, #FCA17D 100%)",
    "linear-gradient(135deg, #5B247A 0%, #1BCEDF 100%)",
    "linear-gradient(135deg, #36D1DC 0%, #5B86E5 100%)",
    "linear-gradient(135deg, #F7971E 0%, #FFD200 100%)",
    "linear-gradient(135deg, #43C6AC 0%, #F8FFAE 100%)",
  ];

  const playlists = [
    { id: "p1", name: "Glad", createdBy: "Mathias" },
    { id: "p2", name: "Inspireret", createdBy: "Mathias, Andreas" },
    { id: "p3", name: "Sur", createdBy: "Mathias" },
    { id: "p4", name: "Festlig", createdBy: "Mathias, Andreas" },
  ];

  const handleSelect = (id) => {
    setSelected((prev) => (prev === id ? null : id));
  };

  const activePlaylist = playlists.find((p) => p.id === selected);

  async function handleShare() {
    if (!activePlaylist) return alert("Vælg en playliste først!");

    try {
      await addDoc(collection(db, "posts"), {
        type: "playlist",
        playlistId: activePlaylist.id,
        playlistName: activePlaylist.name,
        playlistOwner: activePlaylist.createdBy,
        comment: comment.trim(),
        userId: "testuser",
        user: "Testbruger",
        image: gradients[Math.floor(Math.random() * gradients.length)],
        timestamp: serverTimestamp(),
      });

      setShowSuccess(true);
      setComment("");
      setSelected(null);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Fejl ved deling af playliste:", err);
    }
  }

  return (
    <>
      <div className="bg-[#121212] text-white min-h-screen px-5 py-8 relative">
        <button
          className="absolute right-5 top-5 text-gray-400 hover:text-white"
          onClick={() => navigate(-1)}
        >
          <X size={24} />
        </button>

        <h1 className="text-2xl font-bold mb-2 mt-10">Dit bibliotek</h1>
        <p className="text-gray-400 mb-6">
          Vælg hvilken playliste fra dit bibliotek du vil dele.
        </p>

        <div className="space-y-3">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => handleSelect(pl.id)}
              className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition ${
                selected === pl.id
                  ? "bg-[#4D00FF]"
                  : "bg-[#1E1E1E] hover:bg-[#2A2A2A]"
              }`}
            >
              <div>
                <p className="font-semibold">{pl.name}</p>
                <p className="text-gray-400 text-sm">
                  Playliste - {pl.createdBy}
                </p>
              </div>
              {selected === pl.id && <Check size={20} className="text-white" />}
            </div>
          ))}
        </div>

        <textarea
          placeholder="Skriv kommentar..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-[#23262c] text-white placeholder-gray-400 text-sm rounded-2xl p-3 mt-6 outline-none resize-none h-24"
        ></textarea>

        <button
          className="bg-[#4D00FF] w-full mt-4 py-3 rounded-2xl font-semibold"
          onClick={handleShare}
        >
          Del
        </button>
      </div>

      {showSuccess && (
        <ShareSuccess
          type="playlist"
          onClose={() => {
            setShowSuccess(false);
            navigate("/");
          }}
        />
      )}
    </>
  );
}
