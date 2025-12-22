// Judge0 API Service for C++ Code Execution
// Using the free public CE (Community Edition) endpoint

// Free public instance (works without API key, rate limited)
const PUBLIC_JUDGE0_URL = 'https://ce.judge0.com';

// C++ language ID in Judge0
const CPP_LANGUAGE_ID = 54; // C++ (GCC 9.2.0)

/**
 * Submit C++ code for execution
 * @param {string} sourceCode - The C++ source code
 * @param {string} stdin - Optional standard input  
 * @returns {Promise<{token: string}>} - Submission token
 */
export async function submitCode(sourceCode, stdin = '') {
    const response = await fetch(`${PUBLIC_JUDGE0_URL}/submissions?base64_encoded=false&wait=false`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            source_code: sourceCode,
            language_id: CPP_LANGUAGE_ID,
            stdin: stdin
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Submission failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
}

/**
 * Get submission result
 * @param {string} token - Submission token
 * @returns {Promise<Object>} - Execution result
 */
export async function getSubmissionResult(token) {
    const response = await fetch(
        `${PUBLIC_JUDGE0_URL}/submissions/${token}?base64_encoded=false&fields=stdout,stderr,compile_output,status,time,memory`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to get result: ${response.statusText}`);
    }

    return await response.json();
}

/**
 * Execute code and wait for result (polls until complete)
 * @param {string} sourceCode - The C++ source code
 * @param {string} stdin - Optional standard input
 * @returns {Promise<Object>} - Final execution result
 */
export async function executeCode(sourceCode, stdin = '') {
    // Submit the code
    const { token } = await submitCode(sourceCode, stdin);

    // Poll for result (max 30 seconds)
    const maxAttempts = 15;
    const pollInterval = 2000; // 2 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));

        const result = await getSubmissionResult(token);

        // Status IDs: 1=In Queue, 2=Processing, 3+=Done
        if (result.status && result.status.id >= 3) {
            return {
                success: result.status.id === 3, // 3 = Accepted
                status: result.status.description,
                stdout: result.stdout || '',
                stderr: result.stderr || '',
                compile_output: result.compile_output || '',
                time: result.time,
                memory: result.memory
            };
        }
    }

    throw new Error('Execution timed out');
}

/**
 * Check if Judge0 API is available (always true for public endpoint)
 */
export function isJudge0Configured() {
    return true; // Public endpoint always available
}
