import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily, theme} from '../Theme';

export const Scene0WebsiteReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Header fade
  const headerOpacity = interpolate(frame, [0, 15], [0, 1], {extrapolateRight: 'clamp'});

  // Browser mockup entrance (0.1s-1s)
  const browserSpring = spring({frame: frame - 3, fps, config: {damping: 18, stiffness: 140}, durationInFrames: 24});
  const browserY = interpolate(browserSpring, [0, 1], [80, 0]);
  const browserOpacity = interpolate(frame, [3, 18], [0, 1], {extrapolateRight: 'clamp'});

  // Price tag drops in (1.2s-2s)
  const priceSpring = spring({frame: frame - 36, fps, config: {damping: 9, stiffness: 180}});
  const priceY = interpolate(priceSpring, [0, 1], [-80, 0]);
  const priceOpacity = interpolate(frame, [36, 50], [0, 1], {extrapolateRight: 'clamp'});
  const priceRotate = interpolate(priceSpring, [0, 1], [-8, -4]);

  // Strikethrough line draws (2s-2.5s)
  const strikeProgress = interpolate(frame, [60, 75], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // FREE slam (2.5s-3.3s)
  const freeSpring = spring({frame: frame - 75, fps, config: {damping: 9, stiffness: 200}});
  const freeOpacity = interpolate(frame, [75, 85], [0, 1], {extrapolateRight: 'clamp'});
  const freeScale = freeSpring;
  const freeRotate = interpolate(freeSpring, [0, 1], [-18, 4]);

  // Included tagline (3.3s-4s)
  const taglineOpacity = interpolate(frame, [100, 112], [0, 1], {extrapolateRight: 'clamp'});
  const taglineY = interpolate(spring({frame: frame - 100, fps, config: {damping: 200}}), [0, 1], [20, 0]);

  return (
    <AbsoluteFill style={{background: theme.paper, fontFamily, justifyContent: 'flex-start', alignItems: 'center', overflow: 'hidden', paddingTop: 100}}>
      {/* Ambient glow */}
      <div style={{position: 'absolute', width: 1200, height: 1200, borderRadius: '50%', background: `radial-gradient(circle, rgba(47,103,121,0.08), transparent 60%)`, top: '10%', left: '50%', transform: 'translateX(-50%)', filter: 'blur(40px)'}} />

      {/* Header */}
      <div style={{textAlign: 'center', opacity: headerOpacity, marginBottom: 40}}>
        <div style={{color: theme.teal, fontSize: 28, fontWeight: 800, letterSpacing: 10, textTransform: 'uppercase'}}>Service Pros &middot; Listen Up</div>
      </div>

      {/* Browser mockup */}
      <div style={{transform: `translateY(${browserY}px)`, opacity: browserOpacity, width: 680, background: theme.paper, borderRadius: 18, boxShadow: '0 40px 100px rgba(47,103,121,0.25)', border: '1px solid rgba(17,17,17,0.08)', overflow: 'hidden'}}>
        {/* Browser chrome */}
        <div style={{display: 'flex', alignItems: 'center', gap: 10, background: '#f2f2f2', padding: '12px 18px', borderBottom: '1px solid rgba(0,0,0,0.05)'}}>
          <div style={{width: 12, height: 12, borderRadius: '50%', background: '#ff5f57'}} />
          <div style={{width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e'}} />
          <div style={{width: 12, height: 12, borderRadius: '50%', background: '#28c840'}} />
          <div style={{marginLeft: 18, flex: 1, background: '#fff', borderRadius: 8, padding: '7px 14px', fontSize: 16, color: theme.inkFaint, fontWeight: 500}}>
            yourservice.com
          </div>
        </div>
        {/* Page content — tightened */}
        <div style={{padding: '34px 32px', background: `linear-gradient(180deg, ${theme.paper} 0%, #f9fbfc 100%)`}}>
          <div style={{color: theme.teal, fontSize: 15, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 10}}>YOUR BUSINESS NAME</div>
          <div style={{color: theme.ink, fontSize: 36, fontWeight: 800, lineHeight: 1.15, letterSpacing: -1, marginBottom: 12}}>Professional Service.<br />On-Call 24/7.</div>
          <div style={{color: theme.inkMuted, fontSize: 17, fontWeight: 500, marginBottom: 22}}>Licensed &middot; Bonded &middot; Insured</div>

          <div style={{display: 'flex', gap: 14, alignItems: 'center'}}>
            <div style={{background: theme.teal, color: '#fff', padding: '14px 26px', borderRadius: 8, fontSize: 17, fontWeight: 700, letterSpacing: 1}}>Get a Free Estimate →</div>
            <div style={{color: theme.teal, fontSize: 17, fontWeight: 700, letterSpacing: 0.5}}>(555) 123-1212</div>
          </div>
        </div>
      </div>

      {/* Price tag */}
      {frame >= 36 && (
        <div
          style={{
            position: 'absolute',
            top: 950,
            left: '50%',
            transform: `translateX(-50%) translateY(${priceY}px) rotate(${priceRotate}deg)`,
            opacity: priceOpacity,
            background: '#fff',
            border: `6px solid ${theme.ink}`,
            padding: '26px 62px',
            fontSize: 110,
            fontWeight: 800,
            color: theme.ink,
            letterSpacing: -3,
            boxShadow: '0 18px 44px rgba(0,0,0,0.18)',
          }}
        >
          $2,997
          {/* Strikethrough */}
          {strikeProgress > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '4%',
                right: '4%',
                height: 14,
                background: theme.danger,
                transform: `translateY(-50%) scaleX(${strikeProgress})`,
                transformOrigin: 'left',
                borderRadius: 3,
              }}
            />
          )}
        </div>
      )}

      {/* FREE stamp */}
      {frame >= 75 && (
        <div
          style={{
            position: 'absolute',
            top: 1280,
            left: '50%',
            transform: `translateX(-50%) scale(${freeScale}) rotate(${freeRotate}deg)`,
            opacity: freeOpacity,
            color: theme.teal,
            border: `12px solid ${theme.teal}`,
            padding: '28px 90px',
            fontSize: 170,
            fontWeight: 800,
            letterSpacing: 8,
            background: '#fff',
            lineHeight: 1,
            boxShadow: '0 22px 60px rgba(47,103,121,0.4)',
          }}
        >
          FREE
        </div>
      )}

      {/* Tagline */}
      {frame >= 100 && (
        <div
          style={{
            position: 'absolute',
            bottom: 140,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            color: theme.ink,
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: 'uppercase',
          }}
        >
          Included with every install
        </div>
      )}
    </AbsoluteFill>
  );
};
