import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useRef } from "react";
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp, increment, arrayUnion, arrayRemove, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { fetchSpotifyMoodRecommendations } from "../spotifyApi";
import { fetchSpotifyRandomRecommendations } from "../spotifyApi";
import { getImageUrl } from "../utils/getImageUrl";

import { ArrowLeft, PlayIcon, ShuffleIcon, Bookmark, Heart, MessageCircle, RefreshCcwIcon, CirclePlus, EllipsisVertical, ArrowUp, } from "lucide-react";
import "../playlistView.css";
import FooterNav from "../components/FooterNav";
import CreatePlaylistPopup from "../components/CreatePlaylistPopup";


export default function PlaylistView() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const commentSectionRef = useRef(null);
   

    // states
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isSaved, setIsSaved] = useState(false);
    const [popupType, setPopupType] = useState(null);
    const [popupContext, setPopupContext] = useState(null);
    const [selectedSong, setSelectedSong] = useState(null);
    const isOwnPlaylist = playlist?.userId === auth.currentUser?.uid;
    const [recommendedSongs, setRecommendedSongs] = useState(null);
    const [toast, setToast] = useState(null);

   const origin = location.state?.origin || "unknown";
    const isFeedView = origin === "feed";
    const isSharedView = origin === "shared";
    const isLibraryView = origin === "library" || origin === "created";
    const collectionName = isFeedView ? "posts" : "playlists";

    const showRecommended = isLibraryView && !isFeedView && !isSharedView;
    

   const fetchRecommendedSongs = useCallback(async () => {
  const token = localStorage.getItem("spotify_access_token");
  if (!token) return;

  try {
    let recs = [];

    if (playlist?.mood) {
      // 🎧 Mood-baseret
      recs = await fetchSpotifyMoodRecommendations(token, playlist.mood);
    } else {
      // 🎲 Tilfældig
      recs = await fetchSpotifyRandomRecommendations(token);
    }

    setRecommendedSongs(recs);
  } catch (err) {
    console.error("Kunne ikke hente anbefalinger:", err);
  }
}, [playlist?.mood]);

