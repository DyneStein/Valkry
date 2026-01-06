import { problems } from '../data/problems';

// ==================== CONFIGURATION ====================

// Synonyms map for better semantic matching
const SYNONYMS = {
    'sum': ['add', 'plus', 'addition', 'total'],
    'add': ['sum', 'plus', 'total', 'combine'],
    'sub': ['subtract', 'minus', 'difference', 'decrease'],
    'subtract': ['minus', 'difference', 'remove'],
    'multiply': ['product', 'times', 'star'],
    'divide': ['quotient', 'split', 'ratio'],
    'derivative': ['calculus', 'slope'],

    // Data Structures
    'array': ['vector', 'list', 'sequence', 'continuous', 'arrays'],
    'linked list': ['node', 'pointer', 'chain', 'linkedlist'],
    'list': ['array', 'vector', 'sequence'],
    'tree': ['binary', 'bst', 'node', 'hierarchy', 'heap', 'trees'],
    'graph': ['network', 'vertex', 'edge', 'bfs', 'dfs', 'graphs'],
    'stack': ['lifo', 'push', 'pop', 'stacks'],
    'queue': ['fifo', 'enqueue', 'dequeue', 'queues'],
    'hash': ['map', 'dictionary', 'table', 'lookup', 'key', 'hashing'],
    'map': ['hash', 'dictionary', 'associative'],

    // Algorithms
    'dp': ['dynamic programming', 'memoization', 'tabulation', 'optimization'],
    'dynamic programming': ['dp', 'memoization'],
    'recursion': ['recursive', 'base case', 'self-reference', 'recurse'],
    'sort': ['order', 'arrange', 'sorted', 'bubble', 'merge', 'quick', 'sorting'],
    'search': ['find', 'locate', 'detect', 'binary', 'searching'],
    'greedy': ['best', 'optimal', 'choice'],

    // Concepts
    'bit': ['binary', 'xor', 'and', 'or', 'shift', 'bitwise', 'bits'],
    'bitwise': ['bit', 'binary', 'xor', 'and', 'or', 'manipulation'],
    'bits': ['bit', 'binary'],
    'string': ['text', 'char', 'characters', 'str', 'strings'],
    'math': ['number', 'algebra', 'arithmetic', 'formula', 'calculation', 'integer', 'int'],
    'pointer': ['reference', 'memory', 'address', 'pointers'],

    // Common Typos/Terms
    'dijkstra': ['shortest path', 'graph'],
    'bfs': ['breadth', 'graph', 'traversal'],
    'dfs': ['depth', 'graph', 'traversal']
};

// Difficulty synonyms
const DIFFICULTY_MAP = {
    'easy': 'EASY',
    'beginner': 'EASY',
    'simple': 'EASY',
    'basic': 'EASY',
    'medium': 'MEDIUM',
    'intermediate': 'MEDIUM',
    'normal': 'MEDIUM',
    'hard': 'HARD',
    'advanced': 'HARD',
    'expert': 'HARD',
    'difficult': 'HARD',
    'tough': 'HARD'
};

// Stop words to ignore
const STOP_WORDS = new Set([
    'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'about', 'how', 'what', 'where', 'when', 'who', 'show', 'me', 'find',
    'check', 'problem', 'problems', 'question', 'questions', 'exercise',
    'practice', 'solve', 'solution', 'code', 'program', 'example', 'like'
]);

// ==================== HELPERS ====================

// Levenshtein distance for fuzzy matching
function levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1  // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

function stem(word) {
    // Very basic stemming
    if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
    if (word.endsWith('ing')) return word.slice(0, -3);
    if (word.endsWith('ed')) return word.slice(0, -2);
    // bitwise -> bit
    if (word.endsWith('wise') && word.length > 4) return word.slice(0, -4);
    return word;
}

// ==================== ENGINE ====================

/**
 * Parses user query to extract filters and terms.
 */
function parseQuery(query) {
    const tokens = query.toLowerCase().split(/[\s,?.!]+/).filter(t => t);
    const result = {
        difficulty: null,
        categoryKeywords: [],
        searchTerms: [],
        originalTokens: tokens
    };

    for (const token of tokens) {
        // Check difficulty
        if (DIFFICULTY_MAP[token]) {
            result.difficulty = DIFFICULTY_MAP[token];
            continue;
        }

        if (!STOP_WORDS.has(token)) {
            result.searchTerms.push(token);
            // Also add stemmed version if different
            const stemmed = stem(token);
            if (stemmed !== token && stemmed.length > 2) {
                result.searchTerms.push(stemmed);
            }
        }
    }

    return result;
}

