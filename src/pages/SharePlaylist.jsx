import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Check } from "lucide-react";

export default function SharePlaylist() {
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const playlists = [
    { id: 1, name: "Glad", createdBy: "Mathias" },
    { id: 2, name: "Inspireret", createdBy: "Mathias, Andreas" },
    { id: 3, name: "Sur", createdBy: "Mathias" },
    { id: 4, name: "Festlig", createdBy: "Mathias, Andreas" },
  ];

  const handleSelect = (id) => {
    setSelected((prev) => (prev === id ? null : id));
  };

  return (
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
        onClick={() => navigate("/")}
      >
        Del
      </button>
    </div>
  );
}
