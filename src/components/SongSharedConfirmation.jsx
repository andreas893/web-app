// src/components/SongSharedConfirmation.jsx
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function SongSharedConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 font-inter px-6">
      <CheckCircle className="w-20 h-20 text-white mb-4 animate-bounce" />
      <h2 className="text-2xl font-bold mb-2">Sangen er delt!</h2>
      <p className="text-sm text-gray-100 mb-6 text-center">
        Sangen er nu delt med dit netværk
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-white text-black font-semibold py-2 px-6 rounded-full shadow-lg hover:scale-105 transition"
      >
        Tilbage til forsiden
      </button>
    </div>
  );
}
