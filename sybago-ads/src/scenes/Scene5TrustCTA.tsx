import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily, theme} from '../Theme';

const StatCard: React.FC<{frame: number; fps: number; enterAt: number; icon: React.ReactNode; value: string; label: string; finalY: number}> = ({frame, fps, enterAt, icon, value, label, finalY}) => {
  const s = spring({frame: frame - enterAt, fps, config: {damping: 14, stiffness: 160}, durationInFrames: 24});
  const y = interpolate(s, [0, 1], [120, finalY]);
  const scale = interpolate(s, [0, 1], [0.85, 1]);
  const opacity = interpolate(frame, [enterAt, enterAt + 6], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.08)',
        border: '2px solid rgba(255,255,255,0.25)',
        borderRadius: 28,
        padding: '44px 36px',
        textAlign: 'center',
        width: 300,
        transform: `translateY(${y}px) scale(${scale})`,
        opacity,
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{width: 72, height: 72, margin: '0 auto 22px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{icon}</div>
      <div style={{color: theme.gold, fontSize: 72, fontWeight: 800, lineHeight: 1, letterSpacing: -1}}>{value}</div>
      <div style={{color: 'rgba(255,255,255,0.8)', fontSize: 20, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', marginTop: 14}}>{label}</div>
    </div>
  );
};

const LightningIcon = () => (
  <svg viewBox="0 0 24 24" width={56} height={56} fill="none" stroke={theme.gold} strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={theme.gold} opacity="0.2" />
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" width={56} height={56} fill="none" stroke={theme.gold} strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width={56} height={56} fill="none" stroke={theme.gold} strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11.5 14.5 16 10" />
  </svg>
);

export const Scene5TrustCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Header fade-in
  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});

  // CTA phase starts at frame 195
  const ctaOpacity = interpolate(frame, [195, 215], [0, 1], {extrapolateRight: 'clamp'});
  const ctaTransform = spring({frame: frame - 195, fps, config: {damping: 18}, durationInFrames: 20});
  const ctaY = interpolate(ctaTransform, [0, 1], [80, 0]);

  // Arrow bounce
  const arrowBob = Math.sin((frame / fps) * 4) * 20;

  // Logo reveal at frame 270
  const logoOpacity = interpolate(frame, [270, 285], [0, 1], {extrapolateRight: 'clamp'});
  const logoScale = spring({frame: frame - 270, fps, config: {damping: 12}});

  // Gradient sweep
  const sweepX = interpolate(frame, [270, 300], [-100, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const showStats = frame < 270;
  const showLogo = frame >= 270;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${theme.tealDark} 0%, ${theme.teal} 60%, ${theme.tealLight} 100%)`,
        fontFamily,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        color: '#fff',
      }}
    >
      {/* Ambient radial glows */}
      <div style={{position: 'absolute', width: 900, height: 900, borderRadius: '50%', background: `radial-gradient(circle, rgba(212,161,74,0.2), transparent 60%)`, top: '20%', right: '-20%', filter: 'blur(40px)'}} />
      <div style={{position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)`, bottom: '-20%', left: '-15%', filter: 'blur(40px)'}} />

      {showStats && (
        <>
          {/* Header */}
          <div style={{position: 'absolute', top: 140, left: 0, right: 0, textAlign: 'center', opacity: headerOpacity, padding: '0 80px'}}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 14,
                background: `linear-gradient(135deg, ${theme.gold}, #e8b85a)`,
                color: theme.tealDark,
                padding: '14px 28px',
                borderRadius: 999,
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 4,
                textTransform: 'uppercase',
                marginBottom: 26,
                boxShadow: '0 14px 34px rgba(212,161,74,0.4)',
              }}
            >
              + Free Website &middot; $2,997 Value
            </div>
            <div style={{color: 'rgba(255,255,255,0.7)', fontSize: 28, fontWeight: 600, letterSpacing: 6, textTransform: 'uppercase', marginBottom: 22}}>SYBAGO INSTALLS</div>
            <div style={{fontSize: 68, fontWeight: 800, lineHeight: 1.15, letterSpacing: -1}}>Every leak. Plugged.</div>
          </div>

          {/* Stat cards */}
          <div style={{display: 'flex', gap: 28, marginTop: 220}}>
            <StatCard frame={frame} fps={fps} enterAt={60} icon={<LightningIcon />} value="72h" label="install window" finalY={0} />
            <StatCard frame={frame} fps={fps} enterAt={105} icon={<PinIcon />} value="1" label="per zip code" finalY={0} />
            <StatCard frame={frame} fps={fps} enterAt={150} icon={<ShieldIcon />} value="30d" label="money back" finalY={0} />
          </div>

          {/* CTA line */}
          {frame >= 195 && (
            <div style={{position: 'absolute', bottom: 280, left: 0, right: 0, textAlign: 'center', opacity: ctaOpacity, transform: `translateY(${ctaY}px)`, padding: '0 60px'}}>
              <div style={{color: 'rgba(255,255,255,0.7)', fontSize: 26, fontWeight: 600, letterSpacing: 5, textTransform: 'uppercase', marginBottom: 20}}>Is Your Zip Still Open?</div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 24,
                  background: 'rgba(255,255,255,0.1)',
                  border: `2px solid ${theme.gold}`,
                  padding: '28px 56px',
                  borderRadius: 18,
                  fontSize: 48,
                  fontWeight: 800,
                  letterSpacing: 3,
                }}
              >
                APPLY BELOW
                <span style={{fontSize: 52, transform: `translateY(${arrowBob}px)`, display: 'inline-block'}}>↓</span>
              </div>
            </div>
          )}
        </>
      )}

      {showLogo && (
        <>
          <div style={{opacity: logoOpacity, transform: `scale(${logoScale})`, textAlign: 'center'}}>
            <div style={{fontSize: 180, fontWeight: 800, letterSpacing: 12, color: '#fff', lineHeight: 1}}>SYBAGO</div>
            <div style={{fontSize: 28, fontWeight: 600, letterSpacing: 10, color: theme.gold, marginTop: 12, textTransform: 'uppercase'}}>sybago.ai</div>
          </div>
          {/* Gradient sweep */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(90deg, transparent 0%, rgba(212,161,74,0.25) 50%, transparent 100%)`,
              transform: `translateX(${sweepX}%)`,
              pointerEvents: 'none',
            }}
          />
        </>
      )}
    </AbsoluteFill>
  );
};
