import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
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

  return (
     <div className="login-page">
      <h2>Log på “app-navn”</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
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
