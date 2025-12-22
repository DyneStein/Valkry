import React from 'react';
import { Link } from 'react-router-dom';

// Ultra-minimal Google/Apple style logo - just clean typography
const Logo = ({ size = 'default' }) => {
    const sizes = {
        small: 16,
        default: 20,
        large: 28,
        hero: 44
    };

    const fontSize = sizes[size] || sizes.default;

    return (
        <Link
            to="/"
            style={{
                textDecoration: 'none',
                display: 'inline-block'
            }}
        >
            <span style={{
                fontSize,
                fontWeight: 500,
                letterSpacing: '-0.02em',
                color: '#FAFAFA',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'
            }}>
                Valkry
            </span>
        </Link>
    );
};

export default Logo;
