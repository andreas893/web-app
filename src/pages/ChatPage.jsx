// src/pages/ChatPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
  Send,
} from "lucide-react";
import { getAuth } from "firebase/auth";

import {
  listenToMessages,
  sendTextMessage,
  sendSongMessage,
  updateMessage,
  deleteMessage,
} from "../services/firebaseChat";

import { getTrackInfo } from "../services/spotifyService";
import ShareSong from "../components/ShareSong";

// indtil begge har login med auth.currentUser.uid
const MATHIAS_UID = "mathiasUid123";
const ANDREAS_UID = "andreasUid123";

function buildChatId(uid1, uid2) {
  return [uid1, uid2].sort().join("_");
}

export default function ChatPage() {
  const navigate = useNavigate();
  const { chatId: routeParam } = useParams(); // "andreas"

  const auth = getAuth();
  const currentUid = auth.currentUser?.uid || MATHIAS_UID;
  const otherUid = routeParam === "andreas" ? ANDREAS_UID : "unknown";

  const chatId = useMemo(
    () => buildChatId(currentUid, otherUid),
    [currentUid, otherUid]
  );

  // tekstfelt nederst
  const [inputValue, setInputValue] = useState("");

  // hvilke beskeder der er i chatten
  const [messagesWithSpotify, setMessagesWithSpotify] = useState([]);

  // hvilken besked har åben "..." menu
  const [menuMessageId, setMenuMessageId] = useState(null);

  // redigering
  const [editMessageId, setEditMessageId] = useState(null);
  const [editText, setEditText] = useState("");

  // popup states
  const [showChooseShareType, setShowChooseShareType] = useState(false); // første popup (del sang / del playliste)
  const [showSongPicker, setShowSongPicker] = useState(false); // anden popup (ShareSong)
  const [showPlaylistPicker, setShowPlaylistPicker] = useState(false); // placeholder til playlist-flow

  // realtime beskeder
  useEffect(() => {
    const unsub = listenToMessages(chatId, async (rawMessages) => {
      const enriched = await Promise.all(
        rawMessages.map(async (m) => {
          if (m.type === "song" && m.song?.trackId) {
            const track = await getTrackInfo(m.song.trackId);
            return {
              ...m,
              songData: track,
            };
          }
          return m;
        })
      );
      setMessagesWithSpotify(enriched);
    });

    return () => unsub();
  }, [chatId]);

  // SEND TEKST
  async function handleSendText() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    await sendTextMessage(chatId, currentUid, trimmed, [
      currentUid,
      otherUid,
    ]);

    setInputValue("");
  }

  // NÅR EN SANG ER VALGT I SHARESONG
  async function handleSongChosen(trackId) {
    await sendSongMessage(chatId, currentUid, trackId, [
      currentUid,
      otherUid,
    ]);

    setShowSongPicker(false);
    setShowChooseShareType(false);
  }

  // START REDIGERING AF EN TEKSTBESKED
  function startEditMessage(msg) {
    setEditMessageId(msg.id);
    setEditText(msg.text || "");
    setMenuMessageId(null);
  }

  // GEM REDIGERET BESKED
  async function saveEditMessage() {
    if (!editMessageId) return;
    const trimmed = editText.trim();

    if (!trimmed) {
      // tom efter redigering = bare slet den
      await deleteMessage(chatId, editMessageId);
    } else {
      await updateMessage(chatId, editMessageId, trimmed);
    }

    setEditMessageId(null);
    setEditText("");
  }

  // SLET BESKED
  async function handleDeleteMessage(messageId) {
    await deleteMessage(chatId, messageId);
    setMenuMessageId(null);
  }

  // klik på baggrunden skal lukke evt. åbne menuer
  function handleBackgroundClick(e) {
    // vi vil ikke lukke hvis man trykker inde i boblen/elementet
    if (e.target.dataset?.chatbg === "true") {
      setMenuMessageId(null);
    }
  }

  return (
    <div className="bg-[#0d0d0d] text-white min-h-screen flex flex-col font-inter relative">
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1c1c1c] rounded-b-2xl">
        <ArrowLeft
          className="w-6 h-6 text-gray-300 cursor-pointer"
          onClick={() => navigate("/messages")}
        />

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            {/* avatar placeholder */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-300"
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
            <p className="font-semibold capitalize">{routeParam}</p>
            <p className="text-xs text-gray-400">online</p>
          </div>
        </div>
      </div>

      {/* CHAT LIST */}
      <div
        className="flex-1 px-4 py-4 overflow-y-auto space-y-4"
        data-chatbg="true"
        onClick={handleBackgroundClick}
      >
        {messagesWithSpotify.map((msg) => {
          const isMe = msg.senderUid === currentUid;
          const isEditing = editMessageId === msg.id && msg.type === "text";

          // TEKSTBESKED
          if (msg.type === "text") {
            return (
              <div
                key={msg.id}
                className={`max-w-[80%] ${
                  isMe ? "ml-auto" : ""
                }`}
              >
                <div
                  className={`relative rounded-2xl px-4 py-2 text-[15px] leading-snug ${
                    isMe ? "bg-purple-600" : "bg-gray-800"
                  }`}
                >
                  {/* REDIGER-TILSTAND */}
                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <input
                        className="w-full bg-black/30 text-white text-sm rounded-md px-2 py-1 outline-none"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <div className="flex gap-2 text-xs">
                        <button
                          className="bg-white/20 rounded px-2 py-1"
                          onClick={saveEditMessage}
                        >
                          Gem
                        </button>
                        <button
                          className="text-gray-300"
                          onClick={() => {
                            setEditMessageId(null);
                            setEditText("");
                          }}
                        >
                          Annuller
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="pr-6 break-words">{msg.text}</p>

                      {/* TRE PRIKKER (kun mine beskeder) */}
                      {isMe && (
                        <button
                          className="absolute top-2 right-2 text-gray-200/70"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuMessageId(
                              menuMessageId === msg.id ? null : msg.id
                            );
                          }}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* MENUEN UNDER BOBLEN */}
                {menuMessageId === msg.id && !isEditing && (
                  <div className="bg-[#1c1c1c] border border-white/10 rounded-xl mt-2 p-2 text-sm w-36 ml-auto">
                    <button
                      className="flex w-full items-center gap-2 px-2 py-1 text-left hover:bg-white/10 rounded"
                      onClick={() => startEditMessage(msg)}
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Rediger</span>
                    </button>
                    <button
                      className="flex w-full items-center gap-2 px-2 py-1 text-left hover:bg-white/10 rounded text-red-400"
                      onClick={() => handleDeleteMessage(msg.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Slet</span>
                    </button>
                  </div>
                )}
              </div>
            );
          }

          // SANG-BESKED
          if (msg.type === "song") {
            return (
              <div
                key={msg.id}
                className={`max-w-[80%] ${isMe ? "ml-auto" : ""}`}
              >
                <div className="relative bg-gray-800 flex items-center gap-3 p-3 rounded-2xl">
                  {/* COVER */}
                  <div className="w-12 h-12 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                    {msg.songData?.coverUrl ? (
                      <img
                        src={msg.songData.coverUrl}
                        alt={msg.songData.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        ♫
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 pr-6">
                    <p className="font-medium leading-tight truncate">
                      {msg.songData?.title || "Ukendt sang"}
                    </p>
                    <p className="text-sm text-gray-400 leading-tight truncate">
                      {msg.songData?.artist || ""}
                    </p>
                  </div>

                  {/* menu til egne sang-beskeder (kun slet) */}
                  {isMe && (
                    <button
                      className="absolute top-2 right-2 text-gray-200/70"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuMessageId(
                          menuMessageId === msg.id ? null : msg.id
                        );
                      }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {menuMessageId === msg.id && (
                  <div className="bg-[#1c1c1c] border border-white/10 rounded-xl mt-2 p-2 text-sm w-36 ml-auto">
                    <button
                      className="flex w-full items-center gap-2 px-2 py-1 text-left hover:bg-white/10 rounded text-red-400"
                      onClick={() => handleDeleteMessage(msg.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Slet</span>
                    </button>
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* INPUT BAR */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1c1c1c] rounded-t-2xl">
        {/* i stedet for direkte at åbne ShareSong, åbner vi valg-popup */}
        <button onClick={() => setShowChooseShareType(true)}>
          <Plus className="w-6 h-6 text-gray-300" />
        </button>

        <input
          type="text"
          placeholder="Skriv en besked..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 bg-transparent text-white outline-none placeholder-gray-500"
        />

        <button onClick={handleSendText}>
          <Send className="w-6 h-6 text-purple-500" />
        </button>
      </div>

      {/* POPUP 1: Vælg hvad du vil dele */}
      {showChooseShareType && (
        <div
          className="absolute inset-0 bg-black/70 flex items-end"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowChooseShareType(false);
            }
          }}
        >
          <div className="w-full bg-[#1c1c1c] rounded-t-2xl p-4 space-y-4">
            <h2 className="text-white font-semibold text-base">
              Del noget i chatten
            </h2>

            <button
              className="w-full bg-[#2A2A2A] rounded-xl p-4 text-left"
              onClick={() => {
                setShowSongPicker(true);
                setShowPlaylistPicker(false);
              }}
            >
              <p className="text-white font-medium text-sm">
                Del en sang 🎵
              </p>
              <p className="text-gray-400 text-xs">
                Vælg en sang fra Spotify
              </p>
            </button>

            <button
              className="w-full bg-[#2A2A2A] rounded-xl p-4 text-left"
              onClick={() => {
                setShowPlaylistPicker(true);
                setShowSongPicker(false);
              }}
            >
              <p className="text-white font-medium text-sm">
                Del en playliste 📀
              </p>
              <p className="text-gray-400 text-xs">
                Vælg en af dine playlister
              </p>
            </button>

            <button
              className="w-full text-center text-gray-400 text-sm py-2"
              onClick={() => setShowChooseShareType(false)}
            >
              Annuller
            </button>
          </div>
        </div>
      )}

      {/* POPUP 2: ShareSong bottom sheet */}
      {showSongPicker && (
        <div
          className="absolute inset-0 bg-black/70 flex items-end"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSongPicker(false);
              setShowChooseShareType(false);
            }
          }}
        >
          <div className="w-full max-h-[75%] bg-[#1c1c1c] rounded-t-2xl shadow-xl overflow-y-auto">
            <ShareSong
              inChatMode={true}
              onSelectTrack={(trackId) => handleSongChosen(trackId)}
              onClose={() => {
                setShowSongPicker(false);
                setShowChooseShareType(false);
              }}
            />
          </div>
        </div>
      )}

      {/* POPUP 3: Playlist placeholder */}
      {showPlaylistPicker && (
        <div
          className="absolute inset-0 bg-black/70 flex items-end"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPlaylistPicker(false);
              setShowChooseShareType(false);
            }
          }}
        >
          <div className="w-full max-h-[60%] bg-[#1c1c1c] rounded-t-2xl shadow-xl p-4 text-white text-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-base">Del playliste</h2>
              <button
                className="text-gray-300 text-sm"
                onClick={() => {
                  setShowPlaylistPicker(false);
                  setShowChooseShareType(false);
                }}
              >
                Luk
              </button>
            </div>

            <p className="text-gray-400 text-sm">
              TODO: her skal vi vise brugerens playlister fra Spotify og gemme
              dem som en besked ligesom med sang. Men UI-flowet er klar ✔
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
