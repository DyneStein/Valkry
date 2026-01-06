import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'src/data');

// Configuration
const DRY_RUN = process.argv.includes('--dry-run');
const SINGLE_FILE = process.argv.find(a => a.startsWith('--file='))?.split('=')[1];

console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE - WRITING CHANGES'}`);
if (SINGLE_FILE) console.log(`Single file mode: ${SINGLE_FILE}`);

let files = fs.readdirSync(dataDir).filter(f => f.startsWith('problems_') && f.endsWith('.json'));
if (SINGLE_FILE) files = files.filter(f => f === SINGLE_FILE);

let totalFixed = 0;
let totalSkipped = 0;
let alreadyOk = 0;
let errors = [];

/**
 * Parse function signature to extract name, return type, and parameters
 */
function parseFunctionSignature(code) {
    // Look for function before main
    // Match patterns like: int solve(int n) or bool check(int a[], int n)
    const lines = code.split(/\\n|\n/);

    for (const line of lines) {
        // Skip main function
        if (line.includes('int main')) continue;

        const match = line.match(/^(int|bool|long long|double|void|string)\s+(\w+)\s*\(([^)]*)\)/);
        if (match) {
            return {
                returnType: match[1],
                funcName: match[2],
                params: parseParams(match[3])
            };
        }
    }
    return null;
}

function parseParams(paramStr) {
    if (!paramStr.trim()) return [];

    const params = [];
    const parts = paramStr.split(',').map(p => p.trim());

    for (const part of parts) {
        let match;

        // Array: int a[] or int a[10] or int arr[]
        if ((match = part.match(/^(int|long long|double|char)\s+(\w+)\s*\[\d*\]$/))) {
            params.push({ type: 'int[]', name: match[2], isArray: true });
        }
        // Pointer array: int* a
        else if ((match = part.match(/^(int|long long|double|char)\s*\*\s*(\w+)$/))) {
            params.push({ type: 'int*', name: match[2], isArray: true });
        }
        // string
        else if ((match = part.match(/^string\s+(\w+)$/))) {
            params.push({ type: 'string', name: match[1], isArray: false });
        }
        // char[]
        else if ((match = part.match(/^char\s+(\w+)\s*\[\d*\]$/))) {
            params.push({ type: 'string', name: match[1], isArray: false });
        }
        // Scalar: int n, bool flag, etc
        else if ((match = part.match(/^(int|bool|long long|double|char)\s+(\w+)$/))) {
            params.push({ type: match[1], name: match[2], isArray: false });
        }
        // 2D array: int g[][3]
        else if ((match = part.match(/^(int|char)\s+(\w+)\s*\[\d*\]\s*\[\d+\]$/))) {
            params.push({ type: '2d', name: match[2], is2DArray: true });
        }
        // char* dict[] - array of strings
        else if ((match = part.match(/^char\s*\*\s*(\w+)\s*\[\d*\]$/))) {
            params.push({ type: 'string[]', name: match[1], isStringArray: true });
        }
        else {
            // Unknown format, return null to skip
            return null;
        }
    }

    return params;
}

/**
 * Generate new starterCode with proper cin reading
 */
