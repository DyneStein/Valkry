import React, { useState, useMemo } from 'react';
import { getAllCategories } from '../data/problems';
import { ChevronDown, ChevronRight, Eye, EyeOff, ChevronLeft, ChevronsLeft, ChevronsRight, Info } from 'lucide-react';
import Editor from '@monaco-editor/react';
import SmartSearch from '../components/SmartSearch';
import { searchProblems } from '../services/searchService';

const ITEMS_PER_PAGE = 20;

const LearningPage = () => {
    const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedProblem, setExpandedProblem] = useState(null);
    const [showSolution, setShowSolution] = useState({});
    const [showAllTestCases, setShowAllTestCases] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const categories = useMemo(() => ['ALL', ...getAllCategories()], []);

    const filteredProblems = useMemo(() => {
        return searchProblems(searchQuery, {
            difficulty: selectedDifficulty,
            category: selectedCategory
        });
    }, [selectedDifficulty, selectedCategory, searchQuery]);

    // Pagination
    const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedProblems = filteredProblems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [selectedDifficulty, selectedCategory, searchQuery]);

    const toggleProblem = (id) => {
        setExpandedProblem(expandedProblem === id ? null : id);
        if (expandedProblem === id) {
            setShowSolution({});
        }
    };

    const toggleSolution = (id, e) => {
        e.stopPropagation();
        setShowSolution(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const getDifficultyStyle = (diff) => {
        switch (diff) {
            case 'EASY': return { background: 'rgba(48, 209, 88, 0.12)', color: 'var(--green)' };
            case 'MEDIUM': return { background: 'rgba(255, 159, 10, 0.12)', color: 'var(--orange)' };
            case 'HARD': return { background: 'rgba(255, 69, 58, 0.12)', color: 'var(--red)' };
            default: return { background: 'rgba(0, 113, 227, 0.12)', color: 'var(--accent)' };
        }
    };

    return (
        <div className="page">
            <div className="container" style={{ paddingTop: '56px', paddingBottom: '56px' }}>
                {/* Header */}
                <div style={{ marginBottom: '48px' }}>
                    <p className="caption" style={{ marginBottom: '8px' }}>Learn</p>
                    <h1 className="headline">Master C++ Programming.</h1>
                    <p className="body-large" style={{ marginTop: '12px' }}>
                        600+ curated problems with solutions and explanations.
                    </p>
                </div>

                {/* Filters */}
                <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <SmartSearch
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Try 'hard array problems' or 'dynamic programming'..."
                            />
                        </div>
                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="input"
                            style={{ width: 'auto', cursor: 'pointer', fontFamily: 'inherit', height: '48px' }}
                        >
                            <option value="ALL">All Levels</option>
                            <option value="EASY">Easy</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HARD">Hard</option>
                        </select>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="input"
                            style={{ width: 'auto', cursor: 'pointer', fontFamily: 'inherit', height: '48px' }}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat === 'ALL' ? 'All Categories' : cat}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                        <span className="caption">
                            Found {filteredProblems.length} results
                        </span>
                        <span className="caption">
                            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProblems.length)} of {filteredProblems.length}
                        </span>
                    </div>
                </div>

                {/* Problems Table */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>#</th>
                                <th>Problem</th>
                                <th style={{ width: '100px' }}>Level</th>
                                <th style={{ width: '140px' }}>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedProblems.map((problem, index) => (
                                <React.Fragment key={problem.id}>
                                    <tr
                                        onClick={() => toggleProblem(problem.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td className="mono" style={{ color: 'var(--text-tertiary)' }}>
                                            {startIndex + index + 1}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {expandedProblem === problem.id ?
                                                    <ChevronDown size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} /> :
                                                    <ChevronRight size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                                                }
                                                <div>
                                                    <div style={{ fontWeight: '500' }}>{problem.title}</div>
                                                    <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                                                        {problem.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge" style={getDifficultyStyle(problem.difficulty)}>
                                                {problem.difficulty}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{problem.category}</td>
                                    </tr>
                                    {expandedProblem === problem.id && (
                                        <tr>
                                            <td colSpan={4} style={{ padding: 0, background: 'var(--bg-secondary)' }}>
                                                <div style={{ padding: '24px' }}>
                                                    <div className="grid grid-2" style={{ marginBottom: '24px' }}>
                                                        <div>
                                                            <span className="caption" style={{ display: 'block', marginBottom: '8px' }}>
                                                                DESCRIPTION
                                                            </span>
                                                            <p style={{ color: 'var(--text)', lineHeight: '1.5' }}>
                                                                {problem.description}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="caption" style={{ display: 'block', marginBottom: '8px' }}>
                                                                EXPECTED OUTPUT
                                                            </span>
                                                            <code className="mono" style={{
                                                                background: 'var(--bg-elevated)',
                                                                padding: '10px 14px',
                                                                borderRadius: '8px',
                                                                display: 'block',
                                                                color: 'var(--green)'
                                                            }}>
                                                                {problem.expectedOutput}
                                                            </code>
                                                        </div>
                                                    </div>

                                                    {/* Test Cases Section */}
                                                    {problem.testCases && problem.testCases.length > 0 && (
                                                        <div style={{ marginBottom: '24px' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                                <span className="caption">
                                                                    TEST CASES ({problem.testCases.length})
                                                                </span>
                                                                {problem.testCases.length > 3 && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setShowAllTestCases(prev => ({ ...prev, [problem.id]: !prev[problem.id] }));
                                                                        }}
                                                                        style={{
                                                                            background: 'transparent',
                                                                            border: 'none',
                                                                            color: 'var(--accent)',
                                                                            cursor: 'pointer',
                                                                            fontSize: '13px',
                                                                            fontWeight: '500'
                                                                        }}
                                                                    >
                                                                        {showAllTestCases[problem.id] ? 'Show Less' : `Show All ${problem.testCases.length}`}
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                {(showAllTestCases[problem.id] ? problem.testCases : problem.testCases.slice(0, 3)).map((tc, idx) => (
                                                                    <div
                                                                        key={idx}
                                                                        style={{
                                                                            background: 'var(--bg-elevated)',
                                                                            borderRadius: '10px',
                                                                            padding: '12px 14px',
                                                                            border: '1px solid var(--border)'
                                                                        }}
                                                                    >
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                                                                            <div style={{ flex: 1 }}>
                                                                                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: '600', letterSpacing: '0.5px' }}>
                                                                                    INPUT
                                                                                </span>
                                                                                <code className="mono" style={{ display: 'block', fontSize: '13px', color: 'var(--text)', marginTop: '4px' }}>
                                                                                    {tc.input}
                                                                                </code>
                                                                            </div>
                                                                            <div style={{ flex: 1 }}>
                                                                                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: '600', letterSpacing: '0.5px' }}>
                                                                                    OUTPUT
                                                                                </span>
                                                                                <code className="mono" style={{ display: 'block', fontSize: '13px', color: 'var(--green)', marginTop: '4px' }}>
                                                                                    {tc.expectedOutput}
                                                                                </code>
                                                                            </div>
                                                                        </div>
                                                                        {tc.explanation && (
                                                                            <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                                                                <Info size={12} style={{ color: 'var(--text-tertiary)', marginTop: '2px', flexShrink: 0 }} />
                                                                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                                                                    {tc.explanation}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div style={{ marginBottom: '24px' }}>
                                                        <span className="caption" style={{ display: 'block', marginBottom: '12px' }}>
                                                            STARTER CODE
                                                        </span>
                                                        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                                            <Editor
                                                                height="160px"
                                                                defaultLanguage="cpp"
                                                                value={problem.starterCode}
                                                                theme="vs-dark"
                                                                options={{
                                                                    readOnly: true,
                                                                    minimap: { enabled: false },
                                                                    fontSize: 13,
                                                                    scrollBeyondLastLine: false,
                                                                    lineNumbers: 'on',
                                                                    padding: { top: 12 }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={(e) => toggleSolution(problem.id, e)}
                                                        className="btn btn-primary"
                                                        style={{ marginBottom: showSolution[problem.id] ? '24px' : 0 }}
                                                    >
                                                        {showSolution[problem.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        {showSolution[problem.id] ? 'Hide Solution' : 'Show Solution'}
                                                    </button>

                                                    {showSolution[problem.id] && (
                                                        <>
                                                            <div style={{ marginBottom: '24px' }}>
                                                                <span className="caption" style={{ display: 'block', marginBottom: '12px' }}>
                                                                    SOLUTION
                                                                </span>
                                                                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255, 159, 10, 0.3)' }}>
                                                                    <Editor
                                                                        height="200px"
                                                                        defaultLanguage="cpp"
                                                                        value={problem.solution}
                                                                        theme="vs-dark"
                                                                        options={{
                                                                            readOnly: true,
                                                                            minimap: { enabled: false },
                                                                            fontSize: 13,
                                                                            scrollBeyondLastLine: false,
                                                                            lineNumbers: 'on',
                                                                            padding: { top: 12 }
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {problem.explanation && (
                                                                <div className="card" style={{ background: 'var(--bg-elevated)' }}>
                                                                    <span className="caption" style={{ display: 'block', marginBottom: '16px' }}>
                                                                        EXPLANATION
                                                                    </span>
                                                                    {problem.explanation.approach && (
                                                                        <div style={{ marginBottom: '16px' }}>
                                                                            <span style={{ fontWeight: '500', color: 'var(--accent)' }}>Approach: </span>
                                                                            <span style={{ color: 'var(--text-secondary)' }}>{problem.explanation.approach}</span>
                                                                        </div>
                                                                    )}
                                                                    {problem.explanation.analogy && (
                                                                        <div style={{
                                                                            marginBottom: '16px',
                                                                            padding: '14px 16px',
                                                                            background: 'rgba(0, 113, 227, 0.08)',
                                                                            borderRadius: '10px',
                                                                            borderLeft: '3px solid var(--accent)'
                                                                        }}>
                                                                            <span style={{ fontWeight: '500', color: 'var(--accent)' }}>Analogy: </span>
                                                                            <span style={{ color: 'var(--text)' }}>{problem.explanation.analogy}</span>
                                                                        </div>
                                                                    )}
                                                                    {problem.explanation.steps && (
                                                                        <div style={{ marginBottom: '16px' }}>
                                                                            <span style={{ fontWeight: '500', color: 'var(--green)', display: 'block', marginBottom: '8px' }}>
                                                                                Steps:
                                                                            </span>
                                                                            <ol style={{ paddingLeft: '20px', color: 'var(--text-secondary)', margin: 0 }}>
                                                                                {problem.explanation.steps.map((step, i) => (
                                                                                    <li key={i} style={{ marginBottom: '4px', lineHeight: '1.5' }}>{step}</li>
                                                                                ))}
                                                                            </ol>
                                                                        </div>
                                                                    )}
                                                                    {problem.explanation.complexity && (
                                                                        <div style={{
                                                                            display: 'inline-block',
                                                                            padding: '8px 14px',
                                                                            background: 'var(--bg-secondary)',
                                                                            borderRadius: '8px'
                                                                        }}>
                                                                            <span className="mono" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                                                                                {problem.explanation.complexity}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '24px'
                    }}>
                        <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="btn btn-ghost"
                            style={{ padding: '8px' }}
                        >
                            <ChevronsLeft size={18} />
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="btn btn-ghost"
                            style={{ padding: '8px' }}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span style={{ padding: '0 16px', color: 'var(--text-secondary)' }}>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="btn btn-ghost"
                            style={{ padding: '8px' }}
                        >
                            <ChevronRight size={18} />
                        </button>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="btn btn-ghost"
                            style={{ padding: '8px' }}
                        >
                            <ChevronsRight size={18} />
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {filteredProblems.length === 0 && (
                    <div className="empty">
                        <p style={{ fontSize: '17px', marginBottom: '8px' }}>No problems found</p>
                        <p style={{ fontSize: '14px' }}>Try adjusting your filters or search query</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearningPage;
