import React from 'react';
import { T, FONT } from '../tokens';

// Minimal browser-window chrome. Shows three traffic-light dots and
// a centered URL pill. Rendered children fill the viewport area.

export const Browser: React.FC<{
  width:    number;
  height:   number;
  url?:     string;
  children?: React.ReactNode;
  style?:   React.CSSProperties;
}> = ({ width, height, url = 'mike-roofing.com', children, style }) => {
  const chrome = 56;
  return (
    <div style={{
      width, height,
      background: T.bg,
      borderRadius: 16,
      boxShadow:
        '0 30px 60px -20px rgba(15,20,25,0.20), 0 12px 24px -10px rgba(15,20,25,0.10)',
      border: `1px solid ${T.line}`,
      overflow: 'hidden',
      fontFamily: FONT,
      ...style,
    }}>
      {/* Title bar */}
      <div style={{
        height: chrome,
        background: T.bg2,
        borderBottom: `1px solid ${T.line}`,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 18px',
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
            <span key={c} style={{
              width: 12, height: 12, borderRadius: '50%', background: c,
            }} />
          ))}
        </div>
        <div style={{
          margin: '0 auto',
          background: T.bg,
          border: `1px solid ${T.line}`,
          borderRadius: 999,
          padding: '6px 18px',
          fontSize: 14,
          color: T.ink2,
          fontWeight: 500,
          minWidth: 280,
          textAlign: 'center',
        }}>
          🔒 {url}
        </div>
      </div>

      {/* Viewport */}
      <div style={{
        height: height - chrome,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
};
