import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp, increment, arrayUnion, arrayRemove, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

import { ArrowLeft, User, PlayIcon, ShuffleIcon, Bookmark, Heart, MessageCircle, RefreshCcwIcon, CirclePlus, EllipsisVertical, ArrowUp } from "lucide-react";
import "../playlistView.css";
import FooterNav from "../components/FooterNav";


export default function PlaylistView() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const commentSectionRef = useRef(null);
    const isFeedView = location.pathname.includes("/feed");
    const collectionName = isFeedView ? "posts" : "playlists";

    // states
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isSaved, setIsSaved] = useState(false);

    // fetch playliste fra firebase
    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
            const ref = doc(db, collectionName, id); // ← samme collection som i feed
            const snap = await getDoc(ref);
            if (snap.exists()) {
                setPlaylist(snap.data());
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


    return(
        <div className="playlist-view">
            
            <div className="playlist-hero"
             style={{ backgroundImage: `url(${playlist.imgUrl || "/img/fallback.jpg"})` }}>
                <div className="playlist-overlay"></div>

                <div className="playlist-hero-content">
                    <ArrowLeft onClick={() => navigate(-1)}/>
                    <h1 className="mood">{playlist.mood || "Ukendt stemning"}</h1>
                    <h2 className="playlist-name">{playlist.name || playlist.song}</h2>
                    <p> <span className="user"><User /></span> {playlist.user || "Ukendt bruger"}s playliste</p>
                </div>
            </div>

            <div className="playlist-overview">
                <div className="playlist-btns">
                    <span><PlayIcon/></span>
                    <ShuffleIcon />
                    <Heart/>
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
                            <EllipsisVertical className="options" />
                        </div>
                    ))}

                </div>

                <div className="recommended">
                    <div className="recommended-text">
                        <div>
                            <h3>Anbefalede sange</h3>
                            <p>Baseret på denne playliste</p>
                        </div>
                        
                        <div className="refresh-icon">
                            <RefreshCcwIcon />
                        </div>
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
                            <CirclePlus />
                        </div>
                    ))}
                    </div>
                </div>

            </div>


           {isFeedView && (
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
                                    fill={c.likedBy?.includes(auth.currentUser?.uid) ? "#e0e0e0" : "none"}
                                    color={c.likedBy?.includes(auth.currentUser?.uid) ? "#e0e0e0" : "#e0e0e0"} />
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
            <FooterNav />
        </div>
    );
};