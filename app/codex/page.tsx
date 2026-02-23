"use client";
import { BookOpen, Terminal, ChevronRight, Code2, Command } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CodexPage() {
  const snippets = [
    { id: 1, title: "Custom Memory Allocators", category: "C++ / Systems", readTime: "5m", desc: "Bypassing standard malloc for high-performance trading algorithms." },
    { id: 2, title: "Tensor Memory Optimization", category: "PyTorch", readTime: "8m", desc: "Reducing VRAM overhead during backpropagation in deep neural networks." },
    { id: 3, title: "Advanced Graph Traversal", category: "Algorithms", readTime: "12m", desc: "Implementing bidirectional BFS for sub-millisecond pathfinding." },
    { id: 4, title: "WebAssembly Integrations", category: "Rust / Web", readTime: "6m", desc: "Porting cryptographic functions to the browser with zero-cost abstractions." },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 selection:bg-green-500/30">
      
      {/* Navigation */}
      <nav className="max-w-4xl mx-auto mb-16 flex justify-between items-center">
        <Link href="/" className="text-xs font-mono text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
          <Command className="w-3 h-3" /> return to base
        </Link>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50">
          <BookOpen className="w-3 h-3 text-zinc-400" />
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-400">Public Archive</span>
        </div>
      </nav>

      {/* Header */}
      <header className="max-w-4xl mx-auto mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black tracking-tighter uppercase font-mono mb-4 flex items-center gap-4"
        >
          <Terminal className="w-10 h-10 text-zinc-500" />
          The Codex
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-zinc-400 font-mono text-sm max-w-xl">
          High-level execution strategies, system optimizations, and algorithm breakdowns. Read the documentation. Survive the arena.
        </motion.p>
      </header>

      {/* Snippet Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {snippets.map((snippet) => (
          <div key={snippet.id} className="group relative p-6 rounded-xl border border-zinc-800/50 bg-zinc-900/40 hover:bg-zinc-800/80 transition-all cursor-pointer overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-start mb-4">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                <Code2 className="w-3 h-3" /> {snippet.category}
              </span>
              <span className="text-[10px] font-mono text-zinc-600">{snippet.readTime} read</span>
            </div>

            <h3 className="text-lg font-bold text-zinc-100 mb-2">{snippet.title}</h3>
            <p className="text-xs text-zinc-400 mb-6">{snippet.desc}</p>

            <div className="flex items-center text-xs font-bold uppercase tracking-wider text-zinc-500 group-hover:text-white transition-colors">
              Read File <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}