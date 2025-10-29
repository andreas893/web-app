import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { loginWithSpotify, getSpotifyToken } from "../spotifyAuthPKCE";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

/**
 * Props fra ChatPage:
 * - inChatMode: true/false
 * - onSelectTrack(trackId): callback når man vælger en sang (kun i chat)
 * - onClose(): luk popup (kun i chat)
 */
export default function ShareSong({
  inChatMode = false,
  onSelectTrack,
  onClose,
}) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("spotify_access_token")
  );
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // efter Spotify redirect med ?code=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code && !token) {
      getSpotifyToken(code)
        .then((newToken) => {
          if (newToken) {
            localStorage.setItem("spotify_access_token", newToken);
            setToken(newToken);

            // hvis vi var på en route (ikke popup), fjern query params
            if (!inChatMode) {
              window.history.replaceState({}, document.title, "/share-song");
            }
          }
        })
        .catch((err) => console.error("Token fejl:", err));
    }
  }, [token, inChatMode]);

  // hvis vi ikke HAR token → prøv loginWithSpotify
  // nu også i chat-mode, for så kan vi faktisk søge i popup'en
  useEffect(() => {
    if (!token) {
      console.log("Ingen Spotify-token fundet — starter login...");
      loginWithSpotify();
    }
  }, [token]);

  async function handleSearch() {
    if (!query.trim()) return;
    if (!token) {
      console.warn("Ingen token endnu, kan ikke søge.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=track&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // token kan være udløbet
      if (res.status === 401) {
        console.warn("Token udløbet — prøver login igen...");
        localStorage.removeItem("spotify_access_token");
        loginWithSpotify();
        return;
      }

      const data = await res.json();

      const list = data.tracks?.items || [];
      setResults(list);
    } catch (err) {
      console.error("Spotify søgefejl:", err);
    } finally {
      setLoading(false);
    }
  }

  // public del til feed
  async function handleSharePublic() {
    if (!selectedSong) {
      alert("Vælg en sang først!");
      return;
    }

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
      navigate("/home");
    } catch (err) {
      console.error("Fejl ved deling:", err);
    }
  }

  // privat del til chat
  function chooseForChat(song) {
    if (onSelectTrack) {
      onSelectTrack(song.id); // giver trackId tilbage til ChatPage
    }
  }

  return (
    <div
      className={
        inChatMode
          ? "text-white flex flex-col p-4"
          : "relative min-h-screen bg-black text-white flex flex-col items-center p-6"
      }
    >
      {/* Header */}
      {inChatMode ? (
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-base font-semibold">Del sang i chat</h1>
          {onClose && (
            <button
              className="text-gray-300 hover:text-white text-sm"
              onClick={onClose}
            >
              Luk
            </button>
          )}
        </div>
      ) : (
        <>
          <button
            onClick={() => navigate(-1)}
            className="absolute top-5 right-5 text-gray-300 hover:text-white transition"
          >
            <X size={28} />
          </button>

          <h1 className="text-2xl font-bold mb-2 mt-14">Del sang</h1>
          <p className="text-gray-400 mb-6 text-center">
            Søg efter en sang, du vil dele med dit netværk.
          </p>
        </>
      )}

      {/* Søg input + knap */}
      <div
        className={
          inChatMode
            ? "w-full mb-3"
            : "w-full max-w-md flex flex-col items-center mb-3"
        }
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Søg efter en sang..."
          className={
            inChatMode
              ? "w-full bg-[#1E1E1E] rounded-xl p-3 text-white outline-none text-sm"
              : "w-full max-w-md bg-[#1E1E1E] rounded-xl p-3 text-white outline-none mb-3"
          }
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className={
            inChatMode
              ? "bg-[#4D00FF] px-4 py-2 rounded-xl text-white font-semibold text-sm disabled:opacity-60 mt-2"
              : "bg-[#4D00FF] px-5 py-2 rounded-xl text-white font-semibold w-full max-w-md disabled:opacity-60"
          }
        >
          {loading ? "Søger..." : "Søg"}
        </button>
      </div>

      {/* Resultater */}
      <div
        className={
          inChatMode
            ? "flex-1 overflow-y-auto space-y-3"
            : "mt-6 w-full max-w-md space-y-3"
        }
      >
        {results.map((song) => (
          <div
            key={song.id}
            onClick={() => {
              if (inChatMode) {
                chooseForChat(song);
              } else {
                setSelectedSong(song);
              }
            }}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
              !inChatMode && selectedSong?.id === song.id
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
              <p className="font-semibold text-sm">{song.name}</p>
              <p className="text-xs text-gray-400">
                {song.artists.map((a) => a.name).join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* feed-mode footer */}
      {!inChatMode && selectedSong && (
        <div className="mt-6 w-full max-w-md">
          <textarea
            placeholder="Skriv kommentar..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-[#1E1E1E] rounded-xl p-3 text-white outline-none h-24 resize-none text-sm"
          />

          <button
            onClick={handleSharePublic}
            className="w-full mt-3 bg-[#4D00FF] py-3 rounded-xl font-semibold"
          >
            Del
          </button>
        </div>
      )}
    </div>
  );
}
