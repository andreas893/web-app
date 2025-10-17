// src/spotifyAuthPKCE.js

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const scopes = import.meta.env.VITE_SPOTIFY_SCOPES;

// 🔒 Helper: Lav kodeverifier og challenge
function base64encode(str) {
  return btoa(String.fromCharCode(...new Uint8Array(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64encode(digest);
}

// 🔐 Login-funktion
export async function loginWithSpotify() {
  const codeVerifier = base64encode(crypto.getRandomValues(new Uint8Array(64)));
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem("spotify_code_verifier", codeVerifier);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scopes,
    redirect_uri: redirectUri,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  console.log("🚀 Redirecting to Spotify with:", Object.fromEntries(params));

  window.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// 🎫 Byt authorization code til access token
export async function getSpotifyToken(code) {
  const codeVerifier = localStorage.getItem("spotify_code_verifier");

  console.log("🧩 Sender til Spotify:", {
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json();
  console.log("🔐 Spotify token response:", data);

  if (data.access_token) {
    console.log("✅ Token hentet korrekt!");
    return data.access_token;
  } else {
    console.error("❌ Spotify token fejl:", data);
    return null;
  }
}
