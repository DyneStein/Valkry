import React, { useEffect, useRef } from 'react';
import { getPhaseConfig } from '../../services/visualizerEngine';

/**
 * CodeHighlighter - Clean, professional code display
 * Apple-inspired minimal design
 */
export default function CodeHighlighter({ code, currentStep, isPlaying }) {
  const lines = code.split('\n');
  const highlightRef = useRef(null);

  const highlightLine = currentStep?.line;
  const charStart = currentStep?.charStart;
  const charEnd = currentStep?.charEnd;
  const phaseConfig = getPhaseConfig(currentStep?.phase);

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep?.id]);

  return (
    <div className="code-panel">
      <div className="code-header">
        <span className="code-label">Source Code</span>
        {currentStep && (
          <span className="step-label">{phaseConfig.label}</span>
        )}
      </div>

      <div className="code-scroll">
        <pre className="code-body">
          {lines.map((line, lineIndex) => {
            const lineNum = lineIndex + 1;
            const isActive = lineNum === highlightLine;

            return (
              <div
                key={lineIndex}
                ref={isActive ? highlightRef : null}
                className={`code-line ${isActive ? 'active' : ''}`}
              >
                <span className="ln">{lineNum}</span>
                <span className="lc">
                  {isActive && charStart !== undefined ? (
                    <>
                      <span className="dim">{line.substring(0, charStart)}</span>
                      <mark className={isPlaying ? 'pulse' : ''}>{line.substring(charStart, charEnd)}</mark>
                      <span className="dim">{line.substring(charEnd)}</span>
                    </>
                  ) : (
                    <span className={isActive ? '' : 'dim'}>{line || ' '}</span>
                  )}
                </span>
              </div>
            );
          })}
        </pre>
      </div>

      <style>{`
        .code-panel {
          background: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          overflow: hidden;
        }
        
        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        
        .code-label {
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .step-label {
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
        }
        
        .code-scroll {
          max-height: 380px;
          overflow-y: auto;
        }
        
        .code-body {
          margin: 0;
          padding: 14px 0;
          font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
          font-size: 13px;
          line-height: 1.7;
        }
        
        .code-line {
          display: flex;
          padding: 1px 16px;
        }
        
        .code-line.active {
          background: rgba(255,255,255,0.02);
        }
        
        .ln {
          min-width: 28px;
          padding-right: 16px;
          color: rgba(255,255,255,0.15);
          font-size: 12px;
          text-align: right;
          user-select: none;
        }
        
        .active .ln {
          color: rgba(255,255,255,0.3);
        }
        
        .lc {
          flex: 1;
          white-space: pre;
        }
        
        .dim {
          color: rgba(255,255,255,0.3);
        }
        
        mark {
          background: rgba(255,255,255,0.1);
          color: #fff;
          padding: 2px 4px;
          margin: -2px 0;
          border-radius: 3px;
          font-weight: 500;
        }
        
        mark.pulse {
          animation: glow 1.5s ease-in-out infinite;
        }
        
        @keyframes glow {
          0%, 100% { background: rgba(255,255,255,0.1); }
          50% { background: rgba(255,255,255,0.15); }
        }
        
        .code-scroll::-webkit-scrollbar { width: 6px; }
        .code-scroll::-webkit-scrollbar-track { background: transparent; }
        .code-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
      `}</style>
    </div>
  );
}
