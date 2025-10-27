import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { loginWithSpotify, getSpotifyToken } from "../spotifyAuthPKCE";
import { useNavigate, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import ShareSuccess from "./ShareSuccess";

export default function ShareSong() {
  const [token, setToken] = useState(() =>
    localStorage.getItem("spotify_access_token")
  );
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  /* --------------------------------------------------
     1️⃣ Fanger redirect fra Spotify (authorization code)
  -------------------------------------------------- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code && !token) {
      getSpotifyToken(code)
        .then((newToken) => {
          if (newToken) {
            localStorage.setItem("spotify_access_token", newToken);
            setToken(newToken);

            // fjern ?code fra URL, men bliv på /share-song
            window.history.replaceState({}, document.title, "/share-song");
          }
        })
        .catch((err) => console.error("Token fejl:", err));
    }
  }, [token]);

  /* --------------------------------------------------
     2️⃣ Starter Spotify-login hvis autoLogin=true
  -------------------------------------------------- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const autoLogin = params.get("autoLogin");

    if (autoLogin === "true" && !token) {
      console.log("Starter Spotify-login fra /share-song ...");
      loginWithSpotify();
    }
  }, [location, token]);

  /* --------------------------------------------------
     3️⃣ Søg sang i Spotify
  -------------------------------------------------- */
  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=track&limit=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // token udløbet → login igen
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

  /* --------------------------------------------------
     4️⃣ Del sang til Firestore
  -------------------------------------------------- */
  const handleShare = async () => {
    if (!selectedSong) {
      alert("Vælg en sang først!");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        type: "song",
        trackId: selectedSong.id,
        name: selectedSong.name,
        artist: selectedSong.artists.map((a) => a.name).join(", "),
        imgUrl: selectedSong.album.images[0]?.url || "",
        comment: comment.trim(),
        userId: "testuser", // TODO: skift til auth.currentUser.uid
        user: "Testbruger", // TODO: skift til auth.currentUser.displayName
        timestamp: serverTimestamp(),
      });

      setShowSuccess(true); // viser ✅ overlay

      // ryd UI
      setQuery("");
      setComment("");
      setResults([]);
      setSelectedSong(null);

      // auto tilbage til forsiden efter 1.5 sek
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Fejl ved deling:", err);
      alert("Kunne ikke dele sangen 😭");
    }
  };

  /* --------------------------------------------------
     🖼️ UI
  -------------------------------------------------- */
  return (
    <>
      <div className="relative min-h-screen bg-black text-white flex flex-col items-center p-6">
        {/* Luk / tilbage */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 right-5 text-gray-300 hover:text-white transition"
        >
          <X size={28} />
        </button>

        {/* Titel */}
        <h1 className="text-2xl font-bold mb-2 mt-14">Del sang</h1>
        <p className="text-gray-400 mb-6 text-center">
          Søg efter en sang, du vil dele med dit netværk.
        </p>

        {/* Søg felt */}
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
          className="bg-[#4D00FF] px-5 py-2 rounded-xl text-white font-semibold w-full max-w-md disabled:opacity-60"
        >
          {loading ? "Søger..." : "Søg"}
        </button>

        {/* Resultater */}
        <div className="mt-6 w-full max-w-md space-y-3">
          {results.map((song) => (
            <div
              key={song.id}
              onClick={() => setSelectedSong(song)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                selectedSong?.id === song.id
                  ? "bg-[#4D00FF]"
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

        {/* Kommentar + Del */}
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
              className="w-full mt-3 bg-[#4D00FF] py-3 rounded-xl font-semibold"
            >
              Del
            </button>
          </div>
        )}
      </div>

      {showSuccess && (
        <ShareSuccess
          type="sang"
          onClose={() => {
            setShowSuccess(false);
            navigate("/");
          }}
        />
      )}
    </>
  );
}
