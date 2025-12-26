const fs = require('fs');
const path = require('path');

const dataDir = './src/data';
let total = 0;
let counts = {};

fs.readdirSync(dataDir)
    .filter(f => f.endsWith('.json') && f !== 'problems_template.json')
    .forEach(f => {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(dataDir, f)));
            const count = Array.isArray(data) ? data.length : (data.problems ? data.problems.length : 0);
            counts[f] = count;
            total += count;
        } catch (e) {
            counts[f] = 'error: ' + e.message;
        }
    });

console.log('=== PROBLEM COUNTS BY FILE ===');
Object.entries(counts).sort().forEach(([file, count]) => {
    console.log(`${file}: ${count}`);
});
console.log('==============================');
console.log(`TOTAL PROBLEMS: ${total}`);
