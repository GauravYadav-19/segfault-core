import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { language, code, problemSlug } = await req.json();

    const PISTON_NAMES: Record<string, string> = { cpp: "c++", python: "python", java: "java" };
    const PISTON_VERSIONS: Record<string, string> = { cpp: "10.2.0", python: "3.10.0", java: "15.0.2" };
    const FILE_NAMES: Record<string, string> = { cpp: "main.cpp", python: "main.py", java: "Main.java" };

    // 1. DYNAMIC ADJUDICATOR: Fetch the hidden driver from the Storage Vault
    let driverCode = "";
    if (problemSlug) {
        const vaultUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/problem-vault/${problemSlug}/engine.json`;
        try {
            const engineRes = await fetch(vaultUrl);
            if (engineRes.ok) {
                const engineData = await engineRes.json();
                driverCode = engineData.drivers?.[language] || "";
            }
        } catch (err) {
            console.error("Failed to fetch driver from vault:", err);
        }
    }

    // 2. Payload Construction
    let finalPayload = code;
    if (driverCode) {
        finalPayload = code.replace(/int main\(\) \{[\s\S]*?\}/g, ""); 
        finalPayload += driverCode;
    }

    // 3. Fire to Docker
    const response = await fetch("http://localhost:2000/api/v2/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: PISTON_NAMES[language] || language,
        version: PISTON_VERSIONS[language] || "10.2.0",
        files: [{ name: FILE_NAMES[language] || "main.txt", content: finalPayload }],
        compile_timeout: 10000,
        run_timeout: 3000,
      }),
    });

    const data = await response.json();

    // 4. Parse Output
    if (data.run && data.run.output !== undefined) {
      const outputStr = data.run.output;
      let status = "EXECUTED";
      let isCorrect = false;

      if (outputStr.includes("[SEGFAULT_EXECUTION_VERIFIED] :: TEST_PASS")) {
          status = "ACCEPTED";
          isCorrect = true;
      } else if (outputStr.includes("[SEGFAULT_EXECUTION_FAILED] :: TEST_FAIL")) {
          status = "WRONG_ANSWER";
      }

      return NextResponse.json({ ...data, segfault_status: status, is_correct: isCorrect });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Execution Engine Error:", error);
    return NextResponse.json({ error: "Local Docker Execution Engine is unreachable." }, { status: 500 });
  }
}