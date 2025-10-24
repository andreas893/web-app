import { useState, useEffect } from "react";

import { auth, db } from "../firebase";
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { Pencil, User, EllipsisVertical, ArrowRight} from 'lucide-react';
import FooterNav from "../components/FooterNav";
import "../profile.css";
import { useParams } from "react-router-dom";

export default function ProfilePage() {

    const { id } = useParams();
    const profileUserId = id || auth.currentUser?.uid; // fallback til dig selv
    const [userData, setUserData] = useState(null);
    const isOwnProfile = auth.currentUser?.uid === profileUserId;


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
                        <User className="default-icon" />
                    )}

                    {isOwnProfile && (
                        <>
                        <label htmlFor="profile-upload" className="edit-icon">
                            <Pencil size={18} />
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
                    <h2>{userData?.username || userData?.user || "Ukendt bruger"}</h2>

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
                    <div className="options">
                    <EllipsisVertical />
                    </div>
                )}
            </div>


            <div className="pinned">
                <div>
                    <h2>Pinned</h2>
                    <ArrowRight />
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
            {/* {isOwnProfile && (
                <>
                    <div className="stats">
                        <div className="stat-heading">
                            <h2>Statistikker</h2>
                            <ArrowRight />
                        </div>

                        <div className="stats-container">
                            <div className="stat-element">
                                 <img src="" alt="" />
                            </div>

                            <div>
                                <img src="" alt="" />
                            </div>

                            <div>
                                <img src="" alt="" />
                            </div>
                        </div>
                      
                    </div>

                    <div className="badges">
                        <div className="badges-heading">
                            <h2>Badges og Achievements</h2>
                            <ArrowRight />
                        </div>

                        <div className="badge-list">
                            <div><img src="" alt="" /></div>
                            <div><img src="" alt="" /></div>
                            <div><img src="" alt="" /></div>
                        </div>
                    </div>
                </>
            )} */}


            <FooterNav />
        </div>
    );
};