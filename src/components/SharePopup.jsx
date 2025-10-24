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
          className="bg-[#1E1E1E] w-full rounded-t-3xl p-6 text-white relative"
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
            <div
              className="flex items-center gap-4 p-4 bg-[#2A2A2A] rounded-2xl cursor-pointer hover:bg-[#333333] transition"
              onClick={() => {
                onClose();
                navigate("/share-playlist");
              }}
            >
              <div className="bg-white text-[#1E1E1E] p-3 rounded-full">
                <ListMusic size={22} />
              </div>
              <div>
                <p className="font-semibold text-white">Del Playlist</p>
                <p className="text-sm text-gray-400">
                  Del en playliste til dit netværk, for dem at se og gemme
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-4 p-4 bg-[#2A2A2A] rounded-2xl cursor-pointer hover:bg-[#333333] transition"
              onClick={() => {
                onClose();
                navigate("/share-song");
              }}
            >
              <div className="bg-white text-[#1E1E1E] p-3 rounded-full">
                <Music size={22} />
              </div>
              <div>
                <p className="font-semibold text-white">Del sang</p>
                <p className="text-sm text-gray-400">
                  Del en sang til dit netværk, for dem at se og gemme
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
