// src/services/spotifyService.js

// prøv forskellige keys i localStorage (vi vil bare have ét gyldigt token)
function getSpotifyToken() {
  return (
    localStorage.getItem("spotify_access_token") ||
    localStorage.getItem("spotify_token") ||
    localStorage.getItem("access_token") ||
    null
  );
}

// fetch track info til at vise boblen i chat
export async function getTrackInfo(trackId) {
  const token = getSpotifyToken();

  if (!token) {
    // ingen token = vi kan ikke hente cover/title endnu
    return {
      title: "Ukendt sang",
      artist: "",
      coverUrl: null,
    };
  }

  const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error("Spotify track fetch failed", res.status);
    return {
      title: "Ukendt sang",
      artist: "",
      coverUrl: null,
    };
  }

  const data = await res.json();

  return {
    title: data.name,
    artist: data.artists.map((a) => a.name).join(", "),
    coverUrl: data.album?.images?.[0]?.url || null,
  };
}

// ✅ NY FUNKTION – søg efter sang via navn + artist
export async function searchTrackByName(query) {
  const token = getSpotifyToken();

  if (!token) {
    console.warn("Ingen Spotify token tilgængelig");
    return null;
  }

  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // 👇 Her er debug-linjen tilføjet
  console.log("Spotify search status:", res.status, "for query:", query);

  if (!res.ok) {
    console.error("Spotify search failed", res.status);
    return null;
  }

  const data = await res.json();
  if (data.tracks && data.tracks.items.length > 0) {
    const track = data.tracks.items[0];
    return {
      title: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      coverUrl: track.album?.images?.[0]?.url || null,
      spotifyUrl: track.external_urls?.spotify || null,
    };
  }

  return null;
}
