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
  