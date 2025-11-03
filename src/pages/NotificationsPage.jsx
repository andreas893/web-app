// src/pages/NotificationsPage.jsx
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import FooterNav from "../components/FooterNav";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Lyt til ændringer i Firestore i realtid
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotifications(data);
    });

    return () => unsubscribe();
  }, []);

  const formatAction = (type) => {
    switch (type) {
      case "like":
        return "likede dit post.";
      case "comment":
        return "kommenterede på dit post.";
      case "save":
        return "gemte dit post.";
      case "post":
        return "lavede et nyt post.";
      default:
        return "";
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-white min-h-screen flex flex-col font-inter">
      {/* Header */}
      <div className="px-4 py-3 bg-[#1c1c1c] rounded-b-2xl text-center">
        <h2 className="text-lg font-semibold">Notifikationer</h2>
      </div>

      {/* Filter pill */}
      <div className="flex justify-center mt-4">
        <button className="bg-[#4D00FF] text-white font-medium py-1.5 px-6 rounded-full text-sm">
          Aktivitet
        </button>
      </div>

      {/* Liste */}
      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-400 mt-10 text-sm">
            Ingen aktivitet endnu.
          </p>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
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
                    {n.user} {formatAction(n.type)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {n.createdAt?.toDate
                      ? n.createdAt.toDate().toLocaleDateString("da-DK", {
                          day: "2-digit",
                          month: "short",
                        })
                      : ""}
                  </p>
                </div>
              </div>

              {n.imageUrl && (
                <img
                  src={n.imageUrl}
                  alt="Post"
                  className="w-14 h-14 rounded-lg object-cover shrink-0"
                />
              )}
            </div>
          ))
        )}
      </div>

      <FooterNav />
    </div>
  );
}
