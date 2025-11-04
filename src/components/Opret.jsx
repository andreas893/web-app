import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../login.css";
import { getImageUrl } from "../utils/getImageUrl";

const Opret = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

           await setDoc(doc(db, "users", user.uid), {
          // Basale brugerdata
          userId: user.uid,
          email: user.email,
          username: username.trim().toLowerCase(),
          photoURL: getImageUrl("images/default-avatar.png"), // fallback
          createdAt: new Date(),

          // Social struktur
          followers: [],
          following: [],

          // Musikpræferencer
          moods: [],              // fx ["Glad", "Chill"]
          genres: [],             // fx ["Pop", "Jazz"]
          discoveryPreference: null,
          eraPreference: null,          

          // Indhold og interaktioner
          playlists: [],           // gemte eller oprettede
          pinned: [],              // pinned playlister/posts
          posts: [],               // (kan evt. tilføjes når du vil have feed-relateret data)

          // Notifikationer
          notifications: [],       // valgfrit — eller du bruger separat collection
        });
        
         console.log("Bruger oprettet ✅"); 
         navigate("/onboarding", { replace: true });
        } catch (err) {
                setError(err.message);
                }
    };





  return (
     <div className="opret-page">
      <div className="opret-img"><img src="/images/chord-logo.png" alt="chord-logo" /></div>
      <h2>Opret konto</h2>
      <form onSubmit={handleSignup}>
         <input
          type="text"
          placeholder="Brugernavn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Adgangskode"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <button type="submit">Opret konto</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  )
}

export default Opret