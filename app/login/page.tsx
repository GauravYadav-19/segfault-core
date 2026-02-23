"use client";
import { Terminal, Github, Mail, Command } from "lucide-react";
import { createClient } from "../../utils/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const handleGitHubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error("GitHub Auth Error:", error.message);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // This triggers the Google account selection screen
        queryParams: {
          prompt: 'consent',
        },
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error("Google Auth Error:", error.message);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 selection:bg-green-500/30">
      
      <a href="/" className="absolute top-8 left-8 text-xs font-mono text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
        <Command className="w-3 h-3" /> return to base
      </a>

      <div className="w-full max-w-sm flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 border border-zinc-800 bg-zinc-900 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(39,39,42,0.5)]">
            <Terminal className="w-6 h-6 text-zinc-100" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase font-mono text-white">
            Authenticate
          </h1>
          <p className="text-sm text-zinc-500 font-mono">
            Connect your developer identity to enter the arena.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleGitHubLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-3.5 rounded-lg font-bold hover:bg-zinc-200 transition-colors"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>
          
          {/* Google Login Handler Attached Here */}
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-zinc-900 text-white border border-zinc-800 py-3.5 rounded-lg font-bold hover:bg-zinc-800 transition-colors"
          >
            <Mail className="w-5 h-5" />
            Continue with Google
          </button>
        </div>

        <div className="text-center">
          <p className="text-[10px] text-zinc-600 font-mono leading-relaxed">
            By authenticating, you agree to our <br/>
            <a href="#" className="underline hover:text-zinc-400">Terms of Service</a> & <a href="#" className="underline hover:text-zinc-400">Privacy Policy</a>
          </p>
        </div>

      </div>
    </div>
  );
}