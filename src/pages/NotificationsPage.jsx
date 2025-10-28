// src/pages/NotificationsPage.jsx
import FooterNav from "../components/FooterNav";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      name: "Navn",
      action: "gemte dit post.",
      date: "12 sep",
      image:
        "https://i.scdn.co/image/ab67616d0000b2737d9b8a9c58c7c832b0ccfc94",
    },
    {
      id: 2,
      name: "Navn",
      action: "likede dit post.",
      date: "12 sep",
      image:
        "https://i.scdn.co/image/ab67616d0000b273a25b2d6742e6b2f58c3f1f2a",
    },
  ];

  return (
    <div className="bg-[#0d0d0d] text-white min-h-screen flex flex-col font-inter">
      {/* Header */}
      <div className="px-4 py-3 bg-[#1c1c1c] rounded-b-2xl text-center">
        <h2 className="text-lg font-semibold">Notifikationer</h2>
      </div>

      {/* Filter pill */}
      <div className="flex justify-center mt-4">
        <button className="bg-purple-600 text-white font-medium py-1.5 px-6 rounded-full text-sm flex items-center gap-1">
          <span>Aktivitet</span>
          <span className="text-xs">⌁</span>
        </button>
      </div>

      {/* Liste */}
      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {notifications.map((n) => (
          <div key={n.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                {/* avatar */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.847.576 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>

              <div className="text-left">
                <p className="font-medium text-[15px] leading-snug">
                  {n.name} {n.action}
                </p>
                <p className="text-xs text-gray-400 mt-1">{n.date}</p>
              </div>
            </div>

            <img
              src={n.image}
              alt="Post"
              className="w-14 h-14 rounded-lg object-cover shrink-0"
            />
          </div>
        ))}
      </div>

      <FooterNav />
    </div>
  );
}
