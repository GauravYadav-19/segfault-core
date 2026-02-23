import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { language, code } = await req.json();

    // Map your UI languages to the exact versions required by the execution engine
    const PISTON_VERSIONS: Record<string, string> = {
      cpp: "10.2.0",
      python: "3.10.0",
      javascript: "18.15.0"
    };

    // Forward the payload to the secure Piston execution engine
    // Running this server-side prevents CORS errors and hides any future API keys
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: language,
        version: PISTON_VERSIONS[language] || "10.2.0",
        files: [{ content: code }],
        compile_timeout: 10000,
        run_timeout: 3000,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Execution Engine Error:", error);
    return NextResponse.json(
      { error: "Failed to connect to the execution sandbox." }, 
      { status: 500 }
    );
  }
}