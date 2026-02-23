"use client";
import { Terminal, Code2, Swords, Trophy, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-green-500/30 overflow-hidden relative flex flex-col items-center justify-center">
      
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Radial Gradient for central glow */}
      <div className="absolute inset-0 bg-zinc-950 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_20%,black_100%)]"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        
        {/* Top Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-zinc-400">System Online</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-mono mb-6"
        >
          Write Code. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-600">
            Destroy Your Friends.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-zinc-400 font-mono max-w-xl mx-auto mb-10 text-sm md:text-base leading-relaxed"
        >
          The elite arena for competitive developers. Link your LeetCode, HackerRank, and Codeforces. Stake your XP. Climb the global ranks.
        </motion.p>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center"
        >
          <Link href="/login" className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-black uppercase tracking-widest overflow-hidden rounded-sm hover:scale-105 transition-transform active:scale-95">
            <Terminal className="w-5 h-5" />
            <span>Enter Arena</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
          </Link>
          
          <Link href="/codex" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors rounded-sm">
            <Code2 className="w-5 h-5" />
            <span>Read Codex</span>
          </Link>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-24 w-full text-left"
        >
          <div className="p-6 border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm rounded-xl">
            <Trophy className="w-6 h-6 text-yellow-500 mb-4" />
            <h3 className="font-bold font-mono text-zinc-100 mb-2">Global Leaderboards</h3>
            <p className="text-xs font-mono text-zinc-500">Aggregate your stats across multiple coding platforms into one unified rank.</p>
          </div>
          <div className="p-6 border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm rounded-xl">
            <Swords className="w-6 h-6 text-red-500 mb-4" />
            <h3 className="font-bold font-mono text-zinc-100 mb-2">1v1 Deathmatches</h3>
            <p className="text-xs font-mono text-zinc-500">Challenge friends to live, timed algorithm battles. Winner takes the staked XP.</p>
          </div>
          <div className="p-6 border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm rounded-xl">
            <Code2 className="w-6 h-6 text-blue-500 mb-4" />
            <h3 className="font-bold font-mono text-zinc-100 mb-2">Bounty Contracts</h3>
            <p className="text-xs font-mono text-zinc-500">Solve asynchronous, high-difficulty challenges to grind XP and earn badges.</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}