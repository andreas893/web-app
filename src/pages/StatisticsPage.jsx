/**
 * Statistiksystem – dataflow (konceptuelt):
 * -----------------------------------------
 * 1. Brugerens handlinger (afspilning, likes, oprettelse af playlister)
 *    logges som events i Firestore.
 * 2. En cron-function aggregerer events til daglige/månedlige statistikker
 *    (f.eks. total lytning, genrefordeling, aktivitetsmønster).
 * 3. Statistik-siden henter disse aggregerede data og viser dem grafisk.
 *
 * I denne prototype bruger vi getUserStats() i /data/userStats.js som et
 * mock-lag, der simulerer, hvordan data normalt ville hentes fra Firestore.
 */

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart
} from "recharts";
import { getUserStats } from "../data/userStats";
import FooterNav from "../components/FooterNav";
import "../statistics.css";


export default function StatisticsPage() {
    const [activeCategory, setActiveCategory] = useState("Timer");
    const [stats, setStats] = useState(null);
    const navigate = useNavigate();


  useEffect(() => {
    async function fetchStats() {
      const data = await getUserStats();
      setStats(data);
    }
    fetchStats();
  }, []);

  if (!stats) return <p>Indlæser data...</p>;

  // Tooltip styling
  const tooltipStyle = {
    backgroundColor: "#23262C",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    color: "#e0e0e0",
    padding: "0.6rem 0.8rem",
    fontSize: "0.8rem",
  };

  const tooltipItem = {
    color: "#FFD633",
    fontWeight: 500,
  };

  const tooltipLabel = {
    color: "#e0e0e0",
    fontWeight: 600,
    marginBottom: "0.25rem",
  };


 const renderCharts = () => {
  switch (activeCategory) {
    case "Timer":
      return (
        <>
          {/* Ugedagsmønster */}
          <div className="stat-card blue full-width">
            <h3>Timer lyttet pr. ugedag</h3>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={[
                { day: "Man", hours: 2.1 },
                { day: "Tir", hours: 3.4 },
                { day: "Ons", hours: 4.0 },
                { day: "Tor", hours: 3.7 },
                { day: "Fre", hours: 5.2 },
                { day: "Lør", hours: 6.1 },
                { day: "Søn", hours: 4.8 },
              ]}>
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItem} labelStyle={tooltipLabel}/>
                <Bar dataKey="hours" fill="#0091ff" radius={[10,10,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Samlet lytning denne måned */}
          <div className="stat-card dark full-width">
            <h3>Samlet lytning denne måned</h3>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={[
                { week: "Uge 40", total: 12.3 },
                { week: "Uge 41", total: 14.1 },
                { week: "Uge 42", total: 18.9 },
                { week: "Uge 43", total: 16.7 },
              ]}>
                <Line type="monotone" dataKey="total" stroke="#FFD633" strokeWidth={3} dot={{ r: 4 }} />
                <XAxis dataKey="week" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItem} labelStyle={tooltipLabel}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      );

    case "Genrer":
      return (
        <>
          {/* Favoritgenrer */}
          <div className="stat-card yellow full-width">
            <h3>Dine mest spillede genrer</h3>
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={[
                    { genre: "Pop", value: 28 },
                    { genre: "Lo-Fi", value: 20 },
                    { genre: "R&B", value: 17 },
                    { genre: "Indie", value: 15 },
                    { genre: "Hip-Hop", value: 20 },
                  ]}
                  dataKey="value"
                  nameKey="genre"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {["#FF6584","#FFD633","#37E2D5","#7C83FD","#8AFF80"].map((c,i)=><Cell key={i} fill={c}/>)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItem} labelStyle={tooltipLabel}/>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Musiksmag over året */}
          <div className="stat-card dark full-width">
            <h3>Udvikling i musiksmag</h3>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={[
                { month: "Jun", Pop: 60, LoFi: 40 },
                { month: "Jul", Pop: 65, LoFi: 45 },
                { month: "Aug", Pop: 70, LoFi: 55 },
                { month: "Sep", Pop: 74, LoFi: 60 },
              ]}>
                <defs>
                  <linearGradient id="colorPop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6584" stopOpacity={0.7}/>
                    <stop offset="100%" stopColor="#FF6584" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorLoFi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#37E2D5" stopOpacity={0.7}/>
                    <stop offset="100%" stopColor="#37E2D5" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItem} labelStyle={tooltipLabel}/>
                <Area type="monotone" dataKey="Pop" stroke="#FF6584" fill="url(#colorPop)" />
                <Area type="monotone" dataKey="LoFi" stroke="#37E2D5" fill="url(#colorLoFi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      );

    case "Aktivitet":
      return (
        <>
          {/* Døgnrytme */}
          <div className="stat-card pink full-width">
            <h3>Lytteaktivitet gennem dagen</h3>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={[
                { hour: "06", plays: 10 },
                { hour: "09", plays: 35 },
                { hour: "12", plays: 55 },
                { hour: "15", plays: 80 },
                { hour: "18", plays: 95 },
                { hour: "21", plays: 70 },
                { hour: "00", plays: 25 },
              ]}>
                <Line type="monotone" dataKey="plays" stroke="#FFD633" strokeWidth={3} dot={false}/>
                <XAxis dataKey="hour" stroke="#888"/>
                <YAxis stroke="#888"/>
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItem} labelStyle={tooltipLabel}/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Mest brugte enheder */}
          <div className="stat-card green full-width">
            <h3>Hvilke enheder du lytter mest på</h3>
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={[
                    { device: "Mobil", value: 70 },
                    { device: "PC", value: 20 },
                    { device: "Smart TV", value: 10 },
                  ]}
                  dataKey="value"
                  nameKey="device"
                  outerRadius={80}
                >
                  {["#8AFF80","#FFD633","#37E2D5"].map((c,i)=><Cell key={i} fill={c}/>)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItem} labelStyle={tooltipLabel}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      );

    case "Kunstnere":
      return (
        <>
          {/* Personlig top */}
          <div className="stat-card blue full-width">
            <h3>Dine mest lyttede artister</h3>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={[
                { name: "SZA", listens: 140 },
                { name: "Joji", listens: 115 },
                { name: "Kali Uchis", listens: 104 },
                { name: "Drake", listens: 98 },
                { name: "Frank Ocean", listens: 155 },
              ]}>
                <XAxis dataKey="name" stroke="#888"/>
                <YAxis stroke="#888"/>
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItem} labelStyle={tooltipLabel}/>
                <Bar dataKey="listens" fill="#8AFF80" radius={[10,10,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Lytning fordelt på lande */}
          <div className="stat-card dark full-width">
            <h3>Hvor dine artister kommer fra</h3>
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={[
                    { country: "USA", value: 60 },
                    { country: "UK", value: 25 },
                    { country: "DK", value: 10 },
                    { country: "Andet", value: 5 },
                  ]}
                  dataKey="value"
                  nameKey="country"
                  outerRadius={80}
                >
                  {["#FFD633","#37E2D5","#FF6584","#7C83FD"].map((c,i)=><Cell key={i} fill={c}/>)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItem} labelStyle={tooltipLabel}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      );

    default:
      return null;
  }
};





    return(
         <div className="stats-page">
      <div className="statistic-heading">
            <div className="stat-arrow"><ArrowLeft onClick={() => navigate(-1)}/></div>
            
            <div className="stat-text">
                <h1>Dine Statistikker</h1>
                <p>Se hvordan du lytter</p>
            </div>
      </div>

      <div className="primary-stat">
        <div className="primary-stat-content">
          <h2>Du har i alt lyttet</h2>
          <p className="highlight"> 
            {Math.floor(stats.totalMinutes / 60)} timer og{" "}
            {stats.totalMinutes % 60} minutter</p>
          <span className="subtext">Siden starten af måneden</span>
        </div>

        <div className="primary-stat-extra">
           <div className="extra-item"><h4>Favorit tidspunkt</h4><p>{stats.favoriteTime}</p></div>
          <div className="extra-item"><h4>Top genre</h4><p>{stats.topGenre}</p></div>
          <div className="extra-item"><h4>Flest streams på</h4><p>{stats.device}</p></div>
        </div>
      </div>

      <div className="category-slider">
        {["Timer", "Genrer", "Aktivitet", "Kunstnere"].map((cat) => (
          <button
            key={cat}
            className={activeCategory === cat ? "active" : ""}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="active-stat">
        <h2>{activeCategory}</h2>
        <div className="stat-display">{renderCharts()}</div>
      </div>
        <FooterNav />
    </div>
    );
};