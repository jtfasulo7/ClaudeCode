import React from 'react';
import {AbsoluteFill, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily, theme} from './Theme';

type Caption = {text: string; at: number; duration: number; accent?: string};

const CAPTIONS: Caption[] = [
  {text: 'SERVICE PROS', at: 12, duration: 48},
  {text: '$2,997 WEBSITES', at: 70, duration: 50, accent: theme.gold},
  {text: 'PHONE GOES TO VOICEMAIL', at: 140, duration: 58},
  {text: '$8,000 JOB GONE', at: 260, duration: 58, accent: '#ff5a5a'},
  {text: '3-SECOND TEXT-BACKS', at: 345, duration: 50},
  {text: 'REBOOK DEAD LEADS', at: 400, duration: 50},
  {text: '5-STAR REVIEWS', at: 455, duration: 50},
  {text: "WEBSITE'S FREE", at: 510, duration: 50, accent: theme.gold},
  {text: 'LIVE IN 72 HOURS', at: 570, duration: 52},
  {text: '30 DAYS · MONEY BACK', at: 645, duration: 58},
];

export const PolishedAd: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Intro sting — 12f (0.4s) teal flash with logo punch
  const stingOpacity = interpolate(frame, [0, 4, 10, 14], [1, 1, 1, 0], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  const stingLogoScale = spring({frame: frame - 1, fps, config: {damping: 12, stiffness: 200}});
  const stingLogoOpacity = interpolate(frame, [1, 6, 10, 14], [0, 1, 1, 0], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});

  // Outro — last 60f (2s)
  const outroStart = durationInFrames - 60;
  const outroBgOpacity = interpolate(frame, [outroStart, outroStart + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const outroLogoSpring = spring({frame: frame - outroStart - 4, fps, config: {damping: 14, stiffness: 170}});
  const outroCTAOpacity = interpolate(frame, [outroStart + 18, outroStart + 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const outroCTAY = interpolate(spring({frame: frame - outroStart - 18, fps, config: {damping: 16}}), [0, 1], [40, 0]);

  // Progress bar
  const progressPct = Math.min(100, (frame / durationInFrames) * 100);

  // Active moment caption
  const activeCaption = CAPTIONS.find((c) => frame >= c.at && frame < c.at + c.duration);
  const captionLocalFrame = activeCaption ? frame - activeCaption.at : 0;
  const captionEnter = activeCaption ? spring({frame: captionLocalFrame, fps, config: {damping: 11, stiffness: 200}}) : 0;
  const captionExit = activeCaption
    ? interpolate(captionLocalFrame, [activeCaption.duration - 10, activeCaption.duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 0;

  // Watermark fade (hide during intro/outro)
  const watermarkOpacity =
    frame < 14 ? 0 : frame >= outroStart ? interpolate(frame, [outroStart, outroStart + 8], [0.4, 0], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}) : 0.4;

  return (
    <AbsoluteFill style={{background: '#000', fontFamily}}>
      {/* LAYER 1 — Base video with subtle color grade */}
      <AbsoluteFill style={{filter: 'saturate(1.1) contrast(1.05) brightness(1.02)'}}>
        <OffthreadVideo src={staticFile('sybago_video_2.mp4')} />
      </AbsoluteFill>

      {/* LAYER 2 — Vignette (edges darkened slightly) */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.38) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* LAYER 3 — Corner watermark (persistent brand mark) */}
      <div
        style={{
          position: 'absolute',
          top: 42,
          right: 42,
          color: '#fff',
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: 5,
          opacity: watermarkOpacity,
          textShadow: '0 3px 10px rgba(0,0,0,0.55)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div style={{width: 10, height: 10, background: theme.gold, borderRadius: '50%', boxShadow: `0 0 10px ${theme.gold}`}} />
        SYBAGO
      </div>

      {/* LAYER 4 — Moment captions */}
      {activeCaption && (
        <div
          style={{
            position: 'absolute',
            bottom: 340,
            left: 0,
            right: 0,
            textAlign: 'center',
            padding: '0 60px',
            opacity: captionExit,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(10,14,16,0.88)',
              color: '#fff',
              padding: '22px 40px',
              fontSize: 58,
              fontWeight: 800,
              letterSpacing: 1.5,
              borderRadius: 14,
              borderBottom: `6px solid ${activeCaption.accent ?? theme.gold}`,
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              textShadow: '0 2px 6px rgba(0,0,0,0.6)',
              transform: `scale(${captionEnter})`,
              lineHeight: 1.15,
              maxWidth: 900,
            }}
          >
            {activeCaption.text}
          </div>
        </div>
      )}

      {/* LAYER 5 — Progress bar */}
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 5, background: 'rgba(255,255,255,0.12)', pointerEvents: 'none'}}>
        <div
          style={{
            width: `${progressPct}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${theme.teal}, ${theme.gold})`,
            boxShadow: `0 0 14px rgba(212,161,74,0.6)`,
          }}
        />
      </div>

      {/* LAYER 6 — Intro sting (first ~0.5s) */}
      {frame < 15 && (
        <AbsoluteFill
          style={{
            background: `linear-gradient(135deg, ${theme.tealDark}, ${theme.teal})`,
            opacity: stingOpacity,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{transform: `scale(${stingLogoScale})`, opacity: stingLogoOpacity, textAlign: 'center'}}>
            <div style={{fontSize: 160, fontWeight: 800, color: '#fff', letterSpacing: 12, lineHeight: 1}}>SYBAGO</div>
            <div style={{width: 120, height: 4, background: theme.gold, margin: '20px auto 0', borderRadius: 2}} />
          </div>
        </AbsoluteFill>
      )}

      {/* LAYER 7 — Outro card (last 2s) */}
      {frame >= outroStart && (
        <AbsoluteFill
          style={{
            background: `linear-gradient(160deg, ${theme.tealDark} 0%, ${theme.teal} 60%, ${theme.tealLight} 100%)`,
            opacity: outroBgOpacity,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Ambient glow */}
          <div style={{position: 'absolute', width: 900, height: 900, borderRadius: '50%', background: `radial-gradient(circle, rgba(212,161,74,0.22), transparent 60%)`, top: '30%', left: '50%', transform: 'translateX(-50%)', filter: 'blur(40px)'}} />

          <div style={{textAlign: 'center', transform: `scale(${outroLogoSpring})`}}>
            <div style={{fontSize: 200, fontWeight: 800, color: '#fff', letterSpacing: 14, lineHeight: 1, marginBottom: 14}}>SYBAGO</div>
            <div style={{fontSize: 32, fontWeight: 600, color: theme.gold, letterSpacing: 10, textTransform: 'uppercase'}}>sybago.ai</div>
          </div>

          <div
            style={{
              marginTop: 80,
              opacity: outroCTAOpacity,
              transform: `translateY(${outroCTAY}px)`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
              background: 'rgba(255,255,255,0.12)',
              border: `2px solid ${theme.gold}`,
              color: '#fff',
              padding: '22px 52px',
              borderRadius: 14,
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: 3,
            }}
          >
            APPLY BELOW <span style={{fontSize: 48}}>↓</span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
