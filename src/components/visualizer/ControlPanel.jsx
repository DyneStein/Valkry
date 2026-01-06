import React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * ControlPanel - Clean, minimal playback controls
 */
export default function ControlPanel({
  currentStepIndex,
  totalSteps,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBack,
  onFirst,
  onLast,
  onSpeedChange
}) {
  const progress = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  return (
    <div className="controls">
      {/* Progress */}
      <div className="progress-row">
        <div className="progress-track">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-text">{currentStepIndex + 1} / {totalSteps}</span>
      </div>

      {/* Buttons */}
      <div className="button-row">
        <div className="btn-group">
          <button className="ctrl-btn" onClick={onFirst} disabled={currentStepIndex === 0}>
            <ChevronLeft size={16} /><ChevronLeft size={16} style={{ marginLeft: -10 }} />
          </button>
          <button className="ctrl-btn" onClick={onStepBack} disabled={currentStepIndex === 0}>
            <ChevronLeft size={18} />
          </button>
        </div>

        <button
          className="play-btn"
          onClick={isPlaying ? onPause : onPlay}
          disabled={currentStepIndex >= totalSteps - 1 && !isPlaying}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <div className="btn-group">
          <button className="ctrl-btn" onClick={onStepForward} disabled={currentStepIndex >= totalSteps - 1}>
            <ChevronRight size={18} />
          </button>
          <button className="ctrl-btn" onClick={onLast} disabled={currentStepIndex >= totalSteps - 1}>
            <ChevronRight size={16} /><ChevronRight size={16} style={{ marginLeft: -10 }} />
          </button>
        </div>
      </div>

      {/* Speed */}
      <div className="speed-row">
        {['slow', 'normal', 'fast'].map(s => (
          <button
            key={s}
            className={`speed-btn ${speed === s ? 'active' : ''}`}
            onClick={() => onSpeedChange(s)}
          >
            {s === 'slow' ? '0.5×' : s === 'normal' ? '1×' : '2×'}
          </button>
        ))}
      </div>

      <style>{`
        .controls {
          background: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .progress-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .progress-track {
          flex: 1;
          height: 3px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          background: rgba(255,255,255,0.4);
          transition: width 0.2s;
        }
        
        .progress-text {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          min-width: 50px;
          text-align: right;
        }
        
        .button-row {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
        }
        
        .btn-group {
          display: flex;
          gap: 4px;
        }
        
        .ctrl-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 8px;
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: all 0.15s;
        }
        
        .ctrl-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.08);
          color: #fff;
        }
        
        .ctrl-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        
        .play-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border: none;
          border-radius: 50%;
          background: #fff;
          color: #000;
          cursor: pointer;
          transition: all 0.15s;
        }
        
        .play-btn:hover:not(:disabled) {
          transform: scale(1.05);
        }
        
        .play-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        
        .speed-row {
          display: flex;
          justify-content: center;
          gap: 4px;
        }
        
        .speed-btn {
          padding: 6px 14px;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: rgba(255,255,255,0.4);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.15s;
        }
        
        .speed-btn:hover {
          color: rgba(255,255,255,0.6);
        }
        
        .speed-btn.active {
          background: rgba(255,255,255,0.08);
          color: #fff;
        }
      `}</style>
    </div>
  );
}
