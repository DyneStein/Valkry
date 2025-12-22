// C++ Problems for Arena Battles - VALKRY Platform
// 2000+ Programming Questions across all difficulty levels

// ==================== EASY PROBLEMS (13 files x 50 = 650) ====================
import problemsEasy1 from './problems_easy_1.json';
import problemsEasy2 from './problems_easy_2.json';
import problemsEasy3 from './problems_easy_3.json';
import problemsEasy4 from './problems_easy_4.json';
import problemsEasy5 from './problems_easy_5.json';
import problemsEasy6 from './problems_easy_6.json';
import problemsEasy7 from './problems_easy_7.json';
import problemsEasy8 from './problems_easy_8.json';
import problemsEasy9 from './problems_easy_9.json';
import problemsEasy10 from './problems_easy_10.json';
import problemsEasy11 from './problems_easy_11.json';
import problemsEasy12 from './problems_easy_12.json';
import problemsEasy13 from './problems_easy_13.json';

// ==================== MEDIUM PROBLEMS (10 files) ====================
import problemsMedium1 from './problems_medium_1.json';
import problemsMedium2 from './problems_medium_2.json';
import problemsMedium3 from './problems_medium_3.json';
import problemsMedium4 from './problems_medium_4.json';
import problemsMedium5 from './problems_medium_5.json';
import problemsMedium6 from './problems_medium_6.json';
import problemsMedium7 from './problems_medium_7.json';
import problemsMedium8 from './problems_medium_8.json';
import problemsMedium9 from './problems_medium_9.json';
import problemsMedium10 from './problems_medium_10.json';

// ==================== HARD PROBLEMS (8 files) ====================
import problemsHard1 from './problems_hard_1.json';
import problemsHard2 from './problems_hard_2.json';
import problemsHard3 from './problems_hard_3.json';
import problemsHard4 from './problems_hard_4.json';
import problemsHard5 from './problems_hard_5.json';
import problemsHard6 from './problems_hard_6.json';
import problemsHard7 from './problems_hard_7.json';
import problemsHard8 from './problems_hard_8.json';

// ==================== CORE CONCEPTUAL (8 files x 25 = 200) ====================
import problemsCore1 from './problems_core_1.json';
import problemsCore2 from './problems_core_2.json';
import problemsCore3 from './problems_core_3.json';
import problemsCore4 from './problems_core_4.json';
import problemsCore5 from './problems_core_5.json';
import problemsCore6 from './problems_core_6.json';
import problemsCore7 from './problems_core_7.json';
import problemsCore8 from './problems_core_8.json';

// ==================== TOPIC SPECIFIC ====================
import problemsRecursion1 from './problems_recursion_1.json';
import problemsRecursion2 from './problems_recursion_2.json';
import problemsBits1 from './problems_bits_1.json';
import problemsLogic1 from './problems_logic_1.json';
import problemsArrays1 from './problems_arrays_1.json';
import problemsStrings1 from './problems_strings_1.json';
import problemsDp1 from './problems_dp_1.json';
import problemsGraph1 from './problems_graph_1.json';
import problemsTrees1 from './problems_trees_1.json';

// ==================== FUNDAMENTALS (4 files x 25 = 100) ====================
import problemsFundamentals1 from './problems_fundamentals_1.json';
import problemsFundamentals2 from './problems_fundamentals_2.json';
import problemsFundamentals3 from './problems_fundamentals_3.json';
import problemsFundamentals4 from './problems_fundamentals_4.json';

// ==================== PRACTICE & EXTRA ====================
import problemsPractice1 from './problems_practice_1.json';
import problemsPractice2 from './problems_practice_2.json';
import problemsPractice3 from './problems_practice_3.json';
import problemsExtra1 from './problems_extra_1.json';
import problemsExtra2 from './problems_extra_2.json';
import problemsExtra3 from './problems_extra_3.json';
import problemsMath1 from './problems_math_1.json';
import problemsDs1 from './problems_ds_1.json';

// ==================== FINAL COLLECTION (5 files x 25 = 125) ====================
import problemsFinal1 from './problems_final_1.json';
import problemsFinal2 from './problems_final_2.json';
import problemsFinal3 from './problems_final_3.json';
import problemsFinal4 from './problems_final_4.json';
import problemsFinal5 from './problems_final_5.json';

// ==================== COMBINE BY DIFFICULTY ====================
const allEasyProblems = [
    ...problemsEasy1, ...problemsEasy2, ...problemsEasy3, ...problemsEasy4,
    ...problemsEasy5, ...problemsEasy6, ...problemsEasy7, ...problemsEasy8,
    ...problemsEasy9, ...problemsEasy10, ...problemsEasy11, ...problemsEasy12,
    ...problemsEasy13
];

const allMediumProblems = [
    ...problemsMedium1, ...problemsMedium2, ...problemsMedium3, ...problemsMedium4,
    ...problemsMedium5, ...problemsMedium6, ...problemsMedium7, ...problemsMedium8,
    ...problemsMedium9, ...problemsMedium10
];

