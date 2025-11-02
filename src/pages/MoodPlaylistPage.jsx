import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { searchTrackByName } from "../services/spotifyService";

export default function MoodPlaylistPage() {
  const { moodType } = useParams();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);

  const moodData = {
    glad: {
      title: "Glad",
      songs: [
        { title: "Happy", artist: "Pharrell Williams" },
        { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
        { title: "Can’t Stop the Feeling!", artist: "Justin Timberlake" },
        { title: "Good as Hell", artist: "Lizzo" },
        { title: "Firework", artist: "Katy Perry" },
        { title: "Walking on Sunshine", artist: "Katrina & The Waves" },
        { title: "Shut Up and Dance", artist: "WALK THE MOON" },
        { title: "On Top of the World", artist: "Imagine Dragons" },
        { title: "Good Time", artist: "Owl City & Carly Rae Jepsen" },
        { title: "Levitating", artist: "Dua Lipa" },
      ],
    },
    inspireret: {
      title: "Inspireret",
      songs: [
        { title: "Lose Yourself", artist: "Eminem" },
        { title: "Stronger", artist: "Kanye West" },
        { title: "Hall of Fame", artist: "The Script ft. will.i.am" },
        { title: "Believer", artist: "Imagine Dragons" },
        { title: "Unstoppable", artist: "Sia" },
        { title: "Power", artist: "Kanye West" },
        { title: "Whatever It Takes", artist: "Imagine Dragons" },
        { title: "Eye of the Tiger", artist: "Survivor" },
        { title: "Stronger (What Doesn’t Kill You)", artist: "Kelly Clarkson" },
        { title: "Titanium", artist: "David Guetta ft. Sia" },
      ],
    },
    ked: {
      title: "Ked af det",
      songs: [
        { title: "Someone Like You", artist: "Adele" },
        { title: "Let Her Go", artist: "Passenger" },
        { title: "Fix You", artist: "Coldplay" },
        { title: "All I Want", artist: "Kodaline" },
        { title: "When I Was Your Man", artist: "Bruno Mars" },
        { title: "The Night We Met", artist: "Lord Huron" },
        { title: "Skinny Love", artist: "Bon Iver" },
        { title: "I Will Always Love You", artist: "Whitney Houston" },
        { title: "Someone You Loved", artist: "Lewis Capaldi" },
        { title: "Say Something", artist: "A Great Big World & Christina Aguilera" },
      ],
    },
    sur: {
      title: "Sur",
      songs: [
        { title: "Smells Like Teen Spirit", artist: "Nirvana" },
        { title: "Killing in the Name", artist: "Rage Against The Machine" },
        { title: "In the End", artist: "Linkin Park" },
        { title: "Boulevard of Broken Dreams", artist: "Green Day" },
        { title: "HUMBLE.", artist: "Kendrick Lamar" },
        { title: "Bad Guy", artist: "Billie Eilish" },
        { title: "Stronger", artist: "Kanye West" },
        { title: "MONTERO (Call Me By Your Name)", artist: "Lil Nas X" },
        { title: "Radioactive", artist: "Imagine Dragons" },
        { title: "Bad Blood", artist: "Taylor Swift" },
      ],
    },
    festlig: {
      title: "Festlig",
      songs: [
        { title: "Blinding Lights", artist: "The Weeknd" },
        { title: "Dance Monkey", artist: "Tones and I" },
        { title: "Can’t Hold Us", artist: "Macklemore & Ryan Lewis" },
        { title: "Don't Start Now", artist: "Dua Lipa" },
        { title: "24K Magic", artist: "Bruno Mars" },
        { title: "Taki Taki", artist: "DJ Snake, Selena Gomez, Ozuna, Cardi B" },
        { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
        { title: "Party Rock Anthem", artist: "LMFAO" },
        { title: "Timber", artist: "Pitbull ft. Kesha" },
        { title: "I Wanna Dance with Somebody", artist: "Whitney Houston" },
      ],
    },
  };

  const mood = moodData[moodType];

  useEffect(() => {
    if (!mood) return;

    const loadSpotifyData = async () => {
      const results = await Promise.all(
        mood.songs.map(async (s) => {
          const track = await searchTrackByName(`${s.title} ${s.artist}`);
          return {
            ...s,
            coverUrl: track?.coverUrl || null,
            spotifyUrl: track?.spotifyUrl || null,
          };
        })
      );
      setSongs(results);
    };

    loadSpotifyData();
  }, [moodType]);

  if (!mood) {
    return (
      <div className="text-white p-6">
        <h1 className="text-2xl font-bold">Ukendt humør 😅</h1>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-white min-h-screen px-4 py-6 font-inter relative">
      {/* 🔙 Tilbagepil */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-4 flex items-center gap-1 text-gray-300 hover:text-white transition"
      >
        <ArrowLeft size={22} />
        <span className="text-sm font-medium">Tilbage</span>
      </button>

      <div className="pt-12">
        <h1 className="text-2xl font-bold mb-6">{mood.title}</h1>

        <div className="space-y-4">
          {songs.map((song, index) => (
            <a
              key={index}
              href={song.spotifyUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-[#1E1E1E] rounded-xl p-3 shadow-md hover:bg-[#2a2a2a] transition"
            >
              <img
                src={
                  song.coverUrl ||
                  "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
                }
                alt={song.title}
                className="w-14 h-14 rounded-lg object-cover mr-4"
              />
              <div>
                <h3 className="font-semibold">{song.title}</h3>
                <p className="text-sm text-gray-400">{song.artist}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
