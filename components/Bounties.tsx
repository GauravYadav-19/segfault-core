"use client";
import { Target, Code2, Award, Clock, ChevronRight } from "lucide-react";

export default function Bounties({ currentTheme }: { currentTheme: any }) {
  const bounties = [
    { 
      id: 1, 
      title: "Optimize Tensor Operations", 
      desc: "Refactor the core matrix multiplication loop to reduce memory overhead.", 
      tags: ["Python", "PyTorch"], 
      difficulty: "Hard", 
      reward: 850, 
      timeLeft: "12h" 
    },
    { 
      id: 2, 
      title: "Custom Memory Allocator", 
      desc: "Implement a thread-safe slab allocator to prevent fragmentation.", 
      tags: ["C++", "System"], 
      difficulty: "Extreme", 
      reward: 1200, 
      timeLeft: "2d" 
    },
    { 
      id: 3, 
      title: "Pattern Recognition Pipeline", 
      desc: "Build a lightweight feature extraction model for edge devices.", 
      tags: ["Python", "OpenCV"], 
      difficulty: "Medium", 
      reward: 400, 
      timeLeft: "5h" 
    },
    { 
      id: 4, 
      title: "Fix API Rate Limiting", 
      desc: "Implement a token bucket algorithm to throttle incoming requests.", 
      tags: ["TypeScript", "Backend"], 
      difficulty: "Easy", 
      reward: 150, 
      timeLeft: "1d" 
    }
  ];

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy": return "text-green-500 border-green-500/30 bg-green-500/10";
      case "Medium": return "text-yellow-500 border-yellow-500/30 bg-yellow-500/10";
      case "Hard": return "text-orange-500 border-orange-500/30 bg-orange-500/10";
      case "Extreme": return "text-red-500 border-red-500/30 bg-red-500/10 animate-pulse";
      default: return "text-zinc-500 border-zinc-500/30 bg-zinc-500/10";
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-zinc-800 pb-2">
        <h2 className="text-xl font-bold font-mono text-zinc-100 flex items-center gap-2">
          <Target className="w-5 h-5 text-zinc-400" />
          Active Contracts
        </h2>
        <span className="text-xs text-zinc-500 font-mono">Daily reset in 04:12:09</span>
      </div>

      {/* Bounties List */}
      <div className="flex flex-col gap-4">
        {bounties.map((bounty) => (
          <div 
            key={bounty.id} 
            className={`group relative flex flex-col p-5 rounded-xl border border-zinc-800/50 bg-zinc-900/40 hover:bg-zinc-800/80 transition-all cursor-pointer overflow-hidden`}
          >
            {/* Hover Glow Effect */}
            <div className={`absolute top-0 left-0 w-1 h-full ${currentTheme.bg.replace('/10', '')} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-zinc-100 text-lg">{bounty.title}</h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{bounty.desc}</p>
              </div>
              <div className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider border ${getDifficultyColor(bounty.difficulty)}`}>
                {bounty.difficulty}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              {bounty.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-[10px] bg-zinc-950 px-2 py-1 rounded-md text-zinc-300 border border-zinc-800 font-mono">
                  <Code2 className="w-3 h-3 text-zinc-500" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-zinc-800/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm font-bold text-amber-500">
                  <Award className="w-4 h-4" /> {bounty.reward} XP
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                  <Clock className="w-3 h-3" /> {bounty.timeLeft}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-300 transition-colors group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}