const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const AUTH_ENDPOINT = import.meta.env.VITE_SPOTIFY_AUTH_ENDPOINT;
const SCOPES = import.meta.env.VITE_SPOTIFY_SCOPES;

export const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&scope=${encodeURIComponent(SCOPES)}&response_type=token&show_dialog=true`;
