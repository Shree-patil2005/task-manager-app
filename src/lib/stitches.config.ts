import { createStitches } from '@stitches/react';

export const { styled, css, theme, globalCss } = createStitches({
  theme: {
    colors: {
      brandPrimary: '#6366f1', // Indigo
      brandSuccess: '#10b981',
      brandDanger: '#ef4444',
      bgMain: '#f8fafc',
      glassBg: 'rgba(255, 255, 255, 0.7)',
    },
    shadows: {
      card: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      cardHover: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    transitions: {
      standard: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },
});

// Add a global font reset
export const injectGlobalStyles = globalCss({
  body: { backgroundColor: '$bgMain', fontFamily: 'Inter, sans-serif' },
});