import SoundForYou from "../components/SoundForYou";
import Feed from "../components/Feed";
import Wrapped from "../components/Wrapped";
import FooterNav from "../components/FooterNav";

export default function LandingPage() {
  return (
    <div className="bg-[#121212] min-h-screen flex flex-col font-inter relative">
      <main className="flex-1 pb-20 overflow-y-auto hide-scroll px-4">
        <div className="logo-header">
          <img src="/images/chord-logo.png" alt="Chord logo" />
        </div>
        <Feed />
        <SoundForYou />
        <Wrapped />
      </main>
      <FooterNav />
    </div>
  );
}