const allHardProblems = [
    ...problemsHard1, ...problemsHard2, ...problemsHard3, ...problemsHard4,
    ...problemsHard5, ...problemsHard6, ...problemsHard7, ...problemsHard8
];

// Core conceptual + topic specific + fundamentals
const allCoreProblems = [
    ...problemsCore1, ...problemsCore2, ...problemsCore3, ...problemsCore4,
    ...problemsCore5, ...problemsCore6, ...problemsCore7, ...problemsCore8,
    ...problemsRecursion1, ...problemsRecursion2, ...problemsBits1, ...problemsLogic1,
    ...problemsFundamentals1, ...problemsFundamentals2, ...problemsFundamentals3, ...problemsFundamentals4
];

// Topic-based + practice + extra + final collections
const allTopicProblems = [
    ...problemsArrays1, ...problemsStrings1, ...problemsDp1,
    ...problemsGraph1, ...problemsTrees1,
    ...problemsPractice1, ...problemsPractice2, ...problemsPractice3,
    ...problemsExtra1, ...problemsExtra2, ...problemsExtra3,
    ...problemsMath1, ...problemsDs1,
    ...problemsFinal1, ...problemsFinal2, ...problemsFinal3, ...problemsFinal4, ...problemsFinal5
];

// ==================== MAIN EXPORT ====================
export const problems = [
    ...allEasyProblems,
    ...allMediumProblems,
    ...allHardProblems,
    ...allCoreProblems,
    ...allTopicProblems
];

// ==================== LOGGING ====================
console.log(`
╔═══════════════════════════════════════════════════════════╗
║              VALKRY Problem Bank - Loaded                ║
╠═══════════════════════════════════════════════════════════╣
║  EASY    : ${String(allEasyProblems.length).padStart(4)} questions                           ║
║  MEDIUM  : ${String(allMediumProblems.length).padStart(4)} questions                           ║
║  HARD    : ${String(allHardProblems.length).padStart(4)} questions                           ║
║  CORE    : ${String(allCoreProblems.length).padStart(4)} questions (Recursion, Bits, etc)    ║
║  TOPIC   : ${String(allTopicProblems.length).padStart(4)} questions (Arrays, DP, Graphs, etc) ║
╠═══════════════════════════════════════════════════════════╣
║  TOTAL   : ${String(problems.length).padStart(4)} questions                           ║
╚═══════════════════════════════════════════════════════════╝
`);

// ==================== UTILITY FUNCTIONS ====================

export function getRandomProblem() {
    return problems[Math.floor(Math.random() * problems.length)];
}

export function getProblemById(id) {
    return problems.find(p => p.id === id);
}

export function getProblemsByDifficulty(difficulty) {
    return problems.filter(p => p.difficulty === difficulty);
}

export function getRandomProblemByDifficulty(difficulty) {
    const filtered = getProblemsByDifficulty(difficulty);
    if (filtered.length === 0) return getRandomProblem();
    return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getProblemsByCategory(category) {
    return problems.filter(p => p.category === category);
}

export function getAllCategories() {
    return [...new Set(problems.map(p => p.category))];
}

export function getCountByDifficulty() {
    return {
        EASY: allEasyProblems.length,
        MEDIUM: allMediumProblems.length,
        HARD: allHardProblems.length,
        CORE: allCoreProblems.length,
        TOPIC: allTopicProblems.length,
        total: problems.length
    };
}

export function getRandomProblemByCategory(category) {
    const filtered = getProblemsByCategory(category);
    if (filtered.length === 0) return getRandomProblem();
    return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getProblemsByDifficultyAndCategory(difficulty, category) {
    return problems.filter(p => p.difficulty === difficulty && p.category === category);
}

export function getRandomProblemByDifficultyAndCategory(difficulty, category) {
    const filtered = getProblemsByDifficultyAndCategory(difficulty, category);
    if (filtered.length === 0) return getRandomProblemByDifficulty(difficulty);
    return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getCoreProblems() {
    return allCoreProblems;
}

export function getRandomCoreProblem() {
    return allCoreProblems[Math.floor(Math.random() * allCoreProblems.length)];
}

export function getCoreProblemsByCategory(category) {
    return allCoreProblems.filter(p => p.category === category);
}

export function getRecursionProblems() {
    return problems.filter(p => p.category === 'Recursion');
}

export function getBitManipulationProblems() {
    return problems.filter(p => p.category === 'Bit Manipulation');
}

export function getFundamentalProblems() {
    return problems.filter(p => p.category === 'Fundamentals');
}

export function getDPProblems() {
    return problems.filter(p => p.category === 'DP');
}

export function getGraphProblems() {
    return problems.filter(p => p.category === 'Graph');
}

export function getTreeProblems() {
    return problems.filter(p => p.category === 'Trees');
}

export function getArrayProblems() {
    return problems.filter(p => p.category === 'Arrays');
}

export function getStringProblems() {
    return problems.filter(p => p.category === 'Strings');
}
