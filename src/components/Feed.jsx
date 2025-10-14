import { User, Heart, MessageSquare, Bookmark } from "lucide-react";

export default function Feed() {
  const feed = [
    {
      id: 1,
      user: "Mathias",
      song: "Take Care - Drake",
      img: "/images/takecare.jpg",
    },
    {
      id: 2,
      user: "Andreas",
      song: "Loud - Rihanna",
      img: "/images/loud.jpg",
    },
  ];

  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold mb-3">Feed</h2>
      <div className="flex gap-4 overflow-x-auto hide-scroll">
        {feed.map((post) => (
          <div
            key={post.id}
            className="flex-shrink-0 w-[220px] bg-[#1E1E1E] rounded-[18px] overflow-hidden"
          >
            <div className="relative">
              <img
                src={post.img}
                alt={post.song}
                className="w-full h-[250px] object-cover"
              />
              <div className="absolute right-2 top-2 flex flex-col items-center gap-2">
                <User className="w-5 h-5 text-white cursor-pointer" />
                <Heart className="w-5 h-5 text-white cursor-pointer" />
                <MessageSquare className="w-5 h-5 text-white cursor-pointer" />
                <Bookmark className="w-5 h-5 text-white cursor-pointer" />
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold">{post.song}</p>
              <p className="text-xs text-gray-400">{post.user}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
