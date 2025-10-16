import { Home, Library, Plus, MessageCircle, User, } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function FooterNav() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[#121212] border-t border-gray-800 py-3">
      <div className="flex justify-around items-center">
         <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-[#4D00FF]" : "text-[#E0E0E0]"
          }>
          <Home className="w-6 h-6" />
        </NavLink>

          <NavLink
          to="/library"
          className={({ isActive }) =>
            isActive ? "text-[#4D00FF]" : "text-[#E0E0E0]"
          }>
          <Library className="w-6 h-6" />
        </NavLink>

         <NavLink
          to="/create-post"
          className={({ isActive }) =>
            isActive ? "text-[#4D00FF]" : "text-[#E0E0E0]"
          }>
          <Plus className="w-6 h-6" />
        </NavLink>


        <NavLink
          to="/messages"
          className={({ isActive }) =>
            isActive ? "text-[#4D00FF]" : "text-[#E0E0E0]"
          }>
          <MessageCircle className="w-6 h-6" />
        </NavLink>

         <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "text-[#4D00FF]" : "text-[#E0E0E0]"
          }>
          <User className="w-6 h-6" />
        </NavLink>
        
      </div>
    </footer>
  );
}
