import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Scene, useIn, useRamp } from "../../../shared/components/Scene";
import { Eyebrow, KeyWords } from "../../../shared/components/Type";
import { Lock, Panel } from "../../../shared/components/Graphics";
import { DocTile } from "../../../shared/components/Diagrams";
import { C, SANS } from "../../../shared/theme";

/* 17 — 71.85-76.35  "Inside Peps by Dave, we also have a trusted vendor classroom." */
export const TrustedVendorClassroom: React.FC<{ dur: number }> = ({ dur }) => {
  const card = useIn(14, 24);
  const cap = useIn(52, 18);
  return (
    <Scene dur={dur} enter="scale">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 46 }}>
        <Eyebrow delay={4}>Inside Peps by Dave</Eyebrow>
        <div style={{ opacity: card, transform: `translateY(${(1 - card) * 26}px)` }}>
          <Panel width={860} pad={0} glow>
            <div style={{ height: 150, background: `linear-gradient(120deg, ${C.goldDim}22, ${C.panel2})`, borderRadius: "16px 16px 0 0", display: "flex", alignItems: "center", paddingLeft: 44 }}>
              <div style={{ fontFamily: SANS, fontSize: 26, letterSpacing: 3.6, color: C.gold, textTransform: "uppercase" }}>
                Classroom
              </div>
            </div>
            <div style={{ padding: "34px 44px 42px", fontFamily: SANS }}>
              <div style={{ fontSize: 62, fontWeight: 800, color: C.text, letterSpacing: -1.6 }}>
                Trusted Vendor
              </div>
              <div style={{ fontSize: 26, color: C.textDim, marginTop: 12 }}>
                Vendor information collected and compared by the community
              </div>
            </div>
          </Panel>
        </div>
        <div style={{ opacity: cap }}>
          <KeyWords words={["Trusted", "vendor", "classroom"]} accent={[0]} size={46} />
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 18 — 76.35-80.55  "That classroom unlocks after you engage and participate." */
export const LockUnlock: React.FC<{ dur: number }> = ({ dur }) => {
  const open = useRamp(23, 46);
  const cap = useIn(50, 18);
  const glow = useIn(30, 24);
  return (
    <Scene dur={dur} enter="fade">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 44 }}>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              inset: -70,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(201,162,39,${0.18 * glow}) 0%, rgba(201,162,39,0) 68%)`,
            }}
          />
          <Lock open={open} size={168} />
        </div>
        <div style={{ opacity: cap }}>
          <KeyWords words={["Engage", "·", "participate", "·", "unlock"]} accent={[4]} size={54} />
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 19 — 80.55-86.90  "members can view information about gray market vendors, including international vendors" */
export const VendorDirectory: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const card = useIn(2, 22);
  const rows = [0, 1, 2, 3].map((i) => useRamp(24 + i * 14, 44 + i * 14));
  const more = useRamp(96, 118);
  const intl = useRamp(143, 166);

  const data = [
    { n: "Vendor 01", r: "Domestic", tag: "COA on file" },
    { n: "Vendor 02", r: "International", tag: "COA on file" },
    { n: "Vendor 03", r: "International", tag: "Community notes" },
    { n: "Vendor 04", r: "Domestic", tag: "Community notes" },
  ];

  return (
    <Scene dur={dur} enter="rise">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: card }}>
          <Panel width={1140} pad={0}>
            <div style={{ display: "flex", padding: "24px 36px", borderBottom: `1px solid ${C.line}`, fontFamily: SANS, fontSize: 20, letterSpacing: 2.6, color: C.textFaint, textTransform: "uppercase" }}>
              <span style={{ flex: 2 }}>Vendor</span>
              <span style={{ flex: 1.4 }}>Region</span>
              <span style={{ flex: 1.6 }}>Documentation</span>
            </div>
            {data.map((d, i) => {
              const isIntl = d.r === "International";
              const hot = isIntl ? intl : 0;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "26px 36px",
                    borderBottom: i < 3 ? `1px solid ${C.lineSoft}` : "none",
                    opacity: rows[i],
                    transform: `translateX(${(1 - rows[i]) * 20}px)`,
                    background: `rgba(201,162,39,${hot * 0.1})`,
                    fontFamily: SANS,
                  }}
                >
                  <span style={{ flex: 2, fontSize: 32, fontWeight: 600, color: C.text }}>{d.n}</span>
                  <span style={{ flex: 1.4, fontSize: 28, color: isIntl && hot > 0.3 ? C.goldBright : C.textDim, fontWeight: isIntl ? 700 : 400 }}>
                    {d.r}
                  </span>
                  <span style={{ flex: 1.6, fontSize: 26, color: C.textFaint }}>{d.tag}</span>
                </div>
              );
            })}
            {/* Bridges the gap between the last row landing and the
                international highlight, so the table keeps moving. */}
            <div
              style={{
                padding: "20px 36px",
                borderTop: `1px solid ${C.lineSoft}`,
                opacity: more,
                transform: `translateY(${(1 - more) * 12}px)`,
                fontFamily: SANS,
                fontSize: 24,
                color: C.textFaint,
                letterSpacing: 1.4,
              }}
            >
              + more vendor information inside the classroom
            </div>
          </Panel>
        </div>
        <div style={{ position: "absolute", bottom: 92, opacity: interpolate(f, [140, 162], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <KeyWords words={["Including", "international", "vendors"]} accent={[1]} size={46} />
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 20 — 86.90-90.95  "their available price listings and other vendor information" */
export const PriceListing: React.FC<{ dur: number }> = ({ dur }) => {
  const card = useIn(2, 20);
  const lines = [0, 1, 2].map((i) => useRamp(18 + i * 12, 38 + i * 12));
  return (
    <Scene dur={dur} enter="wipeL">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
        <div style={{ opacity: card }}>
          <Panel width={900} pad={44} glow>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
              <Eyebrow delay={4}>Vendor 02 · price listing</Eyebrow>
              <span style={{ fontFamily: SANS, fontSize: 20, color: C.textFaint, letterSpacing: 2 }}>MEMBER VIEW</span>
            </div>
            {["10 vials", "20 vials", "50 vials"].map((q, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "22px 0",
                  borderTop: `1px solid ${C.lineSoft}`,
                  opacity: lines[i],
                  transform: `translateY(${(1 - lines[i]) * 14}px)`,
                  fontFamily: SANS,
                }}
              >
                <span style={{ fontSize: 32, color: C.textDim }}>{q}</span>
                <span style={{ fontSize: 40, fontWeight: 800, color: C.goldBright, letterSpacing: -1 }}>
                  {["$92", "$168", "$385"][i]}
                </span>
              </div>
            ))}
          </Panel>
        </div>
        <KeyWords words={["Price", "listings", "compared"]} accent={[0]} size={46} delay={62} />
      </AbsoluteFill>
    </Scene>
  );
};

/* 21 — 90.95-94.45  "You can also visit the COA results library classroom" */
export const COALibrary: React.FC<{ dur: number }> = ({ dur }) => {
  const cells = Array.from({ length: 10 }, (_, i) => useRamp(8 + i * 4, 26 + i * 4));
  const cap = useIn(48, 18);
  return (
    <Scene dur={dur} enter="scale">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 46 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 148px)", gap: 26 }}>
          {cells.map((p, i) => (
            <DocTile key={i} p={p} gold={i === 7} />
          ))}
        </div>
        <div style={{ opacity: cap }}>
          <KeyWords words={["COA", "results", "library"]} accent={[0]} size={52} />
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 22 — 94.45-98.55  "to review the testing documentation and COAs we've collected" */
export const TestingDocs: React.FC<{ dur: number }> = ({ dur }) => {
  const doc = useIn(2, 24);
  const items = [0, 1, 2].map((i) => useRamp(22 + i * 16, 44 + i * 16));
  return (
    <Scene dur={dur} enter="fade">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 110 }}>
        {/* Scaled well up — this beat is meant to read as a document closeup,
            and the library thumbnail size is far too small to carry a shot. */}
        <div style={{ opacity: doc, transform: `scale(${(0.92 + doc * 0.08) * 2.3}) rotate(-2deg)`, flexShrink: 0 }}>
          <DocTile p={1} gold />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 30, width: 700 }}>
          <Eyebrow delay={4}>Collected and reviewed</Eyebrow>
          {["Testing documentation", "COAs we've collected", "Compared side by side"].map((t, i) => (
            <div
              key={i}
              style={{
                opacity: items[i],
                transform: `translateX(${(1 - items[i]) * 26}px)`,
                fontFamily: SANS,
                fontSize: 44,
                fontWeight: 600,
                color: i === 0 ? C.text : C.textDim,
                borderLeft: `3px solid ${i === 0 ? C.gold : C.line}`,
                paddingLeft: 22,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
