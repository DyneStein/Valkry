const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f.startsWith('problems_'));

const results = [];
let totalProblemsNeedingFix = 0;

files.forEach(file => {
    try {
        const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
        const problems = JSON.parse(content);

        const needsFix = problems.filter(p => !p.testCases || p.testCases.length < 3);

        if (needsFix.length > 0) {
            console.log(`\n=== ${file} ===`);
            needsFix.forEach(p => {
                const count = p.testCases ? p.testCases.length : 0;
                console.log(`  ${p.id}: "${p.title}" - ${count} test cases`);
                totalProblemsNeedingFix++;
            });
        }
    } catch (e) {
        console.log(`ERROR in ${file}: ${e.message}`);
    }
});

console.log(`\n==============================`);
console.log(`TOTAL PROBLEMS NEEDING FIX: ${totalProblemsNeedingFix}`);
