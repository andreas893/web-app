export default function SoundForYou() {
    const moods = [
      { name: "Glad", img: "/images/glad.jpg" },
      { name: "Inspireret", img: "/images/inspireret.jpg" },
      { name: "Ked af det", img: "/images/ked.jpg" },
      { name: "Sur", img: "/images/sur.jpg" },
      { name: "Festlig", img: "/images/fest.jpg" },
    ];
  
    return (
      <section className="mt-6">
        <h2 className="text-lg font-bold mb-3">Sound for you</h2>
        <div className="flex gap-4 overflow-x-auto hide-scroll">
          {moods.map((mood, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[200px] h-[200px] rounded-full overflow-hidden relative"
            >
              <img
                src={mood.img}
                alt={mood.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center text-xl font-bold bg-black/20">
                {mood.name}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  }
  