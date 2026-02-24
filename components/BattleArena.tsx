"use client";
import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Play, Loader2, Terminal, Swords, Radar, Target, AlertTriangle, Trophy, Skull, X, ShieldAlert, BrainCircuit } from "lucide-react";
import { createClient } from "../utils/supabase/client";
import { Panel, Group, Separator } from "react-resizable-panels";

const BOILERPLATES: Record<string, string> = {
  cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your optimized solution here\n        \n        return {};\n    }\n};\n\nint main() {\n    // Local testing\n    cout << "Ready for battle." << endl;\n    return 0;\n}`,
  python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your optimized solution here\n        pass\n\nif __name__ == "__main__":\n    print("Ready for battle.")`,
  java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your optimized solution here\n        \n        return new int[]{};\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Ready for battle.");\n    }\n}`
};

export default function BattleArena({ currentTheme }: { currentTheme: any }) {
  const supabase = createClient();
  
  const [matchState, setMatchState] = useState<"idle" | "searching" | "combat" | "finished">("idle");
  const [matchResult, setMatchResult] = useState<"victory" | "defeat" | "banned" | null>(null);
  const [victoryReason, setVictoryReason] = useState<"solved" | "dq" | null>(null); 
  const [opponent, setOpponent] = useState<any>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  
  const userIdRef = useRef(`hacker_${Math.floor(Math.random() * 10000)}`);
  const searchingRef = useRef(false);
  const combatChannelRef = useRef<any>(null); 
  const searchTimeoutRef = useRef<any>(null);
  
  const [strikes, setStrikes] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  // NEW: AI Mentor State
  const [mentorState, setMentorState] = useState<"idle" | "loading" | "visible">("idle");
  const [mentorData, setMentorData] = useState<{concept: string, advice: string} | null>(null);

  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState<string>("> System initialized. Awaiting execution...");
  const [isExecuting, setIsExecuting] = useState(false);
  const [codes, setCodes] = useState<Record<string, string>>(BOILERPLATES);

  useEffect(() => {
    return () => {
      supabase.removeAllChannels();
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const handleFindMatch = async () => {
    searchingRef.current = true;
    setMatchState("searching");
    setMatchResult(null);
    setVictoryReason(null);
    setStrikes(0); 
    setMentorState("idle");
    setMentorData(null);
    
    const lobby = supabase.channel('global_lobby', {
      config: { broadcast: { self: true } }
    });

    searchTimeoutRef.current = setTimeout(() => {
      if (searchingRef.current) {
        searchingRef.current = false;
        supabase.removeChannel(supabase.channel('global_lobby'));
        
        setMatchId("solo_practice");
        setOpponent({ name: "Training_Bot", rank: "Unranked" });
        setMatchState("combat");
        setOutput("> MATCHMAKING TIMEOUT.\n> No opponents found.\n> Entering Solo Practice Mode.\n> GLHF.");
      }
    }, 15000);

    lobby
      .on('broadcast', { event: 'looking_for_match' }, (payload) => {
        if (payload.payload.user_id !== userIdRef.current && searchingRef.current) {
          searchingRef.current = false; 
          const newMatchId = `match_${Math.random().toString(36).substring(7)}`;
          
          lobby.send({
            type: 'broadcast',
            event: 'match_found',
            payload: { target_user: payload.payload.user_id, host_user: userIdRef.current, match_id: newMatchId }
          });

          establishCombatZone(newMatchId, payload.payload.user_id);
        }
      })
      .on('broadcast', { event: 'match_found' }, (payload) => {
        if (payload.payload.target_user === userIdRef.current && searchingRef.current) {
          searchingRef.current = false;
          establishCombatZone(payload.payload.match_id, payload.payload.host_user);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          lobby.send({
            type: 'broadcast',
            event: 'looking_for_match',
            payload: { user_id: userIdRef.current }
          });
        }
      });
  };

  const establishCombatZone = (newMatchId: string, opponentId: string) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    supabase.removeChannel(supabase.channel('global_lobby'));
    
    setMatchId(newMatchId);
    setOpponent({ name: opponentId, rank: "Initiate" });
    setMatchState("combat");
    setOutput(`> MATCH FOUND.\n> Connected to secure channel: ${newMatchId}\n> Opponent: ${opponentId}\n> GLHF.`);

    const combatChannel = supabase.channel(newMatchId);
    
    combatChannel
      .on('broadcast', { event: 'match_over' }, (payload) => {
        if (payload.payload.winner !== userIdRef.current) {
          setMatchState("finished");
          setMatchResult("defeat");
          setOutput(`> CRITICAL WARNING: Opponent successfully bypassed security.\n> MATCH LOST.`);
        }
      })
      .on('broadcast', { event: 'opponent_disqualified' }, () => {
        setMatchState("finished");
        setMatchResult("victory");
        setVictoryReason("dq");
        setOutput(`> MATCH WON.\n> Opponent was disqualified for security breach.`);
      })
      .subscribe();

    combatChannelRef.current = combatChannel;
  };

  const handleCancelSearch = () => {
    searchingRef.current = false;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    supabase.removeChannel(supabase.channel('global_lobby'));
    setMatchState("idle");
  };

  // NEW: The AI Mentor Interceptor
  const triggerMentor = async () => {
    setMentorState("loading");
    try {
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          problem: "Two Sum", 
          code: codes[language], 
          language: language 
        }),
      });
      const data = await response.json();
      setMentorData(data);
      setMentorState("visible");
    } catch (error) {
      setMentorState("idle");
    }
  };

  const handleEditorDidMount = (editor: any) => {
    editor.onDidPaste(() => {
      setStrikes((prev) => {
        const newStrikes = prev + 1;
        
        if (newStrikes >= 3) {
          setMatchState("finished");
          setMatchResult("banned");
          setOutput(`> SECURITY BREACH DETECTED.\n> Multiple unauthorized code injections.\n> System locked. Match forfeited.`);
          
          if (combatChannelRef.current) {
            combatChannelRef.current.send({
              type: 'broadcast',
              event: 'opponent_disqualified',
              payload: { loser: userIdRef.current } 
            });
          }
        } else {
          setShowWarning(true);
          setTimeout(() => setShowWarning(false), 4000);
          
          // TRIGGER AI MENTOR ON FIRST OFFENSE
          if (newStrikes === 1) {
             triggerMentor();
          }
        }
        
        return newStrikes;
      });
    });
  };

  const handleRunCode = async () => {
    setIsExecuting(true);
    setOutput("> Compiling and executing in secure sandbox...\n> Provisioning isolated container...\n");

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code: codes[language] }),
      });

      const data = await response.json();

      if (data.error) {
        setOutput(`> SYSTEM ERROR: ${data.error}`);
        return;
      }

      let finalOutput = "";
      if (data.run && data.run.output !== undefined) {
        finalOutput = `[SUCCESS] Execution complete.\n\nOutput:\n${data.run.output}`;
      } else if (data.compile && data.compile.output) {
        finalOutput = `> COMPILE ERROR:\n${data.compile.output}`;
      } else {
        finalOutput = `> RAW SYSTEM RESPONSE:\n${JSON.stringify(data, null, 2)}`;
      }

      if (data.segfault_status === "ACCEPTED") {
        finalOutput += `\n\n> STATUS: ACCEPTED [All Test Cases Passed]`;
        setMatchState("finished");
        setMatchResult("victory");
        setVictoryReason("solved");
        
        if (combatChannelRef.current && matchId !== "solo_practice") {
          combatChannelRef.current.send({
            type: 'broadcast',
            event: 'match_over',
            payload: { winner: userIdRef.current }
          });
        }
      } else if (data.segfault_status === "WRONG_ANSWER") {
        finalOutput += `\n\n> STATUS: WRONG ANSWER [Failed Test Cases]`;
      }

      setOutput(finalOutput);

    } catch (error) {
      setOutput(`> SEVERE: Backend execution route unreachable. Error: ${error}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    setCodes(prev => ({ ...prev, [language]: value || "" }));
  };

  return (
    <div className="flex flex-col animate-in fade-in zoom-in-95 duration-500 w-full h-[80vh] min-h-[600px] relative">
      
      {matchState === "finished" && matchResult && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-md rounded-xl border border-zinc-800">
          <div className="flex flex-col items-center gap-6 p-10 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-md text-center">
            <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center 
              ${matchResult === "victory" ? 'border-green-500 bg-green-500/10' : 
                matchResult === "banned" ? 'border-yellow-500 bg-yellow-500/10' : 'border-red-500 bg-red-500/10'}`}>
              {matchResult === "victory" && <Trophy className="w-12 h-12 text-green-500" />}
              {matchResult === "defeat" && <Skull className="w-12 h-12 text-red-500" />}
              {matchResult === "banned" && <ShieldAlert className="w-12 h-12 text-yellow-500" />}
            </div>
            <div>
              <h2 className={`text-4xl font-black font-mono uppercase tracking-tighter 
                ${matchResult === "victory" ? "text-green-500" : 
                  matchResult === "banned" ? "text-yellow-500" : "text-red-500"}`}>
                {matchResult === "victory" ? "VICTORY" : matchResult === "banned" ? "DISQUALIFIED" : "DEFEAT"}
              </h2>
              <p className="text-sm text-zinc-400 font-mono mt-3 leading-relaxed">
                {matchResult === "victory" 
                  ? (victoryReason === "dq" 
                      ? "Your opponent was disqualified for a security breach. Victory by default. XP awarded." 
                      : "You successfully breached the mainframe before your opponent. XP awarded.") 
                  : matchResult === "banned" 
                  ? "Plagiarism threshold exceeded. Unauthorized code injection detected. Match forfeited." 
                  : "Your opponent's algorithm executed faster. System locked. XP deducted."}
              </p>
            </div>
            <button 
              onClick={() => {
                setMatchState("idle");
                setMatchResult(null);
                setVictoryReason(null);
                setOpponent(null);
                setStrikes(0);
                setMentorState("idle");
              }}
              className="w-full py-4 mt-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all bg-white text-black hover:bg-zinc-200 hover:scale-105 active:scale-95"
            >
              Return to Lobby
            </button>
          </div>
        </div>
      )}

      {matchState !== "combat" && matchState !== "finished" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm rounded-xl border border-zinc-800">
          <div className="flex flex-col items-center gap-6 p-8 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-sm text-center">
            <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center ${matchState === "searching" ? 'border-green-500 bg-green-500/10' : 'border-zinc-700 bg-zinc-950'}`}>
              {matchState === "searching" ? <Radar className="w-10 h-10 text-green-500 animate-spin" /> : <Swords className="w-10 h-10 text-zinc-500" />}
            </div>
            <div className="w-full">
              <h2 className="text-2xl font-black font-mono text-white uppercase tracking-tighter">
                {matchState === "searching" ? "Scanning Array..." : "Ranked 1v1"}
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-2 mb-4">
                {matchState === "searching" ? "Connecting to Supabase Realtime WebSockets." : "Stake your XP. Winner takes all."}
              </p>
              
              <button 
                onClick={handleFindMatch}
                disabled={matchState === "searching"}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2
                  ${matchState === "searching" ? 'bg-zinc-800 text-green-500 border border-green-500/20' : 'bg-white text-black hover:bg-zinc-200 hover:scale-105 active:scale-95'}`}
              >
                {matchState === "searching" ? "Searching..." : "Find Match"}
              </button>

              {matchState === "searching" && (
                <button 
                  onClick={handleCancelSearch}
                  className="w-full mt-3 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all text-zinc-500 hover:bg-red-500/10 hover:text-red-500 border border-transparent hover:border-red-500/20 flex items-center justify-center gap-2"
                >
                  <X className="w-3 h-3" /> Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between p-4 border border-zinc-800 bg-zinc-950/50 rounded-t-xl shrink-0">
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
          disabled={matchState !== 'combat'}
          className="bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 py-1.5 px-3 rounded-md outline-none disabled:opacity-50"
        >
          <option value="cpp">C++ (GCC)</option>
          <option value="python">Python 3</option>
          <option value="java">Java 15</option>
        </select>
      </div>

      <div className={`flex-1 border-x border-b border-zinc-800 rounded-b-xl overflow-hidden ${matchState !== 'combat' ? 'opacity-30 pointer-events-none' : ''}`}>
        <Group orientation="horizontal">
          <Panel defaultSize={35} minSize={25} className="bg-zinc-950 flex flex-col h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-bold text-white tracking-tight">Operation: Two Sum</h3>
              </div>
              <div className="space-y-4 text-sm text-zinc-400 font-sans leading-relaxed">
                <p>Given an array of integers <code className="bg-zinc-800 text-green-400 px-1 py-0.5 rounded text-xs font-mono">nums</code> and an integer <code className="bg-zinc-800 text-green-400 px-1 py-0.5 rounded text-xs font-mono">target</code>, return indices of the two numbers such that they add up to target.</p>
                <p>You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.</p>
                
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mt-6">
                  <p className="font-mono text-xs text-zinc-500 mb-2 uppercase tracking-widest">Example 1:</p>
                  <p className="font-mono text-sm text-white"><span className="text-zinc-500">Input:</span> nums = [2,7,11,15], target = 9</p>
                  <p className="font-mono text-sm text-green-400"><span className="text-zinc-500">Output:</span> [0,1]</p>
                </div>

                <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500/80 p-4 rounded-lg mt-6">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <p className="text-xs">Can you come up with an algorithm that is less than <code className="font-mono bg-yellow-500/20 px-1 rounded text-yellow-500">O(n^2)</code> time complexity?</p>
                </div>
              </div>
            </div>
          </Panel>

          <Separator className="w-1.5 bg-zinc-900 border-x border-zinc-800 flex items-center justify-center hover:bg-green-500/50 transition-colors cursor-col-resize z-10">
             <div className="h-8 w-0.5 bg-zinc-700 rounded-full" />
          </Separator>

          <Panel defaultSize={65} minSize={30} className="flex flex-col h-full">
            <Group orientation="vertical">
              <Panel defaultSize={70} minSize={20} className="bg-[#1e1e1e] relative">
                
                {showWarning && (
                  <div className="absolute top-0 left-0 w-full z-20 bg-yellow-500 text-black px-4 py-2 flex items-center justify-between animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Warning: Unauthorized Code Injection Detected.</span>
                    </div>
                    <span className="text-xs font-mono font-bold">STRIKE {strikes}/3</span>
                  </div>
                )}

                {/* NEW: AI Mentor Floating Glassmorphism Overlay */}
                {(mentorState === "loading" || mentorState === "visible") && (
                  <div className="absolute bottom-4 right-4 z-10 max-w-md bg-zinc-950/80 backdrop-blur-md border border-zinc-700 p-4 rounded-xl shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 text-purple-400">
                        {mentorState === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
                        <span className="text-[10px] font-bold uppercase tracking-widest font-mono">System AI Mentor</span>
                      </div>
                      <button onClick={() => setMentorState("idle")} className="text-zinc-500 hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    
                    {mentorState === "loading" ? (
                      <p className="text-xs text-zinc-400 font-mono mt-3">Analyzing telemetry and algorithm complexity...</p>
                    ) : mentorData && (
                      <div className="mt-2">
                        <p className="text-xs font-bold text-white mb-1 uppercase tracking-tight">{mentorData.concept}</p>
                        <p className="text-xs text-zinc-300 leading-relaxed font-sans">{mentorData.advice}</p>
                      </div>
                    )}
                  </div>
                )}

                <Editor
                  height="100%"
                  language={language}
                  theme="vs-dark"
                  value={codes[language]}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount} 
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    padding: { top: 16 },
                    automaticLayout: true,
                    wordWrap: "on",
                    readOnly: matchState === "finished",
                  }}
                />
              </Panel>

              <Separator className="h-1.5 bg-zinc-900 border-y border-zinc-800 flex items-center justify-center hover:bg-green-500/50 transition-colors cursor-row-resize z-10">
                 <div className="w-8 h-0.5 bg-zinc-700 rounded-full" />
              </Separator>

              <Panel defaultSize={30} minSize={15} className="bg-black flex flex-col">
                <div className="flex items-center justify-between p-3 border-b border-zinc-800 bg-zinc-950 shrink-0">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                    <Terminal className="w-4 h-4" />
                    <span>Status: <span className={isExecuting ? "text-yellow-500" : "text-green-500"}>{isExecuting ? "Executing Sandbox..." : "Idle"}</span></span>
                  </div>
                  <button 
                    onClick={handleRunCode}
                    disabled={isExecuting || matchState !== "combat"}
                    className="flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold uppercase tracking-widest transition-all bg-white text-black hover:bg-zinc-200 active:scale-95 disabled:opacity-50"
                  >
                    {isExecuting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                    Run Code
                  </button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap">{output}</pre>
                </div>
              </Panel>

            </Group>
          </Panel>

        </Group>
      </div>

    </div>
  );
}