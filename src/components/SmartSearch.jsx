import React, { useState, useEffect } from 'react';
import { Search, Sparkles, X } from 'lucide-react';

const DIFFICULTY_COLORS = {
    'easy': 'var(--green)',
    'medium': 'var(--orange)',
    'hard': 'var(--red)'
};

const SmartSearch = ({ value, onChange, placeholder = "Search with AI..." }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [detectedIntent, setDetectedIntent] = useState(null);

    // Simple intent detector for UI feedback
    useEffect(() => {
        const lower = value.toLowerCase();
        if (lower.includes('hard') || lower.includes('advanced')) setDetectedIntent({ type: 'difficulty', label: 'HARD', color: 'var(--red)' });
        else if (lower.includes('medium') || lower.includes('intermediate')) setDetectedIntent({ type: 'difficulty', label: 'MEDIUM', color: 'var(--orange)' });
        else if (lower.includes('easy') || lower.includes('beginner')) setDetectedIntent({ type: 'difficulty', label: 'EASY', color: 'var(--green)' });
        else if (lower.includes('array')) setDetectedIntent({ type: 'category', label: 'ARRAYS', color: 'var(--accent)' });
        else if (lower.includes('tree')) setDetectedIntent({ type: 'category', label: 'TREES', color: 'var(--accent)' });
        else if (lower.includes('dp') || lower.includes('dynamic')) setDetectedIntent({ type: 'category', label: 'DP', color: 'var(--accent)' });
        else setDetectedIntent(null);
    }, [value]);

    return (
        <div className="smart-search-container" style={{ position: 'relative', flex: 1 }}>
            {/* Glow Effect */}
            <div style={{
                position: 'absolute',
                inset: -2,
                background: 'linear-gradient(45deg, var(--accent), #a855f7, var(--accent))',
                borderRadius: '14px',
                opacity: isFocused ? 0.3 : 0,
                filter: 'blur(10px)',
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none'
            }} />

            <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-elevated)',
                border: `1px solid ${isFocused ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '12px',
                padding: '0 16px',
                height: '48px',
                transition: 'all 0.2s ease',
                boxShadow: isFocused ? '0 4px 20px rgba(0, 0, 0, 0.2)' : 'none'
            }}>
                <Search
                    size={18}
                    style={{
                        color: isFocused ? 'var(--accent)' : 'var(--text-tertiary)',
                        marginRight: '12px',
                        transition: 'color 0.2s'
                    }}
                />

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text)',
                        fontSize: '15px',
                        flex: 1,
                        outline: 'none',
                        height: '100%'
                    }}
                />

                {/* Intent Badge */}
                {detectedIntent && value.length > 2 && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 8px',
                        background: `${detectedIntent.color}15`,
                        border: `1px solid ${detectedIntent.color}30`,
                        borderRadius: '6px',
                        marginRight: '8px',
                        animation: 'fadeIn 0.3s ease'
                    }}>
                        <Sparkles size={12} color={detectedIntent.color} />
                        <span style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: detectedIntent.color,
                            letterSpacing: '0.5px'
                        }}>
                            {detectedIntent.label}
                        </span>
                    </div>
                )}

                {value && (
                    <button
                        onClick={() => onChange('')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-tertiary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px'
                        }}
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                `}
            </style>
        </div>
    );
};

export default SmartSearch;
