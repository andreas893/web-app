import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { Pencil, User, EllipsisVertical, ArrowRight} from 'lucide-react';
import FooterNav from "../components/FooterNav";
import StatsSection from "../components/StatsSection";
import BadgeCard from "../components/BadgeCard";
import "../profile.css";
import { useParams } from "react-router-dom";
import ProfileOptionsPopup from "../components/ProfileOptions";

export default function ProfilePage() {

    const { id } = useParams();
    const navigate = useNavigate();
    const profileUserId = id || auth.currentUser?.uid; // fallback til dig selv
    const [userData, setUserData] = useState(null);
    const isOwnProfile = auth.currentUser?.uid === profileUserId;
    const [showOptions, setShowOptions] = useState(false);

    const badges = [
    { title: "Bronze", description: "Lyt i 100 min", type: "Bronze", progress: 80, goal: 100 },
    { title: "Sølv", description: "Udforsk 10 genrer", type: "Silver", progress: 50, goal: 100 },
    { title: "Guld", description: "Opret 3 playlister", type: "Gold", progress: 60, goal: 100 },
    { title: "Platinium", description: "Del 5 playlister", type: "Platinum", progress: 40, goal: 100 },
    { title: "Emerald", description: "Opnå 50 følgere", type: "Emerald", progress: 70, goal: 100 },
    { title: "Diamant", description: "Vær aktiv i 30 dage", type: "Diamond", progress: 30, goal: 100 },
  ];


    // Useeffect til at checke om det er brugerens egen profil eller en anden brugers profil
    useEffect(() => {
            if (!profileUserId) return;

            const userRef = doc(db, "users", profileUserId);
            const unsub = onSnapshot(userRef, (snap) => {
            if (snap.exists()) {
                setUserData(snap.data());
            }
            });

            return () => unsub();
    }, [profileUserId]);



    const toggleFollow = async (targetUserId) => {
        const user = auth.currentUser;
        if (!user || !targetUserId) return;

        const currentUserRef = doc(db, "users", user.uid);
        const targetUserRef = doc(db, "users", targetUserId);

        // tjek om du allerede følger personen
        const alreadyFollowing = userData?.following?.includes(targetUserId);

        try {
            if (alreadyFollowing) {
            // Fjern relationen
            await updateDoc(currentUserRef, {
                following: arrayRemove(targetUserId),
            });
            await updateDoc(targetUserRef, {
                followers: arrayRemove(user.uid),
            });
            console.log("❌ Stoppede med at følge");
            } else {
            // Tilføj relationen
            await updateDoc(currentUserRef, {
                following: arrayUnion(targetUserId),
            });
            await updateDoc(targetUserRef, {
                followers: arrayUnion(user.uid),
            });
            console.log("✅ Følger nu");
            }
        } catch (err) {
            console.error("Fejl ved følgefunktion:", err);
        }
    };
    
        const handleProfileImageChange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Begræns billedstørrelse (fx 300 KB)
            if (file.size > 300 * 1024) {
                alert("Billedet må maks. være 300 KB");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result;

                try {
                const userRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(userRef, { photoURL: base64String });
                console.log("✅ Profilbillede opdateret");
                } catch (err) {
                console.error("Fejl ved opdatering af profilbillede:", err);
                }
            };

            reader.readAsDataURL(file);
        };

    

    return(
        <div className="profile-page">
            
            <div className="profile-header">
                <div className="profile-pic">
                    {userData?.photoURL ? (
                        <img src={userData.photoURL} alt="Profilbillede" className="profile-img" />
                    ) : (
                        <User className="default-icon" strokeWidth={1} />
                    )}

                    {isOwnProfile && (
                        <>
                        <label htmlFor="profile-upload" className="edit-icon">
                            <Pencil className="pencil" size={18} />
                        </label>
                        <input
                            type="file"
                            id="profile-upload"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleProfileImageChange}
                        />
                        </>
                    )}
                </div>

                <div className="profile-meta">
                    <div className="username"><h2>{userData?.username || userData?.user || "Ukendt bruger"}</h2></div>

                    <div className="followers">
                        <p>Følger: {userData?.following?.length || 0}</p>
                        <p>Følgere: {userData?.followers?.length || 0}</p>

                        {/* Følg-knap kun hvis det ikke er din profil */}
                        {!isOwnProfile && (
                            <button
                            className={`follow-btn ${
                                userData?.followers?.includes(auth.currentUser?.uid)
                                ? "following"
                                : ""
                            }`}
                            onClick={() => toggleFollow(profileUserId)}
                            >
                            {userData?.followers?.includes(auth.currentUser?.uid)
                                ? "Følger"
                                : "Følg"}
                            </button>
                        )}
                    </div>
                </div>

                {isOwnProfile && (
                    <div className="options" onClick={() => setShowOptions(true)}>
                    <EllipsisVertical />
                    </div>
                )}
            </div>


            <div className="pinned">
                <div className="pinned-heading">
                    <h2>Pinned</h2>
                    <ArrowRight onClick={() => navigate("/pinned")} />
                </div>

               <div className="pinned-elements">
                    {!userData?.pinned?.length ? (
                        <p>Ingen pinned endnu</p>) : (
                        userData.pinned.map((item) => (
                        <div key={item.id} className="pinned-card">
                            <img src={item.imgUrl} alt={item.name} />
                            <p>{item.name}</p>
                        </div>
                        ))
                    )}
                </div>
            </div>

            {/* Kun på din egen profil */}
            {isOwnProfile && (
                <>
                    <StatsSection />

                    <div className="badges-section">
                        <div className="badges-heading">
                            <h2>Badges og Achievements</h2>
                            <ArrowRight onClick={() => navigate("/badges")}/>
                        </div>

                        <div className="badges-grid">
                            {badges.map((b) => (
                            <BadgeCard key={b.title} {...b} />
                            ))}
                        </div>
                    </div>
                </>
            )}



            {showOptions && (
                <ProfileOptionsPopup
                    onClose={() => setShowOptions(false)}
                    onEdit={() => {
                    setShowOptions(false);
                    }}
                />
            )}

            <FooterNav />
        </div>
    );
};