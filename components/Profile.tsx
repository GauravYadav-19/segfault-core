"use client";
import { User, Trophy, Flame, Code2, Terminal, Zap, Activity, LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import { useEffect, useState } from "react";

export default function Profile({ currentTheme }: { currentTheme: any }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [dbProfile, setDbProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserAndProfile() {
      // 1. Get the secure Auth session
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setSessionUser(user);
        
        // 2. Fetch the real profile data from our new PostgreSQL table
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (!error && profileData) {
          setDbProfile(profileData);
        }
      }
      setLoading(false);
    }
    getUserAndProfile();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/login");
    } else {
      console.error("Failed to log out:", error.message);
    }
  };

  // Mock data we will replace in later phases
  const techStack = ["C++", "Python", "PyTorch", "NumPy"];
  const recentMatches = [
    { id: 1, result: "Victory", type: "1v1 Clash", opponent: "@sush_12", xp: "+50" },
    { id: 2, result: "Defeat", type: "Free-for-All", opponent: "Lobby", xp: "-15" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <Loader2 className={`w-8 h-8 animate-spin ${currentTheme.text}`} />
      </div>
    );
  }

  const githubName = dbProfile?.full_name || sessionUser?.user_metadata?.full_name || "Unknown Hacker";
  const githubHandle = dbProfile?.username ? `@${dbProfile.username}` : "@guest";
  const avatarUrl = dbProfile?.avatar_url || sessionUser?.user_metadata?.avatar_url;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className={`relative flex flex-col items-center p-6 rounded-2xl border ${currentTheme.border} ${currentTheme.bg} overflow-hidden`}>
        <div className={`absolute top-0 w-full h-1 ${currentTheme.bg.replace('/10', '')} shadow-[0_0_20px_currentColor]`}></div>
        
        <div className="w-20 h-20 rounded-full border-2 border-zinc-800 bg-zinc-900 flex items-center justify-center mb-4 z-10 shadow-xl overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
             <User className="w-10 h-10 text-zinc-500" />
          )}
        </div>
        
        <h2 className="text-2xl font-black tracking-tight text-white font-mono">{githubName}</h2>
        
        {/* REAL DATABASE TITLE */}
        <span className={`text-sm font-bold tracking-widest uppercase ${currentTheme.text}`}>
          {dbProfile?.title || "Initiate"}
        </span>
        <span className="text-xs text-zinc-500 font-mono mt-1">{githubHandle}</span>

        <div className="flex w-full justify-around mt-6 pt-6 border-t border-zinc-800/50">
          <div className="flex flex-col items-center gap-1">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-lg font-bold font-mono">Unranked</span>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500">Rank</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Zap className="w-5 h-5 text-blue-500" />
            {/* REAL DATABASE XP */}
            <span className="text-lg font-bold font-mono">{dbProfile?.xp?.toLocaleString() || 0}</span>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500">Total XP</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Flame className="w-5 h-5 text-orange-500" />
            {/* REAL DATABASE STREAK */}
            <span className="text-lg font-bold font-mono">{dbProfile?.streak || 0}</span>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500">Streak</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <Terminal className="w-4 h-4" /> Arsenal
        </h3>
        <div className="flex flex-wrap gap-2">
          {techStack.map(tech => (
            <span key={tech} className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-sm font-bold text-zinc-300 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-zinc-500" /> {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <h3 className="text-sm font-bold font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4" /> Recent Matches
        </h3>
        <div className="flex flex-col gap-2">
          {recentMatches.map(match => (
            <div key={match.id} className="flex items-center justify-between p-3 rounded-xl border border-zinc-800/50 bg-zinc-900/40">
              <div className="flex flex-col">
                <span className={`text-sm font-bold ${match.result === "Victory" ? "text-green-500" : "text-red-500"}`}>
                  {match.result}
                </span>
                <span className="text-xs text-zinc-500">{match.type} vs {match.opponent}</span>
              </div>
              <span className={`text-sm font-mono font-bold ${match.result === "Victory" ? "text-green-400" : "text-red-400"}`}>
                {match.xp}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <h3 className="text-sm font-bold font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          System
        </h3>
        <button onClick={handleLogout} className="w-full py-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 font-bold uppercase tracking-wider text-sm hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" /> Terminate Session
        </button>
      </div>

    </div>
  );
}