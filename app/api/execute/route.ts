import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { language, code } = await req.json();

    // 1. Language Definitions
    const PISTON_NAMES: Record<string, string> = { cpp: "c++", python: "python", java: "java" };
    const PISTON_VERSIONS: Record<string, string> = { cpp: "10.2.0", python: "3.10.0", java: "15.0.2" };
    const FILE_NAMES: Record<string, string> = { cpp: "main.cpp", python: "main.py", java: "Main.java" };

    // 2. THE ADJUDICATOR: Hidden Test Case Drivers for "Two Sum"
    const TWO_SUM_DRIVERS: Record<string, string> = {
      cpp: `
// --- SEGFAULT HIDDEN DRIVER CODE ---
int main() {
    Solution sol;
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    
    vector<int> result = sol.twoSum(nums, target);
    
    if (result.size() == 2 && ((result[0] == 0 && result[1] == 1) || (result[0] == 1 && result[1] == 0))) {
        cout << "\\n[SEGFAULT_EXECUTION_VERIFIED] :: TEST_PASS" << endl;
    } else {
        cout << "\\n[SEGFAULT_EXECUTION_FAILED] :: TEST_FAIL" << endl;
    }
    return 0;
}`,
      python: `
# --- SEGFAULT HIDDEN DRIVER CODE ---
if __name__ == "__main__":
    sol = Solution()
    result = sol.twoSum([2, 7, 11, 15], 9)
    if result == [0, 1] or result == [1, 0]:
        print("\\n[SEGFAULT_EXECUTION_VERIFIED] :: TEST_PASS")
    else:
        print("\\n[SEGFAULT_EXECUTION_FAILED] :: TEST_FAIL")`,
      java: `
// --- SEGFAULT HIDDEN DRIVER CODE ---
// (Note: For Java, we would technically inject this into the main class, but for MVP we will keep it simple)
`
    };

    // 3. Payload Construction (Merging User Code + Hidden Test Cases)
    // We strip out the user's fake main() if they left one, and append our real one.
    // (For this test, we assume they just wrote the class).
    let finalPayload = code;
    
    // Inject the driver if it exists for the language
    if (TWO_SUM_DRIVERS[language]) {
        // Basic safety: Remove standard boilerplate main() so it doesn't clash with ours
        finalPayload = code.replace(/int main\(\) \{[\s\S]*?\}/g, ""); 
        finalPayload += TWO_SUM_DRIVERS[language];
    }

    // 4. Fire to Docker
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

    // 5. Parse the output to see if they passed the test case
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