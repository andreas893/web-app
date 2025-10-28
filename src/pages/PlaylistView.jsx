import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useRef } from "react";
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp, increment, arrayUnion, arrayRemove, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { fetchSpotifyRecommendations } from "../spotifyApi";

import { ArrowLeft, User, PlayIcon, ShuffleIcon, Bookmark, Heart, MessageCircle, RefreshCcwIcon, CirclePlus, EllipsisVertical, ArrowUp, } from "lucide-react";
import "../playlistView.css";
import FooterNav from "../components/FooterNav";
import CreatePlaylistPopup from "../components/CreatePlaylistPopup";

 // spotify recommended fetch, map moods til spotify-genrer
    const moodToGenre = {
        Glad: "pop",
        Trist: "sad",
        Chill: "chill",
        Energisk: "dance",
        Kreativ: "indie",
        Forelsket: "romance",
        Fokuseret: "study",
        Vred: "metal",
        };

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
    const [recommendedSongs, setRecommendedSongs] = useState([]);

   const origin = location.state?.origin || "unknown";
    const isFeedView = origin === "feed";
    const isSharedView = origin === "shared";
    const isLibraryView = origin === "library" || origin === "created";
    const collectionName = isFeedView ? "posts" : "playlists";

    const showRecommended = isLibraryView && !isFeedView && !isSharedView;
    
    
    const fetchRecommendedSongs = useCallback(async () => {
    if (!playlist?.mood) return;

    try {
      const token = localStorage.getItem("spotify_access_token");
      if (!token) {
        console.warn("Ingen Spotify-token — springer anbefalinger over.");
        return;
      }

      const genre = moodToGenre[playlist.mood] || "pop";
      const recs = await fetchSpotifyRecommendations(token, genre);
      setRecommendedSongs(recs);
    } catch (err) {
      console.error("Kunne ikke hente Spotify-sange:", err);
    }
  }, [playlist?.mood]);

  // useEffect der henter anbefalinger når playlist er hentet
  useEffect(() => {
    if (showRecommended) {
      fetchRecommendedSongs();
    }
  }, [showRecommended, fetchRecommendedSongs]);



    // fetch playliste fra firebase
    useEffect(() => {
        const fetchPlaylist = async () => {
        try {
            const ref = doc(db, collectionName, id);
            const snap = await getDoc(ref);
            if (snap.exists()) {
            setPlaylist({ id: snap.id, ...snap.data() });
            } else {
            console.warn("Ingen playliste fundet med id:", id);
            }
        } catch (err) {
            console.error("Fejl ved hentning:", err);
        } finally {
            setLoading(false);
        }
        };
        fetchPlaylist();
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


    // check om playliste er loadet/fundet
    if (loading) return <p className="loading">Indlæser playliste...</p>;
    if (!playlist) return <p className="not-found">Ingen playliste fundet.</p>;


   




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
                userName: user.displayName || user.email.split("@")[0], // brugernavn
                userPhoto: user.photoURL || "/img/default-avatar.png", // profilbillede
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
                id: playlist.id,
                song: playlist.song,
                user: playlist.user,
                imgUrl: playlist.imgUrl,
                name: playlist.name,
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
        const ref = doc(db, "playlists", id);
        await updateDoc(ref, {
            songs: arrayUnion(song)
        });
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
                    <p> <span className="user"><User /></span> {playlist.user || "Ukendt bruger"}s playliste</p>
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
                            <img src={playlist.imgUrl} alt="Cover" />
                            <div className="song-text">
                                <p className="song-title">{song.title}</p>
                                <p className="song-artist">{song.artist}</p>
                            </div>
                            </div>
                            <EllipsisVertical className="options" onClick={(e) => {
                                e.stopPropagation();
                                setPopupType("options")
                                setPopupContext("song")
                                setSelectedSong(song);
                            }}/>
                        </div>
                    ))}

                </div>

                    {showRecommended && (
                        <div className="recommended">
                            <div className="recommended-text">
                            <h3>Anbefalede sange</h3>
                            <RefreshCcwIcon onClick={fetchRecommendedSongs} className="refresh-btn" />
                            </div>

                            <div className="playlist-content">
                            {(recommendedSongs.length > 0 ? recommendedSongs : [
                                { id: 1, title: "Drift", artist: "Soft Beats", coverUrl: "/img/song1.jpg" },
                                { id: 2, title: "Golden Hour", artist: "Dreamfield", coverUrl: "/img/song2.jpg" },
                                { id: 3, title: "Echoes", artist: "Cloud Club", coverUrl: "/img/song3.jpg" },
                            ]).map((song) => (
                                <div key={song.id} className="playlist-song">
                                <div className="song-info">
                                    <img src={song.coverUrl} alt={song.title} />
                                    <div className="song-text">
                                    <p className="song-title">{song.title}</p>
                                    <p className="song-artist">{song.artist}</p>
                                    </div>
                                </div>
                                <CirclePlus onClick={() => handleAddSong(song)} />
                                </div>
                            ))}
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
                            src={c.userPhoto || "/img/default-avatar.png"}
                            alt={c.userName}
                            className="comment-avatar"
                            />

                            <div className="comment-body">
                            <div className="comment-header">
                                <span className="comment-user">{c.userName}</span>
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
            <FooterNav />
        </div>
    );
};