import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Opret = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid),{
                email: user.email,
                username: username,
                createdAt: new Date(),
                moods: [],
                genres: [],
                playlists: [],

            });
        
         console.log("Bruger oprettet ✅"); } catch (err) {
                setError(err.message);
                }
    };





  return (
     <div className="login-page">
      <h2>Opret konto</h2>
      <form onSubmit={handleSignup}>
         <input
          type="email"
          placeholder="E-mail"
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
        />
        <button type="submit">Opret konto</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  )
}

export default Opret