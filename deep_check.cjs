const fs = require('fs');
const path = require('path');

const dataDir = './src/data';
const files = fs.readdirSync(dataDir).filter(f =>
    f.endsWith('.json') && f.startsWith('problems_') && !f.includes('template')
);

// Generic/placeholder patterns to detect
const genericPatterns = [
    /^test\s*\d*$/i,
    /^example\s*\d*$/i,
    /^sample\s*\d*$/i,
    /^case\s*\d*$/i,
    /^input\s*\d*$/i,
    /^output\s*\d*$/i,
    /^placeholder/i,
    /^todo/i,
    /^tbd/i,
    /^n\/a$/i,
    /^expected$/i,
    /^result$/i,
];

const genericExplanations = [
    /^test case$/i,
    /^example$/i,
    /^sample$/i,
    /^basic test$/i,
    /^generic test$/i,
    /^placeholder$/i,
    /^todo$/i,
    /^tbd$/i,
    /^n\/a$/i,
];

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

                    // Check for generic input
                    const inputStr = String(tc.input || '');
                    const isGenericInput = genericPatterns.some(p => p.test(inputStr.trim()));

                    // Check for generic output  
                    const outputStr = String(tc.expectedOutput || '');
                    const isGenericOutput = genericPatterns.some(p => p.test(outputStr.trim()));

                    // Check for generic explanation
                    const explStr = String(tc.explanation || '');
                    const isGenericExplanation = genericExplanations.some(p => p.test(explStr.trim()));

                    // Check if all test cases have identical input/output (suspicious)
                    const allSame = prob.testCases.length >= 3 &&
                        prob.testCases.every(t => t.expectedOutput === prob.testCases[0].expectedOutput &&
                            t.input === prob.testCases[0].input);

                    if (isGenericInput || isGenericOutput || isGenericExplanation) {
                        issues.push({
                            file,
                            id: prob.id,
                            title: prob.title,
                            tcIndex: i,
                            type: isGenericInput ? 'GENERIC_INPUT' : (isGenericOutput ? 'GENERIC_OUTPUT' : 'GENERIC_EXPLANATION'),
                            value: isGenericInput ? inputStr : (isGenericOutput ? outputStr : explStr)
                        });
                    }

                    if (allSame && i === 0) {
                        issues.push({
                            file,
                            id: prob.id,
                            title: prob.title,
                            tcIndex: -1,
                            type: 'ALL_IDENTICAL',
                            value: `All ${prob.testCases.length} test cases have identical input/output`
                        });
                    }
                });
            }
        });
    } catch (e) {
        console.log('Parse error:', file, e.message);
    }
});

console.log('=== Deep Test Case Quality Check ===');
console.log('Total problems:', totalProblems);
console.log('Total test cases:', totalTestCases);
console.log('Issues found:', issues.length);
console.log('');

if (issues.length > 0) {
    // Group by type
    const byType = {};
    issues.forEach(i => {
        byType[i.type] = byType[i.type] || [];
        byType[i.type].push(i);
    });

    Object.entries(byType).forEach(([type, items]) => {
        console.log(`\n${type} (${items.length} issues):`);
        items.forEach(i => {
            console.log(`  ${i.file} | ${i.id} | ${i.title} | TC#${i.tcIndex}`);
            console.log(`    Value: "${i.value.substring(0, 50)}"`);
        });
    });
} else {
    console.log('All test cases appear to be problem-specific!');
}
