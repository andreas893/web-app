import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import Opret from "./pages/Opret";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Opret />} />

           <Route
            path="/"
            element={
              <ProtectedRoute>
                <LandingPage />
              </ProtectedRoute>
            }
          />

           <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}
