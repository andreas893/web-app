import { Home, Library, Plus, MessageCircle, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function FooterNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const icons = [
    { icon: Home, path: "/" },
    { icon: Library, path: "/library" },
    { icon: Plus, path: "/share" },
    { icon: MessageCircle, path: "/messages" },
    { icon: User, path: "/profile" },
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[#121212] border-t border-gray-800 py-3">
      <div className="flex justify-around items-center">
        {icons.map(({ icon: Icon, path }) => (
          <Icon
            key={path}
            onClick={() => navigate(path)}
            className={`w-6 h-6 cursor-pointer ${
              location.pathname === path ? "text-[#4D00FF]" : "text-[#E0E0E0]"
            }`}
          />
        ))}
      </div>
    </footer>
  );
}
