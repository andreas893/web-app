import { Music, ListMusic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function SharePopup({ onClose }) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex justify-center items-end z-50"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={(e, info) => {
            if (info.offset.y > 100) onClose();
          }}
          className="bg-[#23262C] w-full h-[35vh] rounded-t-3xl p-6 text-white relative shadow-[0_-6px_20px_rgba(0,0,0,0.6)]"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hvid træk-linje */}
          <div
            className="w-12 h-1 bg-white rounded-full mx-auto mb-4 cursor-pointer"
            onClick={onClose}
          ></div>

          {/* Valg */}
          <div className="space-y-3">
            {/* === DEL PLAYLIST === */}
            <div
              className="flex items-center gap-4 pb-2 pt-4 rounded-2xl cursor-pointer hover:bg-[#333333] transition"
              onClick={() => {
                onClose();
                navigate("/share-playlist");
              }}
            >
              <div className="popup-icon">
                <ListMusic size={28} />
              </div>
              <div>
                <p className="font-semibold text-white">Del Playlist</p>
                <p className="text-sm text-gray-400">
                  Del en playliste til dit netværk.
                </p>
              </div>
            </div>

            {/* === DEL SANG === */}
            <div
              className="flex items-center gap-4 rounded-2xl cursor-pointer hover:bg-[#333333] transition"
              onClick={() => {
                onClose();
                navigate("/share-song");
              }}
            >
              <div className="popup-icon">
                <Music size={28} />
              </div>
              <div>
                <p className="font-semibold text-white">Del sang</p>
                <p className="text-sm text-gray-400">
                  Del en sang til dit netværk.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
