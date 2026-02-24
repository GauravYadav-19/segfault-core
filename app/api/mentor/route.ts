import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { problem, code, language } = await req.json();

    /* ===============================================================
      THE LLM PROMPT ARCHITECTURE (For when you add an API Key later)
      ===============================================================
      const prompt = `
        You are an elite competitive programming mentor. 
        The user is solving: ${problem}.
        They are coding in: ${language}.
        Here is their current code: ${code}
        
        Do NOT give them the exact code answer. Provide a 2-sentence 
        conceptual hint to guide them toward the optimal time complexity.
      `;
      const aiResponse = await llm.generate(prompt);
    */

    // Simulated LLM Processing Delay (1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    // Mocked AI Response for the MVP
    return NextResponse.json({
      concept: "Hash Map (O(n) Time Complexity)",
      advice: "Do not paste external solutions. You are likely brute-forcing with nested loops. Instead, iterate through the array just once. As you visit each number, store it in a Hash Map. For every new number, simply check if (target - current_number) already exists in your map."
    });

  } catch (error) {
    console.error("AI Mentor Error:", error);
    return NextResponse.json(
      { error: "AI Mentor network unreachable." }, 
      { status: 500 }
    );
  }
}