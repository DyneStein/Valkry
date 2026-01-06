// Enhanced Visualizer Engine with deeper control flow support
// Handles character-level highlighting and flow direction

/**
 * Phase styling configuration
 */
export const PHASE_CONFIG = {
    // Initialization phases
    INIT: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', icon: '🚀', label: 'Initialize' },
    SETUP: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', icon: '⚙️', label: 'Setup' },

    // Condition phases
    CONDITION: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: '❓', label: 'Condition' },
    CONDITION_FAIL: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', icon: '❌', label: 'Condition Failed' },
    IF_CHECK: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: '🔍', label: 'If Check' },
    IF_KEYWORD: { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', icon: '🔀', label: 'If Statement' },
    CASE_CHECK: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: '🎯', label: 'Case Match' },

    // Loop phases
    OUTER_INIT: { color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', icon: '🔄', label: 'Outer Init' },
    OUTER_COND: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: '🔄', label: 'Outer Condition' },
    OUTER_INC: { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', icon: '🔄', label: 'Outer Increment' },
    OUTER_EXIT: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', icon: '🚪', label: 'Exit Outer Loop' },
    INNER_INIT: { color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.15)', icon: '↻', label: 'Inner Init' },
    INNER_COND: { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', icon: '↻', label: 'Inner Condition' },
    INNER_INC: { color: '#c084fc', bg: 'rgba(192, 132, 252, 0.15)', icon: '↻', label: 'Inner Increment' },
    INNER_EXIT: { color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)', icon: '↩', label: 'Exit Inner Loop' },
    DO: { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', icon: '▶️', label: 'Do Block' },

    // Body phases
    BODY: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', icon: '⚡', label: 'Execute' },
    BODY_INCREMENT: { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', icon: '➕', label: 'Body Increment' },

    // Increment/Decrement phases
    INCREMENT: { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', icon: '⬆️', label: 'Increment' },
    DECREMENT: { color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)', icon: '⬇️', label: 'Decrement' },

    // Operator phases
    PREFIX: { color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.15)', icon: '⬆️', label: 'Prefix ++' },
    POSTFIX: { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)', icon: '⬇️', label: 'Postfix ++' },
    ASSIGN: { color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', icon: '📥', label: 'Assign' },
    EVALUATE: { color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', icon: '→', label: 'Evaluate' },
    COMPUTE: { color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)', icon: '🔢', label: 'Compute' },

    // Control flow phases
    BREAK: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', icon: '🛑', label: 'Break' },
    CONTINUE: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: '⏭️', label: 'Continue' },
    SWITCH: { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', icon: '🔀', label: 'Switch' },
    SKIP_ELSE: { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.15)', icon: '⏩', label: 'Skip Else' },
    EMPTY_PART: { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.15)', icon: '⏸️', label: 'Empty' },

    // Output/Complete phases
    OUTPUT: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', icon: '📤', label: 'Output' },
    COMPLETE: { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.15)', icon: '✅', label: 'Complete' }
};

/**
 * Get phase configuration
 */
export function getPhaseConfig(phase) {
    return PHASE_CONFIG[phase] || {
        color: '#6b7280',
        bg: 'rgba(107, 114, 128, 0.15)',
        icon: '•',
        label: phase
    };
}

/**
 * Animation speed presets (ms)
 */
export const SPEED_PRESETS = {
    slow: 1500,
    normal: 800,
    fast: 400
};

/**
 * Get animation duration
 */
export function getAnimationDuration(speed = 'normal') {
    return SPEED_PRESETS[speed] || SPEED_PRESETS.normal;
}

/**
 * Format variables for display
 */
export function formatVariables(variables) {
    if (!variables) return [];

    return Object.entries(variables)
        .filter(([key]) => !key.startsWith('_'))
        .map(([name, value]) => ({
            name,
            value: String(value),
            type: typeof value
        }));
}

/**
 * Get control flow direction arrow
 */
export function getFlowArrow(controlFlow) {
    switch (controlFlow) {
        case 'right': return '→';
        case 'left': return '←';
        case 'down': return '↓';
        case 'up': return '↑';
        case 'done': return '✓';
        case 'skip': return '⏭';
        case 'exit': return '🚪';
        default: return '';
    }
}
