// src/pages/MessagesPage.jsx
import { useNavigate } from "react-router-dom";
import { Bell, UserPlus } from "lucide-react";
import FooterNav from "../components/FooterNav";

export default function MessagesPage() {
  const navigate = useNavigate();

  // lige nu hardcoded
  const chats = [
    {
      id: "andreas",
      name: "Andreas",
      lastMessage: "Delte en playliste - 16t siden",
      date: "12 sep",
    },
    {
      id: "gruppe",
      name: "Gruppechat",
      lastMessage: "Navn delte en sang - 14t siden",
      date: "12 sep",
    },
  ];

  return (
    <div className="bg-[#0d0d0d] text-white min-h-screen flex flex-col font-inter">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1c1c1c] rounded-b-2xl">
        <UserPlus className="w-6 h-6 text-gray-300" />
        <h2 className="text-lg font-semibold">Beskeder</h2>

        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/notifications")}
        >
          <Bell className="w-6 h-6 text-gray-300" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => navigate(`/messages/${chat.id}`)}
          >
            <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
              {/* avatar icon */}
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
            <div>
              <p className="font-medium">{chat.name}</p>
              <p className="text-sm text-gray-400">{chat.lastMessage}</p>
              <p className="text-xs text-gray-500 mt-0.5">{chat.date}</p>
            </div>
          </div>
        ))}
      </div>

      <FooterNav />
    </div>
  );
}
