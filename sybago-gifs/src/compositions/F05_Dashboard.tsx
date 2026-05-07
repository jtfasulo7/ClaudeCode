import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { T, FONT, SIZE } from '../tokens';
import { Browser } from '../components/Browser';

/* ──────────────────────────────────────────────────────────────────────
   Feature 05 — One Dashboard For Everything
   Beats:
     0.0–3.0s   A single tall dashboard scrolls vertically through 3 panels:
                Conversations · Pipeline · Reviews. Smooth eased pan.
   ────────────────────────────────────────────────────────────────────── */

export const F05_Dashboard: React.FC = () => {
  const frame = useCurrentFrame();

  const browserW = SIZE.width  - SIZE.pad * 2;
  const browserH = SIZE.height - SIZE.pad * 2;

  // Total content height — three panels stacked.
  const panelH = 720;
  const totalH = panelH * 3;

  // Pan: hold each panel for ~0.6s, ease across between panels.
  // Frame plan (90 total): 0–18 hold A, 18–36 pan to B, 36–54 hold B,
  //                         54–72 pan to C, 72–90 hold C.
  const scrollY = (() => {
    if (frame < 18) return 0;
    if (frame < 36) {
      const t = (frame - 18) / 18;
      const e = easeInOut(t);
      return e * panelH;
    }
    if (frame < 54) return panelH;
    if (frame < 72) {
      const t = (frame - 54) / 18;
      const e = easeInOut(t);
      return panelH + e * panelH;
    }
    return panelH * 2;
  })();

  // The visible viewport height inside the browser
  const viewportH = browserH - 56; // chrome height
  // Center the active panel in the viewport
  const offsetY = -(scrollY + (panelH - viewportH) / 2);

  return (
    <AbsoluteFill style={{ background: T.bg2, fontFamily: FONT, padding: SIZE.pad }}>
      <AbsoluteFill style={{
        background:
          'radial-gradient(ellipse at 30% 20%, rgba(47,103,121,0.06), transparent 55%),' +
          'radial-gradient(ellipse at 75% 80%, rgba(77,191,122,0.06), transparent 55%)',
      }} />

      {/* Caption */}
      <Caption frame={frame} />

      <Browser
        width={browserW}
        height={browserH - 60}
        url="app.sybago.com/dashboard"
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: offsetY,
            left: 0, right: 0,
            transition: 'top .1s',
          }}>
            <Conversations height={panelH} width={browserW} />
            <Pipeline      height={panelH} width={browserW} />
            <Reviews       height={panelH} width={browserW} />
          </div>
        </div>

        {/* Scroll indicator on the right edge */}
        <div style={{
          position: 'absolute',
          right: 14, top: 16, bottom: 16,
          width: 4,
          background: T.line,
          borderRadius: 2,
        }}>
          <div style={{
            position: 'absolute',
            left: 0, right: 0,
            top: `${(scrollY / totalH) * 100}%`,
            height: `${(viewportH / totalH) * 100}%`,
            background: T.tealB,
            borderRadius: 2,
          }} />
        </div>
      </Browser>

    </AbsoluteFill>
  );
};

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const Caption: React.FC<{ frame: number }> = ({ frame }) => {
  const lines = [
    { from: 0,  to: 36, text: 'Every call, text, lead, review — one inbox.' },
    { from: 36, to: 72, text: 'Pipeline updates as the texts come in.' },
    { from: 72, to: 90, text: 'Two buttons. That\'s all you actually press.' },
  ];
  const active = lines.find(l => frame >= l.from && frame < l.to) ?? lines[lines.length - 1];
  const localT = (frame - active.from) / 6;
  const op = Math.min(1, Math.max(0, localT));

  return (
    <div style={{
      position: 'absolute',
      top: SIZE.pad - 36,
      left: SIZE.pad, right: SIZE.pad,
      textAlign: 'center', opacity: op, pointerEvents: 'none',
    }}>
      <div style={{
        display: 'inline-block',
        background: 'rgba(15,20,25,0.04)',
        border: `1px solid ${T.line}`,
        borderRadius: 999,
        padding: '8px 22px',
        fontSize: 16, fontWeight: 600, color: T.ink,
        letterSpacing: '-0.005em',
      }}>
        {active.text}
      </div>
    </div>
  );
};

/* ─── Panels ─── */

const PanelHeader: React.FC<{ eyebrow: string; title: string; meta?: string }> = ({
  eyebrow, title, meta,
}) => (
  <div style={{
    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
    padding: '32px 40px 16px',
  }}>
    <div>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.32em',
        textTransform: 'uppercase', color: T.tealB,
      }}>{eyebrow}</div>
      <div style={{
        fontSize: 28, fontWeight: 800, color: T.ink,
        letterSpacing: '-0.015em', marginTop: 4,
      }}>{title}</div>
    </div>
    {meta && (
      <div style={{
        fontSize: 13, fontWeight: 600, color: T.ink3,
      }}>{meta}</div>
    )}
  </div>
);

