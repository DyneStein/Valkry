import React from 'react';
import { formatVariables, getPhaseConfig } from '../../services/visualizerEngine';

/**
 * StatePanel - Clean, professional state display with call stack
 */
export default function StatePanel({ currentStep, allSteps, currentStepIndex }) {
  const variables = formatVariables(currentStep?.variables);
  const output = currentStep?.output || '';
  const description = currentStep?.description || 'Select a problem to begin';
  const callStack = currentStep?.callStack || [];
  const arrayState = currentStep?.arrayState;

  // Format description with subtle highlighting for key terms
  const formatDescription = (text) => {
    if (!text) return 'Select a problem to begin';

    // Key terms to highlight
    const keyTerms = [
      'TWO\'S COMPLEMENT', 'TWOS COMPLEMENT', 'TWO\'S COMPLEMENT',
      'ARITHMETIC SHIFT', 'LOGICAL SHIFT', 'SIGN EXTENSION',
      'IMPLICIT CAST', 'CASTING', 'UNSIGNED', 'SIGNED',
      'BRANCHLESS', 'BRIAN KERNIGHAN', 'GRAY CODE',
      'XOR SWAP', 'POWER OF TWO', 'POPCOUNT',
      'ISOLATE LOWEST BIT', 'KEY INSIGHT', 'TRICK',
      'MSB', 'LSB', 'STEP 1', 'STEP 2', 'STEP 3',
      'FENWICK', 'O\\(', 'INT_MAX', 'UINT_MAX', 'INT_MIN'
    ];

    let result = text;
    keyTerms.forEach(term => {
      const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      result = result.replace(regex, '###$1###');
    });

    // Split and render with highlights
    const parts = result.split('###');
    return parts.map((part, i) => {
      const isHighlight = keyTerms.some(term =>
        part.toUpperCase().includes(term.toUpperCase().replace(/\\/g, ''))
      );
      return isHighlight ? (
        <span key={i} className="highlight-term">{part}</span>
      ) : part;
    });
  };

  return (
    <div className="state-panel">
      {/* Description */}
      <div className="panel-section">
        <div className="section-label">Current Step</div>
        <p className="description">{formatDescription(description)}</p>
        {currentStep?.conditionResult !== undefined && (
          <div className={`result ${currentStep.conditionResult ? 'true' : 'false'}`}>
            {currentStep.conditionResult ? '→ TRUE' : '→ FALSE'}
          </div>
        )}
      </div>

      {/* Call Stack (for recursion) */}
      {callStack.length > 0 && (
        <div className="panel-section">
          <div className="section-label">Call Stack</div>
          <div className="call-stack">
            {callStack.map((frame, idx) => (
              <div
                key={idx}
                className={`stack-frame ${idx === callStack.length - 1 ? 'active' : ''}`}
              >
                <div className="frame-header">
                  <span className="frame-name">{frame.func}</span>
                  <span className="frame-status">{frame.status || 'executing'}</span>
                </div>
                {frame.args && (
                  <div className="frame-args">
                    {Object.entries(frame.args).map(([k, v]) => (
                      <span key={k} className="arg">{k}={String(v)}</span>
                    ))}
                  </div>
                )}
                {frame.returnValue !== undefined && (
                  <div className="frame-return">return {frame.returnValue}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Array State (for sorting) */}
      {arrayState && (
        <div className="panel-section">
          <div className="section-label">Array State</div>
          <div className="array-viz">
            {arrayState.values.map((val, idx) => (
              <div
                key={idx}
                className={`array-cell ${arrayState.comparing?.includes(idx) ? 'comparing' : ''
                  } ${arrayState.swapping?.includes(idx) ? 'swapping' : ''} ${arrayState.sorted?.includes(idx) ? 'sorted' : ''
                  }`}
              >
                <div className="cell-value">{val}</div>
                <div className="cell-index">{idx}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Variables */}
      <div className="panel-section">
        <div className="section-label">Variables</div>
        {variables.length > 0 ? (
          <div className="var-list">
            {variables.map(v => (
              <div key={v.name} className="var-row">
                <span className="var-name">{v.name}</span>
                <span className="var-value">{v.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty">No variables</div>
        )}
      </div>

      {/* Console */}
      <div className="panel-section">
        <div className="section-label">Console Output</div>
        <div className="console">
          {output ? (
            <span className="output">{output}</span>
          ) : (
            <span className="cursor">_</span>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="panel-section">
        <div className="section-label">Progress</div>
        <div className="timeline">
          <div
            className="timeline-fill"
            style={{ width: `${((currentStepIndex + 1) / (allSteps?.length || 1)) * 100}%` }}
          />
        </div>
        <div className="timeline-text">{currentStepIndex + 1} of {allSteps?.length || 0} steps</div>
      </div>

      <style>{`
        .state-panel {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: rgba(255,255,255,0.04);
          border-radius: 12px;
          overflow: hidden;
        }
        
        .panel-section {
          background: #0a0a0a;
          padding: 16px;
        }
        
        .section-label {
          font-size: 10px;
          font-weight: 500;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 10px;
        }
        
        .description {
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
          color: rgba(255,255,255,0.8);
        }
        
        .result {
          margin-top: 10px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .result.true { color: #34d399; }
        .result.false { color: #f87171; }
        
        .highlight-term {
          color: #60a5fa;
          font-weight: 500;
          background: rgba(96, 165, 250, 0.1);
          padding: 1px 4px;
          border-radius: 3px;
        }
        
        /* Call Stack */
        .call-stack {
          display: flex;
          flex-direction: column-reverse;
          gap: 2px;
        }
        
        .stack-frame {
          padding: 10px 12px;
          background: rgba(255,255,255,0.03);
          border-radius: 6px;
          border-left: 2px solid rgba(255,255,255,0.1);
          transition: all 0.2s;
        }
        
        .stack-frame.active {
          background: rgba(59, 130, 246, 0.15);
          border-left-color: #3b82f6;
        }
        
        .frame-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        
        .frame-name {
          font-family: 'SF Mono', monospace;
          font-size: 13px;
          color: #fff;
          font-weight: 500;
        }
        
        .frame-status {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
        }
        
        .frame-args {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .arg {
          font-family: 'SF Mono', monospace;
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.05);
          padding: 2px 6px;
          border-radius: 3px;
        }
        
        .frame-return {
          margin-top: 6px;
          font-family: 'SF Mono', monospace;
          font-size: 12px;
          color: #34d399;
        }
        
        /* Array Visualization */
        .array-viz {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        
        .array-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 12px;
          background: rgba(255,255,255,0.05);
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.3s;
        }
        
        .array-cell.comparing {
          background: rgba(251, 191, 36, 0.2);
          border-color: #fbbf24;
        }
        
        .array-cell.swapping {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
          transform: scale(1.05);
        }
        
        .array-cell.sorted {
          background: rgba(52, 211, 153, 0.15);
          border-color: #34d399;
        }
        
        .cell-value {
          font-family: 'SF Mono', monospace;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }
        
        .cell-index {
          font-size: 9px;
          color: rgba(255,255,255,0.3);
          margin-top: 4px;
        }
        
        /* Variables */
        .var-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .var-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          padding: 8px 12px;
          background: rgba(255,255,255,0.03);
          border-radius: 6px;
          font-family: 'SF Mono', monospace;
          font-size: 13px;
          overflow: hidden;
        }
        
        .var-name {
          color: rgba(255,255,255,0.6);
          flex-shrink: 0;
          min-width: 40px;
        }
        
        .var-value {
          color: #fff;
          font-weight: 500;
          text-align: right;
          word-break: break-all;
          max-width: 180px;
          overflow-x: auto;
          scrollbar-width: thin;
        }
        
        .var-value::-webkit-scrollbar {
          height: 3px;
        }
        
        .var-value::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.15);
          border-radius: 2px;
        }
        
        .empty {
          color: rgba(255,255,255,0.25);
          font-size: 13px;
        }
        
        .console {
          background: #000;
          border-radius: 6px;
          padding: 14px;
          min-height: 60px;
          font-family: 'SF Mono', monospace;
          font-size: 13px;
        }
        
        .output {
          color: #fff;
          white-space: pre-wrap;
        }
        
        .cursor {
          color: rgba(255,255,255,0.5);
          animation: blink 1s step-end infinite;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .timeline {
          height: 3px;
          background: rgba(255,255,255,0.08);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        
        .timeline-fill {
          height: 100%;
          background: rgba(255,255,255,0.5);
          transition: width 0.2s;
        }
        
        .timeline-text {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          text-align: center;
        }
      `}</style>
    </div>
  );
}
