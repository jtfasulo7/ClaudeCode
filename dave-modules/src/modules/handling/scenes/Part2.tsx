import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Shot, Stack } from "../../../shared/components/Shot";
import { MaskStatement, MaskWords, TrackLabel, WipeRule } from "../../../shared/components/Kinetic";
import { LightSweep } from "../../../shared/components/StageV2";
import { animAt, maskRight, transformOrNone } from "../../../shared/motion";
import { C, SANS, SERIF } from "../../../shared/theme";
import { HandlingVial } from "./Part1";

/* 12 — 52.00-57.30  "never assume every peptide should be stored or handled the same way" */
export const NeverAssume: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const b = animAt(f, 120, 28, "enter");
  return (
    <Shot dur={dur} enter="settle">
      <Stack gap={32}>
        <MaskWords words={["Never", "assume"]} accent={[0]} size={124} delay={9} step={6} />
        <div style={{ opacity: b }}>
          <TrackLabel delay={120} color={C.gold}>
            That they are all stored the same way
          </TrackLabel>
        </div>
      </Stack>
    </Shot>
  );
};

/* 13 — 57.30-60.50  "You should also know when something looks questionable." */
export const LooksQuestionable: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="rise">
    <Stack gap={26}>
      <TrackLabel delay={4} color={C.textFaint}>
        You should know when
      </TrackLabel>
      <MaskWords words={["Something", "looks", "wrong"]} accent={[2]} size={98} delay={51} step={5} />
    </Stack>
  </Shot>
);

/* 14 — 60.50-67.60  damaged seals / cracked vials / particles / discoloration
 *
 * Each flag lands on its bell in the score.
 */
export const RedFlags: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const CUES = [21, 60, 93, 141];
  const NAMES = ["Damaged seals", "Cracked vials", "Unexpected particles", "Unusual discolouration"];
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={44}>
        <TrackLabel delay={4} color={C.red}>
          Take these seriously
        </TrackLabel>
        <div style={{ display: "flex", gap: 26, alignItems: "flex-end" }}>
          {NAMES.map((n, i) => {
            const p = animAt(f, CUES[i], 24, "enter");
            return (
              <div
                key={i}
                style={{
                  width: 330,
                  opacity: p,
                  transform: transformOrNone([`translateY(${(1 - p) * 30}px)`], p < 1),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <HandlingVial
                  h={270}
                  solution={i === 2 ? 0.7 : i === 3 ? 0.7 : 0}
                  tone="red"
                  p={p}
                  particles={i === 2 ? p : 0}
                  cracked={i === 1 ? p : 0}
                />
                <span
                  style={{
                    fontFamily: SANS,
                    fontSize: 28,
                    fontWeight: 600,
                    color: C.textDim,
                    textAlign: "center",
                    lineHeight: 1.25,
                  }}
                >
                  {n}
                </span>
              </div>
            );
          })}
        </div>
      </Stack>
    </Shot>
  );
};

/* 15 — 67.60-71.50  "or a product that was stored improperly — always taken seriously" */
export const StoredImproperly: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const b = animAt(f, 63, 28, "enter");
  return (
    <Shot dur={dur} enter="pushL">
      <Stack gap={30}>
        <MaskWords words={["Or", "stored", "improperly"]} accent={[2]} size={82} delay={9} step={5} />
        <div style={{ opacity: b }}>
          <TrackLabel delay={63} color={C.red}>
            Always take it seriously
          </TrackLabel>
        </div>
      </Stack>
    </Shot>
  );
};

/* 16 — 71.50-77.40  "appearance alone cannot tell you if something is safe" */
export const AppearanceCant: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const a = animAt(f, 72, 30, "enter");
  const b = animAt(f, 96, 30, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={34}>
        <div style={{ opacity: a }}>
          <MaskWords words={["Appearance", "alone"]} accent={[0]} size={92} delay={72} step={5} />
        </div>
        <div style={{ opacity: b }}>
          <MaskWords words={["Cannot", "tell", "you"]} accent={[]} size={62} delay={96} step={4} color={C.textDim} />
        </div>
      </Stack>
    </Shot>
  );
};

/* 17 — 77.40-84.00  "Something can look completely normal and still have an issue you cannot see."
 *
 * The key beat of the film: two vials, visually identical. One is fine, one is
 * not, and nothing on screen distinguishes them — which is exactly the point.
 */
export const LooksNormal: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const pair = animAt(f, 27, 30, "heavy");
  const reveal = animAt(f, 147, 32, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={44}>
        <div style={{ opacity: pair }}>
          <TrackLabel delay={27} color={C.textFaint}>
            Both look completely normal
          </TrackLabel>
        </div>
        <div style={{ display: "flex", gap: 120, alignItems: "flex-end" }}>
          {[0, 1].map((i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
              <HandlingVial h={400} solution={0.66} tone="gold" p={pair} />
              <div
                style={{
                  opacity: i === 1 ? reveal : 0,
                  fontFamily: SANS,
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: C.red,
                  border: `1.5px solid rgba(180,72,60,0.55)`,
                  background: "rgba(180,72,60,0.09)",
                  borderRadius: 999,
                  padding: "12px 28px",
                }}
              >
                Contaminated
              </div>
            </div>
          ))}
        </div>
        <div style={{ opacity: reveal }}>
          <MaskWords words={["You", "cannot", "see", "it"]} accent={[1]} size={62} delay={147} step={4} />
        </div>
      </Stack>
    </Shot>
  );
};