function generateStarterCode(sig, originalCode) {
    // Check if it returns void and prints inside
    const isVoidPrinter = sig.returnType === 'void';

    let code = '#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\n';

    // Recreate function signature with vector where appropriate
    const paramList = sig.params.map(p => {
        if (p.isArray) return `vector<int>& ${p.name}`;
        if (p.is2DArray) return `vector<vector<int>>& ${p.name}`;
        if (p.isStringArray) return `vector<string>& ${p.name}`;
        if (p.type === 'string') return `string ${p.name}`;
        return `${p.type} ${p.name}`;
    }).join(', ');

    code += `${sig.returnType} ${sig.funcName}(${paramList}) {\n`;
    if (sig.returnType === 'int' || sig.returnType === 'long long' || sig.returnType === 'double') {
        code += '    return 0;\n';
    } else if (sig.returnType === 'bool') {
        code += '    return false;\n';
    } else if (sig.returnType === 'string') {
        code += '    return "";\n';
    } else {
        code += '    // TODO\n';
    }
    code += '}\n\n';

    // Generate main with cin reading
    code += 'int main() {\n';

    for (const p of sig.params) {
        if (p.type === 'string') {
            code += `    string ${p.name};\n`;
            code += `    cin >> ${p.name};\n`;
        } else if (p.isArray) {
            code += `    int ${p.name}_size;\n`;
            code += `    cin >> ${p.name}_size;\n`;
            code += `    vector<int> ${p.name}(${p.name}_size);\n`;
            code += `    for (int i = 0; i < ${p.name}_size; i++) cin >> ${p.name}[i];\n`;
        } else if (p.is2DArray) {
            code += `    int ${p.name}_rows, ${p.name}_cols;\n`;
            code += `    cin >> ${p.name}_rows >> ${p.name}_cols;\n`;
            code += `    vector<vector<int>> ${p.name}(${p.name}_rows, vector<int>(${p.name}_cols));\n`;
            code += `    for (int i = 0; i < ${p.name}_rows; i++)\n`;
            code += `        for (int j = 0; j < ${p.name}_cols; j++)\n`;
            code += `            cin >> ${p.name}[i][j];\n`;
        } else if (p.isStringArray) {
            code += `    int ${p.name}_size;\n`;
            code += `    cin >> ${p.name}_size;\n`;
            code += `    vector<string> ${p.name}(${p.name}_size);\n`;
            code += `    for (int i = 0; i < ${p.name}_size; i++) cin >> ${p.name}[i];\n`;
        } else {
            code += `    ${p.type} ${p.name};\n`;
            code += `    cin >> ${p.name};\n`;
        }
    }

    // Build function call
    const args = sig.params.map(p => p.name).join(', ');
    if (isVoidPrinter) {
        code += `    ${sig.funcName}(${args});\n`;
    } else {
        code += `    cout << ${sig.funcName}(${args});\n`;
    }
    code += '    return 0;\n}\n';

    return code;
}

// Process each file
for (const file of files) {
    const filePath = path.join(dataDir, file);
    console.log(`\nProcessing: ${file}`);

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const problems = JSON.parse(content);
        let modified = false;

        for (const p of problems) {
            const code = p.starterCode || '';

            // Skip if already has cin (already fixed)
            if (/cin\s*>>/.test(code)) {
                alreadyOk++;
                continue;
            }

            // Skip problems with no function (like "Hello World")
            const sig = parseFunctionSignature(code);
            if (!sig) {
                // Check if it's a simple main-only problem (no function to wrap)
                if (code.includes('int main') && !code.match(/(int|bool|void|string)\s+\w+\s*\([^)]*\)\s*{/)) {
                    // This is a standalone main problem, leave it
                    alreadyOk++;
                    continue;
                }
                totalSkipped++;
                errors.push({ file, id: p.id, title: p.title, reason: 'Cannot parse function' });
                continue;
            }

            if (!sig.params || sig.params.length === 0) {
                // No parameters means no input needed
                alreadyOk++;
                continue;
            }

            // Generate new starter code
            const newStarterCode = generateStarterCode(sig, code);

            // Apply changes
            p.starterCode = newStarterCode;
            modified = true;
            totalFixed++;
        }

        // Write back if modified and not dry run
        if (modified && !DRY_RUN) {
            fs.writeFileSync(filePath, JSON.stringify(problems, null, 4), 'utf8');
            console.log(`  ✓ Updated ${file}`);
        } else if (modified) {
            console.log(`  [DRY RUN] Would update ${file}`);
        }

    } catch (e) {
        console.error(`  ✗ Error: ${e.message}`);
        errors.push({ file, reason: e.message });
    }
}

console.log(`\n${'='.repeat(50)}`);
console.log(`Total Fixed: ${totalFixed}`);
console.log(`Already OK (has cin or no input): ${alreadyOk}`);
console.log(`Skipped (parse errors): ${totalSkipped}`);

if (errors.length > 0 && errors.length <= 30) {
    console.log('\nSkipped problems:');
    errors.forEach(e => console.log(`  - ${e.file}: ${e.id || 'N/A'} - ${e.reason}`));
} else if (errors.length > 30) {
    console.log(`\n(${errors.length} errors, too many to list)`);
}
