import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WrappedWeek() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const slides = [
    {
      title: "Hej Mathias",
      subtitle: "Se denne uges wrapped",
    },
    {
      title: "Du lyttede til 543 minutter musik denne uge",
    },
    {
      title: "Din største dag var fredag med 144 minutter",
    },
    {
      title: "Du har afspillet 56 sange denne uge",
    },
    {
      title: "Dine top Sange",
      list: [
        "1. Practice – Drake",
        "2. Where have u been – Rihanna",
        "3. 90210 – Travis Scott",
        "4. Hold on, We’re going home – Drake",
        "5. Sacrifice – The Weeknd",
      ],
    },
    {
      title: "Din top sang denne uge var Practice af Drake",
      image:
        "https://i.scdn.co/image/ab67616d0000b273a7b2b501b6a6c5e1b2b2f4d8", // Dummy album
    },
    {
      title: "Dit humør har ændret sig meget i løbet af ugen",
      subtitle: "Lad os se på din ugentlige musikudvikling",
    },
    {
      title: "Dine top humøre",
      list: ["1. Glad", "2. Festlig", "3. Inspireret", "4. Ked af det", "5. Sur"],
    },
    {
      title: "Din ugentlige wrapped",
      subtitle: "Humør & Sange",
      extra: {
        moods: ["1. Glad", "2. Festlig", "3. Inspireret", "4. Ked af det", "5. Sur"],
        songs: [
          "1. Practice – Drake",
          "2. Where have u been – Rihanna",
          "3. 90210 – Travis Scott",
          "4. Hold on, We’re going home – Drake",
          "5. Sacrifice – The Weeknd",
        ],
        minutes: "543 minutter lyttet",
      },
    },
    {
      title: "Tak fordi du kom med på turen",
      subtitle: "Kom igen næste uge",
    },
    {
      title: "Vil du dele din wrapped med dine venner?",
      button: "Del",
    },
  ];

  const totalSlides = slides.length;
  const progressRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    // Automatisk fremdrift
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
    }, 3000);

    return () => clearInterval(timerRef.current);
  }, []);

  const nextSlide = () => {
    setIndex((i) => (i < totalSlides - 1 ? i + 1 : i));
  };

  const prevSlide = () => {
    setIndex((i) => (i > 0 ? i - 1 : 0));
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center text-white flex flex-col items-center justify-center transition-all duration-500"
      style={{
        backgroundImage:
          "url('/img/wrapped-bg-week.jpg')", // samme baggrund som week på forsiden
      }}
      onClick={nextSlide}
    >
      {/* Progressbar */}
      <div className="absolute top-4 left-0 right-0 flex justify-center gap-1 px-6">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-[4px] w-full bg-gray-600/40 rounded-full overflow-hidden"
          >
            <div
              ref={(el) => (progressRef.current[i] = el)}
              className={`h-full bg-purple-500 transition-all duration-300 ${
                i <= index ? "w-full" : "w-0"
              }`}
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
        className="absolute top-5 right-5 text-white hover:text-gray-300 transition"
      >
        <X size={26} />
      </button>

      {/* Indhold */}
      <div
        className="text-center px-8 transition-all duration-500 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          {slides[index].title}
        </h1>

        {slides[index].subtitle && (
          <p className="text-gray-300 mb-4">{slides[index].subtitle}</p>
        )}

        {slides[index].image && (
          <img
            src={slides[index].image}
            alt="Album"
            className="mx-auto rounded-xl w-56 h-56 object-cover mb-4 shadow-lg"
          />
        )}

        {slides[index].list && (
          <ul className="text-gray-300 space-y-1 text-lg">
            {slides[index].list.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}

        {slides[index].extra && (
          <div className="text-left text-gray-300 space-y-3 text-sm max-w-md mx-auto">
            <div>
              <h3 className="font-bold text-white mb-1">Humør</h3>
              <ul>
                {slides[index].extra.moods.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Sange</h3>
              <ul>
                {slides[index].extra.songs.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <p className="text-white text-center mt-3 font-bold">
              {slides[index].extra.minutes}
            </p>
          </div>
        )}

        {slides[index].button && (
          <button className="bg-[#4D00FF] text-white font-semibold px-6 py-2 rounded-full mt-6 shadow-md">
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
