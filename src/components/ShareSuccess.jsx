import { Check } from "lucide-react";

export default function ShareSuccess({ type = "sang", onClose }) {
  // type: "sang" | "playlist"

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999] text-white">
      <button
        className="absolute top-5 right-5 text-gray-400 hover:text-white"
        onClick={onClose}
      >
        ✕
      </button>

      <h1 className="text-2xl font-bold mb-10 text-center">
        {type === "playlist" ? "Playliste delt!" : "Sang delt!"}
      </h1>

      <div className="w-40 h-40 rounded-full border-2 border-green-500 flex items-center justify-center">
        <Check size={64} className="text-green-500" />
      </div>
    </div>
  );
}
