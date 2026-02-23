"use client";
import { Trophy, Swords, Target, User } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentTheme: any;
}

export default function BottomNav({ activeTab, setActiveTab, currentTheme }: BottomNavProps) {
  const tabs = [
    { id: "leaderboard", icon: Trophy, label: "Rank" },
    { id: "battle", icon: Swords, label: "Arena" },
    { id: "bounties", icon: Target, label: "Bounties" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 w-full h-20 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/50 flex justify-around items-center px-2 pb-4 z-50">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center w-16 h-full relative transition-all ${
              isActive ? currentTheme.text : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            {isActive && (
              <div className={`absolute top-0 w-8 h-1 rounded-b-md ${currentTheme.bg.replace('/10', '')} shadow-[0_0_10px_currentColor]`}></div>
            )}
            <tab.icon className={`w-6 h-6 mb-1 ${isActive ? "scale-110" : ""}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}