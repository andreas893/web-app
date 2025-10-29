import { useEffect } from "react";
import { Headphones, Music, Palette, BookUser } from "lucide-react";
import ScrollStack, { ScrollStackItem } from "../components/ScrollStack";
import BadgeCard from "../components/BadgeCard";
import "../badges.css";

export default function BadgeCategories() {
    useEffect(() => {
    // Tving browseren (og Lenis) til at starte fra top
    window.scrollTo(0, 0);
    }, []);

  const categories = [
    {
      title: "Lyttetid",
      icon: <Headphones />,
      color: "#FFD85E",
      badges: [
        { title: "Bronze", description: "Lyt i 100 min", type: "Bronze", progress: 80, goal: 100 },
        { title: "Sølv", description: "Lyt i 500 min", type: "Silver", progress: 50, goal: 100 },
        { title: "Guld", description: "Lyt i 1000 min", type: "Gold", progress: 30, goal: 100 },
      ],
    },
    {
      title: "Genrer",
      icon: <Music />,
      color: "#80E27E",
      badges: [
        { title: "Bronze", description: "Udforsk 5 genrer", type: "Bronze", progress: 90, goal: 100 },
        { title: "Sølv", description: "Udforsk 10 genrer", type: "Silver", progress: 60, goal: 100 },
        { title: "Guld", description: "Udforsk 20 genrer", type: "Gold", progress: 25, goal: 100 },
      ],
    },
    {
      title: "Skaber",
      icon: <Palette />,
      color: "#FFD85E",
      badges: [
        { title: "Bronze", description: "Opret 1 playliste", type: "Bronze", progress: 100, goal: 100 },
        { title: "Sølv", description: "Opret 3 playlister", type: "Silver", progress: 60, goal: 100 },
        { title: "Guld", description: "Opret 5 playlister", type: "Gold", progress: 20, goal: 100 },
      ],
    },
    {
      title: "Social",
      icon: <BookUser />,
      color: "#6EC8FF",
      badges: [
        { title: "Bronze", description: "Del 1 playliste", type: "Bronze", progress: 80, goal: 100 },
        { title: "Sølv", description: "Del 5 playlister", type: "Silver", progress: 40, goal: 100 },
        { title: "Guld", description: "Del 10 playlister", type: "Gold", progress: 15, goal: 100 },
      ],
    },
  ];

  return (
    // ScrollStack håndterer nu animationen 
    <ScrollStack
      useWindowScroll
      baseScale={0.85}
      itemScale={0.04}
      itemDistance={20}
      itemStackDistance={20}
      stackPosition="25%"
      scaleEndPosition="15%"
    >
      {categories.map((cat) => (
        <ScrollStackItem key={cat.title} itemClassName="category-card">
          <div
            className="category-card-inner"
            style={{ backgroundColor: cat.color }}
          >
            <div className="category-header">
                <span>{cat.icon}</span>
              <h3>{cat.title}</h3>
            </div>

            <div className="category-badges">
              {cat.badges.map((b) => (
                <BadgeCard key={b.title} {...b} />
              ))}
            </div>
          </div>
        </ScrollStackItem>
      ))}
    </ScrollStack>
  );
}
