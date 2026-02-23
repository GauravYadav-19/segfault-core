# ⚔️ SegFault Arena

**Write Code. Destroy Your Friends.** SegFault is a high-performance, real-time competitive multiplayer coding platform. It is designed as a distributed system to handle live matchmaking, secure remote code execution, and algorithmic complexity analysis.

![Status: Work in Progress](https://img.shields.io/badge/Status-Phase_2_Active-yellow?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Next.js_15-Black?style=for-the-badge&logo=next.js)
![Database](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)

## 🏗️ System Architecture (Current State)
Currently in active development. We are building this system in structured phases:

- **[✅] Phase 1: The Perimeter** - OAuth 2.0 Identity pipeline via Next.js Edge Middleware.
  - Automated PostgreSQL profile hydration via Supabase DB Triggers.
  - Dynamic, cinematic UI built with Tailwind CSS and Framer Motion.
- **[✅] Phase 2: The Arena & Sync**
  - `@monaco-editor/react` embedded for browser-based IDE capabilities.
  - Real-time global leaderboard directly connected to PostgreSQL.
  - WebSocket matchmaking lobby via Supabase Realtime (WIP).
- **[🔜] Phase 3: The Distributed Execution Engine**
  - Decoupling the web server from the compiler.
  - Orchestrating isolated Docker microVMs for secure, sandboxed Remote Code Execution (RCE).
- **[⏳] Phase 4: AI Intelligence Layer**
  - AST (Abstract Syntax Tree) code parsing.
  - LLM-driven Time & Space Complexity (Big O) coaching.

## 🚀 Running Locally

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/segfault-core.git](https://github.com/your-username/segfault-core.git)
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables (.env.local):
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key    
   ```
4. Start the Turbopack development server:
   ```npm run dev
   ```

🛡️ Engineering Philosophy
SegFault operates on strict Server Authority. Clients do not calculate XP or enforce match timers. The backend architecture is designed to prevent execution flooding and secure the host system from malicious user-submitted code.