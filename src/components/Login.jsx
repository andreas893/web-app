import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { loginWithSpotify, getSpotifyToken } from "../spotifyAuthPKCE";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import "../login.css";
import { FaSpotify } from "react-icons/fa";
import { AiFillGoogleCircle } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";



async function ensureUserDocument(user) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      userId: user.uid,
      username: user.displayName || user.email?.split("@")[0] || "Ukendt bruger",
      photoURL: user.photoURL || "/images/default-avatar.png",
      email: user.email || "",
      createdAt: new Date().toISOString(),
      playlists: [],
      pinned: [],
    });
    console.log("✅ Nyt user-dokument oprettet:", user.uid);
  } else {
    const data = snap.data();
    const updates = {};

    // Tilføj manglende felter til ældre brugere
    if (!data.userId) updates.userId = user.uid;
    if (!data.photoURL) updates.photoURL = "/images/default-avatar.png";
    if (!data.username)
      updates.username = user.displayName || user.email?.split("@")[0];

    if (Object.keys(updates).length > 0) {
      await setDoc(userRef, updates, { merge: true });
      console.log("🔁 Opdaterede manglende felter for bruger:", user.uid);
    }
  }
}


export default function Login() {
  const [identifier, setIdentifier] = useState(""); // kan være e-mail eller brugernavn
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // håndter redirect fra Spotify
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    // Kun forsøg udveksling hvis vi har code og ingen token i forvejen
    if (code && !localStorage.getItem("spotify_access_token")) {
      (async () => {
        try {
          const token = await getSpotifyToken(code);
          if (token) {
            localStorage.setItem("spotify_access_token", token);
            // Rens URL'en for ?code=...
            window.history.replaceState({}, document.title, "/login");
            console.log("✅ Spotify token gemt");
          } else {
            console.warn("❌ Fik ikke token fra Spotify");
          }
        } catch (e) {
          console.error("Spotify token-fejl:", e);
        }
      })();
    }
  }, []);


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
      emailToUse = userDoc.data().email;
    }

    // 2️⃣ Login med Firebase Auth
    await signInWithEmailAndPassword(auth, emailToUse, password);

    // ✅ Sørg for at user-dokumentet eksisterer og har userId
    await ensureUserDocument(auth.currentUser);

    console.log("✅ Login succesfuldt!");
    navigate("/home");
  } catch (err) {
    console.error(err);
    setError("Forkert brugernavn/e-mail eller adgangskode.");
  }
};


  const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);

    // ✅ Opret / opdater Firestore-dokument
    await ensureUserDocument(auth.currentUser);

    console.log("✅ Logget ind med Google");
    navigate("/home");
  } catch (error) {
    console.error("Google-login fejl:", error.message);
    setError("Noget gik galt med Google-login.");
  }
};

 const handleFacebookLogin = async () => {
  const provider = new FacebookAuthProvider();
  try {
    await signInWithPopup(auth, provider);

    // ✅ Opret / opdater Firestore-dokument
    await ensureUserDocument(auth.currentUser);

    console.log("✅ Logget ind med Facebook");
    navigate("/home");
  } catch (error) {
    console.error("Facebook-login fejl:", error.message);
    setError("Noget gik galt med Facebook-login.");
  }
};

  // Start PKCE-flow med jeres helper (bruger VITE_SPOTIFY_REDIRECT_URI)
  const handleSpotifyLogin = () => {
    // Denne kalder authorize med code_challenge + redirect til VITE_SPOTIFY_REDIRECT_URI
    loginWithSpotify();
  };

  return (
     <div className="login-page">
      
      <div className="logo">
         <div className="logo-img"><img src="/images/chord-logo.png" alt="Chord logo" /></div>
         <h2>Log ind på chord</h2>
      </div>
       
      
      {/* socials login */}
      <div className="social-login">
          <button onClick={handleSpotifyLogin} className="social-btn spotify">
            <FaSpotify size={30} />
            <p>Fortsæt med Spotify</p></button>
          <button onClick={handleGoogleLogin} className="social-btn google">
          <AiFillGoogleCircle size={30} />
          <p>
          Fortsæt med Google
          </p></button>

          <button onClick={handleFacebookLogin} className="social-btn facebook">
            <FaFacebook size={30}/>
            <p>Fortsæt med Facebook</p></button>
      </div>
  

      <span className="line"></span>

      <div className="username-login">
         <form className="username-form" onSubmit={handleLogin}>
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

        <p className="tilmeld-tekst">
          Har du ikke en konto?{" "}
          <a href="/signup">
            Tilmeld dig her
          </a>
        </p>
      </div>
     
    </div>
  )
}
