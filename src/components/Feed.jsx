// src/components/Feed.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { User, Heart, MessageSquare, Bookmark, X, Trash2 } from "lucide-react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
  setDoc,
  getDocs,
  arrayUnion,
  arrayRemove,
  updateDoc,
} from "firebase/firestore";
import DeleteConfirmPopup from "./DeleteConfirmPopup";

export default function Feed() {
  const [feed, setFeed] = useState([]);
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const [activePost, setActivePost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();


  // 🔥 Hent opslag realtime
  useEffect(() => {
    const q = query(collection(db, "posts"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      postsData.sort(
        (a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
      );
      setFeed(postsData);
    });
    return () => unsubscribe();
  }, []);

  // 💾 Hent gemte likes/saves
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const fetchData = async () => {
      const likesSnap = await getDocs(
        query(collection(db, "likes"), where("userId", "==", user.uid))
      );
      const savesSnap = await getDocs(
        query(collection(db, "saves"), where("userId", "==", user.uid))
      );

      const likedPosts = {};
      const savedPosts = {};

      likesSnap.forEach((doc) => (likedPosts[doc.data().postId] = true));
      savesSnap.forEach((doc) => (savedPosts[doc.data().postId] = true));

      setLiked(likedPosts);
      setSaved(savedPosts);
    };

    fetchData();
  }, []);

  // 💬 Kommentarer realtime
  useEffect(() => {
    if (!activePost) return;
    const q = query(
      collection(db, "comments"),
      where("postId", "==", activePost.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      commentsData.sort(
        (a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
      );
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [activePost]);

  // ➕ Tilføj kommentar
  const handleAddComment = async () => {
    if (!newComment.trim() || !activePost) return;

    const user = auth.currentUser;
    if (!user) {
      alert("Du skal være logget ind for at kommentere!");
      return;
    }

    await addDoc(collection(db, "comments"), {
      postId: activePost.id,
      text: newComment,
      userId: user.uid,
      userName: user.displayName || user.email.split("@")[0],
      postOwnerId: activePost.userId,
      timestamp: serverTimestamp(),
    });

    // 🔔 Tilføj notifikation
    await addDoc(collection(db, "notifications"), {
      type: "comment",
      postId: activePost.id,
      postOwnerId: activePost.userId,
      user: user.displayName || user.email.split("@")[0],
      userId: user.uid,
      imageUrl: activePost.imgUrl,
      createdAt: serverTimestamp(),
    });

    setNewComment("");
    document.activeElement?.blur();
  };

  // ❌ Slet kommentar
  const handleDeleteComment = async (comment) => {
    const user = auth.currentUser;
    const isPostOwner = user?.uid === comment.postOwnerId;
    const isOwnComment = user?.uid === comment.userId;

    if (!isPostOwner && !isOwnComment) {
      alert("Du kan kun slette dine egne kommentarer.");
      return;
    }

    await deleteDoc(doc(db, "comments", comment.id));
  };

  // ❤️ Like opslag + notifikation
  const toggleLike = async (post) => {
    const user = auth.currentUser;
    if (!user) return alert("Log ind for at like!");
    const postId = post.id.toString();
    const docRef = doc(db, "likes", `${user.uid}_${postId}`);

    if (liked[postId]) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, {
        postId,
        userId: user.uid,
        timestamp: serverTimestamp(),
      });

      // 🔔 Tilføj notifikation til Firestore
      await addDoc(collection(db, "notifications"), {
        type: "like",
        postId,
        postOwnerId: post.userId,
        user: user.displayName || user.email.split("@")[0],
        userId: user.uid,
        imageUrl: post.imgUrl,
        createdAt: serverTimestamp(),
      });
    }

    setLiked((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  // 🔖 Gem opslag + notifikation
  const toggleSave = async (post) => {
    const user = auth.currentUser;
    if (!user) return alert("Log ind for at gemme!");
    const postId = post.id.toString();
    const docRef = doc(db, "saves", `${user.uid}_${postId}`);
    const userRef = doc(db, "users", user.uid);

    if (saved[postId]) {
      // ❌ Fjern fra saves
      await deleteDoc(docRef);
      await updateDoc(userRef, {
        playlists: arrayRemove({
          id: post.id,
          song: post.song,
          user: post.user,
          imgUrl: post.imgUrl,
        }),
      });
    } else {
      // ✅ Gem opslag
      await setDoc(docRef, {
        postId,
        userId: user.uid,
        timestamp: serverTimestamp(),
      });

      await updateDoc(userRef, {
        playlists: arrayUnion({
          id: post.id,
          name: post.name,
          song: post.song,
          user: post.user,
          imgUrl: post.imgUrl,
        }),
      });

      // 🔔 Tilføj notifikation
      await addDoc(collection(db, "notifications"), {
        type: "save",
        postId,
        postOwnerId: post.userId,
        user: user.displayName || user.email.split("@")[0],
        userId: user.uid,
        imageUrl: post.imgUrl,
        createdAt: serverTimestamp(),
      });
    }

    setSaved((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

// 🗑️ Slet post med bekræftelse og oprydning
const handleDeletePost = async (postId) => {
  const user = auth.currentUser;
  if (!user) return alert("Du skal være logget ind for at slette.");
  
  try {
    const postRef = doc(db, "posts", postId);
    const snap = await getDocs(query(collection(db, "posts"), where("__name__", "==", postId)));

    if (snap.empty) {
      alert("Opslaget blev ikke fundet.");
      return;
    }

    const postData = snap.docs[0].data();
    if (postData.userId !== user.uid) {
      alert("Du kan kun slette dine egne opslag.");
      return;
    }

    // 🧹 Slet selve posten
    await deleteDoc(postRef);

    // 🧹 Slet relaterede likes, kommentarer og saves
    const likesSnap = await getDocs(query(collection(db, "likes"), where("postId", "==", postId)));
    likesSnap.forEach(async (like) => await deleteDoc(doc(db, "likes", like.id)));

    const commentsSnap = await getDocs(query(collection(db, "comments"), where("postId", "==", postId)));
    commentsSnap.forEach(async (comment) => await deleteDoc(doc(db, "comments", comment.id)));

    const savesSnap = await getDocs(query(collection(db, "saves"), where("postId", "==", postId)));
    savesSnap.forEach(async (save) => await deleteDoc(doc(db, "saves", save.id)));

    // 🧹 Fjern fra brugerens gemte playlister hvis nødvendigt
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      playlists: arrayRemove({ id: postId })
    });

    console.log("✅ Opslag slettet:", postId);
  } catch (err) {
    console.error("❌ Fejl ved sletning:", err);
    alert("Noget gik galt under sletningen.");
  }
};


  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold mb-3">Feed</h2>

      <div className="flex gap-4 overflow-x-auto hide-scroll">
        {feed.map((postRaw) => {
          const post = {
            id: postRaw.id,
            imgUrl:
              postRaw.imgUrl || postRaw.image || "/images/default-cover.png",
            song:
              postRaw.song ||
              postRaw.songName ||
              postRaw.playlistName ||
              "Ukendt sang",
            userName:
              postRaw.username ||
              postRaw.userName ||
              postRaw.user ||
              "Ukendt bruger",
            userPhoto: postRaw.userPhoto || "/images/default-avatar.png",
            name: postRaw.name || postRaw.playlistName || "Ukendt titel",
            userId: postRaw.userId,
          };

          return (
            <div
              key={post.id}
              className="flex-shrink-0 w-[220px] bg-[#1E1E1E] rounded-[18px] overflow-hidden cursor-pointer relative"
              onClick={() =>
                navigate(`/playlist/${post.id}`, {
                  state: { origin: "feed" },
                })
              }
            >
              <div className="relative">
                {post.imgUrl ? (
                  <img
                    src={post.imgUrl}
                    alt={post.song}
                    className="w-full h-[250px] object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/img/takecare.jpg";
                    }}
                  />
                ) : (
                  <div className="w-full h-[250px] bg-[#2A2A2A]" />
                )}

                {/* 🔽 Ikoner */}
                <div className="absolute right-3 bottom-6 flex flex-col items-center gap-4">
                  <User
                    className="w-7 h-7 text-white cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/profile/${post.userId}`);
                    }}
                  />
                  <Heart
                    fill={liked[post.id] ? "red" : "none"}
                    className={`w-7 h-7 cursor-pointer ${
                      liked[post.id] ? "text-red-500" : "text-white"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(post);
                    }}
                  />
                  <MessageSquare
                    className="w-7 h-7 text-white cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePost({ ...postRaw, ...post });
                    }}
                  />
                  <Bookmark
                    fill={saved[post.id] ? "gold" : "none"}
                    className={`w-7 h-7 cursor-pointer ${
                      saved[post.id] ? "text-yellow-400" : "text-white"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(post);
                    }}
                  />

                  {/* 🗑️ Hold for delete */}
                  {auth.currentUser?.uid === postRaw.userId && (
                     <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete(post);
                      }}
                      className="relative"
                    >
                      <Trash2 className="w-7 h-7 text-gray-400 hover:text-red-500 cursor-pointer transition" />
                    </div>
                  )}
                </div>
              </div>

              {/* Tekst under billede */}
              <div className="p-3">
                <p className="text-sm font-semibold">{post.name}</p>
                <p className="text-xs text-gray-400">{post.userName}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🪟 Kommentar popup */}
      {activePost && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 p-4 overflow-y-auto">
          <button
            className="absolute top-5 right-5 text-white hover:text-gray-400 transition"
            onClick={() => setActivePost(null)}
          >
            <X size={28} />
          </button>

          <img
            src={activePost.imgUrl}
            alt={activePost.song}
            className="w-[90%] max-w-[400px] rounded-2xl mb-6 shadow-lg"
          />

          <h2 className="text-xl font-semibold mb-2">{activePost.song}</h2>
          <p className="text-gray-400 mb-4">{activePost.user}</p>

          <div className="w-full max-w-[400px] bg-[#1E1E1E] rounded-2xl p-4">
            <h3 className="font-semibold mb-3">Kommentarer</h3>

            <div className="space-y-3 mb-3">
              {comments.map((c) => (
                <div key={c.id} className="flex justify-between items-center">
                  <p className="text-sm">
                    <span className="font-semibold">{c.userName}</span>:{" "}
                    {c.text}
                  </p>
                  {(auth.currentUser?.uid === c.userId ||
                    auth.currentUser?.uid === c.postOwnerId) && (
                    <Trash2
                      className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500"
                      onClick={() => handleDeleteComment(c)}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Tilføj kommentar */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Skriv en kommentar..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                inputMode="text"
                className="bg-[#2A2A2A] rounded-xl p-2 text-white outline-none text-sm w-[85%]"
              />
              <button
                onClick={handleAddComment}
                className="bg-purple-600 px-4 py-2 rounded-xl text-white text-sm flex-shrink-0"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <DeleteConfirmPopup
          name={confirmDelete.name}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={async () => {
            await handleDeletePost(confirmDelete.id);
            setConfirmDelete(null);
          }}
        />
      )}
    </section>
  );
}
