import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics"; // valgfrit

// Din Firebase konfiguration (den du allerede har)
const firebaseConfig = {
  apiKey: "AIzaSyBKCV65Rm9U1V5Y-Xkul5fBSGIi3zLnmU8",
  authDomain: "web-app-de082.firebaseapp.com",
  databaseURL: "https://web-app-de082-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "web-app-de082",
  storageBucket: "web-app-de082.firebasestorage.app",
  messagingSenderId: "890577631951",
  appId: "1:890577631951:web:32b4698fbbcf3a791a95ba",
  measurementId: "G-9WX20YNPK6",
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Opret references til de services I skal bruge
export const db = getFirestore(app);      // Database (Firestore)
export const auth = getAuth(app);         // Login/signup
export const storage = getStorage(app);   // Upload billeder, covers osv.