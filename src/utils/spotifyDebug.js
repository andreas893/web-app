export async function logSpotifyGenres() {
  const token = localStorage.getItem("spotify_access_token");
  if (!token) {
    console.warn("Ingen Spotify token fundet — log ind først.");
    return;
  }

  try {
    const res = await fetch(
      "https://api.spotify.com/v1/recommendations/available-genre-seeds",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      console.error("Fejl ved hentning af genre-liste:", res.status, res.statusText);
      return;
    }

    const data = await res.json();
    console.log("🎧 Spotify available genres:", data.genres);
  } catch (err) {
    console.error("Kunne ikke hente Spotify genre-liste:", err);
  }
}
