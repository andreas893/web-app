import { useNavigate } from "react-router-dom";

export default function Wrapped() {
  const navigate = useNavigate();

  return (
    <section className="mt-8 mb-8">
      <h2 className="text-lg font-bold mb-2">Wrapped</h2>

      <div className="space-y-4">
        {/* Ugentlig Wrapped */}
        <div className="bg-gradient-to-r from-indigo-300/50 to-purple-300/50 rounded-2xl p-4 text-center">
          <h3 className="text-lg font-bold">Din ugentlige Wrapped</h3>
          <p className="text-sm text-gray-200 mb-3">
            Spring ind i din uge i lyd
          </p>
          <button
            onClick={() => navigate("/wrapped-week")}
            className="bg-[#4D00FF] text-white font-bold py-1 px-4 rounded-full hover:bg-[#5c1aff] transition"
          >
            Her
          </button>
        </div>

        {/* Månedlig Wrapped */}
        <div className="bg-gradient-to-r from-indigo-300/50 to-purple-300/50 rounded-2xl p-4 text-center">
          <h3 className="text-lg font-bold">Din månedlige Wrapped</h3>
          <p className="text-sm text-gray-200 mb-3">
            Spring ind i din måned i lyd
          </p>
          <button
            onClick={() => navigate("/wrapped-month")}
            className="bg-[#4D00FF] text-white font-bold py-1 px-4 rounded-full hover:bg-[#5c1aff] transition"
          >
            Her
          </button>
        </div>
      </div>
    </section>
  );
}
