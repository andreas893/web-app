import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import "../profile.css"; 

export default function StatsSection() {
  const navigate = useNavigate();

  // 🎧 1. Aktivitet pr. uge
  const weeklyActivity = [
    { day: "Man", minutes: 35 },
    { day: "Tir", minutes: 42 },
    { day: "Ons", minutes: 28 },
    { day: "Tor", minutes: 55 },
    { day: "Fre", minutes: 60 },
    { day: "Lør", minutes: 48 },
    { day: "Søn", minutes: 39 },
  ];

  // 🎶 2. Genre-fordeling
  const genreDistribution = [
    { genre: "Pop", value: 35 },
    { genre: "Lo-Fi", value: 25 },
    { genre: "R&B", value: 15 },
    { genre: "Indie", value: 10 },
    { genre: "Rock", value: 15 },
  ];

  // 🎤 3. Top artister
  const topArtists = [
    { name: "Frank Ocean", minutes: 124 },
    { name: "Kali Uchis", minutes: 95 },
    { name: "Joji", minutes: 83 },
    { name: "Billie Eilish", minutes: 71 },
    { name: "Brent Faiyaz", minutes: 60 },
  ];

  // ⏰ 4. Aktivitet pr. tidspunkt
  const hourlyListening = [
    { hour: "08", plays: 4 },
    { hour: "10", plays: 7 },
    { hour: "12", plays: 5 },
    { hour: "14", plays: 9 },
    { hour: "16", plays: 8 },
    { hour: "18", plays: 12 },
    { hour: "20", plays: 10 },
  ];

  // 💿 5. Playlister & likes
  const playlistStats = [
    { month: "Jun", playlists: 2, likes: 15 },
    { month: "Jul", playlists: 3, likes: 20 },
    { month: "Aug", playlists: 5, likes: 33 },
    { month: "Sep", playlists: 6, likes: 41 },
    { month: "Oct", playlists: 7, likes: 54 },
  ];

  const COLORS = ["#FF6584", "#FFD633", "#37E2D5", "#7C83FD", "#8AFF80"];

  

  return (
    <section className="stats-section">
      <div className="stats-heading">
        <h2>Statistikker</h2>
        <ArrowRight onClick={() => navigate("/stats")} />
      </div>

      <div className="stats-grid">
        {/* Aktivitet */}
        <div className="stat-card green">
          <h3>Lytteaktivitet pr. uge</h3>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={weeklyActivity}>
              <Line type="monotone" dataKey="minutes" stroke="#000" strokeWidth={2} dot={false}   isAnimationActive={false} />
              <XAxis dataKey="day" hide />
              <YAxis hide />
             <Tooltip
                 wrapperStyle={{ overflow: 'visible', zIndex: 1000 }}
                contentStyle={{
                    backgroundColor: "#23262C",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                    color: "#fff",
                    padding: "0.6rem 0.8rem",
                    fontSize: "0.8rem",
                }}
                itemStyle={{
                    color: "#FFD633",
                    fontWeight: 500,
                }}
                labelStyle={{
                    color: "#fff",
                    fontWeight: 600,
                    marginBottom: "0.25rem",
                }}
            />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Genre-fordeling */}
        <div className="stat-card dark">
          <h3>Genrer</h3>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={genreDistribution}
                dataKey="value"
                nameKey="genre"
                outerRadius={50}
                labelLine={false}
              >
                {genreDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
               <Tooltip
                contentStyle={{
                    backgroundColor: "#23262C",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                    color: "#fff",
                    padding: "0.6rem 0.8rem",
                    fontSize: "0.8rem",
                }}
                itemStyle={{
                    color: "#FFD633",
                    fontWeight: 500,
                }}
                labelStyle={{
                    color: "#fff",
                    fontWeight: 600,
                    marginBottom: "0.25rem",
                }}
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top artister */}
        <div className="stat-card blue">
          <h3>Top Artister</h3>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={topArtists}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
               <Tooltip
                contentStyle={{
                    backgroundColor: "#23262C",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                    color: "#fff",
                    padding: "0.6rem 0.8rem",
                    fontSize: "0.8rem",
                }}
                itemStyle={{
                    color: "#FFD633",
                    fontWeight: 500,
                }}
                labelStyle={{
                    color: "#fff",
                    fontWeight: 600,
                    marginBottom: "0.25rem",
                }}
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
              <Bar dataKey="minutes" fill="#fff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Aktivitet over dagen */}
        <div className="stat-card yellow">
          <h3>Lytteaktivitet pr. time</h3>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={hourlyListening}>
              <Line type="monotone" dataKey="plays" stroke="#000" strokeWidth={2} dot={false} />
              <XAxis dataKey="hour" hide />
              <YAxis hide />
               <Tooltip
                contentStyle={{
                    backgroundColor: "#23262C",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                    color: "#fff",
                    padding: "0.6rem 0.8rem",
                    fontSize: "0.8rem",
                }}
                itemStyle={{
                    color: "#FFD633",
                    fontWeight: 500,
                }}
                labelStyle={{
                    color: "#fff",
                    fontWeight: 600,
                    marginBottom: "0.25rem",
                }}
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Playlister & likes */}
        <div className="stat-card pink full-width">
          <h3>Playlister & Likes</h3>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={playlistStats}>
              <Line type="monotone" dataKey="playlists" stroke="#fff" strokeWidth={2} />
              <Line type="monotone" dataKey="likes" stroke="#FFD633" strokeWidth={2} />
              <XAxis dataKey="month" hide />
              <YAxis hide />
               <Tooltip
                contentStyle={{
                    backgroundColor: "#23262C",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                    color: "#fff",
                    padding: "0.6rem 0.8rem",
                    fontSize: "0.8rem",
                }}
                itemStyle={{
                    color: "#FFD633",
                    fontWeight: 500,
                }}
                labelStyle={{
                    color: "#fff",
                    fontWeight: 600,
                    marginBottom: "0.25rem",
                }}
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
