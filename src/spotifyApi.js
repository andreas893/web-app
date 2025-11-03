export async function searchSpotifyTracks(query, token) {
    if (!query.trim()) return [];
  
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    if (!res.ok) {
      console.error("Spotify API-fejl:", res.status, res.statusText);
      return [];
    }
  
    const data = await res.json();
    return data.tracks.items;
  }

  // 🎧 Gyldige seed-genrer fra Spotify Web API (fast liste)
// const validSpotifyGenres = [
//   "pop", "dance", "rock", "metal", "indie", "chill", "study",
//   "acoustic", "r-n-b", "hip-hop", "electronic", "house", "techno",
//   "trance", "country", "alternative", "classical", "ambient",
//   "punk", "soul", "jazz", "latin", "funk"
// ];



// Hent "anbefalede" sange baseret på mood ved hjælp af Search API
export async function fetchSpotifyMoodRecommendations(token, mood) {
  if (!token) {
    console.warn("Ingen Spotify-token fundet.");
    return [];
  }

  // Hent genre fra dit moodMap
  const moodMap = {
    Glad: "pop",
    Trist: "acoustic",
    Chill: "chill",
    Energisk: "dance",
    Kreativ: "indie",
    Forelsket: "r-n-b",
    Fokuseret: "study",
    Vred: "metal",
  };

  const genre = moodMap[mood] || "pop";

  try {
    const randomOffset = Math.floor(Math.random() * 200); // hop tilfældigt i resultaterne
    const res = await fetch(
       `https://api.spotify.com/v1/search?q=genre:${encodeURIComponent(genre)}&type=track&limit=5&offset=${randomOffset}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      console.error("Fejl ved Spotify search:", res.status, res.statusText);
      return [];
    }

    const data = await res.json();

    if (!data.tracks?.items?.length) {
      console.warn("Ingen tracks fundet for genre:", genre);
      return [];
    }

    // 🎵 Returnér i samme struktur som dine playlist-songs
    return data.tracks.items.map((track) => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      imgUrl: track.album.images[0]?.url,
      previewUrl: track.preview_url,
      uri: track.uri,
    }));
  } catch (err) {
    console.error("Fejl under hentning af mood-baserede anbefalinger:", err);
    return [];
  }
}

// 🎲 Tilfældige anbefalinger (bruges når playlisten ikke har mood)
export async function fetchSpotifyRandomRecommendations(token) {
  if (!token) {
    console.warn("Ingen Spotify-token fundet");
    return [];
  }

  const randomGenres = [
    "pop",
    "rock",
    "indie",
    "dance",
    "chill",
    "jazz",
    "metal",
    "rnb",
    "hip-hop",
    "soul",
  ]
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  let results = [];

  for (const genre of randomGenres) {
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=genre:${encodeURIComponent(
          genre
        )}&type=track&limit=1`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) continue;
      const data = await res.json();

      if (data.tracks?.items?.length) {
        results.push(data.tracks.items[0]);
      }
    } catch (err) {
      console.error(`Fejl under hentning for genre ${genre}:`, err);
    }
  }

  // Fjern dubletter
  const uniqueTracks = Array.from(new Map(results.map((t) => [t.id, t])).values());

  return uniqueTracks.map((track) => ({
    id: track.id,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    imgUrl: track.album.images[0]?.url,
    previewUrl: track.preview_url,
    uri: track.uri,
  }));
}