/**
 * Calculates a match score for a problem against parsed query.
 */
function calculateScore(problem, parsedQuery) {
    let score = 0;
    const { searchTerms, difficulty } = parsedQuery;

    // 1. Difficulty Match (Strict if specified)
    if (difficulty) {
        if (problem.difficulty === difficulty) {
            score += 50;
        } else {
            return -1;
        }
    }

    // 2. Text Matching
    const pTitle = problem.title.toLowerCase();
    const pDesc = problem.description.toLowerCase();
    const pCat = problem.category.toLowerCase();
    const pCatWords = pCat.split(/\s+/);
    const pTitleWords = pTitle.split(/\s+/);

    for (const term of searchTerms) {
        let termMatched = false;
        let bestTermScore = 0;

        // Expand with synonyms
        const synonyms = SYNONYMS[term] || [];
        // Also expand stemming for synonyms
        const stemmedTerm = stem(term);
        const stemmingSynonyms = SYNONYMS[stemmedTerm] || [];

        const termsToCheck = [term, stemmedTerm, ...synonyms, ...stemmingSynonyms];
        const uniqueTerms = [...new Set(termsToCheck)]; // Dedupe

        for (const t of uniqueTerms) {
            if (t.length < 2) continue; // Skip single chars unless meaningful

            let currentTermScore = 0;

            // Title Match (Highest weight)
            if (pTitle.includes(t)) {
                currentTermScore = Math.max(currentTermScore, 20);
                if (pTitle === t) currentTermScore += 10; // Exact
            }

            // Fuzzy Title Match (for typos)
            for (const word of pTitleWords) {
                if (Math.abs(word.length - t.length) <= 2) {
                    const dist = levenshtein(word, t);
                    // Allow 1 edit for short words, 2 for long
                    const allowedEdits = t.length > 5 ? 2 : 1;
                    if (dist <= allowedEdits) {
                        currentTermScore = Math.max(currentTermScore, 15); // Slightly less than exact
                    }
                }
            }

            // Category Match
            if (pCat.includes(t)) {
                currentTermScore = Math.max(currentTermScore, 15);
            }
            // Fuzzy Category Match
            for (const word of pCatWords) {
                if (Math.abs(word.length - t.length) <= 2) {
                    const dist = levenshtein(word, t);
                    if (dist <= (t.length > 5 ? 2 : 1)) {
                        currentTermScore = Math.max(currentTermScore, 10);
                    }
                }
            }

            // Description Match
            if (pDesc.includes(t)) {
                currentTermScore = Math.max(currentTermScore, 5);
            }

            if (currentTermScore > 0) {
                termMatched = true;
                bestTermScore = Math.max(bestTermScore, currentTermScore);
            }
        }

        score += bestTermScore;
        if (termMatched) score += 2;
    }

    return score;
}

/**
 * Main search function
 */
export function searchProblems(query, activeFilters = {}) {
    if (!query || query.trim() === '') {
        return problems.filter(p => {
            if (activeFilters.difficulty && activeFilters.difficulty !== 'ALL' && p.difficulty !== activeFilters.difficulty) return false;
            if (activeFilters.category && activeFilters.category !== 'ALL' && p.category !== activeFilters.category) return false;
            return true;
        });
    }

    const parsed = parseQuery(query);

    // Calculate scores
    const scored = problems.map(p => {
        let valid = true;
        if (activeFilters.difficulty && activeFilters.difficulty !== 'ALL' && p.difficulty !== activeFilters.difficulty) {
            valid = false;
        }
        if (activeFilters.category && activeFilters.category !== 'ALL' && p.category !== activeFilters.category) {
            valid = false;
        }

        if (!valid) return { problem: p, score: -1 };

        return {
            problem: p,
            score: calculateScore(p, parsed)
        };
    });

    // Filter and Sort
    const results = scored
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.problem);

    return results;
}

export function getSuggestions(query) {
    if (!query || query.length < 2) return [];

    const lower = query.toLowerCase();
    const suggestions = new Set();
    const seen = new Set();

    problems.slice(0, 200).forEach(p => {
        if (seen.size > 5) return;

        if (p.title.toLowerCase().includes(lower) && !seen.has(p.title)) {
            suggestions.add(p.title);
            seen.add(p.title);
        }
        if (p.category.toLowerCase().includes(lower) && !seen.has(p.category)) {
            suggestions.add(p.category);
            seen.add(p.title);
        }
    });

    return Array.from(suggestions).slice(0, 5);
}
