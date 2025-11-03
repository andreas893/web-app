import { useNavigate } from "react-router-dom";

export default function SoundForYou() {
  const navigate = useNavigate();

  const moods = [
    { name: "Good Vibes", route: "glad", gradient: "bg-gradient-to-br from-yellow-300 via-pink-400 to-orange-500" },
    { name: "Creative Spark", route: "inspireret", gradient: "bg-gradient-to-br from-purple-400 via-indigo-400 to-blue-400" },
    { name: "Melankoli", route: "ked", gradient: "bg-gradient-to-br from-blue-400 via-indigo-500 to-blue-700" },
    { name: "Pure Chaos", route: "sur", gradient: "bg-gradient-to-br from-red-500 via-orange-600 to-red-700" },
    { name: "Weekend Fever", route: "festlig", gradient: "bg-gradient-to-br from-pink-500 via-yellow-400 to-purple-500" },
  ];

  return (
    <section className="mt-6">
      <h2 className="text-lg font-bold mb-3">Sound for you</h2>
      <div className="flex gap-4 overflow-x-auto hide-scroll">
        {moods.map((mood, i) => (
          <div
            key={i}
            onClick={() => navigate(`/mood/${mood.route}`)}
            className={`flex-shrink-0 w-[200px] h-[200px] rounded-[18px] overflow-hidden relative ${mood.gradient} cursor-pointer transition-transform hover:scale-105`}
          >
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-black/80">
              {mood.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
