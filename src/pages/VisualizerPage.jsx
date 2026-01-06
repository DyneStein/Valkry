import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { visualizerProblems, getAllVisualizerCategories } from '../data/visualizerProblems';
import { getAnimationDuration } from '../services/visualizerEngine';
import CodeHighlighter from '../components/visualizer/CodeHighlighter';
import StatePanel from '../components/visualizer/StatePanel';
import { Search, X, ChevronLeft, ChevronRight, Play, Pause, SkipBack, SkipForward, ChevronsLeft, ChevronsRight, PanelLeftClose, PanelLeft } from 'lucide-react';

export default function VisualizerPage() {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState('normal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const searchInputRef = useRef(null);
  const playIntervalRef = useRef(null);

  const categories = ['All', ...getAllVisualizerCategories()];

  const filteredProblems = useMemo(() => {
    let problems = selectedCategory === 'All'
      ? visualizerProblems
      : visualizerProblems.filter(p => p.category === selectedCategory);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      problems = problems.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    return problems;
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (visualizerProblems.length > 0 && !selectedProblem) {
      setSelectedProblem(visualizerProblems[0]);
    }
  }, []);

  const selectProblem = useCallback((problem) => {
    setSelectedProblem(problem);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  const currentStep = selectedProblem?.steps[currentStepIndex] || null;
  const totalSteps = selectedProblem?.steps.length || 0;

  const accumulatedOutput = useMemo(() => {
    if (!selectedProblem?.steps) return '';
    for (let i = currentStepIndex; i >= 0; i--) {
      const step = selectedProblem.steps[i];
      if (step.output !== undefined) return step.output;
    }
    return '';
  }, [selectedProblem, currentStepIndex]);

  const enhancedCurrentStep = useMemo(() => {
    if (!currentStep) return null;
    return { ...currentStep, output: accumulatedOutput };
  }, [currentStep, accumulatedOutput]);

  useEffect(() => {
    if (isPlaying && currentStepIndex < totalSteps - 1) {
      const duration = getAnimationDuration(speed);
      playIntervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, duration);
    } else {
      clearInterval(playIntervalRef.current);
      if (currentStepIndex >= totalSteps - 1) setIsPlaying(false);
    }
    return () => clearInterval(playIntervalRef.current);
  }, [isPlaying, speed, totalSteps, currentStepIndex]);

  const progress = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  return (
    <>
      <style>{`
        .viz-container {
          display: flex;
          height: calc(100vh - 80px);
          background: #000;
          overflow: hidden;
        }

        /* Sidebar */
        .viz-sidebar {
          width: 260px;
          background: #0a0a0a;
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          transition: width 0.2s ease;
          overflow: hidden;
        }

        .viz-sidebar.collapsed {
          width: 48px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          min-height: 48px;
        }

        .sidebar-header h2 {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .viz-sidebar.collapsed .sidebar-header {
          justify-content: center;
          padding: 12px 8px;
        }

        .viz-sidebar.collapsed .sidebar-header h2 {
          display: none;
        }

        .toggle-btn {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.04);
          border: none;
          border-radius: 6px;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          transition: all 0.15s;
          flex-shrink: 0;
        }

        .toggle-btn:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
        }

        .sidebar-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
        }

        .viz-sidebar.collapsed .sidebar-content {
          display: none;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 10px;
          padding: 9px 11px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 7px;
        }

        .search-box svg { color: rgba(255,255,255,0.25); flex-shrink: 0; }

        .search-box input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 12px;
          min-width: 0;
        }

        .search-box input::placeholder { color: rgba(255,255,255,0.25); }

        .clear-search {
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 50%;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
        }

        .cat-list {
          display: flex;
          gap: 4px;
          padding: 6px 10px;
          overflow-x: auto;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          flex-shrink: 0;
        }

        .cat-list::-webkit-scrollbar { height: 3px; }
        .cat-list::-webkit-scrollbar-track { background: transparent; }
        .cat-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }

        .cat-chip {
          padding: 4px 8px;
          background: transparent;
          border: none;
          border-radius: 4px;
          color: rgba(255,255,255,0.35);
          font-size: 10px;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.15s;
        }

        .cat-chip:hover { color: rgba(255,255,255,0.6); }
        .cat-chip.active { background: rgba(255,255,255,0.08); color: #fff; }

        .prob-list {
          flex: 1;
          overflow-y: auto;
          padding: 4px;
        }

        .prob-list::-webkit-scrollbar { width: 3px; }
        .prob-list::-webkit-scrollbar-track { background: transparent; }
        .prob-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

        .prob-btn {
          display: flex;
          flex-direction: column;
          gap: 2px;
          width: 100%;
          padding: 9px 10px;
          background: transparent;
          border: none;
          border-radius: 5px;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s;
        }

        .prob-btn:hover { background: rgba(255,255,255,0.04); }
        .prob-btn.active { background: rgba(255,255,255,0.07); }

        .prob-btn .title { font-size: 11px; color: #fff; line-height: 1.3; }
        .prob-btn .meta { font-size: 9px; color: rgba(255,255,255,0.3); }

        .prob-empty {
          padding: 16px;
          text-align: center;
          color: rgba(255,255,255,0.2);
          font-size: 11px;
        }

        .sidebar-footer {
          padding: 8px 10px;
          border-top: 1px solid rgba(255,255,255,0.04);
          font-size: 9px;
          color: rgba(255,255,255,0.2);
          text-align: center;
        }

        /* Main */
        .viz-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          flex-shrink: 0;
        }

        .main-header h1 {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .main-header .badge {
          margin-left: 10px;
          padding: 3px 8px;
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
          font-size: 10px;
          color: rgba(255,255,255,0.35);
        }

        .step-info {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          font-family: monospace;
        }

        .main-content {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 300px;
          overflow: hidden;
        }

        @media (max-width: 1000px) {
          .main-content { grid-template-columns: 1fr; }
          .state-col { display: none; }
        }

        .code-col {
          display: flex;
          flex-direction: column;
          padding: 14px 18px;
          overflow: hidden;
        }

        .code-wrapper {
          flex: 1;
          min-height: 0;
          overflow: auto;
        }

        .state-col {
          border-left: 1px solid rgba(255,255,255,0.04);
          overflow-y: auto;
        }

        /* Controls */
        .controls-bar {
          padding: 14px 0 0;
          flex-shrink: 0;
        }

        .ctrl-row {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 5px;
        }

        .ctrl-btn {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 7px;
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          transition: all 0.15s;
        }

        .ctrl-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }

        .ctrl-btn.play {
          width: 42px;
          height: 42px;
          background: #fff;
          border: none;
          border-radius: 50%;
          color: #000;
        }

        .ctrl-btn.play:hover { transform: scale(1.04); }

        .speed-row {
          display: flex;
          justify-content: center;
          gap: 3px;
          margin-top: 10px;
        }

        .speed-chip {
          padding: 4px 10px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px;
          color: rgba(255,255,255,0.3);
          font-size: 10px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .speed-chip:hover { color: rgba(255,255,255,0.5); }
        .speed-chip.active { background: rgba(255,255,255,0.08); color: #fff; border-color: transparent; }

        .progress-track {
          height: 2px;
          background: rgba(255,255,255,0.05);
          border-radius: 1px;
          margin-top: 14px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: #fff;
          transition: width 0.15s ease;
        }
      `}</style>

      <div className="viz-container">
        {/* Sidebar */}
        <aside className={`viz-sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <h2>Problems</h2>
            <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)} title={sidebarOpen ? 'Collapse' : 'Expand'}>
              {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
          </div>

          <div className="sidebar-content">
            <div className="search-box">
              <Search size={13} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>
                  <X size={9} />
                </button>
              )}
            </div>

            <div className="cat-list">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`cat-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="prob-list">
              {filteredProblems.length > 0 ? (
                filteredProblems.map(p => (
                  <button
                    key={p.id}
                    className={`prob-btn ${selectedProblem?.id === p.id ? 'active' : ''}`}
                    onClick={() => selectProblem(p)}
                  >
                    <span className="title">{p.title}</span>
                    <span className="meta">{p.steps.length} steps</span>
                  </button>
                ))
              ) : (
                <div className="prob-empty">No results</div>
              )}
            </div>

            <div className="sidebar-footer">{filteredProblems.length} problems</div>
          </div>
        </aside>

        {/* Main Area */}
        <main className="viz-main">
          <div className="main-header">
            <div>
              <h1>
                {selectedProblem?.title || 'Select a problem'}
                {selectedProblem && <span className="badge">{selectedProblem.category}</span>}
              </h1>
            </div>
            <span className="step-info">{currentStepIndex + 1} / {totalSteps}</span>
          </div>

          <div className="main-content">
            <div className="code-col">
              <div className="code-wrapper">
                {selectedProblem && (
                  <CodeHighlighter
                    code={selectedProblem.code}
                    currentStep={currentStep}
                    isPlaying={isPlaying}
                  />
                )}
              </div>

              <div className="controls-bar">
                <div className="ctrl-row">
                  <button className="ctrl-btn" onClick={() => setCurrentStepIndex(0)}><ChevronsLeft size={15} /></button>
                  <button className="ctrl-btn" onClick={() => currentStepIndex > 0 && setCurrentStepIndex(p => p - 1)}><SkipBack size={15} /></button>
                  <button className="ctrl-btn play" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause size={17} /> : <Play size={17} />}
                  </button>
                  <button className="ctrl-btn" onClick={() => currentStepIndex < totalSteps - 1 && setCurrentStepIndex(p => p + 1)}><SkipForward size={15} /></button>
                  <button className="ctrl-btn" onClick={() => setCurrentStepIndex(totalSteps - 1)}><ChevronsRight size={15} /></button>
                </div>

                <div className="speed-row">
                  {[{ l: '0.5x', v: 'slow' }, { l: '1x', v: 'normal' }, { l: '2x', v: 'fast' }].map(s => (
                    <button key={s.v} className={`speed-chip ${speed === s.v ? 'active' : ''}`} onClick={() => setSpeed(s.v)}>{s.l}</button>
                  ))}
                </div>

                <div className="progress-track">
                  <div className="progress-bar" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            <div className="state-col">
              <StatePanel
                currentStep={enhancedCurrentStep}
                allSteps={selectedProblem?.steps || []}
                currentStepIndex={currentStepIndex}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
