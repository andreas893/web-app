// src/components/PlaylistSharedConfirmation.jsx
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function PlaylistSharedConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 font-inter px-6">
      <CheckCircle2 className="w-20 h-20 text-white mb-4 animate-bounce" />
      <h2 className="text-2xl font-bold mb-2">Playlisten er delt!</h2>
      <p className="text-sm text-gray-100 mb-6 text-center">
        Playlisten er nu sendt ud til dine venner
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
