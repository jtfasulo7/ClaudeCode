import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T, FONT, SIZE } from '../tokens';

/* ──────────────────────────────────────────────────────────────────────
   Feature 04 — Wakes Up Your Dead Leads
   Beats:
     0.0–1.4s   A workflow node graph: Trigger → Wait 60d → Send SMS.
                Three "stale lead" cards waiting on the Wait node.
     1.4–2.0s   Wait node fires; the leads pulse and slide into Send SMS
     2.0–3.0s   Outbound SMS samples cascade out from the Send node;
                a "+ $4,200 reactivated" pill lands as the kicker.
   ────────────────────────────────────────────────────────────────────── */

export const F04_DeadLeads: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Workflow nodes positions
  const nodes = [
    { id: 'trigger', x: 220,  y: 360, w: 240, label: 'Lead added',           kind: 'event' as const },
    { id: 'wait',    x: 540,  y: 360, w: 240, label: 'Wait 60 days',          kind: 'wait'  as const },
    { id: 'send',    x: 860,  y: 360, w: 240, label: 'Send re-engagement SMS', kind: 'send'  as const },
  ];

  // Three lead cards initially perched above the Wait node
  const leadCards = [
    { name: 'Mike A.',  job: 'Roof leak quote',     last: '62 days ago' },
    { name: 'Sarah K.', job: 'Skylight install',    last: '78 days ago' },
    { name: 'Dan T.',   job: 'Gutter replacement',  last: '91 days ago' },
  ];

  // Fire frame (Wait → Send)
  const fireStart = 32;
  const fireEnd   = 56;

  // Wait-node pulse from frame 32 → 56
  const fireT = interpolate(frame, [fireStart, fireEnd], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const sendPulse = (() => {
    const f = frame - fireEnd;
    if (f < 0 || f > 14) return 0;
    return 1 - f / 14;
  })();

  // Outbound SMS samples — cascade in
  const sentMessages = [
    { from: fireEnd + 4,  text: '"Hey Mike, that roof leak we quoted in March — just had a slot open this week."' },
    { from: fireEnd + 14, text: '"Hi Sarah, still thinking about the skylight? Material prices dropped — want a fresh quote?"' },
    { from: fireEnd + 24, text: '"Hey Dan — checking back on those gutters before fall. 30 mins to swing by tomorrow?"' },
  ];

  // Result kicker pill at frame 80
  const kickerT = spring({
    frame: frame - 80, fps, config: { damping: 18, mass: 0.8 },
  });
  const kickerY = interpolate(kickerT, [0, 1], [16, 0], { extrapolateRight: 'clamp' });
  const kickerOp = interpolate(kickerT, [0, 1], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      background: T.bg2,
      fontFamily: FONT,
      padding: SIZE.pad,
    }}>
      <AbsoluteFill style={{
        background:
          'radial-gradient(ellipse at 30% 30%, rgba(47,103,121,0.08), transparent 50%),' +
          'radial-gradient(ellipse at 70% 70%, rgba(77,191,122,0.08), transparent 50%)',
      }} />

      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 56, left: SIZE.pad, right: SIZE.pad,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        <div style={{
          width: 36, height: 36,
          borderRadius: 8,
          background: T.teal,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.32em',
            textTransform: 'uppercase', color: T.tealB,
          }}>Workflow · Dead-lead reactivation</div>
          <div style={{
            fontSize: 22, fontWeight: 700, color: T.ink,
            letterSpacing: '-0.005em', marginTop: 2,
          }}>Active · 247 leads in queue</div>
        </div>

        <div style={{
          marginLeft: 'auto',
          fontSize: 13,
          color: T.ink3,
          fontWeight: 600,
          background: T.bg,
          border: `1px solid ${T.line}`,
          padding: '8px 14px', borderRadius: 6,
        }}>
          Last fired · just now
        </div>
      </div>

      {/* Connector lines between nodes (drawn behind everything else) */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <Connector from={nodes[0]} to={nodes[1]} active={frame >= 4}  fired={frame >= fireStart} />
        <Connector from={nodes[1]} to={nodes[2]} active={frame >= fireStart} fired={frame >= fireEnd} />
      </svg>

      {/* Nodes */}
      {nodes.map(n => {
        const isWait = n.kind === 'wait';
        const isSend = n.kind === 'send';
        return (
          <div key={n.id} style={{
            position: 'absolute',
            left: n.x, top: n.y,
            width: n.w, height: 96,
            background: T.bg,
            border: `2px solid ${
              (isWait && fireT > 0 && fireT < 1) ? T.warn :
              (isSend && sendPulse > 0)           ? T.good :
              T.line
            }`,
            borderRadius: 12,
            padding: '14px 18px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4,
            boxShadow:
              (isWait && fireT > 0 && fireT < 1) ? `0 0 0 6px ${T.tealG}` :
              (isSend && sendPulse > 0)           ? `0 0 0 ${4 + sendPulse * 16}px rgba(77,191,122,${0.18 - sendPulse * 0.1})` :
              '0 6px 14px rgba(15,20,25,0.05)',
            transition: 'box-shadow .2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <NodeIcon kind={n.kind} />
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: n.kind === 'event' ? T.tealB : n.kind === 'wait' ? T.warn : T.good,
              }}>
                {n.kind === 'event' ? 'Trigger' : n.kind === 'wait' ? 'Wait' : 'Action'}
              </span>
            </div>
            <div style={{
              fontSize: 17, fontWeight: 700, color: T.ink, letterSpacing: '-0.005em',
            }}>{n.label}</div>
          </div>
        );
      })}

      {/* Stale lead cards */}
      {leadCards.map((c, i) => {
        // Each card sits above Wait initially, then animates into Send
        const mover = interpolate(
          frame,
          [fireStart + i * 4, fireEnd + i * 4],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        const fromX = nodes[1].x + 30;
        const fromY = nodes[1].y - 110 - i * 76;
        const toX   = nodes[2].x + 30;
        const toY   = nodes[2].y + 110 + i * 8;
        const x = fromX + (toX - fromX) * mover;
        const y = fromY + (toY - fromY) * mover;
        const opacity = interpolate(mover, [0.85, 1], [1, 0], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });

        return (
          <div key={c.name} style={{
            position: 'absolute',
            left: x, top: y,
            width: 200, height: 64,
            background: T.bg,
            border: `1px solid ${T.line}`,
            borderRadius: 10,
            padding: '10px 14px',
            opacity,
            boxShadow: '0 6px 14px rgba(15,20,25,0.06)',
            transition: 'transform .1s',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{c.name}</div>
            <div style={{ fontSize: 12, color: T.ink2, fontWeight: 500 }}>{c.job}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.ink3,
              letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2,
            }}>
              {c.last}
            </div>
          </div>
        );
      })}

      {/* Outbound SMS samples cascading from Send node */}
      {sentMessages.map((m, i) => {
        const inT = interpolate(frame, [m.from, m.from + 8], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        const x = nodes[2].x + nodes[2].w + 36;
        const y = nodes[2].y - 12 + i * 70;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: x + (1 - inT) * -20,
            top:  y,
            width: 320,
            opacity: inT,
            background: T.bg,
            border: `1px solid ${T.tealG}`,
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 13,
            fontWeight: 500,
            color: T.ink,
            lineHeight: 1.4,
            boxShadow: '0 6px 14px rgba(15,20,25,0.06)',
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: T.good, marginBottom: 4,
            }}>
              SMS sent
            </div>
            {m.text}
          </div>
        );
      })}

      {/* Kicker pill */}
      <div style={{
        position: 'absolute',
        bottom: SIZE.pad,
        left: '50%',
        transform: `translate(-50%, ${kickerY}px)`,
        opacity: kickerOp,
        background: T.good,
        color: '#fff',
        padding: '14px 26px',
        borderRadius: 999,
        fontSize: 18, fontWeight: 700,
        letterSpacing: '-0.005em',
        boxShadow: '0 12px 28px rgba(77,191,122,0.32)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{
          background: 'rgba(255,255,255,0.22)',
          padding: '4px 10px', borderRadius: 999,
          fontSize: 12, fontWeight: 700, letterSpacing: '0.18em',
        }}>+ $4,200</span>
        Reactivated last month from leads you'd given up on.
      </div>

    </AbsoluteFill>
  );
};

type Node = { id: string; x: number; y: number; w: number; label: string; kind: 'event'|'wait'|'send' };

const Connector: React.FC<{ from: Node; to: Node; active: boolean; fired: boolean }> = ({
  from, to, active, fired,
}) => {
  const x1 = from.x + from.w;
  const y1 = from.y + 48;
  const x2 = to.x;
  const y2 = to.y + 48;
  return (
    <g>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={fired ? T.good : (active ? T.tealB : T.ink4)}
        strokeWidth={2.5}
        strokeDasharray={fired ? '0' : '6 6'}
      />
      <polygon
        points={`${x2},${y2} ${x2-12},${y2-6} ${x2-12},${y2+6}`}
        fill={fired ? T.good : (active ? T.tealB : T.ink4)}
      />
    </g>
  );
};

const NodeIcon: React.FC<{ kind: 'event'|'wait'|'send' }> = ({ kind }) => {
  const c = kind === 'event' ? T.tealB : kind === 'wait' ? T.warn : T.good;
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c}
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      {kind === 'event' && <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />}
      {kind === 'wait'  && <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}
      {kind === 'send'  && <><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>}
    </svg>
  );
};
