export default function Wrapped() {
    return (
      <section className="mt-8 mb-8">
        <h2 className="text-lg font-bold mb-2">Wrapped</h2>
  
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-300/50 to-purple-300/50 rounded-2xl p-4 text-center">
            <h3 className="text-lg font-bold">Din ugentlige Wrapped</h3>
            <p className="text-sm text-gray-200 mb-3">
              Spring ind i din uge i lyd
            </p>
            <button className="bg-[#4D00FF] text-white font-bold py-1 px-4 rounded-full">
              Her
            </button>
          </div>
  
          <div className="bg-gradient-to-r from-indigo-300/50 to-purple-300/50 rounded-2xl p-4 text-center">
            <h3 className="text-lg font-bold">Din månedlige Wrapped</h3>
            <p className="text-sm text-gray-200 mb-3">
              Spring ind i din måned i lyd
            </p>
            <button className="bg-[#4D00FF] text-white font-bold py-1 px-4 rounded-full">
              Her
            </button>
          </div>
        </div>
      </section>
    );
  }
  