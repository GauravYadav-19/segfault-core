"use client";
import { Zap, Shield, Activity, Cpu, Command, Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 selection:bg-green-500/30">
      
      {/* Navigation */}
      <nav className="max-w-5xl mx-auto mb-16 flex justify-between items-center">
        <Link href="/" className="text-xs font-mono text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
          <Command className="w-3 h-3" /> return to base
        </Link>
      </nav>

      {/* Header */}
      <header className="max-w-5xl mx-auto mb-16 text-center flex flex-col items-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-16 h-16 border border-zinc-800 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(234,179,8,0.1)]">
          <Zap className="w-8 h-8 text-yellow-500" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black tracking-tighter uppercase font-mono mb-4">
          Black Market Access
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-zinc-400 font-mono text-sm max-w-xl mx-auto">
          Upgrade your operational capacity. Gain access to AI-driven code analysis, private lobbies, and advanced telemetry.
        </motion.p>
      </header>

      {/* Pricing Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Free Tier */}
        <div className="flex flex-col p-8 rounded-2xl border border-zinc-800/50 bg-zinc-900/20">
          <h3 className="text-xl font-bold font-mono text-zinc-300 mb-2">Initiate</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-black font-mono text-white">₹0</span>
            <span className="text-xs text-zinc-500 uppercase tracking-widest">/ forever</span>
          </div>
          <p className="text-sm text-zinc-400 mb-8 h-10">The standard issue toolkit for surviving the arena.</p>
          
          <ul className="flex flex-col gap-4 mb-8 flex-1 text-sm text-zinc-300">
            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-zinc-600" /> Access to Public Matchmaking</li>
            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-zinc-600" /> Global Leaderboard Tracking</li>
            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-zinc-600" /> Standard Bounties</li>
          </ul>
          
          <Link href="/login" className="w-full py-4 text-center rounded-xl border border-zinc-800 bg-zinc-900 text-white font-bold uppercase tracking-widest text-sm hover:bg-zinc-800 transition-colors">
            Current Tier
          </Link>
        </div>

        {/* Pro Tier */}
        <div className="relative flex flex-col p-8 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.05)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,1)]" />
          
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold font-mono text-yellow-500">Syndicate</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded border border-yellow-500/30 animate-pulse">
              Recommended
            </span>
          </div>
          
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-black font-mono text-white">₹149</span>
            <span className="text-xs text-zinc-500 uppercase tracking-widest">/ month</span>
          </div>
          <p className="text-sm text-zinc-400 mb-8 h-10">Unfair advantages and deep telemetry for elite performers.</p>
          
          <ul className="flex flex-col gap-4 mb-8 flex-1 text-sm text-zinc-200">
            <li className="flex items-center gap-3"><Activity className="w-4 h-4 text-yellow-500" /> Advanced Match Telemetry</li>
            <li className="flex items-center gap-3"><Cpu className="w-4 h-4 text-yellow-500" /> AI Post-Match Time Complexity Analysis</li>
            <li className="flex items-center gap-3"><Shield className="w-4 h-4 text-yellow-500" /> Create Private Deathmatch Lobbies</li>
            <li className="flex items-center gap-3"><Zap className="w-4 h-4 text-yellow-500" /> 1.5x Multiplier on Bounty XP</li>
          </ul>
          
          <button className="w-full py-4 text-center rounded-xl bg-yellow-500 text-black font-black uppercase tracking-widest text-sm hover:bg-yellow-400 transition-colors hover:scale-[1.02] active:scale-[0.98]">
            Upgrade to Syndicate
          </button>
        </div>

      </motion.div>
    </div>
  );
}