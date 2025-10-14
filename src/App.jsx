import { Routes, Route, Navigate } from "react-router";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Landingpage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
