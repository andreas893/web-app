import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import BadgeCard from "../components/BadgeCard";
import FooterNav from "../components/FooterNav";
import BadgeCategories from "../components/CategoryScroll";
import "../badges.css"

export default function BadgePage() {
    const navigate = useNavigate();


      const badges = [
    { title: "Bronze", description: "Lyt i 100 min", type: "Bronze", progress: 80, goal: 100 },
    { title: "Sølv", description: "Udforsk 10 genrer", type: "Silver", progress: 50, goal: 100 },
    { title: "Guld", description: "Opret 3 playlister", type: "Gold", progress: 60, goal: 100 },
    { title: "Platinium", description: "Del 5 playlister", type: "Platinum", progress: 40, goal: 100 },
    { title: "Emerald", description: "Opnå 50 følgere", type: "Emerald", progress: 70, goal: 100 },
    { title: "Diamant", description: "Vær aktiv i 30 dage", type: "Diamond", progress: 30, goal: 100 },
  ];


    return(
        <div className="badge-page">
            <div className="badge-page-heading">
                <div className="back-arrow  ">
                    <ArrowLeft onClick={() => navigate(-1)}/>
                </div>
                
                <div className="badge-text">
                    <h1>Dine Badges</h1>
                    <p>Små beviser på din store musikglæde</p>
                </div>
            </div>

            <div className="progress">
                <h2>Status</h2>
                <div className="badges">
                    <div className="badge-cards">
                        {badges.slice(0, 3).map((b) => (
                        <BadgeCard key={b.title} {...b} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="badge-category">
                <h2>Kategorier</h2>
                <BadgeCategories />

            </div>
            <FooterNav />
        </div>
    );
};