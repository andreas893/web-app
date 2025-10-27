// src/data/userStats.js
// Simuleret data-interface, hvor rigtige apps normalt ville kalde Firestore

export async function getUserStats() {
  // I en rigtig app ville vi her hente fra Firestore:
  // const doc = await getDoc(doc(db, `users/${uid}/stats_monthly/${monthKey}`));

  return {
    totalMinutes: 2900, // samlet tid denne måned
    favoriteTime: "Sen aften",
    topGenre: "Indie",
    device: "Mobil",

    // Data til grafer
    dailyListening: [
      { day: "Man", hours: 2.1 },
      { day: "Tir", hours: 3.4 },
      { day: "Ons", hours: 4.0 },
      { day: "Tor", hours: 3.7 },
      { day: "Fre", hours: 5.2 },
      { day: "Lør", hours: 6.1 },
      { day: "Søn", hours: 4.8 },
    ],
    monthlyTotals: [
      { week: "Uge 40", total: 12.3 },
      { week: "Uge 41", total: 14.1 },
      { week: "Uge 42", total: 18.9 },
      { week: "Uge 43", total: 16.7 },
    ],
  };
}
