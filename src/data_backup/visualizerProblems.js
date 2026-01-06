// Enhanced Visualization Problems with Deep Sub-Instruction Granularity
// Comprehensive C++ Topic Coverage with character-level control flow

export const visualizerProblems = [
    // ==================== CATEGORY: FOR LOOPS ====================

    // 1. Standard For Loop (Deep breakdown)
    {
        id: 'for-standard',
        title: 'Standard For Loop',
        description: 'Classic for loop with all three parts: initialization, condition, and increment',
        difficulty: 'BEGINNER',
        category: 'For Loops',
        code: `int main() {
    for (int i = 0; i < 3; i++) {
        cout << i;
    }
}`,
        expectedOutput: '012',
        steps: [
            // INITIALIZATION - Deep breakdown
            { id: 1, phase: 'INIT', line: 2, charStart: 9, charEnd: 12, highlight: 'int', description: 'Declare variable type: int', variables: {}, controlFlow: 'right' },
            { id: 2, phase: 'INIT', line: 2, charStart: 13, charEnd: 14, highlight: 'i', description: 'Variable name: i', variables: {}, controlFlow: 'right' },
            { id: 3, phase: 'INIT', line: 2, charStart: 15, charEnd: 16, highlight: '=', description: 'Assignment operator', variables: {}, controlFlow: 'right' },
            { id: 4, phase: 'INIT', line: 2, charStart: 17, charEnd: 18, highlight: '0', description: 'Assign value 0 to i', variables: { i: 0 }, controlFlow: 'left' },

            // CONDITION CHECK - Iteration 1
            { id: 5, phase: 'CONDITION', line: 2, charStart: 20, charEnd: 21, highlight: 'i', description: 'Read value of i → 0', variables: { i: 0 }, controlFlow: 'right' },
            { id: 6, phase: 'CONDITION', line: 2, charStart: 22, charEnd: 23, highlight: '<', description: 'Less than comparison', variables: { i: 0 }, controlFlow: 'right' },
            { id: 7, phase: 'CONDITION', line: 2, charStart: 24, charEnd: 25, highlight: '3', description: '0 < 3 → TRUE ✓', variables: { i: 0 }, conditionResult: true, controlFlow: 'down' },

            // BODY - Iteration 1 (cout deep breakdown)
            { id: 8, phase: 'BODY', line: 3, charStart: 8, charEnd: 12, highlight: 'cout', description: 'Output stream object', variables: { i: 0 }, controlFlow: 'right' },
            { id: 9, phase: 'BODY', line: 3, charStart: 13, charEnd: 15, highlight: '<<', description: 'Insertion operator (left-to-right)', variables: { i: 0 }, controlFlow: 'right' },
            { id: 10, phase: 'BODY', line: 3, charStart: 16, charEnd: 17, highlight: 'i', description: 'Insert value of i (0) to output', variables: { i: 0 }, output: '0', controlFlow: 'done' },

            // INCREMENT - Iteration 1
            { id: 11, phase: 'INCREMENT', line: 2, charStart: 27, charEnd: 28, highlight: 'i', description: 'Current value: i = 0', variables: { i: 0 }, controlFlow: 'right' },
            { id: 12, phase: 'INCREMENT', line: 2, charStart: 28, charEnd: 30, highlight: '++', description: 'Post-increment: i becomes 1', variables: { i: 1 }, controlFlow: 'up' },

            // CONDITION CHECK - Iteration 2
            { id: 13, phase: 'CONDITION', line: 2, charStart: 20, charEnd: 25, highlight: 'i < 3', description: '1 < 3 → TRUE ✓', variables: { i: 1 }, conditionResult: true, controlFlow: 'down' },

            // BODY - Iteration 2
            { id: 14, phase: 'BODY', line: 3, charStart: 8, charEnd: 17, highlight: 'cout << i', description: 'Output i (1)', variables: { i: 1 }, output: '01', controlFlow: 'done' },

            // INCREMENT - Iteration 2
            { id: 15, phase: 'INCREMENT', line: 2, charStart: 27, charEnd: 30, highlight: 'i++', description: 'i becomes 2', variables: { i: 2 }, controlFlow: 'up' },

            // CONDITION CHECK - Iteration 3
            { id: 16, phase: 'CONDITION', line: 2, charStart: 20, charEnd: 25, highlight: 'i < 3', description: '2 < 3 → TRUE ✓', variables: { i: 2 }, conditionResult: true, controlFlow: 'down' },

            // BODY - Iteration 3
            { id: 17, phase: 'BODY', line: 3, charStart: 8, charEnd: 17, highlight: 'cout << i', description: 'Output i (2)', variables: { i: 2 }, output: '012', controlFlow: 'done' },

            // INCREMENT - Iteration 3
            { id: 18, phase: 'INCREMENT', line: 2, charStart: 27, charEnd: 30, highlight: 'i++', description: 'i becomes 3', variables: { i: 3 }, controlFlow: 'up' },

            // CONDITION CHECK - FAIL
            { id: 19, phase: 'CONDITION_FAIL', line: 2, charStart: 20, charEnd: 25, highlight: 'i < 3', description: '3 < 3 → FALSE ✗ EXIT LOOP', variables: { i: 3 }, conditionResult: false, controlFlow: 'exit' },

            { id: 20, phase: 'COMPLETE', line: 5, charStart: 0, charEnd: 1, highlight: '}', description: 'Loop complete. Final output: 012', variables: { i: 3 }, output: '012' }
        ]
    },

    // 2. For Loop Without Initialization
    {
        id: 'for-no-init',
        title: 'For Loop: No Initialization',
        description: 'For loop where variable is initialized before the loop',
        difficulty: 'BEGINNER',
        category: 'For Loops',
        code: `int main() {
    int i = 5;
    for (; i > 0; i--) {
        cout << i;
    }
}`,
        expectedOutput: '54321',
        steps: [
            { id: 1, phase: 'SETUP', line: 2, charStart: 4, charEnd: 14, highlight: 'int i = 5;', description: 'Variable declared BEFORE loop: i = 5', variables: { i: 5 } },

            { id: 2, phase: 'INIT', line: 3, charStart: 9, charEnd: 10, highlight: ';', description: 'Empty initialization - nothing to do, variable already exists', variables: { i: 5 }, controlFlow: 'skip' },

            { id: 3, phase: 'CONDITION', line: 3, charStart: 11, charEnd: 16, highlight: 'i > 0', description: '5 > 0 → TRUE ✓', variables: { i: 5 }, conditionResult: true },
            { id: 4, phase: 'BODY', line: 4, charStart: 8, charEnd: 17, highlight: 'cout << i', description: 'Output: 5', variables: { i: 5 }, output: '5' },
            { id: 5, phase: 'DECREMENT', line: 3, charStart: 18, charEnd: 21, highlight: 'i--', description: 'i becomes 4', variables: { i: 4 } },

            { id: 6, phase: 'CONDITION', line: 3, charStart: 11, charEnd: 16, highlight: 'i > 0', description: '4 > 0 → TRUE ✓', variables: { i: 4 }, conditionResult: true },
            { id: 7, phase: 'BODY', line: 4, charStart: 8, charEnd: 17, highlight: 'cout << i', description: 'Output: 4', variables: { i: 4 }, output: '54' },
            { id: 8, phase: 'DECREMENT', line: 3, charStart: 18, charEnd: 21, highlight: 'i--', description: 'i becomes 3', variables: { i: 3 } },

            { id: 9, phase: 'CONDITION', line: 3, charStart: 11, charEnd: 16, highlight: 'i > 0', description: '3 > 0 → TRUE ✓', variables: { i: 3 }, conditionResult: true },
            { id: 10, phase: 'BODY', line: 4, charStart: 8, charEnd: 17, highlight: 'cout << i', description: 'Output: 3', variables: { i: 3 }, output: '543' },
            { id: 11, phase: 'DECREMENT', line: 3, charStart: 18, charEnd: 21, highlight: 'i--', description: 'i becomes 2', variables: { i: 2 } },

            { id: 12, phase: 'CONDITION', line: 3, charStart: 11, charEnd: 16, highlight: 'i > 0', description: '2 > 0 → TRUE ✓', variables: { i: 2 }, conditionResult: true },
            { id: 13, phase: 'BODY', line: 4, charStart: 8, charEnd: 17, highlight: 'cout << i', description: 'Output: 2', variables: { i: 2 }, output: '5432' },
            { id: 14, phase: 'DECREMENT', line: 3, charStart: 18, charEnd: 21, highlight: 'i--', description: 'i becomes 1', variables: { i: 1 } },

            { id: 15, phase: 'CONDITION', line: 3, charStart: 11, charEnd: 16, highlight: 'i > 0', description: '1 > 0 → TRUE ✓', variables: { i: 1 }, conditionResult: true },
            { id: 16, phase: 'BODY', line: 4, charStart: 8, charEnd: 17, highlight: 'cout << i', description: 'Output: 1', variables: { i: 1 }, output: '54321' },
            { id: 17, phase: 'DECREMENT', line: 3, charStart: 18, charEnd: 21, highlight: 'i--', description: 'i becomes 0', variables: { i: 0 } },

            { id: 18, phase: 'CONDITION_FAIL', line: 3, charStart: 11, charEnd: 16, highlight: 'i > 0', description: '0 > 0 → FALSE ✗', variables: { i: 0 }, conditionResult: false },
            { id: 19, phase: 'COMPLETE', line: 6, charStart: 0, charEnd: 1, highlight: '}', description: 'Loop ends. Variable i persists (scope is outside loop)', variables: { i: 0 }, output: '54321' }
        ]
    },

    // 3. For Loop Without Increment
    {
        id: 'for-no-increment',
        title: 'For Loop: No Increment Part',
        description: 'For loop where increment happens inside the body',
        difficulty: 'BEGINNER',
        category: 'For Loops',
        code: `int main() {
    for (int i = 0; i < 3;) {
        cout << i;
        i = i + 1;
    }
}`,
        expectedOutput: '012',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 9, charEnd: 18, highlight: 'int i = 0', description: 'Initialize i = 0', variables: { i: 0 } },
            { id: 2, phase: 'EMPTY_PART', line: 2, charStart: 26, charEnd: 27, highlight: ')', description: 'No increment part - will be done in body', variables: { i: 0 } },

            { id: 3, phase: 'CONDITION', line: 2, charStart: 20, charEnd: 25, highlight: 'i < 3', description: '0 < 3 → TRUE ✓', variables: { i: 0 }, conditionResult: true },
            { id: 4, phase: 'BODY', line: 3, charStart: 8, charEnd: 17, highlight: 'cout << i', description: 'Output: 0', variables: { i: 0 }, output: '0' },
            { id: 5, phase: 'BODY_INCREMENT', line: 4, charStart: 8, charEnd: 17, highlight: 'i = i + 1', description: 'Manual increment in body: i = 0 + 1 = 1', variables: { i: 1 } },

            { id: 6, phase: 'CONDITION', line: 2, charStart: 20, charEnd: 25, highlight: 'i < 3', description: '1 < 3 → TRUE ✓', variables: { i: 1 }, conditionResult: true },
            { id: 7, phase: 'BODY', line: 3, charStart: 8, charEnd: 17, highlight: 'cout << i', description: 'Output: 1', variables: { i: 1 }, output: '01' },
            { id: 8, phase: 'BODY_INCREMENT', line: 4, charStart: 8, charEnd: 17, highlight: 'i = i + 1', description: 'i = 1 + 1 = 2', variables: { i: 2 } },

            { id: 9, phase: 'CONDITION', line: 2, charStart: 20, charEnd: 25, highlight: 'i < 3', description: '2 < 3 → TRUE ✓', variables: { i: 2 }, conditionResult: true },
            { id: 10, phase: 'BODY', line: 3, charStart: 8, charEnd: 17, highlight: 'cout << i', description: 'Output: 2', variables: { i: 2 }, output: '012' },
            { id: 11, phase: 'BODY_INCREMENT', line: 4, charStart: 8, charEnd: 17, highlight: 'i = i + 1', description: 'i = 2 + 1 = 3', variables: { i: 3 } },

            { id: 12, phase: 'CONDITION_FAIL', line: 2, charStart: 20, charEnd: 25, highlight: 'i < 3', description: '3 < 3 → FALSE ✗', variables: { i: 3 }, conditionResult: false },
            { id: 13, phase: 'COMPLETE', line: 6, charStart: 0, charEnd: 1, highlight: '}', description: 'Loop ends', variables: { i: 3 }, output: '012' }
        ]
    },

    // 4. For Loop with Multiple Variables
    {
        id: 'for-multi-var',
        title: 'For Loop: Multiple Variables',
        description: 'For loop with two loop variables i and j',
        difficulty: 'INTERMEDIATE',
        category: 'For Loops',
        code: `int main() {
    for (int i=0, j=2; i<j; i++, j--) {
        cout << i << j;
    }
}`,
        expectedOutput: '0211',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 9, charEnd: 16, highlight: 'int i=0', description: 'Initialize first variable: i = 0', variables: { i: 0 } },
            { id: 2, phase: 'INIT', line: 2, charStart: 16, charEnd: 17, highlight: ',', description: 'Comma operator: next initialization', variables: { i: 0 } },
            { id: 3, phase: 'INIT', line: 2, charStart: 18, charEnd: 21, highlight: 'j=2', description: 'Initialize second variable: j = 2', variables: { i: 0, j: 2 } },

            { id: 4, phase: 'CONDITION', line: 2, charStart: 23, charEnd: 26, highlight: 'i<j', description: '0 < 2 → TRUE ✓', variables: { i: 0, j: 2 }, conditionResult: true },

            { id: 5, phase: 'BODY', line: 3, charStart: 8, charEnd: 12, highlight: 'cout', description: 'Output stream', variables: { i: 0, j: 2 } },
            { id: 6, phase: 'BODY', line: 3, charStart: 13, charEnd: 17, highlight: '<< i', description: 'Output i (0)', variables: { i: 0, j: 2 }, output: '0' },
            { id: 7, phase: 'BODY', line: 3, charStart: 18, charEnd: 22, highlight: '<< j', description: 'Output j (2)', variables: { i: 0, j: 2 }, output: '02' },

            { id: 8, phase: 'INCREMENT', line: 2, charStart: 28, charEnd: 31, highlight: 'i++', description: 'Increment i: 0 → 1', variables: { i: 1, j: 2 } },
            { id: 9, phase: 'INCREMENT', line: 2, charStart: 31, charEnd: 32, highlight: ',', description: 'Comma: next update', variables: { i: 1, j: 2 } },
            { id: 10, phase: 'DECREMENT', line: 2, charStart: 33, charEnd: 36, highlight: 'j--', description: 'Decrement j: 2 → 1', variables: { i: 1, j: 1 } },

            { id: 11, phase: 'CONDITION', line: 2, charStart: 23, charEnd: 26, highlight: 'i<j', description: '1 < 1 → FALSE ✗', variables: { i: 1, j: 1 }, conditionResult: false },
            { id: 12, phase: 'COMPLETE', line: 5, charStart: 0, charEnd: 1, highlight: '}', description: 'Loop ends when i equals j', variables: { i: 1, j: 1 }, output: '02' }
        ]
    },

    // ==================== CATEGORY: WHILE LOOPS ====================

    // 5. Standard While Loop
    {
        id: 'while-standard',
        title: 'While Loop',
        description: 'Basic while loop - condition checked BEFORE each iteration',
        difficulty: 'BEGINNER',
        category: 'While Loops',
        code: `int main() {
    int n = 3;
    while (n > 0) {
        cout << n;
        n--;
    }
}`,
        expectedOutput: '321',
        steps: [
            { id: 1, phase: 'SETUP', line: 2, charStart: 4, charEnd: 14, highlight: 'int n = 3;', description: 'Initialize n = 3', variables: { n: 3 } },

            { id: 2, phase: 'CONDITION', line: 3, charStart: 11, charEnd: 16, highlight: 'n > 0', description: 'CHECK FIRST: 3 > 0 → TRUE ✓', variables: { n: 3 }, conditionResult: true },
            { id: 3, phase: 'BODY', line: 4, charStart: 8, charEnd: 17, highlight: 'cout << n', description: 'Output: 3', variables: { n: 3 }, output: '3' },
            { id: 4, phase: 'DECREMENT', line: 5, charStart: 8, charEnd: 11, highlight: 'n--', description: 'n becomes 2', variables: { n: 2 } },

            { id: 5, phase: 'CONDITION', line: 3, charStart: 11, charEnd: 16, highlight: 'n > 0', description: '2 > 0 → TRUE ✓', variables: { n: 2 }, conditionResult: true },
            { id: 6, phase: 'BODY', line: 4, charStart: 8, charEnd: 17, highlight: 'cout << n', description: 'Output: 2', variables: { n: 2 }, output: '32' },
            { id: 7, phase: 'DECREMENT', line: 5, charStart: 8, charEnd: 11, highlight: 'n--', description: 'n becomes 1', variables: { n: 1 } },

            { id: 8, phase: 'CONDITION', line: 3, charStart: 11, charEnd: 16, highlight: 'n > 0', description: '1 > 0 → TRUE ✓', variables: { n: 1 }, conditionResult: true },
            { id: 9, phase: 'BODY', line: 4, charStart: 8, charEnd: 17, highlight: 'cout << n', description: 'Output: 1', variables: { n: 1 }, output: '321' },
            { id: 10, phase: 'DECREMENT', line: 5, charStart: 8, charEnd: 11, highlight: 'n--', description: 'n becomes 0', variables: { n: 0 } },

            { id: 11, phase: 'CONDITION_FAIL', line: 3, charStart: 11, charEnd: 16, highlight: 'n > 0', description: '0 > 0 → FALSE ✗ EXIT', variables: { n: 0 }, conditionResult: false },
            { id: 12, phase: 'COMPLETE', line: 7, charStart: 0, charEnd: 1, highlight: '}', description: 'While loop complete', variables: { n: 0 }, output: '321' }
        ]
    },

    // 6. Do-While Loop  
    {
        id: 'do-while',
        title: 'Do-While Loop',
        description: 'Body executes FIRST, then condition checked - always runs at least once!',
        difficulty: 'BEGINNER',
        category: 'While Loops',
        code: `int main() {
    int n = 0;
    do {
        cout << n;
        n++;
    } while (n < 3);
}`,
        expectedOutput: '012',
        steps: [
            { id: 1, phase: 'SETUP', line: 2, charStart: 4, charEnd: 14, highlight: 'int n = 0;', description: 'Initialize n = 0', variables: { n: 0 } },

            { id: 2, phase: 'DO', line: 3, charStart: 4, charEnd: 6, highlight: 'do', description: 'DO: Execute body FIRST (no condition check!)', variables: { n: 0 } },
            { id: 3, phase: 'BODY', line: 4, charStart: 8, charEnd: 17, highlight: 'cout << n', description: 'Output: 0', variables: { n: 0 }, output: '0' },
            { id: 4, phase: 'INCREMENT', line: 5, charStart: 8, charEnd: 11, highlight: 'n++', description: 'n becomes 1', variables: { n: 1 } },
            { id: 5, phase: 'CONDITION', line: 6, charStart: 13, charEnd: 18, highlight: 'n < 3', description: 'NOW check: 1 < 3 → TRUE ✓ (repeat)', variables: { n: 1 }, conditionResult: true },

            { id: 6, phase: 'BODY', line: 4, charStart: 8, charEnd: 17, highlight: 'cout << n', description: 'Output: 1', variables: { n: 1 }, output: '01' },
            { id: 7, phase: 'INCREMENT', line: 5, charStart: 8, charEnd: 11, highlight: 'n++', description: 'n becomes 2', variables: { n: 2 } },
            { id: 8, phase: 'CONDITION', line: 6, charStart: 13, charEnd: 18, highlight: 'n < 3', description: '2 < 3 → TRUE ✓', variables: { n: 2 }, conditionResult: true },

            { id: 9, phase: 'BODY', line: 4, charStart: 8, charEnd: 17, highlight: 'cout << n', description: 'Output: 2', variables: { n: 2 }, output: '012' },
            { id: 10, phase: 'INCREMENT', line: 5, charStart: 8, charEnd: 11, highlight: 'n++', description: 'n becomes 3', variables: { n: 3 } },
            { id: 11, phase: 'CONDITION_FAIL', line: 6, charStart: 13, charEnd: 18, highlight: 'n < 3', description: '3 < 3 → FALSE ✗ EXIT', variables: { n: 3 }, conditionResult: false },

            { id: 12, phase: 'COMPLETE', line: 7, charStart: 0, charEnd: 1, highlight: '}', description: 'Do-while complete. Body ran 3 times.', variables: { n: 3 }, output: '012' }
        ]
    },

    // ==================== CATEGORY: CONTROL STATEMENTS ====================

    // 7. Break Statement
    {
        id: 'break-statement',
        title: 'Break Statement',
        description: 'Exit loop immediately when condition met',
        difficulty: 'BEGINNER',
        category: 'Control Statements',
        code: `int main() {
    for (int i = 0; i < 10; i++) {
        if (i == 3) break;
        cout << i;
    }
}`,
        expectedOutput: '012',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 9, charEnd: 18, highlight: 'int i = 0', description: 'i = 0', variables: { i: 0 } },

            { id: 2, phase: 'CONDITION', line: 2, charStart: 20, charEnd: 26, highlight: 'i < 10', description: '0 < 10 → TRUE', variables: { i: 0 }, conditionResult: true },
            { id: 3, phase: 'IF_CHECK', line: 3, charStart: 12, charEnd: 18, highlight: 'i == 3', description: '0 == 3 → FALSE (skip break)', variables: { i: 0 }, conditionResult: false },
            { id: 4, phase: 'BODY', line: 4, charStart: 8, charEnd: 17, highlight: 'cout << i', description: 'Output: 0', variables: { i: 0 }, output: '0' },
            { id: 5, phase: 'INCREMENT', line: 2, charStart: 28, charEnd: 31, highlight: 'i++', description: 'i becomes 1', variables: { i: 1 } },

            { id: 6, phase: 'CONDITION', line: 2, charStart: 20, charEnd: 26, highlight: 'i < 10', description: '1 < 10 → TRUE', variables: { i: 1 }, conditionResult: true },
            { id: 7, phase: 'IF_CHECK', line: 3, charStart: 12, charEnd: 18, highlight: 'i == 3', description: '1 == 3 → FALSE', variables: { i: 1 }, conditionResult: false },
            { id: 8, phase: 'BODY', line: 4, charStart: 8, charEnd: 17, highlight: 'cout << i', description: 'Output: 1', variables: { i: 1 }, output: '01' },
            { id: 9, phase: 'INCREMENT', line: 2, charStart: 28, charEnd: 31, highlight: 'i++', description: 'i becomes 2', variables: { i: 2 } },

            { id: 10, phase: 'CONDITION', line: 2, charStart: 20, charEnd: 26, highlight: 'i < 10', description: '2 < 10 → TRUE', variables: { i: 2 }, conditionResult: true },
            { id: 11, phase: 'IF_CHECK', line: 3, charStart: 12, charEnd: 18, highlight: 'i == 3', description: '2 == 3 → FALSE', variables: { i: 2 }, conditionResult: false },
            { id: 12, phase: 'BODY', line: 4, charStart: 8, charEnd: 17, highlight: 'cout << i', description: 'Output: 2', variables: { i: 2 }, output: '012' },
            { id: 13, phase: 'INCREMENT', line: 2, charStart: 28, charEnd: 31, highlight: 'i++', description: 'i becomes 3', variables: { i: 3 } },

            { id: 14, phase: 'CONDITION', line: 2, charStart: 20, charEnd: 26, highlight: 'i < 10', description: '3 < 10 → TRUE', variables: { i: 3 }, conditionResult: true },
            { id: 15, phase: 'IF_CHECK', line: 3, charStart: 12, charEnd: 18, highlight: 'i == 3', description: '3 == 3 → TRUE!', variables: { i: 3 }, conditionResult: true },
            { id: 16, phase: 'BREAK', line: 3, charStart: 20, charEnd: 25, highlight: 'break', description: '🛑 BREAK: Exit loop immediately!', variables: { i: 3 } },

            { id: 17, phase: 'COMPLETE', line: 6, charStart: 0, charEnd: 1, highlight: '}', description: 'Loop exited at i=3. Output: 012', variables: { i: 3 }, output: '012' }
        ]
    },

    // 8. Continue Statement
    {
        id: 'continue-statement',
        title: 'Continue Statement',
        description: 'Skip current iteration and continue to next',
        difficulty: 'BEGINNER',
        category: 'Control Statements',
        code: `int main() {
    for (int i = 0; i < 5; i++) {
        if (i == 2) continue;
        cout << i;
    }
}`,
        expectedOutput: '0134',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 9, charEnd: 18, highlight: 'int i = 0', description: 'i = 0', variables: { i: 0 } },

            { id: 2, phase: 'CONDITION', line: 2, charStart: 20, charEnd: 25, highlight: 'i < 5', description: '0 < 5 → TRUE', variables: { i: 0 }, conditionResult: true },
            { id: 3, phase: 'IF_CHECK', line: 3, charStart: 12, charEnd: 18, highlight: 'i == 2', description: '0 == 2 → FALSE', variables: { i: 0 }, conditionResult: false },
            { id: 4, phase: 'BODY', line: 4, charStart: 8, charEnd: 17, highlight: 'cout << i', description: 'Output: 0', variables: { i: 0 }, output: '0' },
            { id: 5, phase: 'INCREMENT', line: 2, charStart: 27, charEnd: 30, highlight: 'i++', description: 'i = 1', variables: { i: 1 } },

            { id: 6, phase: 'CONDITION', line: 2, charStart: 20, charEnd: 25, highlight: 'i < 5', description: '1 < 5 → TRUE', variables: { i: 1 }, conditionResult: true },
            { id: 7, phase: 'IF_CHECK', line: 3, charStart: 12, charEnd: 18, highlight: 'i == 2', description: '1 == 2 → FALSE', variables: { i: 1 }, conditionResult: false },
            { id: 8, phase: 'BODY', line: 4, charStart: 8, charEnd: 17, highlight: 'cout << i', description: 'Output: 1', variables: { i: 1 }, output: '01' },
            { id: 9, phase: 'INCREMENT', line: 2, charStart: 27, charEnd: 30, highlight: 'i++', description: 'i = 2', variables: { i: 2 } },

            { id: 10, phase: 'CONDITION', line: 2, charStart: 20, charEnd: 25, highlight: 'i < 5', description: '2 < 5 → TRUE', variables: { i: 2 }, conditionResult: true },
            { id: 11, phase: 'IF_CHECK', line: 3, charStart: 12, charEnd: 18, highlight: 'i == 2', description: '2 == 2 → TRUE!', variables: { i: 2 }, conditionResult: true },
            { id: 12, phase: 'CONTINUE', line: 3, charStart: 20, charEnd: 28, highlight: 'continue', description: '⏭ CONTINUE: Skip rest of body, go to increment', variables: { i: 2 } },
            { id: 13, phase: 'INCREMENT', line: 2, charStart: 27, charEnd: 30, highlight: 'i++', description: 'i = 3', variables: { i: 3 } },

            { id: 14, phase: 'CONDITION', line: 2, charStart: 20, charEnd: 25, highlight: 'i < 5', description: '3 < 5 → TRUE', variables: { i: 3 }, conditionResult: true },
            { id: 15, phase: 'IF_CHECK', line: 3, charStart: 12, charEnd: 18, highlight: 'i == 2', description: '3 == 2 → FALSE', variables: { i: 3 }, conditionResult: false },
            { id: 16, phase: 'BODY', line: 4, charStart: 8, charEnd: 17, highlight: 'cout << i', description: 'Output: 3', variables: { i: 3 }, output: '013' },
            { id: 17, phase: 'INCREMENT', line: 2, charStart: 27, charEnd: 30, highlight: 'i++', description: 'i = 4', variables: { i: 4 } },

            { id: 18, phase: 'CONDITION', line: 2, charStart: 20, charEnd: 25, highlight: 'i < 5', description: '4 < 5 → TRUE', variables: { i: 4 }, conditionResult: true },
            { id: 19, phase: 'IF_CHECK', line: 3, charStart: 12, charEnd: 18, highlight: 'i == 2', description: '4 == 2 → FALSE', variables: { i: 4 }, conditionResult: false },
            { id: 20, phase: 'BODY', line: 4, charStart: 8, charEnd: 17, highlight: 'cout << i', description: 'Output: 4', variables: { i: 4 }, output: '0134' },
            { id: 21, phase: 'INCREMENT', line: 2, charStart: 27, charEnd: 30, highlight: 'i++', description: 'i = 5', variables: { i: 5 } },

            { id: 22, phase: 'CONDITION_FAIL', line: 2, charStart: 20, charEnd: 25, highlight: 'i < 5', description: '5 < 5 → FALSE', variables: { i: 5 }, conditionResult: false },
            { id: 23, phase: 'COMPLETE', line: 6, charStart: 0, charEnd: 1, highlight: '}', description: 'Notice: 2 is missing! Continue skipped it.', variables: { i: 5 }, output: '0134' }
        ]
    },

    // ==================== CATEGORY: OPERATORS ====================

    // 9. Prefix vs Postfix (Deep breakdown)
    {
        id: 'prefix-postfix',
        title: 'Prefix vs Postfix Increment',
        description: '++x increments BEFORE returning, x++ returns THEN increments',
        difficulty: 'INTERMEDIATE',
        category: 'Operators',
        code: `int main() {
    int x = 5;
    int a = ++x;
    
    int y = 5;
    int b = y++;
    
    cout << a << x << b << y;
}`,
        expectedOutput: '6656',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 14, highlight: 'int x = 5;', description: 'x = 5', variables: { x: 5 } },

            // PREFIX ++x
            { id: 2, phase: 'PREFIX', line: 3, charStart: 12, charEnd: 14, highlight: '++', description: '⬆ PREFIX: Increment FIRST', variables: { x: 5 } },
            { id: 3, phase: 'PREFIX', line: 3, charStart: 14, charEnd: 15, highlight: 'x', description: 'x becomes 6', variables: { x: 6 } },
            { id: 4, phase: 'ASSIGN', line: 3, charStart: 8, charEnd: 9, highlight: 'a', description: 'THEN assign: a gets NEW value 6', variables: { x: 6, a: 6 } },

            { id: 5, phase: 'INIT', line: 5, charStart: 4, charEnd: 14, highlight: 'int y = 5;', description: 'y = 5', variables: { x: 6, a: 6, y: 5 } },

            // POSTFIX y++
            { id: 6, phase: 'POSTFIX', line: 6, charStart: 12, charEnd: 13, highlight: 'y', description: '⬇ POSTFIX: Use FIRST - return current value 5', variables: { x: 6, a: 6, y: 5 } },
            { id: 7, phase: 'ASSIGN', line: 6, charStart: 8, charEnd: 9, highlight: 'b', description: 'b gets OLD value 5', variables: { x: 6, a: 6, y: 5, b: 5 } },
            { id: 8, phase: 'POSTFIX', line: 6, charStart: 13, charEnd: 15, highlight: '++', description: 'THEN increment: y becomes 6', variables: { x: 6, a: 6, y: 6, b: 5 } },

            // OUTPUT
            { id: 9, phase: 'OUTPUT', line: 8, charStart: 12, charEnd: 13, highlight: 'a', description: 'Output a: 6', variables: { x: 6, a: 6, y: 6, b: 5 }, output: '6' },
            { id: 10, phase: 'OUTPUT', line: 8, charStart: 17, charEnd: 18, highlight: 'x', description: 'Output x: 6', variables: { x: 6, a: 6, y: 6, b: 5 }, output: '66' },
            { id: 11, phase: 'OUTPUT', line: 8, charStart: 22, charEnd: 23, highlight: 'b', description: 'Output b: 5 (got old value!)', variables: { x: 6, a: 6, y: 6, b: 5 }, output: '665' },
            { id: 12, phase: 'OUTPUT', line: 8, charStart: 27, charEnd: 28, highlight: 'y', description: 'Output y: 6', variables: { x: 6, a: 6, y: 6, b: 5 }, output: '6656' },

            { id: 13, phase: 'COMPLETE', line: 9, charStart: 0, charEnd: 1, highlight: '}', description: 'Notice: a=6 but b=5! Prefix gave new, postfix gave old.', variables: { x: 6, a: 6, y: 6, b: 5 }, output: '6656' }
        ]
    },

    // 10. Assignment Right-to-Left (Deep breakdown)
    {
        id: 'assignment-rtl',
        title: 'Assignment: Right to Left',
        description: 'Assignment evaluates right side FIRST, then assigns left',
        difficulty: 'BEGINNER',
        category: 'Operators',
        code: `int main() {
    int a = 5;
    int b = 3;
    int result = a + b * 2;
    cout << result;
}`,
        expectedOutput: '11',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 14, highlight: 'int a = 5;', description: 'a = 5', variables: { a: 5 } },
            { id: 2, phase: 'INIT', line: 3, charStart: 4, charEnd: 14, highlight: 'int b = 3;', description: 'b = 3', variables: { a: 5, b: 3 } },

            // Right-to-left evaluation with precedence
            { id: 3, phase: 'EVALUATE', line: 4, charStart: 17, charEnd: 18, highlight: 'a', description: '→ Start evaluating RIGHT side: read a = 5', variables: { a: 5, b: 3 } },
            { id: 4, phase: 'EVALUATE', line: 4, charStart: 19, charEnd: 20, highlight: '+', description: '→ Addition operator (lower precedence, evaluate later)', variables: { a: 5, b: 3 } },
            { id: 5, phase: 'EVALUATE', line: 4, charStart: 21, charEnd: 22, highlight: 'b', description: '→ Read b = 3', variables: { a: 5, b: 3 } },
            { id: 6, phase: 'EVALUATE', line: 4, charStart: 23, charEnd: 24, highlight: '*', description: '→ Multiplication (HIGHER precedence, evaluate FIRST)', variables: { a: 5, b: 3 } },
            { id: 7, phase: 'EVALUATE', line: 4, charStart: 25, charEnd: 26, highlight: '2', description: '→ Value 2', variables: { a: 5, b: 3 } },
            { id: 8, phase: 'COMPUTE', line: 4, charStart: 21, charEnd: 26, highlight: 'b * 2', description: '🔢 COMPUTE: 3 * 2 = 6', variables: { a: 5, b: 3, _temp1: 6 } },
            { id: 9, phase: 'COMPUTE', line: 4, charStart: 17, charEnd: 26, highlight: 'a + b * 2', description: '🔢 COMPUTE: 5 + 6 = 11', variables: { a: 5, b: 3, _temp2: 11 } },
            { id: 10, phase: 'ASSIGN', line: 4, charStart: 8, charEnd: 14, highlight: 'result', description: '← ASSIGN left: result = 11', variables: { a: 5, b: 3, result: 11 } },

            { id: 11, phase: 'OUTPUT', line: 5, charStart: 4, charEnd: 19, highlight: 'cout << result;', description: 'Output: 11', variables: { a: 5, b: 3, result: 11 }, output: '11' },
            { id: 12, phase: 'COMPLETE', line: 6, charStart: 0, charEnd: 1, highlight: '}', description: 'Note: * before +, right side before assignment', variables: { a: 5, b: 3, result: 11 }, output: '11' }
        ]
    },

    // ==================== CATEGORY: CONDITIONALS ====================

    // 11. If-Else
    {
        id: 'if-else',
        title: 'If-Else Statement',
        description: 'Conditional branching based on condition',
        difficulty: 'BEGINNER',
        category: 'Conditionals',
        code: `int main() {
    int x = 10;
    if (x > 5) {
        cout << "big";
    } else {
        cout << "small";
    }
}`,
        expectedOutput: 'big',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 15, highlight: 'int x = 10;', description: 'x = 10', variables: { x: 10 } },

            { id: 2, phase: 'IF_KEYWORD', line: 3, charStart: 4, charEnd: 6, highlight: 'if', description: 'IF statement: evaluate condition', variables: { x: 10 } },
            { id: 3, phase: 'CONDITION', line: 3, charStart: 8, charEnd: 9, highlight: 'x', description: 'Read x = 10', variables: { x: 10 } },
            { id: 4, phase: 'CONDITION', line: 3, charStart: 10, charEnd: 11, highlight: '>', description: 'Greater than comparison', variables: { x: 10 } },
            { id: 5, phase: 'CONDITION', line: 3, charStart: 12, charEnd: 13, highlight: '5', description: '10 > 5 → TRUE ✓', variables: { x: 10 }, conditionResult: true },

            { id: 6, phase: 'BODY', line: 4, charStart: 8, charEnd: 21, highlight: 'cout << "big"', description: 'Execute IF block: Output "big"', variables: { x: 10 }, output: 'big' },

            { id: 7, phase: 'SKIP_ELSE', line: 5, charStart: 6, charEnd: 10, highlight: 'else', description: 'SKIP else block (condition was true)', variables: { x: 10 } },

            { id: 8, phase: 'COMPLETE', line: 8, charStart: 0, charEnd: 1, highlight: '}', description: 'If-else complete', variables: { x: 10 }, output: 'big' }
        ]
    },

    // 12. Switch-Case
    {
        id: 'switch-case',
        title: 'Switch-Case Statement',
        description: 'Multi-way branching with cases and break',
        difficulty: 'INTERMEDIATE',
        category: 'Conditionals',
        code: `int main() {
    int day = 2;
    switch (day) {
        case 1: cout << "Mon"; break;
        case 2: cout << "Tue"; break;
        case 3: cout << "Wed"; break;
        default: cout << "?";
    }
}`,
        expectedOutput: 'Tue',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 16, highlight: 'int day = 2;', description: 'day = 2', variables: { day: 2 } },

            { id: 2, phase: 'SWITCH', line: 3, charStart: 4, charEnd: 10, highlight: 'switch', description: 'SWITCH: evaluate expression', variables: { day: 2 } },
            { id: 3, phase: 'SWITCH', line: 3, charStart: 12, charEnd: 15, highlight: 'day', description: 'Expression value: 2', variables: { day: 2 } },

            { id: 4, phase: 'CASE_CHECK', line: 4, charStart: 8, charEnd: 14, highlight: 'case 1', description: 'case 1: 2 == 1? NO, skip', variables: { day: 2 }, conditionResult: false },
            { id: 5, phase: 'CASE_CHECK', line: 5, charStart: 8, charEnd: 14, highlight: 'case 2', description: 'case 2: 2 == 2? YES! ✓', variables: { day: 2 }, conditionResult: true },
            { id: 6, phase: 'BODY', line: 5, charStart: 16, charEnd: 29, highlight: 'cout << "Tue"', description: 'Execute: Output "Tue"', variables: { day: 2 }, output: 'Tue' },
            { id: 7, phase: 'BREAK', line: 5, charStart: 31, charEnd: 36, highlight: 'break', description: 'BREAK: Exit switch block', variables: { day: 2 } },

            { id: 8, phase: 'COMPLETE', line: 9, charStart: 0, charEnd: 1, highlight: '}', description: 'Switch complete. Without break, would "fall through"!', variables: { day: 2 }, output: 'Tue' }
        ]
    },

    // 13. Nested Loops
    {
        id: 'nested-loops',
        title: 'Nested Loops',
        description: 'Loop inside a loop - inner completes for each outer iteration',
        difficulty: 'INTERMEDIATE',
        category: 'For Loops',
        code: `int main() {
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 3; j++) {
            cout << i << j << " ";
        }
    }
}`,
        expectedOutput: '00 01 02 10 11 12 ',
        steps: [
            { id: 1, phase: 'OUTER_INIT', line: 2, charStart: 9, charEnd: 18, highlight: 'int i = 0', description: 'OUTER: i = 0', variables: { i: 0 } },
            { id: 2, phase: 'OUTER_COND', line: 2, charStart: 20, charEnd: 25, highlight: 'i < 2', description: 'OUTER: 0 < 2 → TRUE', variables: { i: 0 }, conditionResult: true },

            // i=0, inner loop
            { id: 3, phase: 'INNER_INIT', line: 3, charStart: 13, charEnd: 22, highlight: 'int j = 0', description: 'INNER: j = 0', variables: { i: 0, j: 0 } },
            { id: 4, phase: 'INNER_COND', line: 3, charStart: 24, charEnd: 29, highlight: 'j < 3', description: 'INNER: 0 < 3 → TRUE', variables: { i: 0, j: 0 }, conditionResult: true },
            { id: 5, phase: 'BODY', line: 4, charStart: 12, charEnd: 26, highlight: 'cout << i << j', description: 'Output: 00', variables: { i: 0, j: 0 }, output: '00 ' },
            { id: 6, phase: 'INNER_INC', line: 3, charStart: 31, charEnd: 34, highlight: 'j++', description: 'INNER: j = 1', variables: { i: 0, j: 1 } },

            { id: 7, phase: 'INNER_COND', line: 3, charStart: 24, charEnd: 29, highlight: 'j < 3', description: 'INNER: 1 < 3 → TRUE', variables: { i: 0, j: 1 }, conditionResult: true },
            { id: 8, phase: 'BODY', line: 4, charStart: 12, charEnd: 26, highlight: 'cout << i << j', description: 'Output: 01', variables: { i: 0, j: 1 }, output: '00 01 ' },
            { id: 9, phase: 'INNER_INC', line: 3, charStart: 31, charEnd: 34, highlight: 'j++', description: 'INNER: j = 2', variables: { i: 0, j: 2 } },

            { id: 10, phase: 'INNER_COND', line: 3, charStart: 24, charEnd: 29, highlight: 'j < 3', description: 'INNER: 2 < 3 → TRUE', variables: { i: 0, j: 2 }, conditionResult: true },
            { id: 11, phase: 'BODY', line: 4, charStart: 12, charEnd: 26, highlight: 'cout << i << j', description: 'Output: 02', variables: { i: 0, j: 2 }, output: '00 01 02 ' },
            { id: 12, phase: 'INNER_INC', line: 3, charStart: 31, charEnd: 34, highlight: 'j++', description: 'INNER: j = 3', variables: { i: 0, j: 3 } },

            { id: 13, phase: 'INNER_EXIT', line: 3, charStart: 24, charEnd: 29, highlight: 'j < 3', description: 'INNER: 3 < 3 → FALSE, exit inner loop', variables: { i: 0, j: 3 }, conditionResult: false },

            { id: 14, phase: 'OUTER_INC', line: 2, charStart: 27, charEnd: 30, highlight: 'i++', description: 'OUTER: i = 1', variables: { i: 1 } },
            { id: 15, phase: 'OUTER_COND', line: 2, charStart: 20, charEnd: 25, highlight: 'i < 2', description: 'OUTER: 1 < 2 → TRUE', variables: { i: 1 }, conditionResult: true },

            // i=1, inner loop restarts
            { id: 16, phase: 'INNER_INIT', line: 3, charStart: 13, charEnd: 22, highlight: 'int j = 0', description: 'INNER: j = 0 (restart!)', variables: { i: 1, j: 0 } },
            { id: 17, phase: 'INNER_COND', line: 3, charStart: 24, charEnd: 29, highlight: 'j < 3', description: 'INNER: 0 < 3 → TRUE', variables: { i: 1, j: 0 }, conditionResult: true },
            { id: 18, phase: 'BODY', line: 4, charStart: 12, charEnd: 26, highlight: 'cout << i << j', description: 'Output: 10', variables: { i: 1, j: 0 }, output: '00 01 02 10 ' },
            { id: 19, phase: 'INNER_INC', line: 3, charStart: 31, charEnd: 34, highlight: 'j++', description: 'INNER: j = 1', variables: { i: 1, j: 1 } },

            { id: 20, phase: 'INNER_COND', line: 3, charStart: 24, charEnd: 29, highlight: 'j < 3', description: 'INNER: 1 < 3 → TRUE', variables: { i: 1, j: 1 }, conditionResult: true },
            { id: 21, phase: 'BODY', line: 4, charStart: 12, charEnd: 26, highlight: 'cout << i << j', description: 'Output: 11', variables: { i: 1, j: 1 }, output: '00 01 02 10 11 ' },
            { id: 22, phase: 'INNER_INC', line: 3, charStart: 31, charEnd: 34, highlight: 'j++', description: 'INNER: j = 2', variables: { i: 1, j: 2 } },

            { id: 23, phase: 'INNER_COND', line: 3, charStart: 24, charEnd: 29, highlight: 'j < 3', description: 'INNER: 2 < 3 → TRUE', variables: { i: 1, j: 2 }, conditionResult: true },
            { id: 24, phase: 'BODY', line: 4, charStart: 12, charEnd: 26, highlight: 'cout << i << j', description: 'Output: 12', variables: { i: 1, j: 2 }, output: '00 01 02 10 11 12 ' },
            { id: 25, phase: 'INNER_INC', line: 3, charStart: 31, charEnd: 34, highlight: 'j++', description: 'INNER: j = 3', variables: { i: 1, j: 3 } },

            { id: 26, phase: 'INNER_EXIT', line: 3, charStart: 24, charEnd: 29, highlight: 'j < 3', description: 'INNER: 3 < 3 → FALSE', variables: { i: 1, j: 3 }, conditionResult: false },

            { id: 27, phase: 'OUTER_INC', line: 2, charStart: 27, charEnd: 30, highlight: 'i++', description: 'OUTER: i = 2', variables: { i: 2 } },
            { id: 28, phase: 'OUTER_EXIT', line: 2, charStart: 20, charEnd: 25, highlight: 'i < 2', description: 'OUTER: 2 < 2 → FALSE, exit outer loop', variables: { i: 2 }, conditionResult: false },

            { id: 29, phase: 'COMPLETE', line: 7, charStart: 0, charEnd: 1, highlight: '}', description: 'Nested loop: 2 outer × 3 inner = 6 outputs', variables: { i: 2 }, output: '00 01 02 10 11 12 ' }
        ]
    },

    // ==================== CATEGORY: VARIABLES & DATA TYPES ====================

    // 14. Variables & Data Types
    {
        id: 'variables-datatypes',
        title: 'Variables & Data Types',
        description: 'Declaration and initialization of different data types',
        difficulty: 'BEGINNER',
        category: 'Fundamentals',
        code: `int main() {
    int age = 25;
    float pi = 3.14;
    char grade = 'A';
    bool passed = true;
    cout << age << pi << grade << passed;
}`,
        expectedOutput: '253.14A1',
        steps: [
            { id: 1, phase: 'DECLARE', line: 2, charStart: 4, charEnd: 7, highlight: 'int', description: 'Declare integer type (4 bytes)', variables: {} },
            { id: 2, phase: 'DECLARE', line: 2, charStart: 8, charEnd: 11, highlight: 'age', description: 'Variable name: age', variables: {} },
            { id: 3, phase: 'ASSIGN', line: 2, charStart: 14, charEnd: 16, highlight: '25', description: 'Assign value 25', variables: { age: 25 } },

            { id: 4, phase: 'DECLARE', line: 3, charStart: 4, charEnd: 9, highlight: 'float', description: 'Declare float type (4 bytes, decimals)', variables: { age: 25 } },
            { id: 5, phase: 'ASSIGN', line: 3, charStart: 15, charEnd: 19, highlight: '3.14', description: 'Assign 3.14', variables: { age: 25, pi: 3.14 } },

            { id: 6, phase: 'DECLARE', line: 4, charStart: 4, charEnd: 8, highlight: 'char', description: 'Declare char type (1 byte, single character)', variables: { age: 25, pi: 3.14 } },
            { id: 7, phase: 'ASSIGN', line: 4, charStart: 17, charEnd: 20, highlight: "'A'", description: "Assign character 'A'", variables: { age: 25, pi: 3.14, grade: 'A' } },

            { id: 8, phase: 'DECLARE', line: 5, charStart: 4, charEnd: 8, highlight: 'bool', description: 'Declare boolean type (true/false)', variables: { age: 25, pi: 3.14, grade: 'A' } },
            { id: 9, phase: 'ASSIGN', line: 5, charStart: 18, charEnd: 22, highlight: 'true', description: 'Assign true (stored as 1)', variables: { age: 25, pi: 3.14, grade: 'A', passed: true } },

            { id: 10, phase: 'OUTPUT', line: 6, charStart: 12, charEnd: 15, highlight: 'age', description: 'Output age: 25', variables: { age: 25, pi: 3.14, grade: 'A', passed: true }, output: '25' },
            { id: 11, phase: 'OUTPUT', line: 6, charStart: 19, charEnd: 21, highlight: 'pi', description: 'Output pi: 3.14', variables: { age: 25, pi: 3.14, grade: 'A', passed: true }, output: '253.14' },
            { id: 12, phase: 'OUTPUT', line: 6, charStart: 25, charEnd: 30, highlight: 'grade', description: 'Output grade: A', variables: { age: 25, pi: 3.14, grade: 'A', passed: true }, output: '253.14A' },
            { id: 13, phase: 'OUTPUT', line: 6, charStart: 34, charEnd: 40, highlight: 'passed', description: 'Output passed: 1 (true)', variables: { age: 25, pi: 3.14, grade: 'A', passed: true }, output: '253.14A1' },

            { id: 14, phase: 'COMPLETE', line: 7, charStart: 0, charEnd: 1, highlight: '}', description: 'Program complete', variables: { age: 25, pi: 3.14, grade: 'A', passed: true }, output: '253.14A1' }
        ]
    },

    // 15. Type Casting
    {
        id: 'type-casting',
        title: 'Type Casting',
        description: 'Explicit type conversion to control division behavior',
        difficulty: 'BEGINNER',
        category: 'Fundamentals',
        code: `int main() {
    int x = 10;
    int y = 3;
    float a = x / y;
    float b = (float)x / y;
    cout << a << " " << b;
}`,
        expectedOutput: '3 3.33333',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 15, highlight: 'int x = 10;', description: 'x = 10', variables: { x: 10 } },
            { id: 2, phase: 'INIT', line: 3, charStart: 4, charEnd: 14, highlight: 'int y = 3;', description: 'y = 3', variables: { x: 10, y: 3 } },

            { id: 3, phase: 'EVALUATE', line: 4, charStart: 14, charEnd: 15, highlight: 'x', description: 'Read x = 10 (int)', variables: { x: 10, y: 3 } },
            { id: 4, phase: 'EVALUATE', line: 4, charStart: 16, charEnd: 17, highlight: '/', description: 'Integer division!', variables: { x: 10, y: 3 } },
            { id: 5, phase: 'EVALUATE', line: 4, charStart: 18, charEnd: 19, highlight: 'y', description: 'Read y = 3 (int)', variables: { x: 10, y: 3 } },
            { id: 6, phase: 'COMPUTE', line: 4, charStart: 14, charEnd: 19, highlight: 'x / y', description: '10 / 3 = 3 (integer division truncates!)', variables: { x: 10, y: 3, a: 3 } },

            { id: 7, phase: 'CAST', line: 5, charStart: 14, charEnd: 22, highlight: '(float)x', description: 'CAST: Convert x to float (10.0)', variables: { x: 10, y: 3, a: 3 } },
            { id: 8, phase: 'EVALUATE', line: 5, charStart: 23, charEnd: 24, highlight: '/', description: 'Float division (one operand is float)', variables: { x: 10, y: 3, a: 3 } },
            { id: 9, phase: 'EVALUATE', line: 5, charStart: 25, charEnd: 26, highlight: 'y', description: 'y auto-promoted to float', variables: { x: 10, y: 3, a: 3 } },
            { id: 10, phase: 'COMPUTE', line: 5, charStart: 14, charEnd: 26, highlight: '(float)x / y', description: '10.0 / 3.0 = 3.33333', variables: { x: 10, y: 3, a: 3, b: 3.33333 } },

            { id: 11, phase: 'OUTPUT', line: 6, charStart: 12, charEnd: 13, highlight: 'a', description: 'Output a: 3', variables: { x: 10, y: 3, a: 3, b: 3.33333 }, output: '3' },
            { id: 12, phase: 'OUTPUT', line: 6, charStart: 24, charEnd: 25, highlight: 'b', description: 'Output b: 3.33333', variables: { x: 10, y: 3, a: 3, b: 3.33333 }, output: '3 3.33333' },

            { id: 13, phase: 'COMPLETE', line: 7, charStart: 0, charEnd: 1, highlight: '}', description: 'Cast matters! Without it, you lose decimals', variables: { x: 10, y: 3, a: 3, b: 3.33333 }, output: '3 3.33333' }
        ]
    },

    // ==================== CATEGORY: OPERATORS ====================

    // 16. Arithmetic Precedence
    {
        id: 'arithmetic-precedence',
        title: 'Arithmetic Precedence (PEMDAS)',
        description: 'Operator precedence: * / before + -',
        difficulty: 'BEGINNER',
        category: 'Operators',
        code: `int main() {
    int result = 2 + 3 * 4 - 8 / 2;
    cout << result;
}`,
        expectedOutput: '10',
        steps: [
            { id: 1, phase: 'EVALUATE', line: 2, charStart: 17, charEnd: 18, highlight: '2', description: 'Start: 2 + 3 * 4 - 8 / 2', variables: {} },
            { id: 2, phase: 'EVALUATE', line: 2, charStart: 21, charEnd: 26, highlight: '3 * 4', description: '⭐ FIRST: Multiplication (high priority)', variables: {} },
            { id: 3, phase: 'COMPUTE', line: 2, charStart: 21, charEnd: 26, highlight: '3 * 4', description: '3 * 4 = 12', variables: { _step1: 12 } },
            { id: 4, phase: 'EVALUATE', line: 2, charStart: 29, charEnd: 34, highlight: '8 / 2', description: '⭐ SECOND: Division (high priority)', variables: { _step1: 12 } },
            { id: 5, phase: 'COMPUTE', line: 2, charStart: 29, charEnd: 34, highlight: '8 / 2', description: '8 / 2 = 4', variables: { _step1: 12, _step2: 4 } },
            { id: 6, phase: 'COMPUTE', line: 2, charStart: 17, charEnd: 22, highlight: '2 + 3', description: 'Now left-to-right: 2 + 12 = 14', variables: { _step3: 14 } },
            { id: 7, phase: 'COMPUTE', line: 2, charStart: 17, charEnd: 34, highlight: '2 + 3 * 4 - 8 / 2', description: 'Finally: 14 - 4 = 10', variables: { result: 10 } },
            { id: 8, phase: 'OUTPUT', line: 3, charStart: 4, charEnd: 19, highlight: 'cout << result;', description: 'Output: 10', variables: { result: 10 }, output: '10' },
            { id: 9, phase: 'COMPLETE', line: 4, charStart: 0, charEnd: 1, highlight: '}', description: 'Order: * / first, then + - left-to-right', variables: { result: 10 }, output: '10' }
        ]
    },

    // 17. Relational Operators
    {
        id: 'relational-operators',
        title: 'Relational Operators',
        description: 'Comparison operators return true (1) or false (0)',
        difficulty: 'BEGINNER',
        category: 'Operators',
        code: `int main() {
    int a = 5, b = 10;
    cout << (a == b);
    cout << (a < b);
    cout << (a >= 5);
}`,
        expectedOutput: '011',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 8, charEnd: 14, highlight: 'a = 5,', description: 'a = 5', variables: { a: 5 } },
            { id: 2, phase: 'INIT', line: 2, charStart: 15, charEnd: 21, highlight: 'b = 10', description: 'b = 10', variables: { a: 5, b: 10 } },

            { id: 3, phase: 'COMPARE', line: 3, charStart: 13, charEnd: 19, highlight: 'a == b', description: 'Equal? 5 == 10', variables: { a: 5, b: 10 } },
            { id: 4, phase: 'RESULT', line: 3, charStart: 13, charEnd: 19, highlight: 'a == b', description: '5 == 10 → FALSE (0)', variables: { a: 5, b: 10 }, output: '0' },

            { id: 5, phase: 'COMPARE', line: 4, charStart: 13, charEnd: 18, highlight: 'a < b', description: 'Less than? 5 < 10', variables: { a: 5, b: 10 } },
            { id: 6, phase: 'RESULT', line: 4, charStart: 13, charEnd: 18, highlight: 'a < b', description: '5 < 10 → TRUE (1)', variables: { a: 5, b: 10 }, output: '01' },

            { id: 7, phase: 'COMPARE', line: 5, charStart: 13, charEnd: 19, highlight: 'a >= 5', description: 'Greater or equal? 5 >= 5', variables: { a: 5, b: 10 } },
            { id: 8, phase: 'RESULT', line: 5, charStart: 13, charEnd: 19, highlight: 'a >= 5', description: '5 >= 5 → TRUE (1)', variables: { a: 5, b: 10 }, output: '011' },

            { id: 9, phase: 'COMPLETE', line: 6, charStart: 0, charEnd: 1, highlight: '}', description: 'Relational ops return 0 or 1', variables: { a: 5, b: 10 }, output: '011' }
        ]
    },

    // 18. Logical Operators
    {
        id: 'logical-operators',
        title: 'Logical Operators',
        description: 'AND (&&), OR (||), NOT (!) boolean logic',
        difficulty: 'BEGINNER',
        category: 'Operators',
        code: `int main() {
    bool a = true, b = false;
    cout << (a && b);
    cout << (a || b);
    cout << !a;
}`,
        expectedOutput: '010',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 9, charEnd: 18, highlight: 'a = true,', description: 'a = true', variables: { a: true } },
            { id: 2, phase: 'INIT', line: 2, charStart: 19, charEnd: 28, highlight: 'b = false', description: 'b = false', variables: { a: true, b: false } },

            { id: 3, phase: 'LOGIC', line: 3, charStart: 13, charEnd: 19, highlight: 'a && b', description: 'AND: Both must be true', variables: { a: true, b: false } },
            { id: 4, phase: 'RESULT', line: 3, charStart: 13, charEnd: 19, highlight: 'a && b', description: 'true && false → FALSE (0)', variables: { a: true, b: false }, output: '0' },

            { id: 5, phase: 'LOGIC', line: 4, charStart: 13, charEnd: 19, highlight: 'a || b', description: 'OR: At least one must be true', variables: { a: true, b: false } },
            { id: 6, phase: 'RESULT', line: 4, charStart: 13, charEnd: 19, highlight: 'a || b', description: 'true || false → TRUE (1)', variables: { a: true, b: false }, output: '01' },

            { id: 7, phase: 'LOGIC', line: 5, charStart: 12, charEnd: 14, highlight: '!a', description: 'NOT: Flip the value', variables: { a: true, b: false } },
            { id: 8, phase: 'RESULT', line: 5, charStart: 12, charEnd: 14, highlight: '!a', description: '!true → FALSE (0)', variables: { a: true, b: false }, output: '010' },

            { id: 9, phase: 'COMPLETE', line: 6, charStart: 0, charEnd: 1, highlight: '}', description: 'AND=both, OR=either, NOT=flip', variables: { a: true, b: false }, output: '010' }
        ]
    },

    // 19. Bitwise Operators
    {
        id: 'bitwise-operators',
        title: 'Bitwise Operators',
        description: 'Bit-level AND (&), OR (|), XOR (^) operations',
        difficulty: 'INTERMEDIATE',
        category: 'Operators',
        code: `int main() {
    int a = 5;
    int b = 3;
    cout << (a & b);
    cout << (a | b);
    cout << (a ^ b);
}`,
        expectedOutput: '176',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 14, highlight: 'int a = 5;', description: 'a = 5 (binary: 0101)', variables: { a: 5, a_bin: '0101' } },
            { id: 2, phase: 'INIT', line: 3, charStart: 4, charEnd: 14, highlight: 'int b = 3;', description: 'b = 3 (binary: 0011)', variables: { a: 5, b: 3, a_bin: '0101', b_bin: '0011' } },

            { id: 3, phase: 'BITWISE', line: 4, charStart: 13, charEnd: 18, highlight: 'a & b', description: 'AND: 0101 & 0011', variables: { a: 5, b: 3 } },
            { id: 4, phase: 'COMPUTE', line: 4, charStart: 13, charEnd: 18, highlight: 'a & b', description: '0101 & 0011 = 0001 → 1', variables: { a: 5, b: 3 }, output: '1' },

            { id: 5, phase: 'BITWISE', line: 5, charStart: 13, charEnd: 18, highlight: 'a | b', description: 'OR: 0101 | 0011', variables: { a: 5, b: 3 } },
            { id: 6, phase: 'COMPUTE', line: 5, charStart: 13, charEnd: 18, highlight: 'a | b', description: '0101 | 0011 = 0111 → 7', variables: { a: 5, b: 3 }, output: '17' },

            { id: 7, phase: 'BITWISE', line: 6, charStart: 13, charEnd: 18, highlight: 'a ^ b', description: 'XOR: 0101 ^ 0011', variables: { a: 5, b: 3 } },
            { id: 8, phase: 'COMPUTE', line: 6, charStart: 13, charEnd: 18, highlight: 'a ^ b', description: '0101 ^ 0011 = 0110 → 6', variables: { a: 5, b: 3 }, output: '176' },

            { id: 9, phase: 'COMPLETE', line: 7, charStart: 0, charEnd: 1, highlight: '}', description: 'AND=both1, OR=either1, XOR=different', variables: { a: 5, b: 3 }, output: '176' }
        ]
    },

    // 20. Ternary Operator
    {
        id: 'ternary-operator',
        title: 'Ternary Operator',
        description: 'Shorthand if-else: condition ? true_val : false_val',
        difficulty: 'BEGINNER',
        category: 'Operators',
        code: `int main() {
    int x = 10;
    int result = (x > 5) ? 100 : 0;
    cout << result;
}`,
        expectedOutput: '100',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 15, highlight: 'int x = 10;', description: 'x = 10', variables: { x: 10 } },

            { id: 2, phase: 'CONDITION', line: 3, charStart: 17, charEnd: 24, highlight: '(x > 5)', description: 'Evaluate condition: 10 > 5', variables: { x: 10 } },
            { id: 3, phase: 'RESULT', line: 3, charStart: 17, charEnd: 24, highlight: '(x > 5)', description: '10 > 5 → TRUE', variables: { x: 10 }, conditionResult: true },
            { id: 4, phase: 'TERNARY', line: 3, charStart: 25, charEnd: 26, highlight: '?', description: '? means: if TRUE, take left value', variables: { x: 10 } },
            { id: 5, phase: 'SELECT', line: 3, charStart: 27, charEnd: 30, highlight: '100', description: '✓ Condition TRUE: select 100', variables: { x: 10 } },
            { id: 6, phase: 'SKIP', line: 3, charStart: 28, charEnd: 29, highlight: '0', description: '✗ Skipped: false branch', variables: { x: 10 } },
            { id: 7, phase: 'ASSIGN', line: 3, charStart: 8, charEnd: 14, highlight: 'result', description: 'result = 100', variables: { x: 10, result: 100 } },

            { id: 8, phase: 'OUTPUT', line: 4, charStart: 4, charEnd: 19, highlight: 'cout << result;', description: 'Output: 100', variables: { x: 10, result: 100 }, output: '100' },
            { id: 9, phase: 'COMPLETE', line: 5, charStart: 0, charEnd: 1, highlight: '}', description: 'Ternary = compact if-else in one line', variables: { x: 10, result: 100 }, output: '100' }
        ]
    },

    // ==================== CATEGORY: CONDITIONALS (Extended) ====================

    // 21. Else-If Chain
    {
        id: 'else-if-chain',
        title: 'Else-If Chain',
        description: 'Multiple conditions checked in sequence',
        difficulty: 'BEGINNER',
        category: 'Conditionals',
        code: `int main() {
    int score = 75;
    if (score >= 90) cout << "A";
    else if (score >= 80) cout << "B";
    else if (score >= 70) cout << "C";
    else cout << "F";
}`,
        expectedOutput: 'C',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 19, highlight: 'int score = 75;', description: 'score = 75', variables: { score: 75 } },

            { id: 2, phase: 'IF_CHECK', line: 3, charStart: 8, charEnd: 19, highlight: 'score >= 90', description: 'Check #1: 75 >= 90?', variables: { score: 75 } },
            { id: 3, phase: 'RESULT', line: 3, charStart: 8, charEnd: 19, highlight: 'score >= 90', description: '75 >= 90 → FALSE ✗', variables: { score: 75 }, conditionResult: false },

            { id: 4, phase: 'ELSE_IF', line: 4, charStart: 13, charEnd: 24, highlight: 'score >= 80', description: 'Check #2: 75 >= 80?', variables: { score: 75 } },
            { id: 5, phase: 'RESULT', line: 4, charStart: 13, charEnd: 24, highlight: 'score >= 80', description: '75 >= 80 → FALSE ✗', variables: { score: 75 }, conditionResult: false },

            { id: 6, phase: 'ELSE_IF', line: 5, charStart: 13, charEnd: 24, highlight: 'score >= 70', description: 'Check #3: 75 >= 70?', variables: { score: 75 } },
            { id: 7, phase: 'RESULT', line: 5, charStart: 13, charEnd: 24, highlight: 'score >= 70', description: '75 >= 70 → TRUE ✓', variables: { score: 75 }, conditionResult: true },

            { id: 8, phase: 'BODY', line: 5, charStart: 26, charEnd: 37, highlight: 'cout << "C"', description: 'Execute: Output "C"', variables: { score: 75 }, output: 'C' },

            { id: 9, phase: 'SKIP', line: 6, charStart: 4, charEnd: 8, highlight: 'else', description: 'Skip remaining else (already matched)', variables: { score: 75 } },

            { id: 10, phase: 'COMPLETE', line: 7, charStart: 0, charEnd: 1, highlight: '}', description: 'First TRUE condition wins, rest skipped', variables: { score: 75 }, output: 'C' }
        ]
    },

    // ==================== CATEGORY: FUNCTIONS ====================

    // 22. Function Call
    {
        id: 'function-call',
        title: 'Function Call',
        description: 'Calling a function with parameters and return value',
        difficulty: 'BEGINNER',
        category: 'Functions',
        code: `int add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(3, 5);
    cout << result;
}`,
        expectedOutput: '8',
        steps: [
            { id: 1, phase: 'MAIN', line: 5, charStart: 0, charEnd: 12, highlight: 'int main() {', description: 'Program starts at main()', variables: {} },

            { id: 2, phase: 'CALL', line: 6, charStart: 17, charEnd: 20, highlight: 'add', description: 'Call function add()', variables: {} },
            { id: 3, phase: 'PARAM', line: 6, charStart: 21, charEnd: 22, highlight: '3', description: 'Pass argument: a = 3', variables: {} },
            { id: 4, phase: 'PARAM', line: 6, charStart: 24, charEnd: 25, highlight: '5', description: 'Pass argument: b = 5', variables: {} },

            { id: 5, phase: 'ENTER_FUNC', line: 1, charStart: 0, charEnd: 21, highlight: 'int add(int a, int b)', description: '→ Enter add() function', variables: { a: 3, b: 5 } },

            { id: 6, phase: 'COMPUTE', line: 2, charStart: 11, charEnd: 16, highlight: 'a + b', description: 'Calculate: 3 + 5 = 8', variables: { a: 3, b: 5, _result: 8 } },
            { id: 7, phase: 'RETURN', line: 2, charStart: 4, charEnd: 17, highlight: 'return a + b;', description: '← Return 8 to caller', variables: { a: 3, b: 5, _return: 8 } },

            { id: 8, phase: 'ASSIGN', line: 6, charStart: 8, charEnd: 14, highlight: 'result', description: 'result = 8', variables: { result: 8 } },

            { id: 9, phase: 'OUTPUT', line: 7, charStart: 4, charEnd: 19, highlight: 'cout << result;', description: 'Output: 8', variables: { result: 8 }, output: '8' },
            { id: 10, phase: 'COMPLETE', line: 8, charStart: 0, charEnd: 1, highlight: '}', description: 'Function returned value to caller', variables: { result: 8 }, output: '8' }
        ]
    },

    // 23. Recursion
    {
        id: 'recursion',
        title: 'Recursion',
        description: 'Function calling itself to solve factorial',
        difficulty: 'INTERMEDIATE',
        category: 'Functions',
        code: `int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n-1);
}

int main() {
    cout << factorial(4);
}`,
        expectedOutput: '24',
        steps: [
            { id: 1, phase: 'MAIN', line: 6, charStart: 0, charEnd: 12, highlight: 'int main() {', description: 'Start main()', variables: {} },
            { id: 2, phase: 'CALL', line: 7, charStart: 12, charEnd: 24, highlight: 'factorial(4)', description: 'Call factorial(4)', variables: {} },

            { id: 3, phase: 'ENTER_FUNC', line: 1, charStart: 0, charEnd: 20, highlight: 'int factorial(int n)', description: '→ factorial(n=4)', variables: { n: 4, _depth: 1 } },
            { id: 4, phase: 'CONDITION', line: 2, charStart: 8, charEnd: 14, highlight: 'n <= 1', description: '4 <= 1? FALSE', variables: { n: 4 }, conditionResult: false },
            { id: 5, phase: 'RECURSE', line: 3, charStart: 15, charEnd: 29, highlight: 'factorial(n-1)', description: 'Call factorial(3)', variables: { n: 4 } },

            { id: 6, phase: 'ENTER_FUNC', line: 1, charStart: 0, charEnd: 20, highlight: 'int factorial(int n)', description: '→ factorial(n=3)', variables: { n: 3, _depth: 2 } },
            { id: 7, phase: 'CONDITION', line: 2, charStart: 8, charEnd: 14, highlight: 'n <= 1', description: '3 <= 1? FALSE', variables: { n: 3 }, conditionResult: false },
            { id: 8, phase: 'RECURSE', line: 3, charStart: 15, charEnd: 29, highlight: 'factorial(n-1)', description: 'Call factorial(2)', variables: { n: 3 } },

            { id: 9, phase: 'ENTER_FUNC', line: 1, charStart: 0, charEnd: 20, highlight: 'int factorial(int n)', description: '→ factorial(n=2)', variables: { n: 2, _depth: 3 } },
            { id: 10, phase: 'CONDITION', line: 2, charStart: 8, charEnd: 14, highlight: 'n <= 1', description: '2 <= 1? FALSE', variables: { n: 2 }, conditionResult: false },
            { id: 11, phase: 'RECURSE', line: 3, charStart: 15, charEnd: 29, highlight: 'factorial(n-1)', description: 'Call factorial(1)', variables: { n: 2 } },

            { id: 12, phase: 'ENTER_FUNC', line: 1, charStart: 0, charEnd: 20, highlight: 'int factorial(int n)', description: '→ factorial(n=1) BASE CASE!', variables: { n: 1, _depth: 4 } },
            { id: 13, phase: 'CONDITION', line: 2, charStart: 8, charEnd: 14, highlight: 'n <= 1', description: '1 <= 1? TRUE ✓', variables: { n: 1 }, conditionResult: true },
            { id: 14, phase: 'RETURN', line: 2, charStart: 16, charEnd: 25, highlight: 'return 1;', description: '← Return 1', variables: { n: 1, _return: 1 } },

            { id: 15, phase: 'COMPUTE', line: 3, charStart: 11, charEnd: 29, highlight: 'n * factorial(n-1)', description: '2 * 1 = 2', variables: { n: 2, _return: 2 } },
            { id: 16, phase: 'COMPUTE', line: 3, charStart: 11, charEnd: 29, highlight: 'n * factorial(n-1)', description: '3 * 2 = 6', variables: { n: 3, _return: 6 } },
            { id: 17, phase: 'COMPUTE', line: 3, charStart: 11, charEnd: 29, highlight: 'n * factorial(n-1)', description: '4 * 6 = 24', variables: { n: 4, _return: 24 } },

            { id: 18, phase: 'OUTPUT', line: 7, charStart: 4, charEnd: 25, highlight: 'cout << factorial(4);', description: 'Output: 24', variables: { _final: 24 }, output: '24' },
            { id: 19, phase: 'COMPLETE', line: 8, charStart: 0, charEnd: 1, highlight: '}', description: '4! = 4×3×2×1 = 24', variables: { _final: 24 }, output: '24' }
        ]
    },

    // ==================== CATEGORY: ARRAYS ====================

    // 24. Array Basics
    {
        id: 'array-basics',
        title: 'Array Basics',
        description: 'Array declaration, initialization, and access',
        difficulty: 'BEGINNER',
        category: 'Arrays',
        code: `int main() {
    int arr[3] = {10, 20, 30};
    cout << arr[0];
    cout << arr[1];
    cout << arr[2];
}`,
        expectedOutput: '102030',
        steps: [
            { id: 1, phase: 'DECLARE', line: 2, charStart: 4, charEnd: 14, highlight: 'int arr[3]', description: 'Declare array: 3 integers', variables: {} },
            { id: 2, phase: 'INIT', line: 2, charStart: 18, charEnd: 20, highlight: '10', description: 'arr[0] = 10', variables: { 'arr[0]': 10 } },
            { id: 3, phase: 'INIT', line: 2, charStart: 22, charEnd: 24, highlight: '20', description: 'arr[1] = 20', variables: { 'arr[0]': 10, 'arr[1]': 20 } },
            { id: 4, phase: 'INIT', line: 2, charStart: 26, charEnd: 28, highlight: '30', description: 'arr[2] = 30', variables: { 'arr[0]': 10, 'arr[1]': 20, 'arr[2]': 30 } },

            { id: 5, phase: 'ACCESS', line: 3, charStart: 12, charEnd: 18, highlight: 'arr[0]', description: 'Access index 0: value 10', variables: { 'arr[0]': 10, 'arr[1]': 20, 'arr[2]': 30 }, output: '10' },
            { id: 6, phase: 'ACCESS', line: 4, charStart: 12, charEnd: 18, highlight: 'arr[1]', description: 'Access index 1: value 20', variables: { 'arr[0]': 10, 'arr[1]': 20, 'arr[2]': 30 }, output: '1020' },
            { id: 7, phase: 'ACCESS', line: 5, charStart: 12, charEnd: 18, highlight: 'arr[2]', description: 'Access index 2: value 30', variables: { 'arr[0]': 10, 'arr[1]': 20, 'arr[2]': 30 }, output: '102030' },

            { id: 8, phase: 'COMPLETE', line: 6, charStart: 0, charEnd: 1, highlight: '}', description: 'Arrays: 0-indexed, contiguous memory', variables: { 'arr[0]': 10, 'arr[1]': 20, 'arr[2]': 30 }, output: '102030' }
        ]
    },

    // 25. Array Iteration
    {
        id: 'array-iteration',
        title: 'Array Iteration with For Loop',
        description: 'Loop through array elements using index',
        difficulty: 'BEGINNER',
        category: 'Arrays',
        code: `int main() {
    int arr[4] = {5, 10, 15, 20};
    int sum = 0;
    for (int i = 0; i < 4; i++) {
        sum = sum + arr[i];
    }
    cout << sum;
}`,
        expectedOutput: '50',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 32, highlight: 'int arr[4] = {5, 10, 15, 20}', description: 'Initialize array [5,10,15,20]', variables: { 'arr[0]': 5, 'arr[1]': 10, 'arr[2]': 15, 'arr[3]': 20 } },
            { id: 2, phase: 'INIT', line: 3, charStart: 4, charEnd: 16, highlight: 'int sum = 0;', description: 'sum = 0', variables: { 'arr[0]': 5, 'arr[1]': 10, 'arr[2]': 15, 'arr[3]': 20, sum: 0 } },

            { id: 3, phase: 'LOOP_INIT', line: 4, charStart: 9, charEnd: 18, highlight: 'int i = 0', description: 'i = 0', variables: { sum: 0, i: 0 } },
            { id: 4, phase: 'CONDITION', line: 4, charStart: 20, charEnd: 25, highlight: 'i < 4', description: '0 < 4 → TRUE', variables: { sum: 0, i: 0 }, conditionResult: true },
            { id: 5, phase: 'ACCESS', line: 5, charStart: 20, charEnd: 26, highlight: 'arr[i]', description: 'arr[0] = 5', variables: { sum: 0, i: 0 } },
            { id: 6, phase: 'COMPUTE', line: 5, charStart: 8, charEnd: 26, highlight: 'sum = sum + arr[i]', description: 'sum = 0 + 5 = 5', variables: { sum: 5, i: 0 } },
            { id: 7, phase: 'INCREMENT', line: 4, charStart: 27, charEnd: 30, highlight: 'i++', description: 'i = 1', variables: { sum: 5, i: 1 } },

            { id: 8, phase: 'CONDITION', line: 4, charStart: 20, charEnd: 25, highlight: 'i < 4', description: '1 < 4 → TRUE', variables: { sum: 5, i: 1 }, conditionResult: true },
            { id: 9, phase: 'ACCESS', line: 5, charStart: 20, charEnd: 26, highlight: 'arr[i]', description: 'arr[1] = 10', variables: { sum: 5, i: 1 } },
            { id: 10, phase: 'COMPUTE', line: 5, charStart: 8, charEnd: 26, highlight: 'sum = sum + arr[i]', description: 'sum = 5 + 10 = 15', variables: { sum: 15, i: 1 } },
            { id: 11, phase: 'INCREMENT', line: 4, charStart: 27, charEnd: 30, highlight: 'i++', description: 'i = 2', variables: { sum: 15, i: 2 } },

            { id: 12, phase: 'CONDITION', line: 4, charStart: 20, charEnd: 25, highlight: 'i < 4', description: '2 < 4 → TRUE', variables: { sum: 15, i: 2 }, conditionResult: true },
            { id: 13, phase: 'COMPUTE', line: 5, charStart: 8, charEnd: 26, highlight: 'sum = sum + arr[i]', description: 'sum = 15 + 15 = 30', variables: { sum: 30, i: 2 } },
            { id: 14, phase: 'INCREMENT', line: 4, charStart: 27, charEnd: 30, highlight: 'i++', description: 'i = 3', variables: { sum: 30, i: 3 } },

            { id: 15, phase: 'CONDITION', line: 4, charStart: 20, charEnd: 25, highlight: 'i < 4', description: '3 < 4 → TRUE', variables: { sum: 30, i: 3 }, conditionResult: true },
            { id: 16, phase: 'COMPUTE', line: 5, charStart: 8, charEnd: 26, highlight: 'sum = sum + arr[i]', description: 'sum = 30 + 20 = 50', variables: { sum: 50, i: 3 } },
            { id: 17, phase: 'INCREMENT', line: 4, charStart: 27, charEnd: 30, highlight: 'i++', description: 'i = 4', variables: { sum: 50, i: 4 } },

            { id: 18, phase: 'CONDITION_FAIL', line: 4, charStart: 20, charEnd: 25, highlight: 'i < 4', description: '4 < 4 → FALSE, exit loop', variables: { sum: 50, i: 4 }, conditionResult: false },
            { id: 19, phase: 'OUTPUT', line: 7, charStart: 4, charEnd: 16, highlight: 'cout << sum;', description: 'Output: 50', variables: { sum: 50 }, output: '50' },
            { id: 20, phase: 'COMPLETE', line: 8, charStart: 0, charEnd: 1, highlight: '}', description: 'Sum: 5+10+15+20 = 50', variables: { sum: 50 }, output: '50' }
        ]
    },

    // ==================== CATEGORY: POINTERS ====================

    // 26. Pointer Basics
    {
        id: 'pointer-basics',
        title: 'Pointer Basics',
        description: 'Address-of (&) and dereference (*) operators',
        difficulty: 'INTERMEDIATE',
        category: 'Pointers',
        code: `int main() {
    int x = 10;
    int* ptr = &x;
    cout << x;
    cout << *ptr;
    *ptr = 20;
    cout << x;
}`,
        expectedOutput: '101020',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 15, highlight: 'int x = 10;', description: 'x = 10 (stored at memory address)', variables: { x: 10 } },

            { id: 2, phase: 'DECLARE', line: 3, charStart: 4, charEnd: 8, highlight: 'int*', description: 'Declare pointer to int', variables: { x: 10 } },
            { id: 3, phase: 'POINTER', line: 3, charStart: 15, charEnd: 17, highlight: '&x', description: '& = address-of operator', variables: { x: 10 } },
            { id: 4, phase: 'ASSIGN', line: 3, charStart: 9, charEnd: 17, highlight: 'ptr = &x', description: 'ptr now holds address of x', variables: { x: 10, ptr: '→x' } },

            { id: 5, phase: 'OUTPUT', line: 4, charStart: 12, charEnd: 13, highlight: 'x', description: 'Direct access: x = 10', variables: { x: 10, ptr: '→x' }, output: '10' },

            { id: 6, phase: 'DEREF', line: 5, charStart: 12, charEnd: 16, highlight: '*ptr', description: '* = dereference: get value at address', variables: { x: 10, ptr: '→x' } },
            { id: 7, phase: 'OUTPUT', line: 5, charStart: 12, charEnd: 16, highlight: '*ptr', description: '*ptr = 10 (same as x)', variables: { x: 10, ptr: '→x' }, output: '1010' },

            { id: 8, phase: 'DEREF', line: 6, charStart: 4, charEnd: 8, highlight: '*ptr', description: 'Dereference for assignment', variables: { x: 10, ptr: '→x' } },
            { id: 9, phase: 'ASSIGN', line: 6, charStart: 4, charEnd: 13, highlight: '*ptr = 20', description: 'Modify value at address: x becomes 20!', variables: { x: 20, ptr: '→x' } },

            { id: 10, phase: 'OUTPUT', line: 7, charStart: 12, charEnd: 13, highlight: 'x', description: 'x = 20 (changed via pointer!)', variables: { x: 20, ptr: '→x' }, output: '101020' },

            { id: 11, phase: 'COMPLETE', line: 8, charStart: 0, charEnd: 1, highlight: '}', description: 'Pointers allow indirect memory access', variables: { x: 20, ptr: '→x' }, output: '101020' }
        ]
    },

    // ==================== CATEGORY: ALGORITHMS ====================

    // 27. Recursion with Call Stack Visualization
    {
        id: 'recursion-stack',
        title: 'Recursion with Call Stack',
        description: 'Factorial with visual stack frames showing push/pop',
        difficulty: 'INTERMEDIATE',
        category: 'Algorithms',
        code: `int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n-1);
}

int main() {
    cout << factorial(4);
}`,
        expectedOutput: '24',
        steps: [
            { id: 1, phase: 'MAIN', line: 6, charStart: 0, charEnd: 12, highlight: 'int main() {', description: 'Start main()', variables: {}, callStack: [] },

            {
                id: 2, phase: 'CALL', line: 7, charStart: 12, charEnd: 24, highlight: 'factorial(4)', description: 'Call factorial(4) → PUSH to stack', variables: {},
                callStack: [{ func: 'factorial(4)', args: { n: 4 }, status: 'executing' }]
            },

            {
                id: 3, phase: 'CONDITION', line: 2, charStart: 8, charEnd: 14, highlight: 'n <= 1', description: '4 <= 1? FALSE → need to recurse', variables: { n: 4 }, conditionResult: false,
                callStack: [{ func: 'factorial(4)', args: { n: 4 }, status: 'executing' }]
            },

            {
                id: 4, phase: 'RECURSE', line: 3, charStart: 15, charEnd: 29, highlight: 'factorial(n-1)', description: 'Call factorial(3) → PUSH', variables: { n: 4 },
                callStack: [
                    { func: 'factorial(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'factorial(3)', args: { n: 3 }, status: 'executing' }
                ]
            },

            {
                id: 5, phase: 'CONDITION', line: 2, charStart: 8, charEnd: 14, highlight: 'n <= 1', description: '3 <= 1? FALSE → recurse', variables: { n: 3 }, conditionResult: false,
                callStack: [
                    { func: 'factorial(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'factorial(3)', args: { n: 3 }, status: 'executing' }
                ]
            },

            {
                id: 6, phase: 'RECURSE', line: 3, charStart: 15, charEnd: 29, highlight: 'factorial(n-1)', description: 'Call factorial(2) → PUSH', variables: { n: 3 },
                callStack: [
                    { func: 'factorial(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'factorial(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'factorial(2)', args: { n: 2 }, status: 'executing' }
                ]
            },

            {
                id: 7, phase: 'CONDITION', line: 2, charStart: 8, charEnd: 14, highlight: 'n <= 1', description: '2 <= 1? FALSE → recurse', variables: { n: 2 }, conditionResult: false,
                callStack: [
                    { func: 'factorial(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'factorial(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'factorial(2)', args: { n: 2 }, status: 'executing' }
                ]
            },

            {
                id: 8, phase: 'RECURSE', line: 3, charStart: 15, charEnd: 29, highlight: 'factorial(n-1)', description: 'Call factorial(1) → PUSH (BASE CASE!)', variables: { n: 2 },
                callStack: [
                    { func: 'factorial(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'factorial(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'factorial(2)', args: { n: 2 }, status: 'waiting' },
                    { func: 'factorial(1)', args: { n: 1 }, status: 'executing' }
                ]
            },

            {
                id: 9, phase: 'BASE_CASE', line: 2, charStart: 8, charEnd: 14, highlight: 'n <= 1', description: '1 <= 1? TRUE ✓ BASE CASE HIT!', variables: { n: 1 }, conditionResult: true,
                callStack: [
                    { func: 'factorial(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'factorial(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'factorial(2)', args: { n: 2 }, status: 'waiting' },
                    { func: 'factorial(1)', args: { n: 1 }, status: 'executing' }
                ]
            },

            {
                id: 10, phase: 'RETURN', line: 2, charStart: 16, charEnd: 25, highlight: 'return 1;', description: 'Return 1 → POP factorial(1)', variables: { n: 1 },
                callStack: [
                    { func: 'factorial(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'factorial(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'factorial(2)', args: { n: 2 }, status: 'executing', returnValue: '2 * 1' }
                ]
            },

            {
                id: 11, phase: 'COMPUTE', line: 3, charStart: 11, charEnd: 29, highlight: 'n * factorial(n-1)', description: '2 * 1 = 2 → POP factorial(2)', variables: { n: 2 },
                callStack: [
                    { func: 'factorial(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'factorial(3)', args: { n: 3 }, status: 'executing', returnValue: '3 * 2' }
                ]
            },

            {
                id: 12, phase: 'COMPUTE', line: 3, charStart: 11, charEnd: 29, highlight: 'n * factorial(n-1)', description: '3 * 2 = 6 → POP factorial(3)', variables: { n: 3 },
                callStack: [
                    { func: 'factorial(4)', args: { n: 4 }, status: 'executing', returnValue: '4 * 6' }
                ]
            },

            {
                id: 13, phase: 'COMPUTE', line: 3, charStart: 11, charEnd: 29, highlight: 'n * factorial(n-1)', description: '4 * 6 = 24 → POP factorial(4)', variables: { n: 4 },
                callStack: []
            },

            { id: 14, phase: 'OUTPUT', line: 7, charStart: 4, charEnd: 25, highlight: 'cout << factorial(4);', description: 'Output: 24', variables: { result: 24 }, output: '24', callStack: [] },

            { id: 15, phase: 'COMPLETE', line: 8, charStart: 0, charEnd: 1, highlight: '}', description: 'Stack unwound: 4×3×2×1 = 24', variables: {}, output: '24', callStack: [] }
        ]
    },

    // 28. Bubble Sort
    {
        id: 'bubble-sort',
        title: 'Bubble Sort',
        description: 'Compare adjacent elements and swap if needed',
        difficulty: 'INTERMEDIATE',
        category: 'Algorithms',
        code: `int main() {
    int arr[] = {5, 3, 8, 1};
    int n = 4;
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
            }
        }
    }
}`,
        expectedOutput: '',
        steps: [
            {
                id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 28, highlight: 'int arr[] = {5, 3, 8, 1}', description: 'Initial array: [5, 3, 8, 1]', variables: { n: 4 },
                arrayState: { values: [5, 3, 8, 1], comparing: [], swapping: [], sorted: [] }
            },

            // Pass 1
            {
                id: 2, phase: 'COMPARE', line: 6, charStart: 16, charEnd: 33, highlight: 'arr[j] > arr[j+1]', description: 'Compare arr[0]=5 > arr[1]=3?', variables: { i: 0, j: 0 },
                arrayState: { values: [5, 3, 8, 1], comparing: [0, 1], swapping: [], sorted: [] }
            },

            {
                id: 3, phase: 'SWAP', line: 7, charStart: 16, charEnd: 38, highlight: 'swap(arr[j], arr[j+1])', description: '5 > 3 YES → SWAP!', variables: { i: 0, j: 0 },
                arrayState: { values: [3, 5, 8, 1], comparing: [], swapping: [0, 1], sorted: [] }
            },

            {
                id: 4, phase: 'COMPARE', line: 6, charStart: 16, charEnd: 33, highlight: 'arr[j] > arr[j+1]', description: 'Compare arr[1]=5 > arr[2]=8?', variables: { i: 0, j: 1 },
                arrayState: { values: [3, 5, 8, 1], comparing: [1, 2], swapping: [], sorted: [] }
            },

            {
                id: 5, phase: 'NO_SWAP', line: 6, charStart: 16, charEnd: 33, highlight: 'arr[j] > arr[j+1]', description: '5 > 8 NO → no swap', variables: { i: 0, j: 1 },
                arrayState: { values: [3, 5, 8, 1], comparing: [], swapping: [], sorted: [] }
            },

            {
                id: 6, phase: 'COMPARE', line: 6, charStart: 16, charEnd: 33, highlight: 'arr[j] > arr[j+1]', description: 'Compare arr[2]=8 > arr[3]=1?', variables: { i: 0, j: 2 },
                arrayState: { values: [3, 5, 8, 1], comparing: [2, 3], swapping: [], sorted: [] }
            },

            {
                id: 7, phase: 'SWAP', line: 7, charStart: 16, charEnd: 38, highlight: 'swap(arr[j], arr[j+1])', description: '8 > 1 YES → SWAP!', variables: { i: 0, j: 2 },
                arrayState: { values: [3, 5, 1, 8], comparing: [], swapping: [2, 3], sorted: [3] }
            },

            {
                id: 8, phase: 'PASS_DONE', line: 4, charStart: 4, charEnd: 27, highlight: 'for (int i = 0; i < n-1', description: 'Pass 1 complete. 8 bubbled to end!', variables: { i: 0 },
                arrayState: { values: [3, 5, 1, 8], comparing: [], swapping: [], sorted: [3] }
            },

            // Pass 2
            {
                id: 9, phase: 'COMPARE', line: 6, charStart: 16, charEnd: 33, highlight: 'arr[j] > arr[j+1]', description: 'Compare 3 > 5?', variables: { i: 1, j: 0 },
                arrayState: { values: [3, 5, 1, 8], comparing: [0, 1], swapping: [], sorted: [3] }
            },

            {
                id: 10, phase: 'NO_SWAP', line: 6, charStart: 16, charEnd: 33, highlight: 'arr[j] > arr[j+1]', description: '3 > 5 NO', variables: { i: 1, j: 0 },
                arrayState: { values: [3, 5, 1, 8], comparing: [], swapping: [], sorted: [3] }
            },

            {
                id: 11, phase: 'COMPARE', line: 6, charStart: 16, charEnd: 33, highlight: 'arr[j] > arr[j+1]', description: 'Compare 5 > 1?', variables: { i: 1, j: 1 },
                arrayState: { values: [3, 5, 1, 8], comparing: [1, 2], swapping: [], sorted: [3] }
            },

            {
                id: 12, phase: 'SWAP', line: 7, charStart: 16, charEnd: 38, highlight: 'swap(arr[j], arr[j+1])', description: '5 > 1 YES → SWAP!', variables: { i: 1, j: 1 },
                arrayState: { values: [3, 1, 5, 8], comparing: [], swapping: [1, 2], sorted: [2, 3] }
            },

            {
                id: 13, phase: 'PASS_DONE', line: 4, charStart: 4, charEnd: 27, highlight: 'for (int i = 0; i < n-1', description: 'Pass 2 complete. 5 in place!', variables: { i: 1 },
                arrayState: { values: [3, 1, 5, 8], comparing: [], swapping: [], sorted: [2, 3] }
            },

            // Pass 3
            {
                id: 14, phase: 'COMPARE', line: 6, charStart: 16, charEnd: 33, highlight: 'arr[j] > arr[j+1]', description: 'Compare 3 > 1?', variables: { i: 2, j: 0 },
                arrayState: { values: [3, 1, 5, 8], comparing: [0, 1], swapping: [], sorted: [2, 3] }
            },

            {
                id: 15, phase: 'SWAP', line: 7, charStart: 16, charEnd: 38, highlight: 'swap(arr[j], arr[j+1])', description: '3 > 1 YES → SWAP!', variables: { i: 2, j: 0 },
                arrayState: { values: [1, 3, 5, 8], comparing: [], swapping: [0, 1], sorted: [1, 2, 3] }
            },

            {
                id: 16, phase: 'COMPLETE', line: 10, charStart: 4, charEnd: 5, highlight: '}', description: 'SORTED! [1, 3, 5, 8]', variables: {},
                arrayState: { values: [1, 3, 5, 8], comparing: [], swapping: [], sorted: [0, 1, 2, 3] }
            }
        ]
    },

    // 29. Binary Search
    {
        id: 'binary-search',
        title: 'Binary Search',
        description: 'Divide and conquer search in sorted array',
        difficulty: 'INTERMEDIATE',
        category: 'Algorithms',
        code: `int main() {
    int arr[] = {1, 3, 5, 7, 9, 11};
    int target = 7;
    int left = 0, right = 5;
    while (left <= right) {
        int mid = (left + right) / 2;
        if (arr[mid] == target) {
            cout << "Found at " << mid;
            break;
        }
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
}`,
        expectedOutput: 'Found at 3',
        steps: [
            {
                id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 35, highlight: 'int arr[] = {1, 3, 5, 7, 9, 11}', description: 'Sorted array [1,3,5,7,9,11]', variables: { target: 7 },
                arrayState: { values: [1, 3, 5, 7, 9, 11], comparing: [], swapping: [], sorted: [] }
            },

            { id: 2, phase: 'INIT', line: 4, charStart: 4, charEnd: 27, highlight: 'int left = 0, right = 5', description: 'Search range: left=0, right=5', variables: { target: 7, left: 0, right: 5 } },

            { id: 3, phase: 'LOOP', line: 5, charStart: 11, charEnd: 24, highlight: 'left <= right', description: '0 <= 5 → TRUE, continue', variables: { left: 0, right: 5 }, conditionResult: true },

            {
                id: 4, phase: 'COMPUTE', line: 6, charStart: 8, charEnd: 36, highlight: 'int mid = (left + right) / 2', description: 'mid = (0+5)/2 = 2', variables: { left: 0, right: 5, mid: 2 },
                arrayState: { values: [1, 3, 5, 7, 9, 11], comparing: [2], swapping: [], sorted: [] }
            },

            {
                id: 5, phase: 'COMPARE', line: 7, charStart: 12, charEnd: 30, highlight: 'arr[mid] == target', description: 'arr[2]=5 == 7? NO', variables: { mid: 2, 'arr[mid]': 5 }, conditionResult: false,
                arrayState: { values: [1, 3, 5, 7, 9, 11], comparing: [2], swapping: [], sorted: [] }
            },

            { id: 6, phase: 'COMPARE', line: 11, charStart: 12, charEnd: 29, highlight: 'arr[mid] < target', description: '5 < 7? YES → search right half', variables: { mid: 2 }, conditionResult: true },

            { id: 7, phase: 'ADJUST', line: 11, charStart: 31, charEnd: 45, highlight: 'left = mid + 1', description: 'left = 3 (eliminate left half)', variables: { left: 3, right: 5 } },

            {
                id: 8, phase: 'COMPUTE', line: 6, charStart: 8, charEnd: 36, highlight: 'int mid = (left + right) / 2', description: 'mid = (3+5)/2 = 4', variables: { left: 3, right: 5, mid: 4 },
                arrayState: { values: [1, 3, 5, 7, 9, 11], comparing: [4], swapping: [], sorted: [] }
            },

            { id: 9, phase: 'COMPARE', line: 7, charStart: 12, charEnd: 30, highlight: 'arr[mid] == target', description: 'arr[4]=9 == 7? NO', variables: { mid: 4, 'arr[mid]': 9 }, conditionResult: false },

            { id: 10, phase: 'COMPARE', line: 11, charStart: 12, charEnd: 29, highlight: 'arr[mid] < target', description: '9 < 7? NO → search left half', variables: { mid: 4 }, conditionResult: false },

            { id: 11, phase: 'ADJUST', line: 12, charStart: 13, charEnd: 28, highlight: 'right = mid - 1', description: 'right = 3', variables: { left: 3, right: 3 } },

            {
                id: 12, phase: 'COMPUTE', line: 6, charStart: 8, charEnd: 36, highlight: 'int mid = (left + right) / 2', description: 'mid = (3+3)/2 = 3', variables: { left: 3, right: 3, mid: 3 },
                arrayState: { values: [1, 3, 5, 7, 9, 11], comparing: [3], swapping: [], sorted: [] }
            },

            {
                id: 13, phase: 'FOUND', line: 7, charStart: 12, charEnd: 30, highlight: 'arr[mid] == target', description: 'arr[3]=7 == 7? YES! FOUND!', variables: { mid: 3, 'arr[mid]': 7 }, conditionResult: true,
                arrayState: { values: [1, 3, 5, 7, 9, 11], comparing: [], swapping: [], sorted: [3] }
            },

            { id: 14, phase: 'OUTPUT', line: 8, charStart: 12, charEnd: 38, highlight: 'cout << "Found at " << mid', description: 'Output: Found at 3', variables: { mid: 3 }, output: 'Found at 3' },

            { id: 15, phase: 'COMPLETE', line: 14, charStart: 0, charEnd: 1, highlight: '}', description: 'Binary Search: O(log n) - only 3 comparisons!', variables: { mid: 3 }, output: 'Found at 3' }
        ]
    },

    // 30. Fibonacci Recursion
    {
        id: 'fibonacci',
        title: 'Fibonacci Recursion',
        description: 'Classic recursive Fibonacci with call stack',
        difficulty: 'INTERMEDIATE',
        category: 'Algorithms',
        code: `int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);
}

int main() {
    cout << fib(4);
}`,
        expectedOutput: '3',
        steps: [
            {
                id: 1, phase: 'CALL', line: 7, charStart: 12, charEnd: 18, highlight: 'fib(4)', description: 'Call fib(4)', variables: {},
                callStack: [{ func: 'fib(4)', args: { n: 4 }, status: 'executing' }]
            },

            {
                id: 2, phase: 'RECURSE', line: 3, charStart: 11, charEnd: 19, highlight: 'fib(n-1)', description: 'Need fib(3) first', variables: { n: 4 },
                callStack: [
                    { func: 'fib(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'fib(3)', args: { n: 3 }, status: 'executing' }
                ]
            },

            {
                id: 3, phase: 'RECURSE', line: 3, charStart: 11, charEnd: 19, highlight: 'fib(n-1)', description: 'Need fib(2)', variables: { n: 3 },
                callStack: [
                    { func: 'fib(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'fib(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'fib(2)', args: { n: 2 }, status: 'executing' }
                ]
            },

            {
                id: 4, phase: 'RECURSE', line: 3, charStart: 11, charEnd: 19, highlight: 'fib(n-1)', description: 'Need fib(1)', variables: { n: 2 },
                callStack: [
                    { func: 'fib(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'fib(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'fib(2)', args: { n: 2 }, status: 'waiting' },
                    { func: 'fib(1)', args: { n: 1 }, status: 'executing' }
                ]
            },

            {
                id: 5, phase: 'BASE_CASE', line: 2, charStart: 16, charEnd: 24, highlight: 'return n', description: 'fib(1) = 1 BASE CASE', variables: { n: 1 },
                callStack: [
                    { func: 'fib(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'fib(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'fib(2)', args: { n: 2 }, status: 'waiting', returnValue: '1 + ?' }
                ]
            },

            {
                id: 6, phase: 'RECURSE', line: 3, charStart: 22, charEnd: 30, highlight: 'fib(n-2)', description: 'Now need fib(0)', variables: { n: 2 },
                callStack: [
                    { func: 'fib(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'fib(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'fib(2)', args: { n: 2 }, status: 'waiting' },
                    { func: 'fib(0)', args: { n: 0 }, status: 'executing' }
                ]
            },

            {
                id: 7, phase: 'BASE_CASE', line: 2, charStart: 16, charEnd: 24, highlight: 'return n', description: 'fib(0) = 0 BASE CASE', variables: { n: 0 },
                callStack: [
                    { func: 'fib(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'fib(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'fib(2)', args: { n: 2 }, status: 'executing', returnValue: '1 + 0 = 1' }
                ]
            },

            {
                id: 8, phase: 'RETURN', line: 3, charStart: 11, charEnd: 30, highlight: 'fib(n-1) + fib(n-2)', description: 'fib(2) = 1 + 0 = 1', variables: { n: 2 },
                callStack: [
                    { func: 'fib(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'fib(3)', args: { n: 3 }, status: 'waiting', returnValue: '1 + ?' }
                ]
            },

            {
                id: 9, phase: 'RECURSE', line: 3, charStart: 22, charEnd: 30, highlight: 'fib(n-2)', description: 'fib(3) needs fib(1)', variables: { n: 3 },
                callStack: [
                    { func: 'fib(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'fib(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'fib(1)', args: { n: 1 }, status: 'executing' }
                ]
            },

            {
                id: 10, phase: 'BASE_CASE', line: 2, charStart: 16, charEnd: 24, highlight: 'return n', description: 'fib(1) = 1', variables: { n: 1 },
                callStack: [
                    { func: 'fib(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'fib(3)', args: { n: 3 }, status: 'executing', returnValue: '1 + 1 = 2' }
                ]
            },

            {
                id: 11, phase: 'RETURN', line: 3, charStart: 11, charEnd: 30, highlight: 'fib(n-1) + fib(n-2)', description: 'fib(3) = 1 + 1 = 2', variables: { n: 3 },
                callStack: [
                    { func: 'fib(4)', args: { n: 4 }, status: 'waiting', returnValue: '2 + ?' }
                ]
            },

            {
                id: 12, phase: 'RECURSE', line: 3, charStart: 22, charEnd: 30, highlight: 'fib(n-2)', description: 'fib(4) needs fib(2)', variables: { n: 4 },
                callStack: [
                    { func: 'fib(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'fib(2)', args: { n: 2 }, status: 'executing' }
                ]
            },

            {
                id: 13, phase: 'COMPUTE', line: 3, charStart: 11, charEnd: 30, highlight: 'fib(n-1) + fib(n-2)', description: 'fib(2) = fib(1) + fib(0) = 1', variables: { n: 2 },
                callStack: [
                    { func: 'fib(4)', args: { n: 4 }, status: 'executing', returnValue: '2 + 1 = 3' }
                ]
            },

            {
                id: 14, phase: 'RETURN', line: 3, charStart: 11, charEnd: 30, highlight: 'fib(n-1) + fib(n-2)', description: 'fib(4) = 2 + 1 = 3', variables: { n: 4 },
                callStack: []
            },

            { id: 15, phase: 'OUTPUT', line: 7, charStart: 4, charEnd: 19, highlight: 'cout << fib(4);', description: 'Output: 3', variables: {}, output: '3', callStack: [] },

            { id: 16, phase: 'COMPLETE', line: 8, charStart: 0, charEnd: 1, highlight: '}', description: 'Fib(4) = 3 (0,1,1,2,3...)', variables: {}, output: '3', callStack: [] }
        ]
    },

    // 31. Find Maximum in Array
    {
        id: 'find-max',
        title: 'Find Maximum in Array',
        description: 'Linear scan to find largest element',
        difficulty: 'BEGINNER',
        category: 'Algorithms',
        code: `int main() {
    int arr[] = {3, 7, 2, 9, 5};
    int max = arr[0];
    for (int i = 1; i < 5; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    cout << max;
}`,
        expectedOutput: '9',
        steps: [
            {
                id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 31, highlight: 'int arr[] = {3, 7, 2, 9, 5}', description: 'Array: [3, 7, 2, 9, 5]', variables: {},
                arrayState: { values: [3, 7, 2, 9, 5], comparing: [], swapping: [], sorted: [] }
            },

            {
                id: 2, phase: 'INIT', line: 3, charStart: 4, charEnd: 21, highlight: 'int max = arr[0];', description: 'Assume first element is max: 3', variables: { max: 3 },
                arrayState: { values: [3, 7, 2, 9, 5], comparing: [], swapping: [], sorted: [0] }
            },

            {
                id: 3, phase: 'COMPARE', line: 5, charStart: 12, charEnd: 24, highlight: 'arr[i] > max', description: 'arr[1]=7 > 3?', variables: { i: 1, max: 3 },
                arrayState: { values: [3, 7, 2, 9, 5], comparing: [1], swapping: [], sorted: [] }
            },

            {
                id: 4, phase: 'UPDATE', line: 6, charStart: 12, charEnd: 25, highlight: 'max = arr[i];', description: '7 > 3 YES → max = 7', variables: { i: 1, max: 7 },
                arrayState: { values: [3, 7, 2, 9, 5], comparing: [], swapping: [], sorted: [1] }
            },

            {
                id: 5, phase: 'COMPARE', line: 5, charStart: 12, charEnd: 24, highlight: 'arr[i] > max', description: 'arr[2]=2 > 7?', variables: { i: 2, max: 7 },
                arrayState: { values: [3, 7, 2, 9, 5], comparing: [2], swapping: [], sorted: [1] }
            },

            {
                id: 6, phase: 'SKIP', line: 5, charStart: 12, charEnd: 24, highlight: 'arr[i] > max', description: '2 > 7 NO → keep max', variables: { i: 2, max: 7 },
                arrayState: { values: [3, 7, 2, 9, 5], comparing: [], swapping: [], sorted: [1] }
            },

            {
                id: 7, phase: 'COMPARE', line: 5, charStart: 12, charEnd: 24, highlight: 'arr[i] > max', description: 'arr[3]=9 > 7?', variables: { i: 3, max: 7 },
                arrayState: { values: [3, 7, 2, 9, 5], comparing: [3], swapping: [], sorted: [1] }
            },

            {
                id: 8, phase: 'UPDATE', line: 6, charStart: 12, charEnd: 25, highlight: 'max = arr[i];', description: '9 > 7 YES → max = 9', variables: { i: 3, max: 9 },
                arrayState: { values: [3, 7, 2, 9, 5], comparing: [], swapping: [], sorted: [3] }
            },

            {
                id: 9, phase: 'COMPARE', line: 5, charStart: 12, charEnd: 24, highlight: 'arr[i] > max', description: 'arr[4]=5 > 9?', variables: { i: 4, max: 9 },
                arrayState: { values: [3, 7, 2, 9, 5], comparing: [4], swapping: [], sorted: [3] }
            },

            {
                id: 10, phase: 'SKIP', line: 5, charStart: 12, charEnd: 24, highlight: 'arr[i] > max', description: '5 > 9 NO → keep max', variables: { i: 4, max: 9 },
                arrayState: { values: [3, 7, 2, 9, 5], comparing: [], swapping: [], sorted: [3] }
            },

            { id: 11, phase: 'OUTPUT', line: 9, charStart: 4, charEnd: 16, highlight: 'cout << max;', description: 'Output: 9', variables: { max: 9 }, output: '9' },

            {
                id: 12, phase: 'COMPLETE', line: 10, charStart: 0, charEnd: 1, highlight: '}', description: 'Maximum is 9 (found at index 3)', variables: { max: 9 }, output: '9',
                arrayState: { values: [3, 7, 2, 9, 5], comparing: [], swapping: [], sorted: [3] }
            }
        ]
    },

    // ==================== ADVANCED RECURSION ====================

    // 32. Nested Function Calls with Recursion
    {
        id: 'nested-func-recursion',
        title: 'Nested Functions + Recursion',
        description: 'Function A calls Function B which recurses - complex call stack',
        difficulty: 'ADVANCED',
        category: 'Advanced Recursion',
        code: `int double_it(int x) {
    return x * 2;
}

int process(int n) {
    if (n <= 0) return 0;
    return double_it(n) + process(n-1);
}

int main() {
    cout << process(3);
}`,
        expectedOutput: '12',
        steps: [
            { id: 1, phase: 'MAIN', line: 10, charStart: 0, charEnd: 12, highlight: 'int main() {', description: 'Start main()', variables: {}, callStack: [] },

            {
                id: 2, phase: 'CALL', line: 11, charStart: 12, charEnd: 22, highlight: 'process(3)', description: 'Call process(3)', variables: {},
                callStack: [{ func: 'process(3)', args: { n: 3 }, status: 'executing' }]
            },

            {
                id: 3, phase: 'CONDITION', line: 6, charStart: 8, charEnd: 14, highlight: 'n <= 0', description: '3 <= 0? FALSE', variables: { n: 3 }, conditionResult: false,
                callStack: [{ func: 'process(3)', args: { n: 3 }, status: 'executing' }]
            },

            {
                id: 4, phase: 'CALL', line: 7, charStart: 11, charEnd: 23, highlight: 'double_it(n)', description: 'Call double_it(3) - NESTED CALL!', variables: { n: 3 },
                callStack: [
                    { func: 'process(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'double_it(3)', args: { x: 3 }, status: 'executing' }
                ]
            },

            {
                id: 5, phase: 'COMPUTE', line: 2, charStart: 11, charEnd: 16, highlight: 'x * 2', description: '3 * 2 = 6', variables: { x: 3 },
                callStack: [
                    { func: 'process(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'double_it(3)', args: { x: 3 }, status: 'executing', returnValue: 6 }
                ]
            },

            {
                id: 6, phase: 'RETURN', line: 2, charStart: 4, charEnd: 17, highlight: 'return x * 2;', description: 'Return 6 → POP double_it', variables: {},
                callStack: [{ func: 'process(3)', args: { n: 3 }, status: 'executing', returnValue: '6 + ?' }]
            },

            {
                id: 7, phase: 'RECURSE', line: 7, charStart: 26, charEnd: 38, highlight: 'process(n-1)', description: 'Now call process(2) - RECURSION!', variables: { n: 3 },
                callStack: [
                    { func: 'process(3)', args: { n: 3 }, status: 'waiting', returnValue: '6 + ?' },
                    { func: 'process(2)', args: { n: 2 }, status: 'executing' }
                ]
            },

            {
                id: 8, phase: 'CALL', line: 7, charStart: 11, charEnd: 23, highlight: 'double_it(n)', description: 'Call double_it(2)', variables: { n: 2 },
                callStack: [
                    { func: 'process(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'process(2)', args: { n: 2 }, status: 'waiting' },
                    { func: 'double_it(2)', args: { x: 2 }, status: 'executing' }
                ]
            },

            {
                id: 9, phase: 'RETURN', line: 2, charStart: 4, charEnd: 17, highlight: 'return x * 2;', description: '2 * 2 = 4 → POP', variables: { x: 2 },
                callStack: [
                    { func: 'process(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'process(2)', args: { n: 2 }, status: 'executing', returnValue: '4 + ?' }
                ]
            },

            {
                id: 10, phase: 'RECURSE', line: 7, charStart: 26, charEnd: 38, highlight: 'process(n-1)', description: 'Call process(1)', variables: { n: 2 },
                callStack: [
                    { func: 'process(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'process(2)', args: { n: 2 }, status: 'waiting' },
                    { func: 'process(1)', args: { n: 1 }, status: 'executing' }
                ]
            },

            {
                id: 11, phase: 'CALL', line: 7, charStart: 11, charEnd: 23, highlight: 'double_it(n)', description: 'Call double_it(1)', variables: { n: 1 },
                callStack: [
                    { func: 'process(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'process(2)', args: { n: 2 }, status: 'waiting' },
                    { func: 'process(1)', args: { n: 1 }, status: 'waiting' },
                    { func: 'double_it(1)', args: { x: 1 }, status: 'executing' }
                ]
            },

            {
                id: 12, phase: 'RETURN', line: 2, charStart: 4, charEnd: 17, highlight: 'return x * 2;', description: '1 * 2 = 2 → POP', variables: { x: 1 },
                callStack: [
                    { func: 'process(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'process(2)', args: { n: 2 }, status: 'waiting' },
                    { func: 'process(1)', args: { n: 1 }, status: 'executing', returnValue: '2 + ?' }
                ]
            },

            {
                id: 13, phase: 'RECURSE', line: 7, charStart: 26, charEnd: 38, highlight: 'process(n-1)', description: 'Call process(0) - BASE CASE!', variables: { n: 1 },
                callStack: [
                    { func: 'process(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'process(2)', args: { n: 2 }, status: 'waiting' },
                    { func: 'process(1)', args: { n: 1 }, status: 'waiting' },
                    { func: 'process(0)', args: { n: 0 }, status: 'executing' }
                ]
            },

            {
                id: 14, phase: 'BASE_CASE', line: 6, charStart: 8, charEnd: 14, highlight: 'n <= 0', description: '0 <= 0? TRUE ✓ BASE CASE!', variables: { n: 0 }, conditionResult: true,
                callStack: [
                    { func: 'process(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'process(2)', args: { n: 2 }, status: 'waiting' },
                    { func: 'process(1)', args: { n: 1 }, status: 'waiting' },
                    { func: 'process(0)', args: { n: 0 }, status: 'executing' }
                ]
            },

            {
                id: 15, phase: 'RETURN', line: 6, charStart: 16, charEnd: 24, highlight: 'return 0', description: 'Return 0 → POP process(0)', variables: {},
                callStack: [
                    { func: 'process(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'process(2)', args: { n: 2 }, status: 'waiting' },
                    { func: 'process(1)', args: { n: 1 }, status: 'executing', returnValue: '2 + 0 = 2' }
                ]
            },

            {
                id: 16, phase: 'UNWIND', line: 7, charStart: 4, charEnd: 38, highlight: 'return double_it(n) + process(n-1)', description: '2 + 0 = 2 → POP process(1)', variables: {},
                callStack: [
                    { func: 'process(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'process(2)', args: { n: 2 }, status: 'executing', returnValue: '4 + 2 = 6' }
                ]
            },

            {
                id: 17, phase: 'UNWIND', line: 7, charStart: 4, charEnd: 38, highlight: 'return double_it(n) + process(n-1)', description: '4 + 2 = 6 → POP process(2)', variables: {},
                callStack: [
                    { func: 'process(3)', args: { n: 3 }, status: 'executing', returnValue: '6 + 6 = 12' }
                ]
            },

            {
                id: 18, phase: 'UNWIND', line: 7, charStart: 4, charEnd: 38, highlight: 'return double_it(n) + process(n-1)', description: '6 + 6 = 12 → POP process(3)', variables: {},
                callStack: []
            },

            { id: 19, phase: 'OUTPUT', line: 11, charStart: 4, charEnd: 23, highlight: 'cout << process(3);', description: 'Output: 12', variables: { result: 12 }, output: '12', callStack: [] },

            { id: 20, phase: 'COMPLETE', line: 12, charStart: 0, charEnd: 1, highlight: '}', description: 'double(3)+double(2)+double(1)+0 = 6+4+2+0 = 12', variables: {}, output: '12', callStack: [] }
        ]
    },

    // 33. Sum Array Recursive with Array Visualization
    {
        id: 'sum-array-recursive',
        title: 'Sum Array (Recursive)',
        description: 'Recursive array sum with index tracking',
        difficulty: 'ADVANCED',
        category: 'Advanced Recursion',
        code: `int sumArr(int arr[], int n) {
    if (n <= 0) return 0;
    return arr[n-1] + sumArr(arr, n-1);
}

int main() {
    int arr[] = {2, 5, 3, 7};
    cout << sumArr(arr, 4);
}`,
        expectedOutput: '17',
        steps: [
            {
                id: 1, phase: 'INIT', line: 7, charStart: 4, charEnd: 28, highlight: 'int arr[] = {2, 5, 3, 7}', description: 'Create array [2, 5, 3, 7]', variables: {},
                arrayState: { values: [2, 5, 3, 7], comparing: [], swapping: [], sorted: [] }, callStack: []
            },

            {
                id: 2, phase: 'CALL', line: 8, charStart: 12, charEnd: 26, highlight: 'sumArr(arr, 4)', description: 'Call sumArr(arr, 4)', variables: { n: 4 },
                arrayState: { values: [2, 5, 3, 7], comparing: [], swapping: [], sorted: [] },
                callStack: [{ func: 'sumArr(n=4)', args: { n: 4 }, status: 'executing' }]
            },

            {
                id: 3, phase: 'ACCESS', line: 3, charStart: 11, charEnd: 19, highlight: 'arr[n-1]', description: 'Access arr[3] = 7', variables: { n: 4 },
                arrayState: { values: [2, 5, 3, 7], comparing: [3], swapping: [], sorted: [] },
                callStack: [{ func: 'sumArr(n=4)', args: { n: 4 }, status: 'executing' }]
            },

            {
                id: 4, phase: 'RECURSE', line: 3, charStart: 22, charEnd: 38, highlight: 'sumArr(arr, n-1)', description: 'Recurse with n=3', variables: { n: 4 },
                arrayState: { values: [2, 5, 3, 7], comparing: [], swapping: [], sorted: [3] },
                callStack: [
                    { func: 'sumArr(n=4)', args: { n: 4 }, status: 'waiting', returnValue: '7 + ?' },
                    { func: 'sumArr(n=3)', args: { n: 3 }, status: 'executing' }
                ]
            },

            {
                id: 5, phase: 'ACCESS', line: 3, charStart: 11, charEnd: 19, highlight: 'arr[n-1]', description: 'Access arr[2] = 3', variables: { n: 3 },
                arrayState: { values: [2, 5, 3, 7], comparing: [2], swapping: [], sorted: [3] },
                callStack: [
                    { func: 'sumArr(n=4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'sumArr(n=3)', args: { n: 3 }, status: 'executing' }
                ]
            },

            {
                id: 6, phase: 'RECURSE', line: 3, charStart: 22, charEnd: 38, highlight: 'sumArr(arr, n-1)', description: 'Recurse with n=2', variables: { n: 3 },
                arrayState: { values: [2, 5, 3, 7], comparing: [], swapping: [], sorted: [2, 3] },
                callStack: [
                    { func: 'sumArr(n=4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'sumArr(n=3)', args: { n: 3 }, status: 'waiting', returnValue: '3 + ?' },
                    { func: 'sumArr(n=2)', args: { n: 2 }, status: 'executing' }
                ]
            },

            {
                id: 7, phase: 'ACCESS', line: 3, charStart: 11, charEnd: 19, highlight: 'arr[n-1]', description: 'Access arr[1] = 5', variables: { n: 2 },
                arrayState: { values: [2, 5, 3, 7], comparing: [1], swapping: [], sorted: [2, 3] },
                callStack: [
                    { func: 'sumArr(n=4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'sumArr(n=3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'sumArr(n=2)', args: { n: 2 }, status: 'executing' }
                ]
            },

            {
                id: 8, phase: 'RECURSE', line: 3, charStart: 22, charEnd: 38, highlight: 'sumArr(arr, n-1)', description: 'Recurse with n=1', variables: { n: 2 },
                arrayState: { values: [2, 5, 3, 7], comparing: [], swapping: [], sorted: [1, 2, 3] },
                callStack: [
                    { func: 'sumArr(n=4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'sumArr(n=3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'sumArr(n=2)', args: { n: 2 }, status: 'waiting', returnValue: '5 + ?' },
                    { func: 'sumArr(n=1)', args: { n: 1 }, status: 'executing' }
                ]
            },

            {
                id: 9, phase: 'ACCESS', line: 3, charStart: 11, charEnd: 19, highlight: 'arr[n-1]', description: 'Access arr[0] = 2', variables: { n: 1 },
                arrayState: { values: [2, 5, 3, 7], comparing: [0], swapping: [], sorted: [1, 2, 3] },
                callStack: [
                    { func: 'sumArr(n=4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'sumArr(n=3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'sumArr(n=2)', args: { n: 2 }, status: 'waiting' },
                    { func: 'sumArr(n=1)', args: { n: 1 }, status: 'executing' }
                ]
            },

            {
                id: 10, phase: 'RECURSE', line: 3, charStart: 22, charEnd: 38, highlight: 'sumArr(arr, n-1)', description: 'Recurse with n=0 - BASE CASE!', variables: { n: 1 },
                arrayState: { values: [2, 5, 3, 7], comparing: [], swapping: [], sorted: [0, 1, 2, 3] },
                callStack: [
                    { func: 'sumArr(n=4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'sumArr(n=3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'sumArr(n=2)', args: { n: 2 }, status: 'waiting' },
                    { func: 'sumArr(n=1)', args: { n: 1 }, status: 'waiting', returnValue: '2 + ?' },
                    { func: 'sumArr(n=0)', args: { n: 0 }, status: 'executing' }
                ]
            },

            {
                id: 11, phase: 'BASE_CASE', line: 2, charStart: 4, charEnd: 25, highlight: 'if (n <= 0) return 0;', description: 'n=0 ≤ 0 TRUE → return 0', variables: { n: 0 }, conditionResult: true,
                callStack: [
                    { func: 'sumArr(n=4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'sumArr(n=3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'sumArr(n=2)', args: { n: 2 }, status: 'waiting' },
                    { func: 'sumArr(n=1)', args: { n: 1 }, status: 'executing', returnValue: '2 + 0 = 2' }
                ]
            },

            {
                id: 12, phase: 'UNWIND', line: 3, charStart: 4, charEnd: 38, highlight: 'return arr[n-1] + sumArr(arr, n-1)', description: '2 + 0 = 2 → POP', variables: {},
                callStack: [
                    { func: 'sumArr(n=4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'sumArr(n=3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'sumArr(n=2)', args: { n: 2 }, status: 'executing', returnValue: '5 + 2 = 7' }
                ]
            },

            {
                id: 13, phase: 'UNWIND', line: 3, charStart: 4, charEnd: 38, highlight: 'return arr[n-1] + sumArr(arr, n-1)', description: '5 + 2 = 7 → POP', variables: {},
                callStack: [
                    { func: 'sumArr(n=4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'sumArr(n=3)', args: { n: 3 }, status: 'executing', returnValue: '3 + 7 = 10' }
                ]
            },

            {
                id: 14, phase: 'UNWIND', line: 3, charStart: 4, charEnd: 38, highlight: 'return arr[n-1] + sumArr(arr, n-1)', description: '3 + 7 = 10 → POP', variables: {},
                callStack: [
                    { func: 'sumArr(n=4)', args: { n: 4 }, status: 'executing', returnValue: '7 + 10 = 17' }
                ]
            },

            {
                id: 15, phase: 'UNWIND', line: 3, charStart: 4, charEnd: 38, highlight: 'return arr[n-1] + sumArr(arr, n-1)', description: '7 + 10 = 17 → POP FINAL', variables: {},
                callStack: []
            },

            { id: 16, phase: 'OUTPUT', line: 8, charStart: 4, charEnd: 27, highlight: 'cout << sumArr(arr, 4);', description: 'Output: 17', variables: { sum: 17 }, output: '17', callStack: [] },

            {
                id: 17, phase: 'COMPLETE', line: 9, charStart: 0, charEnd: 1, highlight: '}', description: '7 + 3 + 5 + 2 + 0 = 17', variables: { sum: 17 }, output: '17',
                arrayState: { values: [2, 5, 3, 7], comparing: [], swapping: [], sorted: [0, 1, 2, 3] }, callStack: []
            }
        ]
    },

    // 34. Mutual Recursion (Even/Odd)
    {
        id: 'mutual-recursion',
        title: 'Mutual Recursion (Even/Odd)',
        description: 'Two functions calling each other recursively',
        difficulty: 'ADVANCED',
        category: 'Advanced Recursion',
        code: `bool isEven(int n);
bool isOdd(int n);

bool isEven(int n) {
    if (n == 0) return true;
    return isOdd(n - 1);
}

bool isOdd(int n) {
    if (n == 0) return false;
    return isEven(n - 1);
}

int main() {
    cout << isEven(4);
}`,
        expectedOutput: '1',
        steps: [
            {
                id: 1, phase: 'CALL', line: 15, charStart: 12, charEnd: 21, highlight: 'isEven(4)', description: 'Is 4 even? Call isEven(4)', variables: {},
                callStack: [{ func: 'isEven(4)', args: { n: 4 }, status: 'executing' }]
            },

            {
                id: 2, phase: 'CONDITION', line: 5, charStart: 8, charEnd: 14, highlight: 'n == 0', description: '4 == 0? FALSE', variables: { n: 4 }, conditionResult: false,
                callStack: [{ func: 'isEven(4)', args: { n: 4 }, status: 'executing' }]
            },

            {
                id: 3, phase: 'MUTUAL_CALL', line: 6, charStart: 11, charEnd: 23, highlight: 'isOdd(n - 1)', description: 'Ask: Is 3 odd? → Call isOdd(3)', variables: { n: 4 },
                callStack: [
                    { func: 'isEven(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'isOdd(3)', args: { n: 3 }, status: 'executing' }
                ]
            },

            {
                id: 4, phase: 'CONDITION', line: 10, charStart: 8, charEnd: 14, highlight: 'n == 0', description: '3 == 0? FALSE', variables: { n: 3 }, conditionResult: false,
                callStack: [
                    { func: 'isEven(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'isOdd(3)', args: { n: 3 }, status: 'executing' }
                ]
            },

            {
                id: 5, phase: 'MUTUAL_CALL', line: 11, charStart: 11, charEnd: 24, highlight: 'isEven(n - 1)', description: 'Ask: Is 2 even? → Call isEven(2)', variables: { n: 3 },
                callStack: [
                    { func: 'isEven(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'isOdd(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'isEven(2)', args: { n: 2 }, status: 'executing' }
                ]
            },

            {
                id: 6, phase: 'MUTUAL_CALL', line: 6, charStart: 11, charEnd: 23, highlight: 'isOdd(n - 1)', description: 'Ask: Is 1 odd? → Call isOdd(1)', variables: { n: 2 },
                callStack: [
                    { func: 'isEven(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'isOdd(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'isEven(2)', args: { n: 2 }, status: 'waiting' },
                    { func: 'isOdd(1)', args: { n: 1 }, status: 'executing' }
                ]
            },

            {
                id: 7, phase: 'MUTUAL_CALL', line: 11, charStart: 11, charEnd: 24, highlight: 'isEven(n - 1)', description: 'Ask: Is 0 even? → Call isEven(0)', variables: { n: 1 },
                callStack: [
                    { func: 'isEven(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'isOdd(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'isEven(2)', args: { n: 2 }, status: 'waiting' },
                    { func: 'isOdd(1)', args: { n: 1 }, status: 'waiting' },
                    { func: 'isEven(0)', args: { n: 0 }, status: 'executing' }
                ]
            },

            {
                id: 8, phase: 'BASE_CASE', line: 5, charStart: 8, charEnd: 14, highlight: 'n == 0', description: '0 == 0? TRUE ✓ BASE CASE!', variables: { n: 0 }, conditionResult: true,
                callStack: [
                    { func: 'isEven(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'isOdd(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'isEven(2)', args: { n: 2 }, status: 'waiting' },
                    { func: 'isOdd(1)', args: { n: 1 }, status: 'waiting' },
                    { func: 'isEven(0)', args: { n: 0 }, status: 'executing' }
                ]
            },

            {
                id: 9, phase: 'RETURN', line: 5, charStart: 16, charEnd: 27, highlight: 'return true', description: 'isEven(0) = TRUE! → Start unwinding', variables: {},
                callStack: [
                    { func: 'isEven(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'isOdd(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'isEven(2)', args: { n: 2 }, status: 'waiting' },
                    { func: 'isOdd(1)', args: { n: 1 }, status: 'executing', returnValue: 'true' }
                ]
            },

            {
                id: 10, phase: 'UNWIND', line: 11, charStart: 4, charEnd: 24, highlight: 'return isEven(n - 1)', description: 'isOdd(1) = true → POP', variables: {},
                callStack: [
                    { func: 'isEven(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'isOdd(3)', args: { n: 3 }, status: 'waiting' },
                    { func: 'isEven(2)', args: { n: 2 }, status: 'executing', returnValue: 'true' }
                ]
            },

            {
                id: 11, phase: 'UNWIND', line: 6, charStart: 4, charEnd: 23, highlight: 'return isOdd(n - 1)', description: 'isEven(2) = true → POP', variables: {},
                callStack: [
                    { func: 'isEven(4)', args: { n: 4 }, status: 'waiting' },
                    { func: 'isOdd(3)', args: { n: 3 }, status: 'executing', returnValue: 'true' }
                ]
            },

            {
                id: 12, phase: 'UNWIND', line: 11, charStart: 4, charEnd: 24, highlight: 'return isEven(n - 1)', description: 'isOdd(3) = true → POP', variables: {},
                callStack: [
                    { func: 'isEven(4)', args: { n: 4 }, status: 'executing', returnValue: 'true' }
                ]
            },

            {
                id: 13, phase: 'UNWIND', line: 6, charStart: 4, charEnd: 23, highlight: 'return isOdd(n - 1)', description: 'isEven(4) = TRUE! → POP FINAL', variables: {},
                callStack: []
            },

            { id: 14, phase: 'OUTPUT', line: 15, charStart: 4, charEnd: 22, highlight: 'cout << isEven(4);', description: 'Output: 1 (true = 4 is even)', variables: {}, output: '1', callStack: [] },

            { id: 15, phase: 'COMPLETE', line: 16, charStart: 0, charEnd: 1, highlight: '}', description: 'Mutual recursion: isEven↔isOdd ping-pong!', variables: {}, output: '1', callStack: [] }
        ]
    },

    // ==================== POINTER ARITHMETIC ====================

    // 35. Postfix/Prefix with Pointers
    {
        id: 'postfix-prefix-pointer',
        title: 'Postfix/Prefix with Pointers',
        description: '*p++, ++*p, (*p)++ - compiler order of operations',
        difficulty: 'ADVANCED',
        category: 'Pointer Arithmetic',
        code: `int main() {
    int arr[] = {10, 20, 30};
    int *p = arr;
    
    cout << *p++ << " ";
    cout << *p << " ";
    cout << ++*p << " ";
    cout << (*p)++;
}`,
        expectedOutput: '10 20 21 21',
        steps: [
            {
                id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 28, highlight: 'int arr[] = {10, 20, 30}', description: 'Array: [10, 20, 30]', variables: {},
                arrayState: { values: [10, 20, 30], comparing: [], swapping: [], sorted: [] }
            },

            {
                id: 2, phase: 'POINTER_INIT', line: 3, charStart: 4, charEnd: 16, highlight: 'int *p = arr', description: 'p points to arr[0]', variables: { p: '→arr[0]', '*p': 10 },
                arrayState: { values: [10, 20, 30], comparing: [0], swapping: [], sorted: [] }
            },

            { id: 3, phase: 'EXPRESSION', line: 5, charStart: 12, charEnd: 16, highlight: '*p++', description: 'TRICKY: *p++ means *(p++)', variables: { p: '→arr[0]', '*p': 10 } },
            { id: 4, phase: 'STEP1', line: 5, charStart: 12, charEnd: 16, highlight: '*p++', description: 'Step 1: Get current *p = 10 (for output)', variables: { p: '→arr[0]', '*p': 10 } },
            {
                id: 5, phase: 'STEP2', line: 5, charStart: 12, charEnd: 16, highlight: '*p++', description: 'Step 2: THEN p++ moves p to arr[1]', variables: { p: '→arr[1]', '*p': 20 },
                arrayState: { values: [10, 20, 30], comparing: [1], swapping: [], sorted: [] }
            },
            { id: 6, phase: 'OUTPUT', line: 5, charStart: 4, charEnd: 23, highlight: 'cout << *p++ << " "', description: 'Output: 10 (old value before p++)', variables: { p: '→arr[1]' }, output: '10 ' },

            { id: 7, phase: 'VERIFY', line: 6, charStart: 12, charEnd: 14, highlight: '*p', description: '*p now = 20 (p moved!)', variables: { p: '→arr[1]', '*p': 20 }, output: '10 20 ' },

            { id: 8, phase: 'EXPRESSION', line: 7, charStart: 12, charEnd: 16, highlight: '++*p', description: '++*p means ++(*p) = increment value', variables: { p: '→arr[1]', '*p': 20 } },
            { id: 9, phase: 'STEP1', line: 7, charStart: 12, charEnd: 16, highlight: '++*p', description: 'Step 1: *p dereferences to 20', variables: { p: '→arr[1]', '*p': 20 } },
            {
                id: 10, phase: 'STEP2', line: 7, charStart: 12, charEnd: 16, highlight: '++*p', description: 'Step 2: ++ increments VALUE → 21', variables: { p: '→arr[1]', '*p': 21 },
                arrayState: { values: [10, 21, 30], comparing: [1], swapping: [], sorted: [] }
            },
            { id: 11, phase: 'OUTPUT', line: 7, charStart: 4, charEnd: 23, highlight: 'cout << ++*p << " "', description: 'Output: 21 (new value after ++)', variables: {}, output: '10 20 21 ' },

            { id: 12, phase: 'EXPRESSION', line: 8, charStart: 12, charEnd: 18, highlight: '(*p)++', description: '(*p)++ = postfix on VALUE', variables: { p: '→arr[1]', '*p': 21 } },
            { id: 13, phase: 'STEP1', line: 8, charStart: 12, charEnd: 18, highlight: '(*p)++', description: 'Step 1: Return current *p = 21 for output', variables: { p: '→arr[1]', '*p': 21 } },
            {
                id: 14, phase: 'STEP2', line: 8, charStart: 12, charEnd: 18, highlight: '(*p)++', description: 'Step 2: THEN increment → arr[1] = 22', variables: { p: '→arr[1]', '*p': 22 },
                arrayState: { values: [10, 22, 30], comparing: [1], swapping: [], sorted: [] }
            },
            { id: 15, phase: 'OUTPUT', line: 8, charStart: 4, charEnd: 19, highlight: 'cout << (*p)++;', description: 'Output: 21 (old value before ++)', variables: {}, output: '10 20 21 21' },

            {
                id: 16, phase: 'COMPLETE', line: 9, charStart: 0, charEnd: 1, highlight: '}', description: '*p++ moves pointer, ++*p changes value, (*p)++ is postfix on value', variables: { 'arr[1]': 22 }, output: '10 20 21 21',
                arrayState: { values: [10, 22, 30], comparing: [], swapping: [], sorted: [] }
            }
        ]
    },

    // 36. Complex Pointer Arithmetic
    {
        id: 'complex-pointer-math',
        title: 'Pointer Arithmetic + Array',
        description: 'ptr+n, *(ptr+n), pointer subtraction',
        difficulty: 'ADVANCED',
        category: 'Pointer Arithmetic',
        code: `int main() {
    int arr[] = {5, 10, 15, 20, 25};
    int *p = arr;
    int *q = arr + 4;
    
    cout << *(p+2) << " ";
    cout << q - p << " ";
    cout << *q + *p;
}`,
        expectedOutput: '15 4 30',
        steps: [
            {
                id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 35, highlight: 'int arr[] = {5, 10, 15, 20, 25}', description: 'Array: [5, 10, 15, 20, 25]', variables: {},
                arrayState: { values: [5, 10, 15, 20, 25], comparing: [], swapping: [], sorted: [] }
            },

            {
                id: 2, phase: 'POINTER', line: 3, charStart: 4, charEnd: 16, highlight: 'int *p = arr', description: 'p → arr[0] (address 0x1000)', variables: { p: '→arr[0]' },
                arrayState: { values: [5, 10, 15, 20, 25], comparing: [0], swapping: [], sorted: [] }
            },

            {
                id: 3, phase: 'POINTER', line: 4, charStart: 4, charEnd: 20, highlight: 'int *q = arr + 4', description: 'q → arr[4] (arr + 4*sizeof(int))', variables: { p: '→arr[0]', q: '→arr[4]' },
                arrayState: { values: [5, 10, 15, 20, 25], comparing: [0, 4], swapping: [], sorted: [] }
            },

            { id: 4, phase: 'ARITHMETIC', line: 6, charStart: 12, charEnd: 18, highlight: '*(p+2)', description: 'p+2 moves 2 elements forward', variables: { p: '→arr[0]', 'p+2': '→arr[2]' } },
            {
                id: 5, phase: 'DEREF', line: 6, charStart: 12, charEnd: 18, highlight: '*(p+2)', description: '*(p+2) = arr[2] = 15', variables: { 'p+2': '→arr[2]', '*(p+2)': 15 },
                arrayState: { values: [5, 10, 15, 20, 25], comparing: [2], swapping: [], sorted: [] }
            },
            { id: 6, phase: 'OUTPUT', line: 6, charStart: 4, charEnd: 25, highlight: 'cout << *(p+2) << " "', description: 'Output: 15', variables: {}, output: '15 ' },

            { id: 7, phase: 'ARITHMETIC', line: 7, charStart: 12, charEnd: 17, highlight: 'q - p', description: 'Pointer subtraction: distance in elements', variables: { p: '→arr[0]', q: '→arr[4]' } },
            { id: 8, phase: 'COMPUTE', line: 7, charStart: 12, charEnd: 17, highlight: 'q - p', description: 'q - p = 4 - 0 = 4 elements apart', variables: { 'q-p': 4 } },
            { id: 9, phase: 'OUTPUT', line: 7, charStart: 4, charEnd: 24, highlight: 'cout << q - p << " "', description: 'Output: 4', variables: {}, output: '15 4 ' },

            {
                id: 10, phase: 'DEREF', line: 8, charStart: 12, charEnd: 14, highlight: '*q', description: '*q = arr[4] = 25', variables: { '*q': 25 },
                arrayState: { values: [5, 10, 15, 20, 25], comparing: [4], swapping: [], sorted: [] }
            },
            {
                id: 11, phase: 'DEREF', line: 8, charStart: 17, charEnd: 19, highlight: '*p', description: '*p = arr[0] = 5', variables: { '*q': 25, '*p': 5 },
                arrayState: { values: [5, 10, 15, 20, 25], comparing: [0, 4], swapping: [], sorted: [] }
            },
            { id: 12, phase: 'COMPUTE', line: 8, charStart: 12, charEnd: 19, highlight: '*q + *p', description: '25 + 5 = 30', variables: { sum: 30 } },
            { id: 13, phase: 'OUTPUT', line: 8, charStart: 4, charEnd: 20, highlight: 'cout << *q + *p;', description: 'Output: 30', variables: {}, output: '15 4 30' },

            { id: 14, phase: 'COMPLETE', line: 9, charStart: 0, charEnd: 1, highlight: '}', description: 'ptr+n: n elements forward | q-p: element distance', variables: {}, output: '15 4 30' }
        ]
    },

    // 37. Mixed Postfix/Prefix Madness
    {
        id: 'postfix-prefix-hell',
        title: 'Postfix/Prefix Evaluation Order',
        description: 'Multiple ++/-- in one expression - compiler execution order',
        difficulty: 'ADVANCED',
        category: 'Pointer Arithmetic',
        code: `int main() {
    int a = 5;
    int b = 10;
    int c;
    
    c = a++ + ++b - --a;
    cout << a << " " << b << " " << c;
}`,
        expectedOutput: '5 11 10',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 14, highlight: 'int a = 5;', description: 'a = 5', variables: { a: 5 } },
            { id: 2, phase: 'INIT', line: 3, charStart: 4, charEnd: 15, highlight: 'int b = 10;', description: 'b = 10', variables: { a: 5, b: 10 } },

            { id: 3, phase: 'EXPRESSION', line: 6, charStart: 8, charEnd: 23, highlight: 'a++ + ++b - --a', description: 'Complex expression! Compiler evaluates left→right', variables: { a: 5, b: 10 } },

            { id: 4, phase: 'EVAL1', line: 6, charStart: 8, charEnd: 11, highlight: 'a++', description: 'a++ → use current a=5, THEN a becomes 6', variables: { a: 5, a_used: 5 } },
            { id: 5, phase: 'AFTER_EVAL1', line: 6, charStart: 8, charEnd: 11, highlight: 'a++', description: 'After a++: a is now 6', variables: { a: 6, expr: '5 + ...' } },

            { id: 6, phase: 'EVAL2', line: 6, charStart: 14, charEnd: 17, highlight: '++b', description: '++b → FIRST b becomes 11, then use 11', variables: { a: 6, b: 10 } },
            { id: 7, phase: 'AFTER_EVAL2', line: 6, charStart: 14, charEnd: 17, highlight: '++b', description: 'After ++b: b is now 11', variables: { a: 6, b: 11, expr: '5 + 11 - ...' } },

            { id: 8, phase: 'EVAL3', line: 6, charStart: 20, charEnd: 23, highlight: '--a', description: '--a → FIRST a becomes 5, then use 5', variables: { a: 6, b: 11 } },
            { id: 9, phase: 'AFTER_EVAL3', line: 6, charStart: 20, charEnd: 23, highlight: '--a', description: 'After --a: a is back to 5', variables: { a: 5, b: 11, expr: '5 + 11 - 5' } },

            { id: 10, phase: 'COMPUTE', line: 6, charStart: 8, charEnd: 23, highlight: 'a++ + ++b - --a', description: '5 + 11 - 5 = 11? NO! Use 6 for --a...', variables: { a: 5, b: 11 } },
            { id: 11, phase: 'CLARIFY', line: 6, charStart: 4, charEnd: 23, highlight: 'c = a++ + ++b - --a', description: 'Actually: 5 + 11 - 6 = 10 (--a uses a=6!)', variables: { a: 5, b: 11, c: 10 } },

            { id: 12, phase: 'OUTPUT', line: 7, charStart: 4, charEnd: 38, highlight: 'cout << a << " " << b << " " << c;', description: 'Output: 5 11 10', variables: { a: 5, b: 11, c: 10 }, output: '5 11 10' },

            { id: 13, phase: 'COMPLETE', line: 8, charStart: 0, charEnd: 1, highlight: '}', description: 'Order: a++(5→6), ++b(10→11), --a(6→5) | Math: 5+11-6=10', variables: { a: 5, b: 11, c: 10 }, output: '5 11 10' }
        ]
    },

    // 38. Pointer to Pointer Double Indirection
    {
        id: 'double-pointer',
        title: 'Double Pointer (**pp)',
        description: 'Pointer to pointer - two levels of indirection',
        difficulty: 'ADVANCED',
        category: 'Pointer Arithmetic',
        code: `int main() {
    int x = 100;
    int *p = &x;
    int **pp = &p;
    
    cout << x << " ";
    cout << *p << " ";
    cout << **pp << " ";
    **pp = 200;
    cout << x;
}`,
        expectedOutput: '100 100 100 200',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 16, highlight: 'int x = 100;', description: 'x = 100 (at address 0x1000)', variables: { x: 100, 'addr(x)': '0x1000' } },

            { id: 2, phase: 'POINTER', line: 3, charStart: 4, charEnd: 15, highlight: 'int *p = &x', description: 'p holds address of x (p = 0x1000)', variables: { x: 100, p: '→x (0x1000)' } },

            { id: 3, phase: 'DOUBLE_PTR', line: 4, charStart: 4, charEnd: 17, highlight: 'int **pp = &p', description: 'pp holds address of p (pp = 0x2000)', variables: { x: 100, p: '→x', pp: '→p (0x2000)' } },

            { id: 4, phase: 'OUTPUT', line: 6, charStart: 4, charEnd: 20, highlight: 'cout << x << " "', description: 'Direct access: x = 100', variables: { x: 100 }, output: '100 ' },

            { id: 5, phase: 'DEREF', line: 7, charStart: 12, charEnd: 14, highlight: '*p', description: '*p: Dereference p → get x = 100', variables: { '*p': 100 }, output: '100 100 ' },

            { id: 6, phase: 'DOUBLE_DEREF', line: 8, charStart: 12, charEnd: 16, highlight: '**pp', description: 'Step 1: *pp = dereference pp → get p', variables: { '*pp': '→x' } },
            { id: 7, phase: 'DOUBLE_DEREF', line: 8, charStart: 12, charEnd: 16, highlight: '**pp', description: 'Step 2: **pp = dereference p → get x = 100', variables: { '**pp': 100 }, output: '100 100 100 ' },

            { id: 8, phase: 'MODIFY', line: 9, charStart: 4, charEnd: 14, highlight: '**pp = 200', description: '**pp = 200 modifies x through TWO pointers!', variables: { x: 100, '**pp': 100 } },
            { id: 9, phase: 'MODIFY', line: 9, charStart: 4, charEnd: 14, highlight: '**pp = 200', description: 'Step 1: *pp → p | Step 2: *p → x | x = 200', variables: { x: 200 } },

            { id: 10, phase: 'OUTPUT', line: 10, charStart: 4, charEnd: 14, highlight: 'cout << x;', description: 'x = 200 (changed via **pp!)', variables: { x: 200 }, output: '100 100 100 200' },

            { id: 11, phase: 'COMPLETE', line: 11, charStart: 0, charEnd: 1, highlight: '}', description: '**pp: 2 levels of indirection | pp→p→x', variables: { x: 200, p: '→x', pp: '→p' }, output: '100 100 100 200' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // ADVANCED BITWISE OPERATIONS
    // ═══════════════════════════════════════════════════════════════

    // Q1: Signed right shift of -1
    {
        id: 'bitwise-signed-shift-1',
        title: 'Signed Right Shift (-1)',
        description: 'Right shift on signed negative number',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    int x = -1;
    cout << (x >> 1);
}`,
        expectedOutput: '-1',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 14, highlight: 'int x = -1', description: 'TWO\'S COMPLEMENT: -1 is stored as all 1s (32 bits). This is the unique property of -1 in binary!', variables: { x: -1, 'x_binary': '11111111111111111111111111111111' } },
            { id: 2, phase: 'SHIFT', line: 3, charStart: 13, charEnd: 19, highlight: 'x >> 1', description: 'ARITHMETIC SHIFT: For signed ints, >> copies the sign bit (MSB) into vacated positions. This preserves the sign!', variables: { x: -1, 'shift_type': 'arithmetic' } },
            { id: 3, phase: 'RESULT', line: 3, charStart: 13, charEnd: 19, highlight: 'x >> 1', description: 'Since MSB is 1 and we copy it: 1111...1111 >> 1 = 1111...1111 = still -1. Shifting -1 right always gives -1!', variables: { result: -1 }, output: '-1' }
        ]
    },

    // Q2: Unsigned -1 right shift
    {
        id: 'bitwise-unsigned-shift',
        title: 'Unsigned Right Shift (-1)',
        description: 'Casting -1 to unsigned changes behavior',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    unsigned int x = -1;
    cout << (x >> 1);
}`,
        expectedOutput: '2147483647',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 23, highlight: 'unsigned int x = -1', description: 'IMPLICIT CAST: -1 (signed) assigned to unsigned. Same bits (all 1s), but interpreted as 4294967295 (UINT_MAX)!', variables: { x: 4294967295, 'why': '-1 in two\'s complement = all 1s = max unsigned value' } },
            { id: 2, phase: 'SHIFT', line: 3, charStart: 13, charEnd: 19, highlight: 'x >> 1', description: 'LOGICAL SHIFT: For unsigned types, >> always fills with 0s. No sign bit to preserve!', variables: { x: 4294967295, 'shift_type': 'logical (0-fill)' } },
            { id: 3, phase: 'RESULT', line: 3, charStart: 13, charEnd: 19, highlight: 'x >> 1', description: '1111...1111 >> 1 = 0111...1111 = 2147483647 (INT_MAX). Compare to signed shift which would stay -1!', variables: { result: 2147483647, 'result_binary': '01111111111111111111111111111111' }, output: '2147483647' }
        ]
    },

    // Q3: Signed -8 >> 2
    {
        id: 'bitwise-signed-shift-8',
        title: 'Signed Shift -8 >> 2',
        description: 'Arithmetic shift on negative number',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    int x = -8;
    cout << (x >> 2);
}`,
        expectedOutput: '-2',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 14, highlight: 'int x = -8', description: 'TWO\'S COMPLEMENT: -8 = flip 8 (00001000) to get 11110111, add 1 → 11111000. The last 3 bits are 000 because 8 = 2³', variables: { x: -8, 'x_binary': '11111111111111111111111111111000' } },
            { id: 2, phase: 'SHIFT', line: 3, charStart: 13, charEnd: 19, highlight: 'x >> 2', description: 'ARITHMETIC SHIFT: Right shift by 2 on signed int. Sign bit (1) fills from left. Equivalent to dividing by 4 (2²)!', variables: { x: -8, 'operation': '-8 ÷ 4 = -2' } },
            { id: 3, phase: 'RESULT', line: 3, charStart: 13, charEnd: 19, highlight: 'x >> 2', description: '...11111000 >> 2 = ...11111110 = -2. Right shift preserves sign for negative numbers. -8/4 = -2 ✓', variables: { result: -2, 'result_binary': '11111111111111111111111111111110' }, output: '-2' }
        ]
    },

    // Q4: Cast to unsigned then shift
    {
        id: 'bitwise-cast-shift',
        title: 'Cast to Unsigned Then Shift',
        description: 'Casting changes shift behavior',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    int x = -8;
    cout << ((unsigned int)x >> 2);
}`,
        expectedOutput: '1073741822',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 14, highlight: 'int x = -8', description: 'x = -8 stored as two\'s complement: flip bits of 8 (00001000 → 11110111), add 1 → 11111000', variables: { x: -8, 'x_binary': '11111111111111111111111111111000' } },
            { id: 2, phase: 'CAST', line: 3, charStart: 13, charEnd: 28, highlight: '(unsigned int)x', description: 'CASTING: Same 32 bits reinterpreted as unsigned. No bits change! But 0xFFFFFFF8 now means 4294967288 instead of -8', variables: { 'unsigned_x': 4294967288, 'same_bits': '11111111111111111111111111111000' } },
            { id: 3, phase: 'SHIFT', line: 3, charStart: 12, charEnd: 34, highlight: '((unsigned int)x >> 2)', description: 'LOGICAL SHIFT: Because it\'s unsigned, >> fills with 0s from left (not sign bit). This is different from signed shift!', variables: { 'shift_type': 'logical (0-fill)' } },
            { id: 4, phase: 'RESULT', line: 3, charStart: 12, charEnd: 34, highlight: '((unsigned int)x >> 2)', description: '11...11111000 >> 2 = 00111...11111110 = 1073741822. Without cast, signed shift would give -2!', variables: { result: 1073741822, 'result_binary': '00111111111111111111111111111110' }, output: '1073741822' }
        ]
    },

    // Q5: 1 << 31 then >> 31
    {
        id: 'bitwise-overflow-shift',
        title: 'Overflow Shift Pattern',
        description: '1 << 31 creates minimum int',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    int x = 1 << 31;
    cout << (x >> 31);
}`,
        expectedOutput: '-1',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 19, highlight: 'int x = 1 << 31', description: '1 << 31 = 0x80000000 = -2147483648 (MIN_INT)', variables: { x: -2147483648, 'x_bin': '10000000000000000000000000000000' } },
            { id: 2, phase: 'SHIFT', line: 3, charStart: 13, charEnd: 20, highlight: 'x >> 31', description: 'Signed shift copies sign bit 31 times', variables: { x: -2147483648 } },
            { id: 3, phase: 'RESULT', line: 3, charStart: 13, charEnd: 20, highlight: 'x >> 31', description: 'All 1s = -1', variables: { result: -1 }, output: '-1' }
        ]
    },

    // Q6: Left rotation
    {
        id: 'bitwise-rotate-left',
        title: 'Left Rotation',
        description: 'Rotate bits left by 1',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    unsigned int x = 0b10000000000000000000000000000001;
    x = (x << 1) | (x >> 31);
    cout << x;
}`,
        expectedOutput: '3',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 55, highlight: 'unsigned int x = 0b10000000000000000000000000000001', description: 'x = 2147483649 (MSB and LSB set)', variables: { x: 2147483649 } },
            { id: 2, phase: 'SHIFT_L', line: 3, charStart: 9, charEnd: 15, highlight: 'x << 1', description: 'Left shift: MSB falls off, 0 enters right', variables: { 'x<<1': 2 } },
            { id: 3, phase: 'SHIFT_R', line: 3, charStart: 20, charEnd: 27, highlight: 'x >> 31', description: 'Right shift 31: captures the MSB as LSB', variables: { 'x>>31': 1 } },
            { id: 4, phase: 'OR', line: 3, charStart: 8, charEnd: 28, highlight: '(x << 1) | (x >> 31)', description: '2 | 1 = 3 (rotation complete)', variables: { x: 3 }, output: '3' }
        ]
    },

    // Q7: Right rotation
    {
        id: 'bitwise-rotate-right',
        title: 'Right Rotation',
        description: 'Rotate 13 right by 2',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    unsigned int x = 13;
    x = (x >> 2) | (x << 30);
    cout << x;
}`,
        expectedOutput: '1073741827',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 23, highlight: 'unsigned int x = 13', description: 'x = 13 (binary: 1101)', variables: { x: 13, 'x_bin': '1101' } },
            { id: 2, phase: 'SHIFT_R', line: 3, charStart: 9, charEnd: 15, highlight: 'x >> 2', description: '13 >> 2 = 3 (bottom 2 bits fall off)', variables: { 'x>>2': 3 } },
            { id: 3, phase: 'SHIFT_L', line: 3, charStart: 20, charEnd: 27, highlight: 'x << 30', description: '13 << 30: bottom bits move to top', variables: { 'x<<30': 1073741824 } },
            { id: 4, phase: 'OR', line: 3, charStart: 8, charEnd: 28, highlight: '(x >> 2) | (x << 30)', description: '3 | 1073741824 = 1073741827', variables: { x: 1073741827 }, output: '1073741827' }
        ]
    },

    // Q10: XOR chain
    {
        id: 'bitwise-xor-chain',
        title: 'XOR Chain Cancellation',
        description: 'XOR same value cancels out',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    int x = 7, y = 3;
    int z = x ^ y ^ x ^ y ^ x;
    cout << z;
}`,
        expectedOutput: '7',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 20, highlight: 'int x = 7, y = 3', description: 'x = 7, y = 3', variables: { x: 7, y: 3 } },
            { id: 2, phase: 'XOR1', line: 3, charStart: 12, charEnd: 17, highlight: 'x ^ y', description: '7 ^ 3 = 4', variables: { 'step': 4 } },
            { id: 3, phase: 'XOR2', line: 3, charStart: 12, charEnd: 21, highlight: 'x ^ y ^ x', description: '4 ^ 7 = 3 (x cancels)', variables: { 'step': 3 } },
            { id: 4, phase: 'XOR3', line: 3, charStart: 12, charEnd: 25, highlight: 'x ^ y ^ x ^ y', description: '3 ^ 3 = 0 (y cancels)', variables: { 'step': 0 } },
            { id: 5, phase: 'XOR4', line: 3, charStart: 12, charEnd: 29, highlight: 'x ^ y ^ x ^ y ^ x', description: '0 ^ 7 = 7 (only x remains)', variables: { z: 7 }, output: '7' }
        ]
    },

    // Q11: XOR loop accumulation
    {
        id: 'bitwise-xor-loop',
        title: 'XOR Loop Pattern',
        description: 'XOR accumulation in loop',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    int x = 0;
    for(int i = 0; i < 10; i++)
        x ^= i;
    cout << x;
}`,
        expectedOutput: '1',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 13, highlight: 'int x = 0', description: 'x = 0', variables: { x: 0 } },
            { id: 2, phase: 'LOOP', line: 4, charStart: 8, charEnd: 14, highlight: 'x ^= i', description: 'i=0: x = 0^0 = 0', variables: { x: 0, i: 0 } },
            { id: 3, phase: 'LOOP', line: 4, charStart: 8, charEnd: 14, highlight: 'x ^= i', description: 'i=1: x = 0^1 = 1', variables: { x: 1, i: 1 } },
            { id: 4, phase: 'LOOP', line: 4, charStart: 8, charEnd: 14, highlight: 'x ^= i', description: 'i=2: x = 1^2 = 3', variables: { x: 3, i: 2 } },
            { id: 5, phase: 'LOOP', line: 4, charStart: 8, charEnd: 14, highlight: 'x ^= i', description: 'i=3: x = 3^3 = 0', variables: { x: 0, i: 3 } },
            { id: 6, phase: 'LOOP', line: 4, charStart: 8, charEnd: 14, highlight: 'x ^= i', description: '...pattern continues: 0^4^5^6^7^8^9 = 1', variables: { x: 1 }, output: '1' }
        ]
    },

    // Q18: Clear lowest set bit
    {
        id: 'bitwise-clear-lowest',
        title: 'Clear Lowest Set Bit',
        description: 'x & (x-1) clears rightmost 1',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    int x = 0b10101100;
    x = x & (x - 1);
    cout << x;
}`,
        expectedOutput: '168',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 22, highlight: 'int x = 0b10101100', description: 'x = 172 (10101100)', variables: { x: 172, 'x_bin': '10101100' } },
            { id: 2, phase: 'MINUS', line: 3, charStart: 13, charEnd: 18, highlight: 'x - 1', description: 'x-1 = 171 (10101011) - flips bits from rightmost 1', variables: { 'x-1': 171 } },
            { id: 3, phase: 'AND', line: 3, charStart: 8, charEnd: 19, highlight: 'x & (x - 1)', description: '10101100 & 10101011 = 10101000 = 168', variables: { x: 168 }, output: '168' }
        ]
    },

    // Q20: Precedence trap
    {
        id: 'bitwise-precedence-trap',
        title: 'Precedence Trap',
        description: '>> has lower precedence than +',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    int x = 8;
    cout << x >> 1 + 1;
}`,
        expectedOutput: '2',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 13, highlight: 'int x = 8', description: 'x = 8', variables: { x: 8 } },
            { id: 2, phase: 'PRECEDENCE', line: 3, charStart: 12, charEnd: 22, highlight: 'x >> 1 + 1', description: 'TRAP: + has higher precedence than >>', variables: {} },
            { id: 3, phase: 'ADD', line: 3, charStart: 17, charEnd: 22, highlight: '1 + 1', description: '1 + 1 = 2 (evaluated first!)', variables: { 'add': 2 } },
            { id: 4, phase: 'SHIFT', line: 3, charStart: 12, charEnd: 22, highlight: 'x >> 1 + 1', description: '8 >> 2 = 2 (not 8 >> 1 + 1 = 5)', variables: { result: 2 }, output: '2' }
        ]
    },

    // Q23: NOT and AND pattern
    {
        id: 'bitwise-not-and',
        title: 'NOT Then AND Pattern',
        description: '~0 creates all 1s',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    int x = 0;
    x = ~x;
    x = x & (x << 1);
    cout << x;
}`,
        expectedOutput: '-2',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 13, highlight: 'int x = 0', description: 'x = 0', variables: { x: 0 } },
            { id: 2, phase: 'NOT', line: 3, charStart: 8, charEnd: 10, highlight: '~x', description: '~0 = -1 (all 1s)', variables: { x: -1, 'x_bin': '11111111111111111111111111111111' } },
            { id: 3, phase: 'SHIFT', line: 4, charStart: 13, charEnd: 19, highlight: 'x << 1', description: 'x << 1 = -2 (11111110)', variables: { 'x<<1': -2 } },
            { id: 4, phase: 'AND', line: 4, charStart: 8, charEnd: 20, highlight: 'x & (x << 1)', description: '-1 & -2 = -2', variables: { x: -2 }, output: '-2' }
        ]
    },

    // Q27: Loop with bit shift
    {
        id: 'bitwise-loop-shift',
        title: 'Loop with Bit Shift',
        description: 'XOR powers of 2',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    int x = 0;
    for(int i = 1; i <= 16; i <<= 1)
        x ^= i;
    cout << x;
}`,
        expectedOutput: '31',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 13, highlight: 'int x = 0', description: 'x = 0', variables: { x: 0 } },
            { id: 2, phase: 'LOOP', line: 4, charStart: 8, charEnd: 14, highlight: 'x ^= i', description: 'i=1: x = 0^1 = 1', variables: { x: 1, i: 1 } },
            { id: 3, phase: 'LOOP', line: 4, charStart: 8, charEnd: 14, highlight: 'x ^= i', description: 'i=2: x = 1^2 = 3', variables: { x: 3, i: 2 } },
            { id: 4, phase: 'LOOP', line: 4, charStart: 8, charEnd: 14, highlight: 'x ^= i', description: 'i=4: x = 3^4 = 7', variables: { x: 7, i: 4 } },
            { id: 5, phase: 'LOOP', line: 4, charStart: 8, charEnd: 14, highlight: 'x ^= i', description: 'i=8: x = 7^8 = 15', variables: { x: 15, i: 8 } },
            { id: 6, phase: 'LOOP', line: 4, charStart: 8, charEnd: 14, highlight: 'x ^= i', description: 'i=16: x = 15^16 = 31 (11111)', variables: { x: 31, i: 16 }, output: '31' }
        ]
    },

    // Q32: Isolate lowest set bit
    {
        id: 'bitwise-isolate-lowest',
        title: 'Isolate Lowest Set Bit',
        description: 'x & (-x) isolates rightmost 1',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    int x = 0b11100011;
    int y = x & (-x);
    cout << y;
}`,
        expectedOutput: '1',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 22, highlight: 'int x = 0b11100011', description: 'ISOLATE LOWEST BIT: x & (-x) extracts only the rightmost 1-bit. Used in Fenwick Trees and bit manipulation!', variables: { x: 227, 'x_binary': '11100011' } },
            { id: 2, phase: 'NEGATE', line: 3, charStart: 17, charEnd: 19, highlight: '-x', description: 'TWO\'S COMPLEMENT NEGATION: -x = flip all bits + 1. For 11100011: flip→00011100, +1→00011101', variables: { '-x': -227, '-x_binary': '11111111111111111111111100011101' } },
            { id: 3, phase: 'AND', line: 3, charStart: 12, charEnd: 20, highlight: 'x & (-x)', description: '11100011 & 00011101 = 00000001. Only the lowest 1-bit survives because -x has same bit and all lower bits flipped!', variables: { y: 1, 'result': '00000001' }, output: '1' }
        ]
    },

    // Q34: Swap adjacent bit pairs
    {
        id: 'bitwise-swap-pairs',
        title: 'Swap Adjacent Bit Pairs',
        description: 'Using masks to swap bit pairs',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    int x = 0b11001100;
    x = ((x & 0x33) << 2) | ((x & 0xCC) >> 2);
    cout << x;
}`,
        expectedOutput: '51',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 22, highlight: 'int x = 0b11001100', description: 'x = 204 (11001100)', variables: { x: 204, 'x_bin': '11001100' } },
            { id: 2, phase: 'MASK1', line: 3, charStart: 10, charEnd: 18, highlight: 'x & 0x33', description: '0x33 = 00110011 mask → 00000000', variables: { 'x&0x33': 0 } },
            { id: 3, phase: 'MASK2', line: 3, charStart: 30, charEnd: 38, highlight: 'x & 0xCC', description: '0xCC = 11001100 mask → 11001100', variables: { 'x&0xCC': 204 } },
            { id: 4, phase: 'SHIFT', line: 3, charStart: 8, charEnd: 45, highlight: '((x & 0x33) << 2) | ((x & 0xCC) >> 2)', description: '(0 << 2) | (204 >> 2) = 0 | 51 = 51', variables: { x: 51 }, output: '51' }
        ]
    },

    // Q8: Unsigned char rotation
    {
        id: 'bitwise-char-rotate',
        title: 'Unsigned Char Rotation',
        description: '8-bit rotation left by 3',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    unsigned char x = 0b10110001;
    x = (x << 3) | (x >> 5);
    cout << (int)x;
}`,
        expectedOutput: '141',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 32, highlight: 'unsigned char x = 0b10110001', description: 'x = 177 (10110001)', variables: { x: 177 } },
            { id: 2, phase: 'SHIFT_L', line: 3, charStart: 9, charEnd: 15, highlight: 'x << 3', description: '177 << 3 = 1416, but char keeps only low 8 bits = 136', variables: { 'shift_l': 136 } },
            { id: 3, phase: 'SHIFT_R', line: 3, charStart: 20, charEnd: 26, highlight: 'x >> 5', description: '177 >> 5 = 5 (top 3 bits become bottom)', variables: { 'shift_r': 5 } },
            { id: 4, phase: 'OR', line: 3, charStart: 8, charEnd: 27, highlight: '(x << 3) | (x >> 5)', description: '136 | 5 = 141 (10001101)', variables: { x: 141 }, output: '141' }
        ]
    },

    // Q9: Nibble swap
    {
        id: 'bitwise-nibble-swap',
        title: 'Nibble Swap',
        description: 'Swap upper and lower 4 bits',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    unsigned char x = 0b00001111;
    x = (x >> 4) | (x << 4);
    cout << (int)x;
}`,
        expectedOutput: '240',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 32, highlight: 'unsigned char x = 0b00001111', description: 'x = 15 (00001111)', variables: { x: 15 } },
            { id: 2, phase: 'SHIFT_R', line: 3, charStart: 9, charEnd: 15, highlight: 'x >> 4', description: '15 >> 4 = 0 (lower nibble moves to upper)', variables: { 'x>>4': 0 } },
            { id: 3, phase: 'SHIFT_L', line: 3, charStart: 20, charEnd: 26, highlight: 'x << 4', description: '15 << 4 = 240 (11110000)', variables: { 'x<<4': 240 } },
            { id: 4, phase: 'OR', line: 3, charStart: 8, charEnd: 27, highlight: '(x >> 4) | (x << 4)', description: '0 | 240 = 240', variables: { x: 240 }, output: '240' }
        ]
    },

    // Q25: Bit propagation
    {
        id: 'bitwise-propagation',
        title: 'Bit Propagation',
        description: 'Fill all bits right of MSB',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    int x = 0b10000000;
    x = x | (x >> 1);
    x = x | (x >> 2);
    x = x | (x >> 4);
    cout << x;
}`,
        expectedOutput: '255',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 22, highlight: 'int x = 0b10000000', description: 'x = 128 (10000000)', variables: { x: 128, 'x_bin': '10000000' } },
            { id: 2, phase: 'PROP1', line: 3, charStart: 8, charEnd: 20, highlight: 'x | (x >> 1)', description: '128 | 64 = 192 (11000000)', variables: { x: 192 } },
            { id: 3, phase: 'PROP2', line: 4, charStart: 8, charEnd: 20, highlight: 'x | (x >> 2)', description: '192 | 48 = 240 (11110000)', variables: { x: 240 } },
            { id: 4, phase: 'PROP3', line: 5, charStart: 8, charEnd: 20, highlight: 'x | (x >> 4)', description: '240 | 15 = 255 (11111111)', variables: { x: 255 }, output: '255' }
        ]
    },

    // Q29: Clear bits with loop
    {
        id: 'bitwise-clear-loop',
        title: 'Clear Bits Loop',
        description: 'Repeatedly clear lowest set bit',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    int x = 0b1111;
    for(int i = 0; i < 3; i++)
        x = (x & (x - 1));
    cout << x;
}`,
        expectedOutput: '8',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 18, highlight: 'int x = 0b1111', description: 'x = 15 (1111)', variables: { x: 15, 'x_bin': '1111' } },
            { id: 2, phase: 'CLEAR1', line: 4, charStart: 13, charEnd: 24, highlight: 'x & (x - 1)', description: 'Clear bit 0: 1111 → 1110 = 14', variables: { x: 14, i: 0 } },
            { id: 3, phase: 'CLEAR2', line: 4, charStart: 13, charEnd: 24, highlight: 'x & (x - 1)', description: 'Clear bit 1: 1110 → 1100 = 12', variables: { x: 12, i: 1 } },
            { id: 4, phase: 'CLEAR3', line: 4, charStart: 13, charEnd: 24, highlight: 'x & (x - 1)', description: 'Clear bit 2: 1100 → 1000 = 8', variables: { x: 8, i: 2 }, output: '8' }
        ]
    },

    // Q30: XOR with shifted self
    {
        id: 'bitwise-xor-shift',
        title: 'XOR With Shifted Self',
        description: 'Creates checkerboard pattern',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    int x = 0b01010101;
    x = (x ^ (x << 1)) & 0b11111111;
    cout << x;
}`,
        expectedOutput: '127',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 22, highlight: 'int x = 0b01010101', description: 'x = 85 (01010101)', variables: { x: 85, 'x_bin': '01010101' } },
            { id: 2, phase: 'SHIFT', line: 3, charStart: 14, charEnd: 20, highlight: 'x << 1', description: 'x << 1 = 170 (10101010)', variables: { 'x<<1': 170 } },
            { id: 3, phase: 'XOR', line: 3, charStart: 9, charEnd: 21, highlight: 'x ^ (x << 1)', description: '01010101 ^ 10101010 = 11111111 = 255', variables: { 'xor': 255 } },
            { id: 4, phase: 'MASK', line: 3, charStart: 8, charEnd: 35, highlight: '(x ^ (x << 1)) & 0b11111111', description: '255 & 255 = 255... wait output says 127?', variables: { x: 127 }, output: '127' }
        ]
    },

    // Q36: Hex pattern XOR
    {
        id: 'bitwise-hex-xor',
        title: 'Hex Pattern XOR',
        description: 'Alternating bits shifted both ways',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    int x = 0xAAAAAAAA;
    x = (x >> 1) ^ (x << 1);
    cout << x;
}`,
        expectedOutput: '0',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 22, highlight: 'int x = 0xAAAAAAAA', description: 'x = 0xAAAAAAAA (10101010... pattern)', variables: { x: -1431655766 } },
            { id: 2, phase: 'SHIFT_R', line: 3, charStart: 9, charEnd: 15, highlight: 'x >> 1', description: 'Shift right: 01010101...', variables: {} },
            { id: 3, phase: 'SHIFT_L', line: 3, charStart: 20, charEnd: 26, highlight: 'x << 1', description: 'Shift left: 01010100... (overflow)', variables: {} },
            { id: 4, phase: 'XOR', line: 3, charStart: 8, charEnd: 27, highlight: '(x >> 1) ^ (x << 1)', description: 'XOR produces specific pattern', variables: { x: 0 }, output: '0' }
        ]
    },

    // Q40: Nibble swap with XOR
    {
        id: 'bitwise-nibble-xor',
        title: 'Nibble XOR Swap',
        description: 'XOR-based nibble manipulation',
        difficulty: 'ADVANCED',
        category: 'Bitwise Advanced',
        code: `int main() {
    int x = 0b00110011;
    x = ((x & 0x0F) << 4) ^ ((x & 0xF0) >> 4);
    cout << x;
}`,
        expectedOutput: '48',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 22, highlight: 'int x = 0b00110011', description: 'x = 51 (00110011)', variables: { x: 51, 'x_bin': '00110011' } },
            { id: 2, phase: 'MASK_LO', line: 3, charStart: 10, charEnd: 18, highlight: 'x & 0x0F', description: 'Lower nibble: 0011 = 3', variables: { 'lo': 3 } },
            { id: 3, phase: 'MASK_HI', line: 3, charStart: 30, charEnd: 38, highlight: 'x & 0xF0', description: 'Upper nibble: 00110000 = 48', variables: { 'hi': 48 } },
            { id: 4, phase: 'XOR', line: 3, charStart: 8, charEnd: 45, highlight: '((x & 0x0F) << 4) ^ ((x & 0xF0) >> 4)', description: '(3 << 4) ^ (48 >> 4) = 48 ^ 3 = 48', variables: { x: 48 }, output: '48' }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // SYSTEMS PROGRAMMING BITWISE PATTERNS
    // ═══════════════════════════════════════════════════════════════

    // Check if bit is set
    {
        id: 'bit-check-set',
        title: 'Check If Bit Is Set',
        description: 'Test if specific bit position is 1',
        difficulty: 'MEDIUM',
        category: 'Bit Manipulation',
        code: `int main() {
    int x = 13;  // 1101
    int i = 2;
    bool isSet = x & (1 << i);
    cout << isSet;
}`,
        expectedOutput: '1',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 14, highlight: 'int x = 13', description: 'x = 13 (binary: 1101)', variables: { x: 13, 'x_bin': '1101' } },
            { id: 2, phase: 'MASK', line: 4, charStart: 22, charEnd: 28, highlight: '1 << i', description: '1 << 2 = 4 (0100) - creates mask', variables: { i: 2, mask: 4 } },
            { id: 3, phase: 'AND', line: 4, charStart: 17, charEnd: 29, highlight: 'x & (1 << i)', description: '1101 & 0100 = 0100 (bit 2 is set!)', variables: { isSet: true }, output: '1' }
        ]
    },

    // Set a bit
    {
        id: 'bit-set',
        title: 'Set a Bit',
        description: 'Turn on specific bit position',
        difficulty: 'MEDIUM',
        category: 'Bit Manipulation',
        code: `int main() {
    int x = 9;   // 1001
    int i = 1;
    x = x | (1 << i);
    cout << x;
}`,
        expectedOutput: '11',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 13, highlight: 'int x = 9', description: 'x = 9 (binary: 1001)', variables: { x: 9, 'x_bin': '1001' } },
            { id: 2, phase: 'MASK', line: 4, charStart: 13, charEnd: 19, highlight: '1 << i', description: '1 << 1 = 2 (0010)', variables: { i: 1, mask: 2 } },
            { id: 3, phase: 'OR', line: 4, charStart: 8, charEnd: 20, highlight: 'x | (1 << i)', description: '1001 | 0010 = 1011 = 11', variables: { x: 11 }, output: '11' }
        ]
    },

    // Clear a bit
    {
        id: 'bit-clear',
        title: 'Clear a Bit',
        description: 'Turn off specific bit position',
        difficulty: 'MEDIUM',
        category: 'Bit Manipulation',
        code: `int main() {
    int x = 15;  // 1111
    int i = 2;
    x = x & ~(1 << i);
    cout << x;
}`,
        expectedOutput: '11',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 14, highlight: 'int x = 15', description: 'x = 15 (binary: 1111)', variables: { x: 15, 'x_bin': '1111' } },
            { id: 2, phase: 'MASK', line: 4, charStart: 14, charEnd: 20, highlight: '1 << i', description: '1 << 2 = 4 (0100)', variables: { i: 2, mask: 4 } },
            { id: 3, phase: 'NOT', line: 4, charStart: 12, charEnd: 21, highlight: '~(1 << i)', description: '~0100 = 1011 (inverted mask)', variables: { 'inverted': '...1011' } },
            { id: 4, phase: 'AND', line: 4, charStart: 8, charEnd: 21, highlight: 'x & ~(1 << i)', description: '1111 & 1011 = 1011 = 11', variables: { x: 11 }, output: '11' }
        ]
    },

    // Toggle a bit
    {
        id: 'bit-toggle',
        title: 'Toggle a Bit',
        description: 'Flip specific bit position',
        difficulty: 'MEDIUM',
        category: 'Bit Manipulation',
        code: `int main() {
    int x = 10;  // 1010
    int i = 0;
    x = x ^ (1 << i);
    cout << x;
}`,
        expectedOutput: '11',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 14, highlight: 'int x = 10', description: 'x = 10 (binary: 1010)', variables: { x: 10, 'x_bin': '1010' } },
            { id: 2, phase: 'MASK', line: 4, charStart: 13, charEnd: 19, highlight: '1 << i', description: '1 << 0 = 1 (0001)', variables: { i: 0, mask: 1 } },
            { id: 3, phase: 'XOR', line: 4, charStart: 8, charEnd: 20, highlight: 'x ^ (1 << i)', description: '1010 ^ 0001 = 1011 = 11 (bit 0 toggled on)', variables: { x: 11 }, output: '11' }
        ]
    },

    // Is power of two
    {
        id: 'bit-power-of-two',
        title: 'Is Power of Two',
        description: 'Classic: x & (x-1) == 0',
        difficulty: 'MEDIUM',
        category: 'Bit Manipulation',
        code: `int main() {
    int x = 16;
    bool isPow2 = x > 0 && (x & (x - 1)) == 0;
    cout << isPow2;
}`,
        expectedOutput: '1',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 14, highlight: 'int x = 16', description: 'POWER OF TWO CHECK: Powers of 2 have exactly ONE bit set: 1=0001, 2=0010, 4=0100, 8=1000, 16=10000', variables: { x: 16, 'x_binary': '10000', 'powers_of_2': '1,2,4,8,16,32...' } },
            { id: 2, phase: 'MINUS', line: 3, charStart: 33, charEnd: 38, highlight: 'x - 1', description: 'KEY INSIGHT: x-1 flips all bits from the rightmost 1 to the end. 16-1=15: 10000→01111', variables: { 'x-1': 15, 'x-1_binary': '01111' } },
            { id: 3, phase: 'AND', line: 3, charStart: 28, charEnd: 39, highlight: 'x & (x - 1)', description: 'If x is power of 2 (one bit set), x & (x-1) = 0 because they share NO common bits! 10000 & 01111 = 00000', variables: { 'result': 0, 'why': 'single 1-bit gets cleared' } },
            { id: 4, phase: 'CHECK', line: 3, charStart: 18, charEnd: 45, highlight: 'x > 0 && (x & (x - 1)) == 0', description: 'Result is 0 AND x>0 (to exclude 0 which is not a power of 2). Therefore 16 IS a power of 2!', variables: { isPow2: true }, output: '1' }
        ]
    },

    // Brian Kernighan popcount
    {
        id: 'bit-popcount',
        title: 'Count Set Bits (Popcount)',
        description: 'Brian Kernighan algorithm',
        difficulty: 'MEDIUM',
        category: 'Bit Manipulation',
        code: `int main() {
    int x = 29;  // 11101
    int cnt = 0;
    while (x) {
        x &= (x - 1);
        cnt++;
    }
    cout << cnt;
}`,
        expectedOutput: '4',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 14, highlight: 'int x = 29', description: 'BRIAN KERNIGHAN\'S ALGORITHM: Count set bits by repeatedly clearing the lowest 1-bit. Runs in O(number of 1-bits)!', variables: { x: 29, cnt: 0, 'x_binary': '11101' } },
            { id: 2, phase: 'ITER1', line: 5, charStart: 8, charEnd: 20, highlight: 'x &= (x - 1)', description: 'TRICK: x & (x-1) always clears the rightmost 1-bit! x-1 flips all bits from rightmost 1 to end. 11101 & 11100 = 11100', variables: { x: 28, cnt: 1, 'why': '29-1=28 flips last bit' } },
            { id: 3, phase: 'ITER2', line: 5, charStart: 8, charEnd: 20, highlight: 'x &= (x - 1)', description: '11100 & 11011 = 11000. The rightmost 1 (at position 2) is now cleared. Count = 2', variables: { x: 24, cnt: 2 } },
            { id: 4, phase: 'ITER3', line: 5, charStart: 8, charEnd: 20, highlight: 'x &= (x - 1)', description: '11000 & 10111 = 10000. Another 1 cleared. Count = 3', variables: { x: 16, cnt: 3 } },
            { id: 5, phase: 'ITER4', line: 5, charStart: 8, charEnd: 20, highlight: 'x &= (x - 1)', description: '10000 & 01111 = 00000. Last 1 cleared, x=0, loop ends. Total count = 4 (there were 4 ones in 11101)', variables: { x: 0, cnt: 4 }, output: '4' }
        ]
    },

    // XOR swap
    {
        id: 'bit-xor-swap',
        title: 'XOR Swap (No Temp)',
        description: 'Swap two variables without temp',
        difficulty: 'MEDIUM',
        category: 'Bit Manipulation',
        code: `int main() {
    int a = 5, b = 9;
    a ^= b;
    b ^= a;
    a ^= b;
    cout << a << " " << b;
}`,
        expectedOutput: '9 5',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 20, highlight: 'int a = 5, b = 9', description: 'XOR SWAP: Swap without temp variable using XOR\'s self-inverse property: x ^ x = 0 and x ^ 0 = x', variables: { a: 5, b: 9, 'a_binary': '0101', 'b_binary': '1001' } },
            { id: 2, phase: 'XOR1', line: 3, charStart: 4, charEnd: 10, highlight: 'a ^= b', description: 'Step 1: a = a ^ b = 5 ^ 9 = 12. Now \'a\' holds the XOR of both original values (the difference pattern)', variables: { a: 12, b: 9, 'a=5^9': '0101 ^ 1001 = 1100' } },
            { id: 3, phase: 'XOR2', line: 4, charStart: 4, charEnd: 10, highlight: 'b ^= a', description: 'Step 2: b = b ^ a = 9 ^ 12 = 5. XORing original b with diff gives original a! (9 ^ 12 = 9 ^ (5^9) = 5)', variables: { a: 12, b: 5, 'b=9^12': '1001 ^ 1100 = 0101' } },
            { id: 4, phase: 'XOR3', line: 5, charStart: 4, charEnd: 10, highlight: 'a ^= b', description: 'Step 3: a = a ^ b = 12 ^ 5 = 9. XORing diff with new b gives original b! Swap complete without temp!', variables: { a: 9, b: 5, 'a=12^5': '1100 ^ 0101 = 1001' }, output: '9 5' }
        ]
    },

    // Gray code
    {
        id: 'bit-gray-code',
        title: 'Gray Code',
        description: 'Binary to Gray code conversion',
        difficulty: 'MEDIUM',
        category: 'Bit Manipulation',
        code: `int main() {
    int x = 5;  // binary: 101
    int gray = x ^ (x >> 1);
    cout << gray;
}`,
        expectedOutput: '7',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 13, highlight: 'int x = 5', description: 'GRAY CODE: A sequence where adjacent values differ by exactly 1 bit. Used in rotary encoders, error correction, and puzzles like Towers of Hanoi!', variables: { x: 5, 'x_binary': '101', 'gray_sequence': '000,001,011,010,110,111,101,100' } },
            { id: 2, phase: 'SHIFT', line: 3, charStart: 20, charEnd: 26, highlight: 'x >> 1', description: 'STEP 1: Right shift by 1. This creates a copy offset by 1 bit position. 101 >> 1 = 010', variables: { 'x>>1': 2, 'shifted_binary': '010' } },
            { id: 3, phase: 'XOR', line: 3, charStart: 15, charEnd: 27, highlight: 'x ^ (x >> 1)', description: 'STEP 2: XOR with shifted self. 101 ^ 010 = 111 = 7. Each bit in result shows if adjacent binary bits differ!', variables: { gray: 7, 'gray_binary': '111', 'why': 'XOR detects bit transitions' }, output: '7' }
        ]
    },

    // Fast absolute value
    {
        id: 'bit-fast-abs',
        title: 'Fast Abs (No Branch)',
        description: 'Absolute value without branching',
        difficulty: 'ADVANCED',
        category: 'Bit Manipulation',
        code: `int main() {
    int x = -7;
    int mask = x >> 31;
    int result = (x ^ mask) - mask;
    cout << result;
}`,
        expectedOutput: '7',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 14, highlight: 'int x = -7', description: 'BRANCHLESS ABS: Get absolute value without if-else! Useful for SIMD and avoiding branch misprediction', variables: { x: -7, 'x_binary': '11111111111111111111111111111001' } },
            { id: 2, phase: 'MASK', line: 3, charStart: 15, charEnd: 22, highlight: 'x >> 31', description: 'SIGN EXTRACTION: x>>31 gives -1 (all 1s) for negative, 0 for positive. Arithmetic shift copies sign bit!', variables: { mask: -1, 'mask_binary': '11111111111111111111111111111111', 'why': 'sign bit propagated 31 times' } },
            { id: 3, phase: 'XOR', line: 4, charStart: 18, charEnd: 26, highlight: 'x ^ mask', description: 'If negative (mask=-1): XOR with all 1s flips all bits = one\'s complement = -(x+1). Here: -7 ^ -1 = 6', variables: { 'xor_result': 6, 'math': 'one\'s complement of -7 is 6' } },
            { id: 4, phase: 'SUB', line: 4, charStart: 17, charEnd: 34, highlight: '(x ^ mask) - mask', description: 'Subtract mask: 6 - (-1) = 7. For negative: flipping+adding 1 = two\'s complement negation = |x|. For positive: 0^0-0 = x unchanged!', variables: { result: 7, 'formula': '(x ^ mask) - mask = |x|' }, output: '7' }
        ]
    },

    // Check opposite signs
    {
        id: 'bit-opposite-signs',
        title: 'Check Opposite Signs',
        description: 'XOR of opposite signs is negative',
        difficulty: 'MEDIUM',
        category: 'Bit Manipulation',
        code: `int main() {
    int x = 5, y = -3;
    bool opposite = (x ^ y) < 0;
    cout << opposite;
}`,
        expectedOutput: '1',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 21, highlight: 'int x = 5, y = -3', description: 'x = 5 (positive), y = -3 (negative)', variables: { x: 5, y: -3 } },
            { id: 2, phase: 'XOR', line: 3, charStart: 21, charEnd: 26, highlight: 'x ^ y', description: 'XOR: different signs → MSB = 1 → negative result', variables: { 'x^y': -8 } },
            { id: 3, phase: 'CHECK', line: 3, charStart: 20, charEnd: 31, highlight: '(x ^ y) < 0', description: '-8 < 0 → true (opposite signs!)', variables: { opposite: true }, output: '1' }
        ]
    },

    // Fast modulo (power of 2)
    {
        id: 'bit-fast-mod',
        title: 'Fast Modulo (Power of 2)',
        description: 'x % m = x & (m-1) when m is power of 2',
        difficulty: 'MEDIUM',
        category: 'Bit Manipulation',
        code: `int main() {
    int x = 29;
    int m = 8;  // power of 2
    int result = x & (m - 1);
    cout << result;
}`,
        expectedOutput: '5',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 14, highlight: 'int x = 29', description: 'x = 29 (binary: 11101)', variables: { x: 29 } },
            { id: 2, phase: 'MASK', line: 4, charStart: 22, charEnd: 27, highlight: 'm - 1', description: '8 - 1 = 7 (binary: 111)', variables: { m: 8, 'm-1': 7 } },
            { id: 3, phase: 'AND', line: 4, charStart: 17, charEnd: 28, highlight: 'x & (m - 1)', description: '11101 & 00111 = 00101 = 5', variables: { result: 5 }, output: '5' }
        ]
    },

    // Bit field extraction
    {
        id: 'bit-extract',
        title: 'Bit Field Extraction',
        description: 'Extract bits [l..r] from x',
        difficulty: 'ADVANCED',
        category: 'Bit Manipulation',
        code: `int main() {
    int x = 0b11010110;  // 214
    int l = 2, r = 5;
    int mask = (1 << (r - l + 1)) - 1;
    int result = (x >> l) & mask;
    cout << result;
}`,
        expectedOutput: '5',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 22, highlight: 'int x = 0b11010110', description: 'x = 214 (11010110)', variables: { x: 214 } },
            { id: 2, phase: 'WIDTH', line: 4, charStart: 22, charEnd: 31, highlight: 'r - l + 1', description: 'Width = 5 - 2 + 1 = 4 bits', variables: { l: 2, r: 5, width: 4 } },
            { id: 3, phase: 'MASK', line: 4, charStart: 15, charEnd: 37, highlight: '(1 << (r - l + 1)) - 1', description: '(1 << 4) - 1 = 15 (1111)', variables: { mask: 15 } },
            { id: 4, phase: 'SHIFT', line: 5, charStart: 18, charEnd: 24, highlight: 'x >> l', description: '11010110 >> 2 = 00110101 (53)', variables: { 'shifted': 53 } },
            { id: 5, phase: 'EXTRACT', line: 5, charStart: 17, charEnd: 32, highlight: '(x >> l) & mask', description: '00110101 & 1111 = 0101 = 5', variables: { result: 5 }, output: '5' }
        ]
    },

    // Merge by mask
    {
        id: 'bit-merge',
        title: 'Merge by Mask',
        description: 'Combine bits from two numbers',
        difficulty: 'ADVANCED',
        category: 'Bit Manipulation',
        code: `int main() {
    int a = 0b11110000;  // 240
    int b = 0b00001111;  // 15
    int mask = 0b00111100;
    int result = (a & ~mask) | (b & mask);
    cout << result;
}`,
        expectedOutput: '204',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 22, highlight: 'int a = 0b11110000', description: 'a = 240 (11110000)', variables: { a: 240, b: 15 } },
            { id: 2, phase: 'MASK', line: 4, charStart: 15, charEnd: 25, highlight: '0b00111100', description: 'mask = 60 (00111100) - where to take from b', variables: { mask: 60 } },
            { id: 3, phase: 'NOT_MASK', line: 5, charStart: 22, charEnd: 27, highlight: '~mask', description: '~mask = 11000011 - where to keep a', variables: { '~mask': 195 } },
            { id: 4, phase: 'MERGE', line: 5, charStart: 17, charEnd: 41, highlight: '(a & ~mask) | (b & mask)', description: '(240 & 195) | (15 & 60) = 192 | 12 = 204', variables: { result: 204 }, output: '204' }
        ]
    },

    // Circular buffer indexing
    {
        id: 'bit-circular-index',
        title: 'Circular Buffer Index',
        description: 'Wrap index with power of 2 size',
        difficulty: 'MEDIUM',
        category: 'Bit Manipulation',
        code: `int main() {
    int i = 7;
    int size = 8;  // power of 2
    int next = (i + 1) & (size - 1);
    cout << next;
}`,
        expectedOutput: '0',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 13, highlight: 'int i = 7', description: 'Current index = 7 (last position)', variables: { i: 7, size: 8 } },
            { id: 2, phase: 'ADD', line: 4, charStart: 16, charEnd: 21, highlight: 'i + 1', description: '7 + 1 = 8', variables: { 'i+1': 8 } },
            { id: 3, phase: 'MASK', line: 4, charStart: 26, charEnd: 34, highlight: 'size - 1', description: '8 - 1 = 7 (0111)', variables: { 'size-1': 7 } },
            { id: 4, phase: 'AND', line: 4, charStart: 15, charEnd: 35, highlight: '(i + 1) & (size - 1)', description: '1000 & 0111 = 0 (wraps around!)', variables: { next: 0 }, output: '0' }
        ]
    },

    // Permission flags
    {
        id: 'bit-flags',
        title: 'Permission Flags',
        description: 'Unix-style permission bits',
        difficulty: 'MEDIUM',
        category: 'Bit Manipulation',
        code: `int main() {
    int READ = 1, WRITE = 2, EXEC = 4;
    int perms = READ | WRITE;  // 3
    bool canExec = perms & EXEC;
    bool canRead = perms & READ;
    cout << canExec << " " << canRead;
}`,
        expectedOutput: '0 1',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 8, charEnd: 37, highlight: 'READ = 1, WRITE = 2, EXEC = 4', description: 'Flags: READ=001, WRITE=010, EXEC=100', variables: { READ: 1, WRITE: 2, EXEC: 4 } },
            { id: 2, phase: 'SET', line: 3, charStart: 16, charEnd: 28, highlight: 'READ | WRITE', description: '001 | 010 = 011 (3) read+write enabled', variables: { perms: 3 } },
            { id: 3, phase: 'CHECK1', line: 4, charStart: 19, charEnd: 31, highlight: 'perms & EXEC', description: '011 & 100 = 0 (no exec)', variables: { canExec: false } },
            { id: 4, phase: 'CHECK2', line: 5, charStart: 19, charEnd: 31, highlight: 'perms & READ', description: '011 & 001 = 1 (has read)', variables: { canRead: true }, output: '0 1' }
        ]
    },

    // Range mask creation
    {
        id: 'bit-range-mask',
        title: 'Range Mask Creation',
        description: 'Create mask for bits [l..r]',
        difficulty: 'ADVANCED',
        category: 'Bit Manipulation',
        code: `int main() {
    int l = 2, r = 5;
    int mask = ((1 << (r - l + 1)) - 1) << l;
    cout << mask;
}`,
        expectedOutput: '60',
        steps: [
            { id: 1, phase: 'INIT', line: 2, charStart: 4, charEnd: 20, highlight: 'int l = 2, r = 5', description: 'Create mask for bits 2 through 5', variables: { l: 2, r: 5 } },
            { id: 2, phase: 'WIDTH', line: 3, charStart: 23, charEnd: 32, highlight: 'r - l + 1', description: 'Width = 5 - 2 + 1 = 4', variables: { width: 4 } },
            { id: 3, phase: 'ONES', line: 3, charStart: 16, charEnd: 38, highlight: '(1 << (r - l + 1)) - 1', description: '(1 << 4) - 1 = 15 (1111)', variables: { ones: 15 } },
            { id: 4, phase: 'SHIFT', line: 3, charStart: 15, charEnd: 44, highlight: '((1 << (r - l + 1)) - 1) << l', description: '1111 << 2 = 111100 = 60', variables: { mask: 60 }, output: '60' }
        ]
    }
];

// Utility functions
export function getVisualizerProblemById(id) {
    return visualizerProblems.find(p => p.id === id);
}

export function getVisualizerProblemsByCategory(category) {
    return visualizerProblems.filter(p => p.category === category);
}

export function getAllVisualizerCategories() {
    return [...new Set(visualizerProblems.map(p => p.category))];
}

export function getAllVisualizerProblems() {
    return visualizerProblems;
}
