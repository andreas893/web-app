import { Home, Library, Plus, MessageCircle, User } from "lucide-react";

export default function FooterNav() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[#121212] border-t border-gray-800 py-3">
      <div className="flex justify-around items-center">
        <Home className="w-6 h-6 text-[#4D00FF]" />
        <Library className="w-6 h-6 text-[#E0E0E0]" />
        <Plus className="w-6 h-6 text-[#E0E0E0]" />
        <MessageCircle className="w-6 h-6 text-[#E0E0E0]" />
        <User className="w-6 h-6 text-[#E0E0E0]" />
      </div>
    </footer>
  );
}
