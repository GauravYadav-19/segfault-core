"use client";
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, Loader2, Terminal, Swords, GripHorizontal, Radar } from "lucide-react";
import { createClient } from "../utils/supabase/client";

export default function BattleArena({ currentTheme }: { currentTheme: any }) {
  const supabase = createClient();
  
  // MATCHMAKING STATE: 'idle' | 'searching' | 'combat'
  const [matchState, setMatchState] = useState<"idle" | "searching" | "combat">("idle");
  const [opponent, setOpponent] = useState<any>(null);

  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState<string>("> System initialized. Awaiting execution...");
  const [isExecuting, setIsExecuting] = useState(false);
  const [code, setCode] = useState(
`#include <iostream>
using namespace std;

int main() {
    // SegFault Arena Connection Established
    cout << "Ready for battle." << endl;
    return 0;
}`
  );

  // Clean up WebSockets if the user leaves the Arena tab
  useEffect(() => {
    return () => {
      supabase.removeAllChannels();
    };
  }, []);

  const handleFindMatch = async () => {
    setMatchState("searching");
    
    // 1. Open a WebSocket connection to the global lobby
    const lobbyChannel = supabase.channel('global_lobby');
    
    lobbyChannel
      .on('presence', { event: 'sync' }, () => {
        console.log("Synced lobby presence");
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log("Connected to WebSocket Lobby.");
          
          // Temporary Simulation: Wait 3 seconds, then "find" an opponent to unlock the IDE
          setTimeout(() => {
            setOpponent({ name: "Unknown_Hacker", rank: "Initiate" });
            setMatchState("combat");
            setOutput("> MATCH FOUND. Connection established.\n> Countdown initiated...");
          }, 3000);
        }
      });
  };

  const handleRunCode = async () => {
    setIsExecuting(true);
    setOutput("> Compiling and executing in secure sandbox...\n> Provisioning isolated container...\n");

    try {
      // Send the code to our secure Next.js backend API
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });

      const data = await response.json();

      if (data.error) {
        setOutput(`> SYSTEM ERROR: ${data.error}`);
        return;
      }

      // Parse the real output from the compiler
      if (data.run && data.run.output !== undefined) {
        setOutput(`[SUCCESS] Execution complete.\n\nOutput:\n${data.run.output}\n> Signal: ${data.run.signal || 'None'} | Code: ${data.run.code}`);
      } else if (data.compile && data.compile.output) {
        setOutput(`> COMPILE ERROR:\n${data.compile.output}`);
      } else if (data.message) {
        // Piston API specific error messages
        setOutput(`> API ERROR: ${data.message}`);
      } else {
        // DIAGNOSTIC DUMP: If the format is completely unknown, print the raw JSON
        setOutput(`> RAW SYSTEM RESPONSE:\n${JSON.stringify(data, null, 2)}`);
      }

    } catch (error) {
      setOutput(`> SEVERE: Backend execution route unreachable. Error: ${error}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex flex-col animate-in fade-in zoom-in-95 duration-500 w-full relative">
      
      {/* MATCHMAKING OVERLAY */}
      {matchState !== "combat" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm rounded-xl border border-zinc-800">
          <div className="flex flex-col items-center gap-6 p-8 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-sm text-center">
            
            <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center ${matchState === "searching" ? 'border-green-500 bg-green-500/10' : 'border-zinc-700 bg-zinc-950'}`}>
              {matchState === "searching" ? (
                <Radar className="w-10 h-10 text-green-500 animate-spin" />
              ) : (
                <Swords className="w-10 h-10 text-zinc-500" />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-black font-mono text-white uppercase tracking-tighter">
                {matchState === "searching" ? "Scanning Array..." : "Ranked 1v1"}
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-2">
                {matchState === "searching" ? "Connecting to Supabase Realtime WebSockets." : "Stake your XP. Winner takes all."}
              </p>
            </div>

            <button 
              onClick={handleFindMatch}
              disabled={matchState === "searching"}
              className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2
                ${matchState === "searching" 
                  ? 'bg-zinc-800 text-green-500 border border-green-500/20' 
                  : 'bg-white text-black hover:bg-zinc-200 hover:scale-105 active:scale-95'}`}
            >
              {matchState === "searching" ? "Searching..." : "Find Match"}
            </button>
          </div>
        </div>
      )}

      {/* Arena Header */}
      <div className="flex items-center justify-between p-4 border border-zinc-800 bg-zinc-950/50 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${opponent ? 'bg-red-500/10 border-red-500/20' : 'bg-zinc-900 border-zinc-800'}`}>
            <Swords className={`w-5 h-5 ${opponent ? 'text-red-500' : 'text-zinc-600'}`} />
          </div>
          <div>
            <h2 className="font-mono font-black text-white uppercase tracking-tight">
              {opponent ? `VS ${opponent.name}` : "Deathmatch"}
            </h2>
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
              {opponent ? "Match in Progress" : "Awaiting Opponent"}
            </p>
          </div>
        </div>

        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 py-1.5 px-3 rounded-md outline-none"
        >
          <option value="cpp">C++ (GCC)</option>
          <option value="python">Python 3</option>
          <option value="javascript">Node.js</option>
        </select>
      </div>

      {/* Code Editor Container */}
      <div className={`relative border-x border-zinc-800 bg-[#1e1e1e] flex flex-col group ${matchState !== 'combat' ? 'opacity-30 pointer-events-none' : ''}`}>
        <div className="resize-y overflow-hidden min-h-[300px] max-h-[80vh] h-[400px] flex flex-col relative">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              padding: { top: 16 },
              automaticLayout: true,
              wordWrap: "on",
            }}
          />
          <div className="absolute bottom-0 w-full h-3 bg-zinc-800/50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
             <GripHorizontal className="w-4 h-4 text-zinc-500" />
          </div>
        </div>
      </div>

      {/* Execution Controls */}
      <div className={`p-4 border border-zinc-800 bg-zinc-950 flex justify-between items-center ${matchState !== 'combat' ? 'opacity-30 pointer-events-none' : ''}`}>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <Terminal className="w-4 h-4" />
          <span>Status: <span className={isExecuting ? "text-yellow-500" : "text-green-500"}>
            {isExecuting ? "Compiling..." : "Idle"}
          </span></span>
        </div>

        <button 
          onClick={handleRunCode}
          disabled={isExecuting || matchState !== "combat"}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold uppercase tracking-widest text-sm transition-all bg-white text-black hover:bg-zinc-200 active:scale-95`}
        >
          {isExecuting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {isExecuting ? 'Running...' : 'Run Code'}
        </button>
      </div>

      {/* OUTPUT CONSOLE */}
      <div className={`border border-t-0 border-zinc-800 bg-black rounded-b-xl p-4 h-40 overflow-y-auto ${matchState !== 'combat' ? 'opacity-30 pointer-events-none' : ''}`}>
        <h3 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-2">Execution Output</h3>
        <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap">{output}</pre>
      </div>

    </div>
  );
}