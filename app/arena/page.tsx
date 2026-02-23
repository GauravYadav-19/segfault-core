"use client";
import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import BottomNav from "../../components/BottomNav";
import Leaderboard from "../../components/Leaderboard";
import BattleArena from "../../components/BattleArena";
import Bounties from "../../components/Bounties";
import Profile from "../../components/Profile";

export default function SegFaultApp() {
  const [activeTab, setActiveTab] = useState("arena");
  const [activePlatform, setActivePlatform] = useState("hackerrank");
  
  // GLOBAL TOGGLE: Now applies to the entire website, not just the Arena
  const [isDesktopMode, setIsDesktopMode] = useState(true);

  // The Dynamic Theme Engine
  const themeColors: Record<string, { text: string; border: string; bg: string; shadow: string }> = {
    leetcode: { text: "text-orange-500", border: "border-orange-500/50", bg: "bg-orange-500/10", shadow: "shadow-orange-500/20" },
    hackerrank: { text: "text-green-500", border: "border-green-500/50", bg: "bg-green-500/10", shadow: "shadow-green-500/20" },
    codeforces: { text: "text-red-500", border: "border-red-500/50", bg: "bg-red-500/10", shadow: "shadow-red-500/20" },
  };

  const currentTheme = themeColors[activePlatform];

  // Dynamically control the width of the main container for ALL tabs
  const containerWidth = isDesktopMode ? "max-w-7xl" : "max-w-md";

  return (
    <div className="min-h-screen flex flex-col pb-24">
      
      {/* --- THE KILL FEED --- */}
      <div className="w-full bg-zinc-900 border-b border-zinc-800 h-8 flex items-center overflow-hidden relative">
        <style>{`
          @keyframes scroll { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
          .animate-marquee { display: inline-block; white-space: nowrap; animation: scroll 20s linear infinite; }
        `}</style>
        <div className="animate-marquee text-xs font-mono text-zinc-400">
          🔥 Yash just solved Two Sum (Hard) +50 XP &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; 
          💀 Sushant failed Compilation on SegTree &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; 
          🏆 Bharat reached a 28-day streak!
        </div>
      </div>

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800/50 px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-1 font-mono">
          SEGFAULT<span className={`${currentTheme.text} animate-pulse`}>_</span>
        </h1>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${currentTheme.border} ${currentTheme.bg}`}>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-bold font-mono">Rank #5</span>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className={`flex-1 p-4 mx-auto w-full flex flex-col transition-all duration-500 ease-in-out ${containerWidth}`}>
        
        {/* DEV TOOLS & VIEW TOGGLES */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
              {["leetcode", "hackerrank", "codeforces"].map(p => (
                  <button 
                    key={p} 
                    onClick={() => setActivePlatform(p)} 
                    className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded transition-colors ${activePlatform === p ? `bg-zinc-800 text-white` : `text-zinc-600 border border-zinc-800`}`}
                  >
                    {p}
                  </button>
              ))}
          </div>

          {/* Global Desktop/Mobile Layout Toggle */}
          <button 
            onClick={() => setIsDesktopMode(!isDesktopMode)}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-white transition-colors shrink-0"
          >
            {isDesktopMode ? (
              <><Smartphone className="w-4 h-4" /> Mobile View</>
            ) : (
              <><Monitor className="w-4 h-4" /> Desktop View</>
            )}
          </button>
        </div>

        {/* --- VIEW ROUTER --- */}
        {activeTab === "leaderboard" && <Leaderboard currentTheme={currentTheme} />}
        {(activeTab === "arena" || activeTab === "battle") && <BattleArena currentTheme={currentTheme} />}
        {activeTab === "bounties" && <Bounties currentTheme={currentTheme} />}
        {activeTab === "profile" && <Profile currentTheme={currentTheme} />}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} currentTheme={currentTheme} />
    </div>
  );
}