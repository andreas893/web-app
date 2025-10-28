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

  export async function fetchSpotifyRecommendations(token, moodGenre) {
  const res = await fetch(
    `https://api.spotify.com/v1/recommendations?limit=5&seed_genres=${moodGenre}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    console.error("Spotify recommendations error:", res.statusText);
    return [];
  }

  const data = await res.json();

  return data.tracks.map(track => ({
    id: track.id,
    title: track.name,
    artist: track.artists[0]?.name,
    coverUrl: track.album.images[0]?.url,
    previewUrl: track.preview_url,
  }));
}
  