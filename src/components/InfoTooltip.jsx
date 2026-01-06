import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

const InfoTooltip = ({ text, style = {} }) => {
    const [show, setShow] = useState(false);
    const iconRef = useRef(null);
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (show && iconRef.current) {
            const updatePosition = () => {
                const rect = iconRef.current.getBoundingClientRect();
                setCoords({
                    top: rect.top - 8,
                    left: rect.left + rect.width / 2
                });
            };
            updatePosition();
            window.addEventListener('scroll', updatePosition);
            window.addEventListener('resize', updatePosition);
            return () => {
                window.removeEventListener('scroll', updatePosition);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [show]);

    return (
        <div
            ref={iconRef}
            style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '6px', cursor: 'help', ...style }}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            <div style={{ color: 'var(--text-tertiary)', display: 'flex' }}>
                <Info size={14} />
            </div>
            {show && (
                <div style={{
                    position: 'fixed',
                    top: coords.top,
                    left: coords.left,
                    transform: 'translate(-50%, -100%)',
                    background: '#1a1a1a',
                    color: '#e0e0e0',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    width: 'max-content',
                    maxWidth: '320px',
                    zIndex: 9999,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    pointerEvents: 'none',
                    lineHeight: '1.5',
                    border: '1px solid var(--border)',
                    textAlign: 'left',
                    whiteSpace: 'normal'
                }}>
                    {text}
                    <div style={{
                        position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                        borderWidth: '6px', borderStyle: 'solid', borderColor: '#1a1a1a transparent transparent transparent'
                    }} />
                </div>
            )}
        </div>
    );
};

export default InfoTooltip;
