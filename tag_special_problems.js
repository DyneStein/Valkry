import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'src/data');

// List of problem IDs that need special handling (from audit)
const specialProblems = [
    // Hello World / No function
    'easy6', 'easy90', 'fun9',
    // Bit manipulation with special signatures
    'e452', 'e453', 'fin23', 'fin25',
    // Stack/Queue class problems
    'e552', 'e553', 'e554', 'e558', 'fin39', 'h164',
    // Tree problems
    'e601', 'e602', 'e603', 'e604', 'e605', 'e606', 'e607', 'e608', 'e609', 'e610',
    'tree11', 'tree12', 'tree13', 'tree14', 'tree15', 'tree16', 'tree17', 'tree18', 'tree19', 'tree20',
    'extra11', 'extra12', 'hard23', 'hard24', 'h166',
    // Linked List problems
    'fin29', 'fin30', 'fin31', 'fin32', 'hard17', 'hard18',
    'm36', 'm37', 'm38', 'm39', 'm40', 'med31', 'med32', 'med33',
    // BST / Tree construction
    'med34', 'med35', 'med36', 'med37', 'med38',
    // Graph problems
    'graph11', 'graph18', 'med41',
    // Class-based design problems
    'hard7', 'hard25', 'hard26', 'h129', 'h163', 'h165', 'h167', 'h168',
    'ext31', 'ext36', 'ext38', 'ext39', 'fin46', 'fin50', 'm223', 'm225',
    // Logic/probability (no code solution)
    'logic5', 'logic6',
    // OOP examples
    'prac4', 'prac24', 'prac25',
    // Others with special input
    'easy59', 'e410'
];

const instructions = {
    tree: "This problem uses a binary tree structure. The input format is a level-order array like [1,2,3,null,4]. Your solution should build the tree from this input.",
    linkedList: "This problem uses a linked list. The input is given as an array [1,2,3,4,5]. Build your linked list from this array before processing.",
    class: "This is a class design problem. Implement the required methods. The judge tests method calls, not stdin input.",
    graph: "This problem uses a graph structure. Parse the adjacency list or edge list from the input to build your graph.",
    bitwise: "This problem involves bit manipulation with unsigned integers. Handle the input as a 32-bit unsigned value.",
    noInput: "This problem has no input - just print the required output directly.",
    oop: "This is an OOP concept demonstration. Focus on implementing the pattern correctly."
};

function categorize(id, title) {
    const t = title.toLowerCase();
    if (t.includes('tree') || t.includes('bst') || t.includes('invert') || t.includes('serialize')) return 'tree';
    if (t.includes('list') || t.includes('linked') || t.includes('node')) return 'linkedList';
    if (t.includes('cache') || t.includes('stack') || t.includes('queue') || t.includes('stream') || t.includes('design') || t.includes('implement')) return 'class';
    if (t.includes('graph') || t.includes('clone')) return 'graph';
    if (t.includes('bits') || t.includes('reverse bits')) return 'bitwise';
    if (t.includes('hello') || t.includes('swap')) return 'noInput';
    if (t.includes('constructor') || t.includes('inheritance') || t.includes('grade')) return 'oop';
    return 'class'; // default
}

let files = fs.readdirSync(dataDir).filter(f => f.startsWith('problems_') && f.endsWith('.json'));
let tagged = 0;

for (const file of files) {
    const filePath = path.join(dataDir, file);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const problems = JSON.parse(content);
        let modified = false;

        for (const p of problems) {
            if (specialProblems.includes(p.id)) {
                const cat = categorize(p.id, p.title);
                p.requiresManualInput = true;
                p.inputCategory = cat;
                p.inputInstructions = instructions[cat];
                modified = true;
                tagged++;
                console.log(`Tagged: ${p.id} - ${p.title} (${cat})`);
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(problems, null, 4), 'utf8');
        }
    } catch (e) {
        // Skip template files etc
    }
}

console.log(`\nTotal tagged: ${tagged}`);
