import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'src/data');

// Ensure dataDir is correct relative to where script is run
// Assuming script is in root C:\Users\dyssa\Desktop\Edit\Valkry
// And src/data is there.

console.log(`Scanning directory: ${dataDir}`);

let files = [];
try {
    files = fs.readdirSync(dataDir).filter(f => f.startsWith('problems_') && f.endsWith('.json'));
} catch (e) {
    console.error(`Error reading directory: ${e.message}`);
    process.exit(1);
}

let totalProblems = 0;
let problematicCount = 0;
const report = [];

files.forEach(file => {
    const filePath = path.join(dataDir, file);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const problems = JSON.parse(content);

        problems.forEach(p => {
            totalProblems++;
            const code = p.starterCode || "";

            // Check if main exists but NO input reading is done
            const hasMain = /int\s+main\s*\(/.test(code);
            const readsInput = /cin\s*>>|getline|scanf|read\(/.test(code);

            if (hasMain && !readsInput) {
                problematicCount++;
                report.push({
                    file: file,
                    id: p.id,
                    title: p.title,
                    // reason: "No input reading detected in main()",
                    // snippet: code.replace(/\n/g, ' ').substring(0, 100) + "..."
                });
            }
        });
    } catch (e) {
        console.error(`Error processing ${file}: ${e.message}`);
    }
});

console.log(`Total Problems Scanned: ${totalProblems}`);
console.log(`Potential Issues Found: ${problematicCount}`);
console.log(JSON.stringify(report, null, 2));