const Conversations: React.FC<{ height: number; width: number }> = ({ height, width }) => {
  const threads = [
    { name: 'Mike Allen',   sub: 'Hey, sorry I missed that — what\'s the address?', when: '2m', unread: true },
    { name: 'Sarah Klein',  sub: 'Tomorrow at 3 works. See you then.', when: '14m', unread: true },
    { name: 'Dan Torres',   sub: 'Quote received. Looks fair, will sign tonight.', when: '1h',  unread: false },
    { name: 'Web — new',    sub: '[Form] Roof inspection — Rick L., (508) 555-0124', when: '2h', unread: false, badge: 'AUTO' },
    { name: 'Linda Park',   sub: 'Thanks for the photos!', when: '4h', unread: false },
    { name: 'Jay Bhatt',    sub: 'Can you do Saturday morning?', when: '6h', unread: false },
  ];
  return (
    <div style={{ height, padding: '0 0 12px' }}>
      <PanelHeader eyebrow="Conversations" title="Inbox" meta="3 unread · all channels" />
      <div style={{ padding: '0 28px' }}>
        {threads.map((t, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '18px 16px',
            borderTop: `1px solid ${T.line}`,
            background: t.unread ? T.tealTint : 'transparent',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: T.teal, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700,
              flexShrink: 0,
            }}>
              {t.name.split(' ').map(s => s[0]).join('').slice(0, 2)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{
                  fontSize: 16, fontWeight: 700, color: T.ink,
                }}>{t.name}</span>
                {t.badge && (
                  <span style={{
                    fontSize: 10, fontWeight: 800, letterSpacing: '0.18em',
                    color: T.good,
                    border: `1px solid ${T.good}`,
                    padding: '2px 8px', borderRadius: 999,
                  }}>{t.badge}</span>
                )}
                {t.unread && (
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', background: T.teal,
                  }} />
                )}
              </div>
              <div style={{
                fontSize: 14, color: T.ink2, fontWeight: 500,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                marginTop: 2,
              }}>{t.sub}</div>
            </div>
            <div style={{
              fontSize: 12, color: T.ink3, fontWeight: 600,
              flexShrink: 0,
            }}>{t.when}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Pipeline: React.FC<{ height: number; width: number }> = ({ height, width }) => {
  const cols = [
    {
      name: 'NEW',
      tint: T.tealTint,
      cards: [
        { who: 'Mike Allen',   job: 'Roof leak',     val: '$1,400' },
        { who: 'Linda Park',   job: 'Skylight',      val: '$3,200' },
      ],
    },
    {
      name: 'QUOTED',
      tint: 'rgba(232,176,74,0.10)',
      cards: [
        { who: 'Dan Torres',   job: 'Gutters',       val: '$840'   },
        { who: 'Jay Bhatt',    job: 'Saturday roof', val: '$2,100' },
        { who: 'Sarah Klein',  job: '2-story patch', val: '$960'   },
      ],
    },
    {
      name: 'BOOKED',
      tint: T.goodTint,
      cards: [
        { who: 'Rick L.',      job: 'Inspection',    val: 'Wed 3pm' },
        { who: 'Carla M.',     job: 'Asphalt repair', val: 'Fri AM' },
      ],
    },
  ];
  return (
    <div style={{ height, padding: '0 0 12px' }}>
      <PanelHeader eyebrow="Pipeline" title="This week" meta="7 active jobs · $9,540 quoted" />
      <div style={{
        display: 'flex',
        gap: 14,
        padding: '6px 28px',
      }}>
        {cols.map(c => (
          <div key={c.name} style={{ flex: 1 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.32em',
              textTransform: 'uppercase', color: T.ink3,
              padding: '8px 14px',
              borderTop: `1px solid ${T.line}`,
            }}>
              {c.name} · {c.cards.length}
            </div>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 8,
              padding: '8px 0',
            }}>
              {c.cards.map((card, i) => (
                <div key={i} style={{
                  background: c.tint,
                  border: `1px solid ${T.line}`,
                  borderRadius: 10,
                  padding: '12px 14px',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{card.who}</div>
                  <div style={{ fontSize: 12, color: T.ink2, fontWeight: 500, marginTop: 2 }}>
                    {card.job}
                  </div>
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: T.tealB, marginTop: 6,
                  }}>{card.val}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Reviews: React.FC<{ height: number; width: number }> = ({ height, width }) => {
  const reviews = [
    { name: 'Carla M.', stars: 5, text: '"Showed up the day I called. Fixed the leak in 90 min. Thank you!"', when: '2 days ago' },
    { name: 'Rick L.',  stars: 5, text: '"Very professional. Texted me a photo of the finished job. Will hire again."', when: '5 days ago' },
    { name: 'Hena P.',  stars: 5, text: '"Fair price. Honest about what didn\'t need replacing. Rare in this industry."', when: '1 wk ago' },
    { name: 'Tony D.',  stars: 4, text: '"Took an extra day, but quality work. Appreciate the texts along the way."', when: '2 wk ago' },
  ];
  return (
    <div style={{ height, padding: '0 0 12px' }}>
      <PanelHeader eyebrow="Reviews" title="4.9 ★ on Google" meta="this month · +6 new" />
      <div style={{ padding: '0 28px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {reviews.map((r, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', gap: 8,
            padding: '20px 16px',
            borderTop: `1px solid ${T.line}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                fontSize: 14, fontWeight: 700, color: T.ink,
              }}>{r.name}</span>
              <span style={{ display: 'flex', gap: 2 }}>
                {[0,1,2,3,4].map(s => (
                  <svg key={s} width={14} height={14} viewBox="0 0 24 24"
                    fill={s < r.stars ? T.warn : 'none'}
                    stroke={s < r.stars ? T.warn : T.ink4}
                    strokeWidth={2}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </span>
              <span style={{
                marginLeft: 'auto',
                fontSize: 12, fontWeight: 600, color: T.ink3,
              }}>{r.when}</span>
            </div>
            <div style={{
              fontSize: 14, color: T.ink, lineHeight: 1.5, fontWeight: 500,
            }}>{r.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
