import { useState, useEffect } from "react";
import { loginUrl } from "../spotifyAuth";
import { searchSpotifyTracks } from "../spotifyApi";

export default function SpotifyLoginTest() {
  const [token, setToken] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const accessToken = new URLSearchParams(hash.replace("#", "")).get("access_token");
      window.location.hash = "";
      localStorage.setItem("spotify_token", accessToken);
      setToken(accessToken);
    } else {
      const savedToken = localStorage.getItem("spotify_token");
      if (savedToken) setToken(savedToken);
    }
  }, []);

  const handleSearch = async () => {
    if (!token) return;
    const items = await searchSpotifyTracks(query, token);
    setResults(items);
  };

  return (
    <div className="p-4 text-white w-full max-w-md mx-auto">
      {!token ? (
        <a href={loginUrl} className="bg-green-500 px-4 py-2 rounded">
          Log ind med Spotify
        </a>
      ) : (
        <>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Søg efter en sang..."
            className="bg-gray-800 p-2 rounded w-full"
          />
          <button onClick={handleSearch} className="bg-purple-600 px-3 py-1 mt-2 rounded w-full">
            Søg
          </button>

          <div className="mt-4 space-y-2">
            {results.map((track) => (
              <div
                key={track.id}
                className="flex items-center gap-3 bg-[#1E1E1E] rounded-lg p-2"
              >
                <img
                  src={track.album.images[2]?.url}
                  alt={track.name}
                  className="w-12 h-12 rounded"
                />
                <div>
                  <p className="font-semibold">{track.name}</p>
                  <p className="text-sm text-gray-400">{track.artists[0].name}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