useEffect(() => {
  // Vent til playlisten er hentet og loading = false
  if (!loading && showRecommended && playlist) {
    fetchRecommendedSongs();
  }
}, [loading, showRecommended, playlist, fetchRecommendedSongs]);



    // fetch playliste fra firebase realtime
    useEffect(() => {
  if (!id) return;

  const ref = doc(db, collectionName, id);

  const unsubscribe = onSnapshot(
    ref,
    (snapshot) => {
      if (snapshot.exists()) {
        setPlaylist({ id: snapshot.id, ...snapshot.data() });
      } else {
        console.warn("Ingen playliste fundet med id:", id);
      }
      setLoading(false);
    },
    (err) => {
      console.error("Realtime fejl:", err);
      setLoading(false);
    }
  );

  // ryd op når man forlader siden
  return () => unsubscribe();
}, [id, collectionName]);


    // fetch kommentarer i realtime
    useEffect(() => {
        if (!id) return;

        const q = query(collection(db, "comments"), where("postId", "==", id));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }));

            // sortér nyeste øverst
            commentsData.sort(
            (a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
            );

            setComments(commentsData);
        });

        return () => unsubscribe();
    }, [id]);

     // tjek om nuværende playliste er gemt
    useEffect(() => {
        const checkIfSaved = async () => {
            const user = auth.currentUser;
            if (!user || !playlist?.id) return;

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            const data = userSnap.data();

            const saved = data?.playlists?.some((p) => p.id === playlist.id);
            setIsSaved(saved);
        };

        checkIfSaved();
    }, [playlist]);

    // useeffect til at hente playlister fra feed
    useEffect(() => {
  const fetchFullPlaylist = async () => {
    if (!isFeedView || !playlist?.playlistId) return;

    const ref = doc(db, "playlists", playlist.playlistId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setPlaylist((prev) => ({ ...prev, ...snap.data() }));
    }
  };

  fetchFullPlaylist();
}, [isFeedView, playlist?.playlistId]);

    // check om playliste er loadet/fundet
    if (loading) return <p className="loading">Indlæser playliste...</p>;
    if (!playlist) return <p className="not-found">Ingen playliste fundet.</p>;
    // 🧠 Ensret data fra feed-posts, så det matcher playlist-strukturen
    if (isFeedView && !playlist.songs) {
    playlist.songs = [{
        id: 1,
        title: playlist.song || playlist.songName || playlist.name || "Ukendt sang",
        artist: playlist.artist || playlist.artistName || playlist.username || playlist.user || "Ukendt kunstner",
        imgUrl: playlist.imgUrl,
        duration: "3:30"
    }];
    }


   




    // songs fallback
    const songs = playlist.songs || [
     { id: 1, title: playlist.song || "Ukendt sang", artist: playlist.user || "Ukendt kunstner", albumtitle: "Ukendt album", duration: "3:30" }
    ];


    
    // funktion til at tilføje kommentarer
    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        const user = auth.currentUser;
        if (!user) {
            alert("Du skal være logget ind for at kommentere!");
            return;
        }

        try {
            await addDoc(collection(db, "comments"), {
                postId: id, // hvilken post kommentaren hører til
                text: newComment,  // selve kommentarteksten
                userId: user.uid,  // ID på brugeren der kommenterede
                username: user.displayName || user.email.split("@")[0], // brugernavn
                userPhoto: user.photoURL || getImageUrl("images/default-avatar.png"), // profilbillede
                postOwnerId: playlist.userId || "ukendt", // ejeren af playlisten (til evt. notifikationer)
                likes: 0,  // antal likes
                likedBy: [], // hvem der har liket
                timestamp: serverTimestamp(), // hvornår kommentaren blev skrevet
            });
            setNewComment(""); // ryd feltet
        } catch (err) {
            console.error("Fejl ved tilføjelse af kommentar:", err);
        }
    };

    // Beregner tidspunkt kommentar er skrevet
    function timeSince(timestamp) {
        if (!timestamp?.seconds) return "lige nu";
        const seconds = Math.floor((Date.now() - timestamp.seconds * 1000) / 1000);

        const intervals = [
            { label: "år", seconds: 31536000 },
            { label: "måneder", seconds: 2592000 },
            { label: "dage", seconds: 86400 },
            { label: "t", seconds: 3600 },
            { label: "min", seconds: 60 },
        ];

        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count >= 1) return `for ${count} ${interval.label} siden`;
        }
        return "for få sek siden";
    }


    const toggleLike = async (comment) => {
        const user = auth.currentUser;
        if (!user) {
            alert("Du skal være logget ind for at like kommentarer!");
            return;
        }

        const commentRef = doc(db, "comments", comment.id);
        const hasLiked = comment.likedBy?.includes(user.uid);

        try {
            if (hasLiked) {
            // Fjern like
            await updateDoc(commentRef, {
                likes: increment(-1),
                likedBy: arrayRemove(user.uid),
            });
            } else {
            // Tilføj like
            await updateDoc(commentRef, {
                likes: increment(1),
                likedBy: arrayUnion(user.uid),
            });
            }
        } catch (err) {
            console.error("Fejl ved like:", err);
        }
    };

    // Funktion til at gemme/bookmarke playliste
    const toggleSave = async () => {
        const user = auth.currentUser;
        if (!user || !playlist) {
            alert("Du skal være logget ind for at gemme playlister!");
            return;
        }

        const userRef = doc(db, "users", user.uid);

        try {
            if (isSaved) {
            await updateDoc(userRef, {
                playlists: arrayRemove({
                id: playlist.id,
                song: playlist.song,
                user: playlist.user,
                imgUrl: playlist.imgUrl,
                name: playlist.name,
                }),
            });
            setIsSaved(false);
            console.log("❌ Fjernet fra bibliotek:", playlist.name);
            } else {
            await updateDoc(userRef, {
                playlists: arrayUnion({
                    id: playlist.id || "",
                    song: playlist.song || "",
                    user: playlist.user || playlist.username || "Ukendt bruger",
                    imgUrl: playlist.imgUrl || getImageUrl("images/default-cover.png"),
                    name: playlist.name || "Ukendt titel",
                    mood: playlist.mood || null,
                    type: playlist.type || "unknown",
                    songsCount: playlist.songs?.length || playlist.songsCount || 0,
                }),
                });
            setIsSaved(true);
            console.log("💾 Tilføjet til bibliotek:", playlist.name);
            }
        } catch (err) {
            console.error("Fejl ved gemning:", err);
        }
    };  

    const togglePlaylistLike = async () => {
        const user = auth.currentUser;
        if (!user || !playlist) return;

        try {
            const playlistRef = doc(db, "posts", id); // eller "playlists" hvis det er fra library
            const hasLiked = playlist.likedBy?.includes(user.uid);

            await updateDoc(playlistRef, {
            likedBy: hasLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
            likes: hasLiked ? increment(-1) : increment(1),
            });

            setPlaylist((prev) => ({
            ...prev,
            likedBy: hasLiked
                ? prev.likedBy.filter((uid) => uid !== user.uid)
                : [...(prev.likedBy || []), user.uid],
            likes: (prev.likes || 0) + (hasLiked ? -1 : 1),
            }));
        } catch (err) {
            console.error("Fejl ved like af playliste:", err);
        }
    };

  const handleAddSong = async (song) => {
  const user = auth.currentUser;
  if (!user) {
    setToast({ type: "error", message: "Du skal være logget ind for at tilføje sange!" });
    return;
  }

  try {
    const ref = doc(db, "playlists", id);
    const newSong = {
      id: song.id,
      title: song.title,
      artist: song.artist,
      imgUrl: song.imgUrl,
      previewUrl: song.previewUrl || null,
      addedBy: user.displayName || user.email.split("@")[0],
      addedAt: new Date().toISOString(),
    };

    await updateDoc(ref, { songs: arrayUnion(newSong) });

    // 🎯 Fjern den tilføjede sang fra anbefalingerne
    setRecommendedSongs((prev) => prev.filter((s) => s.id !== song.id));

    setToast({ type: "success", message: `Tilføjede "${song.title}"` });
  } catch (err) {
    console.error("Fejl ved tilføjelse af sang:", err);
    setToast({ type: "error", message: "Kunne ikke tilføje sangen" });
  }

  // Fjern toast efter 2 sek.
  setTimeout(() => setToast(null), 2000);
};


    return(
        <div className="playlist-view">
            
            <div className="playlist-hero"
             style={{ backgroundImage: `url(${playlist.imgUrl || "/img/fallback.jpg"})` }}>
                <div className="playlist-overlay"></div>

                <div className="playlist-hero-content">
                    <div className="playlist-hero-btns">
                         <ArrowLeft onClick={() => navigate("/library")} />
                         <EllipsisVertical onClick={(e) => {
                                e.stopPropagation();
                                setPopupType("options")
                                setPopupContext("playlist")
                            }}/> 
                    </div>
                   
                    <h1 className="playlist-name">{playlist.name || playlist.song}</h1>
                    <h2 className="mood">{playlist.mood || ""}</h2>
                    <p className="user-line">
                       {playlist.userPhoto ? (
                        <img
                            src={playlist.userPhoto || getImageUrl("images/default-avatar.png")}
                            alt={playlist.username || playlist.user || "Ukendt bruger"}
                            className="user-avatar"
                        />
                        ) : null}

                        <span className="user-name">
                        {playlist.username || playlist.user || "Ukendt bruger"}
                        </span>
                    </p>
                </div>
            </div>

            <div className="playlist-overview">
                <div className="playlist-btns">
                    <span><PlayIcon/></span>
                    <ShuffleIcon />
                    <Heart onClick={() => {
                        if (isLibraryView || isOwnPlaylist) {
                        alert("Du kan ikke like din egen playliste.");
                        return;
                        }
                        togglePlaylistLike(); // vi laver denne funktion lige nedenfor
                    }}
                    fill={!isOwnPlaylist && playlist?.likedBy?.includes(auth.currentUser?.uid) ? "red" : "none"}
                    color={!isOwnPlaylist && playlist?.likedBy?.includes(auth.currentUser?.uid) ? "red" : "#fff"}
                    style={{ cursor: isOwnPlaylist ? "not-allowed" : "pointer", opacity: isOwnPlaylist ? 0.5 : 1 }}/>

                    <Bookmark onClick={toggleSave} fill={isSaved ? "gold" : "none"}  color={isSaved ? "gold" : "#fff"}/>

                    <MessageCircle  onClick={() => {
                            commentSectionRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                            });
                        }}/>
                </div>

                <div className="playlist-content">
                   
                    {songs.map((song) => (
                        <div key={song.id} className="playlist-song">
                            <div className="song-info">
                            <img src={song.imgUrl || playlist.imgUrl || getImageUrl("images/default-cover.png")}
                            alt={song.title || "Sangcover"}
                            onError={(e) => (e.currentTarget.src = getImageUrl("images/default-cover.png"))} />
                            <div className="song-text">
                                <p className="song-title">{song.title}</p>
                                <p className="song-artist">{song.artist}</p>
                            </div>
                            </div>
                            <div><EllipsisVertical className="options" onClick={(e) => {
                                e.stopPropagation();
                                setPopupType("options")
                                setPopupContext("song")
                                setSelectedSong(song);
                            }}/></div>
                        </div>
                    ))}

                </div>

                   {showRecommended && (
                        <div className="recommended">
                            <div className="recommended-text">
                            <h3>Anbefalede sange</h3>
                            <button>
                            <RefreshCcwIcon onClick={() => fetchRecommendedSongs()} className="refresh-btn" />
                            </button>
                            </div>

                            <div className="playlist-content">
                            {recommendedSongs === null ? (
                                <p className="loading">Henter anbefalinger...</p>
                            ) : recommendedSongs.length === 0 ? (
                                <p className="no-recommendations">Ingen anbefalinger fundet for dette mood 😕</p>
                            ) : (
                                recommendedSongs.map((song) => (
                                <div key={song.id} className="playlist-song">
                                    <div className="song-info">
                                    <img src={song.imgUrl} alt={song.title} />
                                    <div className="song-text">
                                        <p className="song-title">{song.title}</p>
                                        <p className="song-artist">{song.artist}</p>
                                    </div>
                                    </div>

                                    {/* ➕ Tilføj sang til playliste */}
                                    <CirclePlus
                                    onClick={() => handleAddSong(song)}
                                    className="add-song-btn"
                                    />
                                </div>
                                ))
                            )}
                            </div>
                        </div>
                        )}


            </div>


           {(isFeedView || isSharedView) && (
                <div className="comment-section"  ref={commentSectionRef}>
                    <h3>Kommentarer</h3>

                    {/* 🧾 Kommentar-liste */}
                    <div className="comments-list">
                    {comments.length === 0 ? (
                        <p className="no-comments">Ingen kommentarer endnu</p>
                    ) : (
                        comments.map((c) => (
                        <div key={c.id} className="comment">
                            <img
                            src={c.photoURL|| getImageUrl("images/default-avatar.png")}
                            alt={c.username}
                            className="comment-avatar"
                            />

                            <div className="comment-body">
                            <div className="comment-header">
                                <span className="comment-user">{c.username}</span>
                                <span className="comment-time">{timeSince(c.timestamp)}</span>
                            </div>

                            <p className="comment-text">{c.text}</p>

                            <div className="comment-actions">
                                <button className={`like-btn ${c.likedBy?.includes(auth.currentUser?.uid) ? "liked" : ""}`} onClick={() => toggleLike(c)}>
                                <Heart size={16}
                                    fill={c.likedBy?.includes(auth.currentUser?.uid) ? "red" : "none"}
                                    color={c.likedBy?.includes(auth.currentUser?.uid) ? "red" : "#e0e0e0"} />
                                <span>{c.likes || 0}</span>
                                </button>
                            </div>
                            </div>
                        </div>
                        ))
                    )}
                    </div>

                    {/* ➕ Tilføj kommentar */}
                    <div className="add-comment">
                    <input
                        placeholder="Tilføj en kommentar..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={handleAddComment} className="send-btn">
                        <ArrowUp size={18} />
                    </button>
                    </div>
                </div>
            )}

            {popupType === "options" && (
                <CreatePlaylistPopup
                    type="options"
                    playlist={playlist}
                    context={popupContext}
                    song={selectedSong} 
                    onClose={() => setPopupType(null)}
                    onShare={() => {
                    setPopupType(null);
                    setTimeout(() => setPopupType("share"), 200);
                    }}
                />
                )}

            {popupType === "share" && (
                <CreatePlaylistPopup
                    type="share"
                    context={popupContext}  
                    song={selectedSong}
                    playlist={playlist}
                    onClose={() => setPopupType(null)}
                />
                )}

            {toast && (
                <div
                    className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 px-5 py-3 rounded-xl text-sm font-medium shadow-lg 
                    transition-all duration-500 ease-out 
                    ${toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
                    ${toast.type === "success" ? "bg-green-500/90" : "bg-red-500/90"} text-white`}
                    >
                    {toast.message}
                    </div>
                )}
            <FooterNav />
        </div>
    );
};