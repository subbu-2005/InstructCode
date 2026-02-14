// Piston API is a service for code execution
// Backend version using node-fetch

const PISTON_API = "https://emkc.org/api/v2/piston";

const LANGUAGE_VERSIONS = {
    javascript: { language: "javascript", version: "18.15.0" },
    python: { language: "python", version: "3.10.0" },
    java: { language: "java", version: "15.0.2" },
};

/**
 * Wrap user code with test input execution
 * Extracts function name and appends a call with the test input
 */
function wrapCodeWithTestInput(language, code, input) {
    if (!input) return code;

    if (language === "javascript") {
        // Extract function name from code (e.g., "var countPaths = function" or "function countPaths")
        const functionMatch = code.match(/(?:var|let|const)\s+(\w+)\s*=\s*function|function\s+(\w+)/);
        const functionName = functionMatch ? (functionMatch[1] || functionMatch[2]) : null;

        if (!functionName) {
            console.warn("⚠️ Could not extract function name from JavaScript code");
            console.warn("Code preview:", code.substring(0, 200));
            return code;
        }

        console.log(`✅ Found JavaScript function: ${functionName}`);

        // Append function call with parsed input
        return `${code}\n\n// Test execution\nconsole.log(${functionName}(${input}));`;
    }

    if (language === "python") {
        // Check if code uses Solution class pattern (LeetCode style)
        const hasClass = code.includes("class Solution:");

        if (hasClass) {
            // Extract method name from class
            const methodMatch = code.match(/def\s+(\w+)\s*\(self/);
            const methodName = methodMatch ? methodMatch[1] : null;

            if (!methodName) {
                console.warn("⚠️ Could not extract method name from Python Solution class");
                return code;
            }

            console.log(`✅ Found Python Solution class method: ${methodName}`);

            // Append Solution instantiation and method call
            return `${code}\n\n# Test execution\nsolution = Solution()\nprint(solution.${methodName}(${input}))`;
        } else {
            // Standalone function (not in a class)
            const functionMatch = code.match(/def\s+(\w+)\s*\(/);
            const functionName = functionMatch ? functionMatch[1] : null;

            if (!functionName) {
                console.warn("⚠️ Could not extract function name from Python code");
                return code;
            }

            console.log(`✅ Found Python function: ${functionName}`);

            // Append function call with parsed input
            return `${code}\n\n# Test execution\nprint(${functionName}(${input}))`;
        }
    }

    if (language === "java") {
        // For Java, we need to add a main method call
        // This is more complex, so for now we'll just return the code as-is
        // Java problems should include their own main method in starter code
        return code;
    }

    return code;
}

/**
 * Execute code using Piston API
 * @param {string} language - programming language
 * @param {string} code - source code to execute
 * @param {string} input - test input (function arguments as string)
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code, input = "") {
    try {
        const languageConfig = LANGUAGE_VERSIONS[language];

        if (!languageConfig) {
            return {
                success: false,
                error: `Unsupported language: ${language}`,
            };
        }

        // Wrap code with test input execution
        const wrappedCode = wrapCodeWithTestInput(language, code, input);

        console.log(`🔧 Executing ${language} code with input: ${input}`);

        const requestBody = {
            language: languageConfig.language,
            version: languageConfig.version,
            files: [
                {
                    name: `main.${getFileExtension(language)}`,
                    content: wrappedCode,
                },
            ],
        };

        const response = await fetch(`${PISTON_API}/execute`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            return {
                success: false,
                error: `HTTP error! status: ${response.status}`,
            };
        }

        const data = await response.json();

        const output = data.run.output || "";
        const stderr = data.run.stderr || "";

        if (stderr) {
            return {
                success: false,
                output: output,
                error: stderr,
            };
        }

        return {
            success: true,
            output: output || "No output",
        };
    } catch (error) {
        return {
            success: false,
            error: `Failed to execute code: ${error.message}`,
        };
    }
}

function getFileExtension(language) {
    const extensions = {
        javascript: "js",
        python: "py",
        java: "java",
    };

    return extensions[language] || "txt";
}
