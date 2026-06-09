import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily, theme} from '../Theme';

const LEADS = [
  {name: 'Jerry Sanchez', days: 94, booked: false},
  {name: 'Patricia Kowalski', days: 122, booked: true},
  {name: 'Ben Reilly', days: 67, booked: false},
  {name: 'Marcus Chen', days: 211, booked: false},
  {name: 'Dana Whitfield', days: 88, booked: true},
  {name: 'Tom Esposito', days: 156, booked: false},
];

export const Scene3DeadLead: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const headerSpring = spring({frame, fps, config: {damping: 18}, durationInFrames: 12});

  return (
    <AbsoluteFill style={{background: theme.paperCool, fontFamily, justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}>
      <div style={{width: '82%', maxWidth: 900}}>
        <div style={{textAlign: 'center', marginBottom: 60, opacity: headerSpring}}>
          <div style={{color: theme.teal, fontSize: 36, fontWeight: 800, letterSpacing: 8, textTransform: 'uppercase'}}>Your Dead CRM</div>
          <div style={{color: theme.ink, fontSize: 62, fontWeight: 800, marginTop: 16, letterSpacing: -1}}>Everyone gets a text.</div>
        </div>

        <div style={{background: theme.paper, borderRadius: 28, padding: 28, boxShadow: '0 30px 80px rgba(47,103,121,0.15)'}}>
          {LEADS.map((lead, i) => {
            const textFireStart = 15 + i * 4;
            const textFireOpacity = interpolate(frame, [textFireStart, textFireStart + 6], [0, 1], {extrapolateRight: 'clamp'});
            const textFireX = interpolate(spring({frame: frame - textFireStart, fps, config: {damping: 18, stiffness: 180}}), [0, 1], [0, 60]);
            const textFireFade = interpolate(frame, [textFireStart + 10, textFireStart + 18], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

            // Booked rows turn green at ~45f onward
            const bookedStart = 45;
            const greenProgress = lead.booked ? interpolate(frame, [bookedStart + i * 2, bookedStart + i * 2 + 10], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}) : 0;

            return (
              <div
                key={lead.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '22px 26px',
                  marginBottom: i < LEADS.length - 1 ? 10 : 0,
                  borderRadius: 16,
                  background: `rgba(46,177,88,${greenProgress * 0.15})`,
                  border: `2px solid ${greenProgress > 0.5 ? theme.success : 'rgba(17,17,17,0.06)'}`,
                  position: 'relative',
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: greenProgress > 0.5 ? theme.success : 'rgba(17,17,17,0.12)',
                      color: greenProgress > 0.5 ? '#fff' : theme.inkFaint,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 28,
                    }}
                  >
                    {lead.name[0]}
                  </div>
                  <div>
                    <div style={{fontSize: 32, fontWeight: 700, color: theme.ink, letterSpacing: -0.3}}>{lead.name}</div>
                    <div style={{fontSize: 22, color: greenProgress > 0.5 ? theme.success : theme.inkFaint, fontWeight: 500, marginTop: 2}}>
                      {greenProgress > 0.5 ? 'BOOKED · replied YES' : `DEAD · ${lead.days}d ago`}
                    </div>
                  </div>
                </div>

                {/* Text fire icon */}
                <div style={{opacity: textFireOpacity * textFireFade, transform: `translateX(${textFireX}px)`, fontSize: 40}}>
                  💬
                </div>

                {greenProgress > 0.5 && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 26,
                      background: theme.success,
                      color: '#fff',
                      padding: '8px 18px',
                      borderRadius: 8,
                      fontSize: 20,
                      fontWeight: 800,
                      letterSpacing: 2,
                      transform: `scale(${greenProgress})`,
                    }}
                  >
                    ✓ BOOKED
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div
          style={{
            textAlign: 'center',
            marginTop: 48,
            color: theme.teal,
            fontSize: 30,
            fontWeight: 600,
            opacity: interpolate(frame, [50, 58], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          }}
        >
          A handful book. That handful pays for the system.
        </div>
      </div>
    </AbsoluteFill>
  );
};
