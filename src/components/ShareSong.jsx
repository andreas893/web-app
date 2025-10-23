import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { loginWithSpotify, getSpotifyToken } from "../spotifyAuthPKCE";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

export default function ShareSong() {
  const [token, setToken] = useState(() => localStorage.getItem("spotify_access_token"));
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔐 Hent access token automatisk, hvis Spotify redirecter tilbage med code
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code && !token) {
      getSpotifyToken(code)
        .then((newToken) => {
          if (newToken) {
            localStorage.setItem("spotify_access_token", newToken);
            setToken(newToken);
            window.history.replaceState({}, document.title, "/share");
          }
        })
        .catch((err) => console.error("Token fejl:", err));
    }
  }, [token]);

  // 🎧 Hvis man åbner siden uden token, start Spotify-login automatisk
  useEffect(() => {
    if (!token) {
      console.log("Ingen Spotify-token fundet — starter login...");
      loginWithSpotify();
    }
  }, [token]);

  // 🎵 Søg i Spotify API
  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 401) {
        console.warn("Token udløbet — logger ind igen...");
        localStorage.removeItem("spotify_access_token");
        loginWithSpotify();
        return;
      }

      const data = await res.json();
      setResults(data.tracks?.items || []);
    } catch (err) {
      console.error("Spotify søgefejl:", err);
    } finally {
      setLoading(false);
    }
  };

  // 💾 Del (midlertidig test uden login)
  const handleShare = async () => {
    if (!selectedSong) return alert("Vælg en sang først!");

    try {
      await addDoc(collection(db, "posts"), {
        userId: "testuser",
        user: "Testbruger",
        name: selectedSong.name,
        artist: selectedSong.artists.map((a) => a.name).join(", "),
        imgUrl: selectedSong.album.images[0]?.url || "",
        comment: comment.trim(),
        timestamp: serverTimestamp(),
      });

      setQuery("");
      setComment("");
      setResults([]);
      setSelectedSong(null);
      alert("🎉 Sangen er delt!");
    } catch (err) {
      console.error("Fejl ved deling:", err);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center p-6">
      {/* 🔙 Luk */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 right-5 text-gray-300 hover:text-white transition"
      >
        <X size={28} />
      </button>

      <h1 className="text-2xl font-bold mb-6 mt-2">Del sang</h1>

      {/* 🔍 Søg */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Søg efter en sang..."
        className="w-full max-w-md bg-[#1E1E1E] rounded-xl p-3 mb-3 text-white outline-none"
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="bg-purple-600 px-5 py-2 rounded-xl text-white font-semibold"
      >
        {loading ? "Søger..." : "Søg"}
      </button>

      {/* 🎧 Resultater */}
      <div className="mt-6 w-full max-w-md space-y-3">
        {results.map((song) => (
          <div
            key={song.id}
            onClick={() => setSelectedSong(song)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
              selectedSong?.id === song.id
                ? "bg-purple-600"
                : "bg-[#1E1E1E] hover:bg-[#2A2A2A]"
            }`}
          >
            <img
              src={song.album.images[0]?.url}
              alt={song.name}
              className="w-14 h-14 rounded-lg object-cover"
            />
            <div>
              <p className="font-semibold">{song.name}</p>
              <p className="text-sm text-gray-400">
                {song.artists.map((a) => a.name).join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 💬 Kommentar + del */}
      {selectedSong && (
        <div className="mt-6 w-full max-w-md">
          <textarea
            placeholder="Skriv kommentar..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-[#1E1E1E] rounded-xl p-3 text-white outline-none h-24 resize-none"
          />
          <button
            onClick={handleShare}
            className="w-full mt-3 bg-purple-600 py-3 rounded-xl font-semibold"
          >
            Del
          </button>
        </div>
      )}
    </div>
  );
}
