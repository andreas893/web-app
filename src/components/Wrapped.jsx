import { useNavigate } from "react-router-dom";

export default function Wrapped() {
  const navigate = useNavigate();

  return (
    <section className="mt-8 mb-8">
      <h2 className="text-lg font-bold mb-2">Wrapped</h2>

      <div className="space-y-4">
        {/* Ugentlig Wrapped */}
        <div
          className="rounded-2xl p-4 text-center text-white cursor-pointer transition-transform hover:scale-[1.02] shadow-lg"
          style={{
            background:
              "linear-gradient(160deg, #FF758C 0%, #FF7EB3 40%, #FCA17D 100%)",
          }}
          onClick={() => navigate("/wrapped-week")}
        >
          <h3 className="text-lg font-bold">Din ugentlige Wrapped</h3>
          <p className="text-sm text-white/90 mb-3">
            Spring ind i din uge i lyd
          </p>
          <button className="bg-white text-black font-bold py-1 px-4 rounded-full hover:bg-gray-200 transition">
            Her
          </button>
        </div>

        {/* Månedlig Wrapped */}
        <div
          className="rounded-2xl p-4 text-center text-white cursor-pointer transition-transform hover:scale-[1.02] shadow-lg"
          style={{
            background:
              "linear-gradient(160deg, #5C6BC0 0%, #7E57C2 40%, #9575CD 100%)",
          }}
          onClick={() => navigate("/wrapped-month")}
        >
          <h3 className="text-lg font-bold">Din månedlige Wrapped</h3>
          <p className="text-sm text-white/90 mb-3">
            Spring ind i din måned i lyd
          </p>
          <button className="bg-white text-black font-bold py-1 px-4 rounded-full hover:bg-gray-200 transition">
            Her
          </button>
        </div>
      </div>
    </section>
  );
}
