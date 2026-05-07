import React from 'react';
import { T, FONT } from '../tokens';

// Phone frame — iPhone-ish silhouette. Stripped down to the essentials so
// the actual SMS / notification content has the visual weight, not chrome.
//
// Children render inside the screen area. Pass `time` (HH:MM) to tweak the
// status-bar clock; otherwise it shows 9:41 (the Apple keynote default).

export const Phone: React.FC<{
  width?:    number;
  time?:     string;
  carrier?:  string;
  children?: React.ReactNode;
  style?:    React.CSSProperties;
}> = ({
  width = 360,
  time = '9:41',
  carrier = 'Verizon',
  children,
  style,
}) => {
  // Aspect ratio ~ iPhone 14: 19.5/9 ≈ 2.165
  const height = width * 2.05;
  const radius = width * 0.13;
  const screenInset = width * 0.022;
  const screenRadius = radius - screenInset * 0.7;

  return (
    <div
      style={{
        width,
        height,
        background: T.ink,
        borderRadius: radius,
        boxShadow:
          '0 30px 60px -20px rgba(15,20,25,0.40), 0 12px 24px -10px rgba(15,20,25,0.18)',
        padding: screenInset,
        position: 'relative',
        ...style,
      }}
    >
      {/* Screen */}
      <div
        style={{
          width:  '100%',
          height: '100%',
          background: T.bg,
          borderRadius: screenRadius,
          overflow: 'hidden',
          position: 'relative',
          fontFamily: FONT,
          color: T.ink,
        }}
      >
        {/* Status bar */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: width * 0.13,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${width * 0.075}px`,
            fontSize: width * 0.045,
            fontWeight: 700,
            color: T.ink,
            zIndex: 5,
          }}
        >
          <span>{time}</span>
          <span style={{
            fontSize: width * 0.035,
            fontWeight: 600,
            color: T.ink2,
            display: 'flex',
            alignItems: 'center',
            gap: width * 0.022,
          }}>
            {carrier}
            {/* Signal bars */}
            <span style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
              {[0.35, 0.55, 0.75, 1].map((h, i) => (
                <span key={i} style={{
                  width: width * 0.012,
                  height: width * 0.04 * h,
                  background: T.ink,
                  borderRadius: 1,
                }} />
              ))}
            </span>
            {/* Battery */}
            <span style={{
              width:  width * 0.075,
              height: width * 0.04,
              border: `1.5px solid ${T.ink}`,
              borderRadius: width * 0.008,
              padding: 1,
              position: 'relative',
            }}>
              <span style={{
                display: 'block',
                width: '78%', height: '100%',
                background: T.ink,
                borderRadius: width * 0.004,
              }} />
              <span style={{
                position: 'absolute',
                right: -width * 0.012,
                top: '25%',
                width:  width * 0.008,
                height: '50%',
                background: T.ink,
                borderRadius: 1,
              }} />
            </span>
          </span>
        </div>

        {/* Notch (Dynamic Island style) */}
        <div
          style={{
            position: 'absolute',
            top: width * 0.030,
            left: '50%',
            transform: 'translateX(-50%)',
            width:  width * 0.32,
            height: width * 0.080,
            background: '#000',
            borderRadius: 999,
            zIndex: 6,
          }}
        />

        {/* Content */}
        <div style={{
          position: 'absolute',
          top: width * 0.13,
          left: 0, right: 0, bottom: 0,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Common SMS thread header (a contact card, basically). Sits at the top
// of an SMS conversation view.
export const SmsHeader: React.FC<{ name: string; sub?: string; width: number }> = ({
  name, sub, width,
}) => {
  const avatarSize = width * 0.13;
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: width * 0.022,
      padding: `${width * 0.04}px 0 ${width * 0.025}px`,
      borderBottom: `1px solid ${T.line}`,
      background: T.bg2,
    }}>
      <div style={{
        width: avatarSize, height: avatarSize,
        borderRadius: '50%',
        background: T.teal,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: width * 0.055,
        fontWeight: 700,
        letterSpacing: -0.5,
      }}>
        {name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()}
      </div>
      <div style={{
        fontSize: width * 0.040,
        fontWeight: 700,
        color: T.ink,
        lineHeight: 1,
      }}>
        {name}
      </div>
      {sub && (
        <div style={{
          fontSize: width * 0.028,
          color: T.ink3,
          fontWeight: 500,
        }}>
          {sub}
        </div>
      )}
    </div>
  );
};

// Single SMS bubble. side: 'in' (gray, left) | 'out' (teal, right)
export const SmsBubble: React.FC<{
  side: 'in' | 'out';
  text: string;
  width: number;
  opacity?: number;
}> = ({ side, text, width, opacity = 1 }) => {
  const isOut = side === 'out';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isOut ? 'flex-end' : 'flex-start',
      padding: `${width * 0.012}px ${width * 0.045}px`,
      opacity,
    }}>
      <div style={{
        maxWidth: '78%',
        background: isOut ? T.teal : T.bg3,
        color:      isOut ? '#fff' : T.ink,
        padding: `${width * 0.025}px ${width * 0.040}px`,
        borderRadius: width * 0.05,
        borderBottomRightRadius: isOut ? width * 0.012 : width * 0.05,
        borderBottomLeftRadius:  isOut ? width * 0.05  : width * 0.012,
        fontSize:   width * 0.034,
        lineHeight: 1.35,
        fontWeight: 500,
        boxShadow: '0 2px 4px rgba(15,20,25,0.04)',
      }}>
        {text}
      </div>
    </div>
  );
};