/* 18 — 84.00-88.60  "proper handling is more than just knowing how to reconstitute something" */
export const MoreThanReconstitute: React.FC<{ dur: number }> = ({ dur }) => (
  <Shot dur={dur} enter="settle">
    <Stack gap={28}>
      <TrackLabel delay={4} color={C.textFaint}>
        Proper handling is
      </TrackLabel>
      <MaskWords words={["More", "than", "one", "step"]} accent={[0]} size={98} delay={48} step={5} />
    </Stack>
  </Shot>
);

/* 19 — 88.60-94.50  storage / sterility / contamination / stability — each on its bell */
export const TheFour: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const CUES = [24, 57, 87, 123];
  const NAMES = ["Storage", "Sterility", "Contamination", "Stability"];
  return (
    <Shot dur={dur} enter="rise">
      <Stack gap={40}>
        <TrackLabel delay={4}>It is understanding</TrackLabel>
        <div style={{ width: 900, display: "flex", flexDirection: "column", gap: 18 }}>
          {NAMES.map((n, i) => {
            const p = animAt(f, CUES[i], 24, "enter");
            const line = animAt(f, CUES[i] + 4, 26, "enter");
            return (
              <div
                key={i}
                style={{
                  opacity: p,
                  transform: transformOrNone([`translateX(${(1 - p) * 28}px)`], p < 1),
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  fontFamily: SANS,
                }}
              >
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: C.gold,
                    width: 44,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {`0${i + 1}`}
                </span>
                <span style={{ fontSize: 50, fontWeight: 600, color: C.text, letterSpacing: -1 }}>{n}</span>
                <span
                  style={{
                    flex: 1,
                    height: 1,
                    background: `linear-gradient(90deg, ${C.line}, transparent)`,
                    ...maskRight(line),
                  }}
                />
              </div>
            );
          })}
        </div>
      </Stack>
    </Shot>
  );
};

/* 20 — 94.50-99.90  "knowing when you should stop and ask questions instead of guessing" */
export const StopAndAsk: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const b = animAt(f, 111, 30, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={34}>
        <TrackLabel delay={4} color={C.gold}>
          And most importantly
        </TrackLabel>
        <MaskWords words={["Stop", "and", "ask"]} accent={[0]} size={116} delay={54} step={5} />
        <div style={{ opacity: b }}>
          <TrackLabel delay={111} color={C.textDim}>
            Instead of guessing
          </TrackLabel>
        </div>
      </Stack>
    </Shot>
  );
};

/* 21 — 99.90-103.90  "If you ever don't understand something, ask in the community." */
export const AskCommunity: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const icon = animAt(f, 12, 28, "heavy");
  const b = animAt(f, 78, 28, "enter");
  return (
    <Shot dur={dur} enter="rise">
      <Stack gap={34}>
        <svg width="112" height="98" viewBox="0 0 112 98" style={{ opacity: icon }}>
          <rect x="4" y="6" width="104" height="72" rx="15" fill="rgba(201,162,39,0.08)" stroke={C.gold} strokeWidth="3.5" />
          <path d="M30 34 H82 M30 52 H66" stroke={C.gold} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M36 78 L36 94 L54 78" fill={C.gold} />
        </svg>
        <div style={{ opacity: b }}>
          <MaskWords words={["Ask", "in", "the", "community"]} accent={[3]} size={72} delay={78} step={4} />
        </div>
      </Stack>
    </Shot>
  );
};

/* 22 — 103.90-107.60  "We're here to help you learn." */
export const EndCard: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const mark = animAt(f, 62, 30, "enter");
  return (
    <Shot dur={dur} enter="fade">
      <Stack gap={42}>
        <MaskStatement
          lines={[
            <>
              We are here to <span style={{ color: C.goldBright }}>help you learn</span>.
            </>,
          ]}
          size={76}
          delay={21}
        />
        <div style={{ opacity: mark, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          {/* Standing series disclaimer. Not spoken in this script, but every
              other module carries it and this one covers injectables and
              sterility — flagged to the client as an addition. */}
          <div style={{ fontFamily: SERIF, fontSize: 38, color: C.red, letterSpacing: -0.4 }}>
            Education and research discussion only. Not medical advice.
          </div>
          <WipeRule delay={70} width={320} />
          <div
            style={{
              fontFamily: SANS,
              fontSize: 30,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: C.goldBright,
              fontWeight: 700,
            }}
          >
            Peps by Dave
          </div>
        </div>
      </Stack>
      <LightSweep at={76} dur={56} />
    </Shot>
  );
};
