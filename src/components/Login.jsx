import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // kan være e-mail eller brugernavn
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let emailToUse = identifier;

      // 1️⃣ Hvis brugeren har skrevet et brugernavn i stedet for e-mail:
      if (!identifier.includes("@")) {
        const q = query(collection(db, "users"), where("username", "==", identifier));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("Brugernavn ikke fundet");
        }

        const userDoc = querySnapshot.docs[0];
        emailToUse = userDoc.data().email; // brug den tilhørende e-mail
      }

      // 2️⃣ Login med Firebase Auth
      await signInWithEmailAndPassword(auth, emailToUse, password);

      console.log("✅ Login succesfuldt!");
      navigate("/"); // fx til forsiden
    } catch (err) {
      console.error(err);
      setError("Forkert brugernavn/e-mail eller adgangskode.");
    }
  };


  const handleGoogleLogin = async () =>{
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider)
      console.log("logget ind med google");
      navigate("/");      
    } catch (error) {
      console.error("facebook-login fejl", error.message);
      setError("Noget gik galt med Facebook-login.");
    }
  };

  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      console.log("✅ Logget ind med Facebook");
      navigate("/");
    } catch (error) {
      console.error("Facebook-login fejl:", error.message);
      setError("Noget gik galt med Facebook-login.");
    }
  };

  const handleSpotifyLogin = () =>{
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = window.location.origin + "/";
    const scopes = "user-read-email user-read-private";
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}`;
    window.location.href = authUrl;
  }

  return (
     <div className="login-page">
      
      <h2>Log på “app-navn”</h2>
      
      {/* socials login */}

      <button onClick={handleSpotifyLogin} className="social-btn spotify"><img src="../assets/images/spotify.png" alt="" />Fortsæt med Spotify</button>
      <button onClick={handleGoogleLogin} className="social-btn google"><img src="../assets/images/google.png" alt="" />Fortsæt med Google</button>
      <button onClick={handleFacebookLogin} className="social-btn facebook"><img src="../assets/images/facebook-01.png" alt="" />Fortsæt med Facebook</button>

      <span className="line"></span>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="E-mailadresse eller brugernavn"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Adgangskode"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <button type="submit">Log in</button>
      </form>

      {error && <p className="error">{error}</p>}

      <p>
        Har du ikke en konto?{" "}
        <a href="/signup" style={{ textDecoration: "underline" }}>
          Tilmeld dig her
        </a>
      </p>
    </div>
  )
}
