import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily, theme} from '../Theme';

const PhoneFrame: React.FC<{children: React.ReactNode; scale: number; opacity: number}> = ({children, scale, opacity}) => (
  <div
    style={{
      width: 640,
      height: 1320,
      borderRadius: 72,
      background: '#000',
      border: `8px solid ${theme.ink}`,
      position: 'relative',
      transform: `scale(${scale})`,
      opacity,
      boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 18,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 180,
        height: 32,
        borderRadius: 20,
        background: '#000',
        zIndex: 2,
      }}
    />
    <div style={{position: 'absolute', inset: 20, borderRadius: 52, background: '#0a0a0a', padding: 40, paddingTop: 80}}>{children}</div>
  </div>
);

export const Scene1Voicemail: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Phone entrance
  const phoneEnter = spring({frame, fps, config: {damping: 20, stiffness: 180}, durationInFrames: 20});

  // Ringing pulse (0-2s)
  const pulse = Math.sin((frame / fps) * Math.PI * 3) * 0.5 + 0.5;
  const ringScale = 1 + pulse * 0.15;
  const ringOpacity = interpolate(frame, [0, 15, 60, 75], [0, 1, 1, 0], {extrapolateRight: 'clamp'});

  // Missed call stamp (2-3s)
  const stampScale = spring({frame: frame - 60, fps, config: {damping: 8, stiffness: 220}});
  const stampOpacity = interpolate(frame, [60, 70, 120, 135], [0, 1, 1, 0], {extrapolateRight: 'clamp'});
  const stampRotate = interpolate(stampScale, [0, 1], [-30, -12]);

  // Competitor phone cutaway (3-4s)
  const compOpacity = interpolate(frame, [90, 105, 120, 130], [0, 1, 1, 0], {extrapolateRight: 'clamp'});
  const compSlide = interpolate(spring({frame: frame - 90, fps, config: {damping: 200}}), [0, 1], [200, 0]);

  // Job Gone final slam (4-5s)
  const jobScale = spring({frame: frame - 120, fps, config: {damping: 12, stiffness: 200}});
  const jobOpacity = interpolate(frame, [120, 130], [0, 1], {extrapolateRight: 'clamp'});
  const dollarCount = Math.floor(interpolate(frame, [125, 145], [0, 8000], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));

  // Phase visibility
  const isPhaseRinging = frame < 90;
  const isPhaseCompetitor = frame >= 90 && frame < 120;
  const isPhaseJobGone = frame >= 120;

  return (
    <AbsoluteFill style={{background: theme.ink, fontFamily, justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}>
      {/* Ambient grid */}
      <AbsoluteFill style={{opacity: 0.06, backgroundImage: `radial-gradient(circle, ${theme.teal} 1px, transparent 1px)`, backgroundSize: '40px 40px'}} />

      {isPhaseRinging && (
        <div style={{position: 'relative'}}>
          {/* Ringing pulse rings */}
          <div
            style={{
              position: 'absolute',
              inset: '50% 50% 50% 50%',
              width: 900,
              height: 900,
              marginLeft: -450,
              marginTop: -450,
              borderRadius: '50%',
              border: `3px solid ${theme.teal}`,
              opacity: ringOpacity * 0.4,
              transform: `scale(${ringScale})`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: '50% 50% 50% 50%',
              width: 700,
              height: 700,
              marginLeft: -350,
              marginTop: -350,
              borderRadius: '50%',
              border: `2px solid ${theme.teal}`,
              opacity: ringOpacity * 0.25,
              transform: `scale(${ringScale * 0.9})`,
            }}
          />

          <PhoneFrame scale={phoneEnter} opacity={1}>
            <div style={{color: 'rgba(255,255,255,0.5)', fontSize: 28, fontWeight: 500, letterSpacing: 2, textAlign: 'center', marginTop: 40}}>INCOMING CALL</div>
            <div
              style={{
                width: 220,
                height: 220,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.teal}, ${theme.tealDark})`,
                margin: '60px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 88,
                fontWeight: 800,
              }}
            >
              M
            </div>
            <div style={{color: '#fff', fontSize: 56, fontWeight: 700, textAlign: 'center', marginTop: 20}}>Mike Johnson</div>
            <div style={{color: 'rgba(255,255,255,0.5)', fontSize: 30, fontWeight: 500, textAlign: 'center', marginTop: 14}}>Smithtown, NY · 2:47 PM</div>

            {/* Decline / Answer buttons (muted) */}
            <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 120}}>
              <div style={{width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,60,60,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6666', fontSize: 60}}>✕</div>
              <div style={{width: 130, height: 130, borderRadius: '50%', background: 'rgba(46,177,88,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3ad671', fontSize: 60}}>✓</div>
            </div>

            {/* Missed call stamp overlay */}
            {frame >= 60 && (
              <div
                style={{
                  position: 'absolute',
                  top: '40%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${stampRotate}deg) scale(${stampScale})`,
                  opacity: stampOpacity,
                  border: `10px solid ${theme.danger}`,
                  color: theme.danger,
                  padding: '28px 60px',
                  fontSize: 80,
                  fontWeight: 800,
                  letterSpacing: 6,
                  background: 'rgba(20,0,0,0.8)',
                  textAlign: 'center',
                  lineHeight: 1,
                }}
              >
                MISSED
                <br />
                CALL
              </div>
            )}
          </PhoneFrame>
        </div>
      )}

      {isPhaseCompetitor && (
        <div style={{opacity: compOpacity, transform: `translateY(${compSlide}px)`, textAlign: 'center'}}>
          <div style={{color: 'rgba(255,255,255,0.4)', fontSize: 44, fontWeight: 500, marginBottom: 40, letterSpacing: 4}}>MEANWHILE...</div>
          <div
            style={{
              background: theme.paper,
              borderRadius: 32,
              padding: '80px 100px',
              boxShadow: '0 40px 100px rgba(46,177,88,0.3)',
              border: `4px solid ${theme.success}`,
            }}
          >
            <div style={{color: theme.success, fontSize: 120, fontWeight: 800, letterSpacing: -2, lineHeight: 1}}>✓</div>
            <div style={{color: theme.ink, fontSize: 60, fontWeight: 800, marginTop: 20}}>Competitor Roofing</div>
            <div style={{color: theme.inkMuted, fontSize: 42, fontWeight: 500, marginTop: 16}}>answered Mike's call</div>
            <div style={{color: theme.success, fontSize: 56, fontWeight: 700, marginTop: 40, letterSpacing: 2}}>0:24</div>
          </div>
        </div>
      )}

      {isPhaseJobGone && (
        <div style={{textAlign: 'center', opacity: jobOpacity, transform: `scale(${jobScale})`}}>
          <div style={{color: '#fff', fontSize: 280, fontWeight: 800, letterSpacing: -8, lineHeight: 0.9}}>JOB</div>
          <div style={{color: theme.danger, fontSize: 280, fontWeight: 800, letterSpacing: -8, lineHeight: 0.9, marginTop: -40}}>GONE.</div>
          <div style={{color: theme.gold, fontSize: 120, fontWeight: 800, letterSpacing: -2, marginTop: 30}}>${dollarCount.toLocaleString()}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
