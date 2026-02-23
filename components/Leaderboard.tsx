"use client";
import { useEffect, useState } from "react";
import { Trophy, Flame, User, Loader2, Crown, Medal } from "lucide-react";
import { createClient } from "../utils/supabase/client";

export default function Leaderboard({ currentTheme }: { currentTheme: any }) {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchLeaderboard() {
      // 1. Get current user so we can highlight you in the list
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      // 2. Fetch the top 50 players directly from PostgreSQL, ordered by XP
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, xp, streak, title")
        .order("xp", { ascending: false })
        .limit(50);

      if (!error && data) {
        setLeaders(data);
      } else {
        console.error("Failed to fetch leaderboard:", error);
      }
      setLoading(false);
    }

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <Loader2 className={`w-8 h-8 animate-spin ${currentTheme.text}`} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${currentTheme.border} ${currentTheme.bg}`}>
            <Trophy className={`w-5 h-5 ${currentTheme.text}`} />
          </div>
          <div>
            <h2 className="font-mono font-black text-white uppercase tracking-tight">Global Ranks</h2>
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Top 50 Players</p>
          </div>
        </div>
      </div>

      {/* Leaderboard Roster */}
      <div className="flex flex-col gap-2">
        {leaders.map((player, index) => {
          const rank = index + 1;
          const isCurrentUser = player.id === currentUserId;
          
          // Dynamic Styling for Top 3 Players
          let rankIcon = <span className="font-mono font-bold text-zinc-500 w-6 text-center">{rank}</span>;
          let borderClass = "border-zinc-800/50";
          let bgClass = isCurrentUser ? "bg-zinc-800/80" : "bg-zinc-900/40";
          
          if (rank === 1) {
            rankIcon = <Crown className="w-5 h-5 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />;
            borderClass = "border-yellow-500/30";
            bgClass = isCurrentUser ? "bg-yellow-500/10" : "bg-yellow-500/5";
          } else if (rank === 2) {
            rankIcon = <Medal className="w-5 h-5 text-zinc-300" />;
            borderClass = "border-zinc-300/30";
          } else if (rank === 3) {
            rankIcon = <Medal className="w-5 h-5 text-amber-600" />;
            borderClass = "border-amber-600/30";
          }

          return (
            <div 
              key={player.id} 
              className={`flex items-center justify-between p-3 rounded-xl border ${borderClass} ${bgClass} hover:bg-zinc-800 transition-colors relative overflow-hidden`}
            >
              {/* Highlight bar for the logged-in user */}
              {isCurrentUser && (
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${currentTheme.bg.replace('/10', '')} shadow-[0_0_10px_currentColor]`}></div>
              )}

              <div className="flex items-center gap-4">
                <div className="flex justify-center w-6">
                  {rankIcon}
                </div>
                
                <div className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-950 overflow-hidden flex-shrink-0">
                  {player.avatar_url ? (
                    <img src={player.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 m-2 text-zinc-500" />
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-100 text-sm truncate max-w-[120px] sm:max-w-xs">
                      {player.full_name || "Unknown Hacker"}
                    </span>
                    {isCurrentUser && (
                      <span className="text-[9px] uppercase tracking-wider bg-zinc-700 text-white px-1.5 py-0.5 rounded">You</span>
                    )}
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">
                    @{player.username || "guest"} • {player.title}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500" /> {player.streak || 0}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-600">Streak</span>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="text-lg font-black font-mono text-white tracking-tight">
                    {player.xp?.toLocaleString() || 0}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500">Total XP</span>
                </div>
              </div>
            </div>
          );
        })}

        {leaders.length === 0 && !loading && (
          <div className="text-center p-8 text-zinc-500 font-mono text-sm border border-zinc-800 rounded-xl bg-zinc-900/20">
            No players found in the database.
          </div>
        )}
      </div>
      
    </div>
  );
}