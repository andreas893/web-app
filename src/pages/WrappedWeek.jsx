import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WrappedWeek() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const progressRef = useRef([]);
  const timerRef = useRef(null);

  const slides = [
    { title: "Hej Mathias", subtitle: "Se denne uges wrapped" },
    { title: "Du lyttede til 543 minutter musik denne uge" },
    { title: "Din største dag var fredag med 144 minutter" },
    { title: "Du har afspillet 56 sange denne uge" },
    {
      title: "Dine top Sange",
      list: [
        "1. Practice – Drake",
        "2. Where Have U Been – Rihanna",
        "3. 90210 – Travis Scott",
        "4. Hold On, We’re Going Home – Drake",
        "5. Sacrifice – The Weeknd",
      ],
    },
    {
      title: "Din top sang denne uge var Practice af Drake",
      image: "/images/takecare.jpg",
    },
    {
      title: "Dit humør har ændret sig meget i løbet af ugen",
      subtitle: "Lad os se på din ugentlige musikudvikling",
    },
    { title: "Tak fordi du kom med på turen", subtitle: "Kom igen næste uge!" },
    { title: "Vil du dele din wrapped med dine venner?", button: "Del" },
  ];

  const totalSlides = slides.length;

  // Automatisk fremdrift
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
    }, 3500);
    return () => clearInterval(timerRef.current);
  }, []);

  const nextSlide = () => setIndex((i) => (i < totalSlides - 1 ? i + 1 : i));
  const prevSlide = () => setIndex((i) => (i > 0 ? i - 1 : 0));

  return (
    <div
      className="relative w-full h-screen text-white flex flex-col items-center justify-center transition-all duration-500"
      style={{
        background:
          "linear-gradient(160deg, #FF758C 0%, #FF7EB3 40%, #FCA17D 100%)",
      }}
      onClick={nextSlide}
    >
      {/* Progressbar */}
      <div className="absolute top-4 left-0 right-0 flex justify-center gap-1 px-6">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-[4px] w-full bg-white/20 rounded-full overflow-hidden"
          >
            <div
              ref={(el) => (progressRef.current[i] = el)}
              className={`h-full transition-all duration-300 ${
                i <= index ? "w-full" : "w-0"
              }`}
              style={{ backgroundColor: "#9b5cf6" }}
            />
          </div>
        ))}
      </div>

      {/* Luk-knap */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate("/");
        }}
        className="absolute top-5 right-5 text-white/90 hover:text-white transition"
      >
        <X size={26} />
      </button>

      {/* Indhold */}
      <div
        className="text-center px-8 transition-all duration-500 ease-in-out flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 drop-shadow-lg">
          {slides[index].title}
        </h1>

        {slides[index].subtitle && (
          <p className="text-white/90 mb-4">{slides[index].subtitle}</p>
        )}

        {slides[index].image && (
          <img
            src={slides[index].image}
            alt="Album"
            className="mx-auto rounded-2xl w-64 h-64 object-cover mt-4 shadow-xl border-2 border-white/40"
          />
        )}

        {slides[index].list && (
          <ul className="text-white/90 space-y-1 text-lg mt-4">
            {slides[index].list.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}

        {slides[index].button && (
          <button className="bg-white text-black font-semibold px-6 py-2 rounded-full mt-6 shadow-md hover:bg-gray-200 transition">
            {slides[index].button}
          </button>
        )}
      </div>

      {/* Venstre klik for tilbage */}
      {index > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 w-[35%] cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
        />
      )}
    </div>
  );
}
