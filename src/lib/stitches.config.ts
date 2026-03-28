import { createStitches } from '@stitches/react';

export const { styled, css, theme, createTheme, globalCss } = createStitches({
  theme: {
    colors: {
      brandPrimary: '#c59aff',
      bgMain: '#0a0a0c',       
      textMain: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.5)',
      glassBg: 'rgba(26, 16, 46, 0.6)',
      border: 'rgba(255, 255, 255, 0.1)',
      inputBg: 'rgba(255, 255, 255, 0.05)',
      cardBg: 'rgba(255, 255, 255, 0.03)',
    },
    shadows: {
      card: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
    },
    transitions: {
      standard: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },
});

// Rename this to match the class next-themes will use
export const lightTheme = createTheme('light', {
  colors: {
    brandPrimary: '#6366f1',
    bgMain: '#f8fafc',       
    textMain: '#0f172a',     
    textSecondary: '#64748b',
    glassBg: 'rgba(255, 255, 255, 0.8)',
    border: 'rgba(0, 0, 0, 0.1)',
    inputBg: '#ffffff',
    cardBg: '#ffffff',
  },
  shadows: {
    card: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
});

export const injectGlobalStyles = globalCss({
  'html, body': { 
    margin: 0, 
    padding: 0,
    backgroundColor: '$bgMain', 
    color: '$textMain',
    fontFamily: 'sans-serif',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
});