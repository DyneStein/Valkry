const fs = require('fs');
const path = require('path');

const dataDir = './src/data';
const files = fs.readdirSync(dataDir).filter(f =>
    f.endsWith('.json') && f.startsWith('problems_') && !f.includes('template')
);

let issues = [];
let totalProblems = 0;
let totalTestCases = 0;

files.forEach(file => {
    try {
        const problems = JSON.parse(fs.readFileSync(path.join(dataDir, file)));
        problems.forEach(prob => {
            totalProblems++;
            if (prob.testCases) {
                prob.testCases.forEach((tc, i) => {
                    totalTestCases++;
                    // Check for truly missing/null values (empty string is valid for no-input problems)
                    const hasNullOutput = tc.expectedOutput === undefined || tc.expectedOutput === null;
                    const hasNullInput = tc.input === undefined || tc.input === null;
                    const hasNullExplanation = tc.explanation === undefined || tc.explanation === null || tc.explanation === '';

                    if (hasNullOutput || hasNullInput || hasNullExplanation) {
                        issues.push({
                            file: file,
                            id: prob.id,
                            title: prob.title,
                            tcIndex: i,
                            input: tc.input !== undefined ? String(tc.input).substring(0, 30) : 'NULL',
                            output: tc.expectedOutput !== undefined ? String(tc.expectedOutput).substring(0, 30) : 'NULL',
                            explanation: tc.explanation ? tc.explanation.substring(0, 30) : 'NULL',
                            issue: hasNullOutput ? 'NULL_OUTPUT' : (hasNullInput ? 'NULL_INPUT' : 'NULL_EXPLANATION')
                        });
                    }
                });
            } else {
                issues.push({
                    file: file,
                    id: prob.id,
                    title: prob.title,
                    issue: 'NO_TESTCASES'
                });
            }
        });
    } catch (e) {
        console.log('Parse error in', file, ':', e.message);
    }
});

console.log('=== Test Case Analysis ===');
console.log('Total problems:', totalProblems);
console.log('Total test cases:', totalTestCases);
console.log('Issues found:', issues.length);
console.log('');

if (issues.length > 0) {
    console.log('Issues by type:');
    const byType = {};
    issues.forEach(i => {
        byType[i.issue] = (byType[i.issue] || 0) + 1;
    });
    Object.entries(byType).forEach(([type, count]) => console.log('  ', type, ':', count));
    console.log('');

    console.log('All issues:');
    issues.forEach(i => {
        console.log(`  ${i.file} | ${i.id} | TC#${i.tcIndex} | ${i.issue}`);
    });
}
