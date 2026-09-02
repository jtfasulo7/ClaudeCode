import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Scene, useIn, useRamp } from "../../../shared/components/Scene";
import { Eyebrow, KeyWords, Statement } from "../../../shared/components/Type";
import { ChapterNumber, Countdown, DMCard, ResultRow, WalletAddress } from "../../../shared/components/Diagrams";
import { C, SANS } from "../../../shared/theme";

const Center: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 28 }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap }}>
    {children}
  </AbsoluteFill>
);

/** Same string in both wallet scenes so it reads as one continuous address. */
const ADDR = "bc1q9x7k2m4vp8hs3ndz6ytu5rwfa0cegj1lqvbnmx";
const BAD_INDEX = 24;

/* 13 — 65.55-70.70  "don't rely only on reviews posted on a vendor's own website" */
export const MistakeThree: React.FC<{ dur: number }> = ({ dur }) => {
  const ch = useIn(2, 20);
  const rows = [useRamp(68, 84), useRamp(78, 94), useRamp(88, 104)];
  return (
    <Scene dur={dur} enter="rise">
      <Center gap={40}>
        <ChapterNumber n="03" label="Mistake" p={ch} />
        <div style={{ width: 900, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Eyebrow delay={62} color={C.red}>
              Reviews on the vendor's own site
            </Eyebrow>
          </div>
          {["★★★★★ Best vendor ever", "★★★★★ Fast shipping, A+", "★★★★★ Would order again"].map((t, i) => (
            <div
              key={i}
              style={{
                opacity: rows[i],
                padding: "20px 30px",
                borderRadius: 12,
                background: "rgba(180,72,60,0.06)",
                border: `1px solid rgba(180,72,60,0.28)`,
                fontFamily: SANS,
                fontSize: 30,
                color: C.textDim,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </Center>
    </Scene>
  );
};

/* 14 — 70.70-74.90  "independent discussions and patterns over time" */
export const IndependentPatterns: React.FC<{ dur: number }> = ({ dur }) => {
  const a = useRamp(21, 40);
  const b = useIn(66, 20);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={36}>
        <Eyebrow delay={4}>Look instead for</Eyebrow>
        <div style={{ width: 900, display: "flex", flexDirection: "column", gap: 14 }}>
          <ResultRow title="Independent discussion — vendor experiences" meta="community thread" p={a} hot />
        </div>
        <div style={{ opacity: b }}>
          <KeyWords words={["Patterns", "over", "time"]} accent={[0]} size={64} />
        </div>
      </Center>
    </Scene>
  );
};

/* 15 — 74.90-79.30  "don't let a flash sale or 'only 30 minutes left' rush you" */
export const FlashSaleTimer: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const card = useIn(24, 20);
  const cap = useIn(72, 20);
  // Ticks once per whole second so the digits swap cleanly rather than churning.
  const left = 1800 - Math.floor(Math.max(0, f - 24) / 30);
  return (
    <Scene dur={dur} enter="scale">
      <Center gap={40}>
        <Countdown secondsLeft={left} p={card} />
        <div style={{ opacity: cap }}>
          <KeyWords words={["Don't", "let", "it", "rush", "you"]} accent={[3]} size={58} />
        </div>
      </Center>
    </Scene>
  );
};

/* 16 — 79.30-82.40  "before doing your research" */
export const DoYourResearch: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="rise">
    <Center gap={26}>
      <Eyebrow color={C.textFaint}>Not before</Eyebrow>
      <KeyWords words={["Doing", "your", "research"]} accent={[2]} size={100} delay={4} />
    </Center>
  </Scene>
);

/* 17 — 82.40-87.85  "If you're sending crypto, double check the wallet address" */
export const CryptoWallet: React.FC<{ dur: number }> = ({ dur }) => {
  const addr = useIn(27, 22);
  const cap = useIn(57, 20);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={40}>
        <Eyebrow delay={4}>If you're sending crypto</Eyebrow>
        <div style={{ opacity: addr }}>
          <WalletAddress addr={ADDR} showBad={0} />
        </div>
        <div style={{ opacity: cap }}>
          <KeyWords words={["Double", "check", "the", "address"]} accent={[0]} size={54} />
        </div>
      </Center>
    </Scene>
  );
};

/* 18 — 87.85-91.00  "Crypto transactions are generally irreversible" */
export const Irreversible: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="scale">
    <Center gap={26}>
      <Eyebrow color={C.red}>Generally</Eyebrow>
      <KeyWords words={["Irreversible"]} accent={[]} size={150} delay={4} color={C.text} />
    </Center>
  </Scene>
);

/* 19 — 91.00-94.30  "one wrong character can mean that money is gone" */
export const OneWrongCharacter: React.FC<{ dur: number }> = ({ dur }) => {
  const bad = useRamp(9, 26);
  const gone = useIn(69, 20);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={40}>
        <WalletAddress addr={ADDR} badIndex={BAD_INDEX} showBad={bad} />
        <div style={{ opacity: gone }}>
          <KeyWords words={["One", "character.", "Gone."]} accent={[]} size={62} color={C.text} />
        </div>
      </Center>
    </Scene>
  );
};

/* 20 — 94.30-98.00  "do not respond to random DMs" */
export const RandomDMs: React.FC<{ dur: number }> = ({ dur }) => {
  const dm = useIn(63, 20);
  return (
    <Scene dur={dur} enter="rise">
      <Center gap={38}>
        <Eyebrow delay={4} color={C.red}>
          Do not respond to
        </Eyebrow>
        <DMCard who="Unknown sender" text="Hey — I've got peptides in stock, DM me for a price list." p={dm} />
      </Center>
    </Scene>
  );
};

/* 21 — 98.00-101.95  "from people claiming to be a vendor" */
export const ClaimingVendor: React.FC<{ dur: number }> = ({ dur }) => {
  const flag = useRamp(48, 70);
  const cap = useIn(74, 20);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={38}>
        <DMCard
          who="Unknown sender"
          text="Hey — I've got peptides in stock, DM me for a price list."
          p={1}
          flagged={flag}
        />
        <div style={{ opacity: cap }}>
          <KeyWords words={["Claiming", "to", "be", "a", "vendor"]} accent={[0]} size={52} />
        </div>
      </Center>
    </Scene>
  );
};

/* 22 — 101.95-106.90  "Verify contact info through the official information in the community" */
export const VerifyOfficial: React.FC<{ dur: number }> = ({ dur }) => {
  const a = useIn(6, 20);
  const b = useIn(80, 22);
  return (
    <Scene dur={dur} enter="scale">
      <Center gap={40}>
        <div style={{ opacity: a }}>
          <KeyWords words={["Verify", "contact", "info"]} accent={[0]} size={82} />
        </div>
        <div style={{ opacity: b }}>
          <Statement size={52} delay={80}>
            Through the <span style={{ color: C.goldBright }}>official information</span> listed inside the community.
          </Statement>
        </div>
      </Center>
    </Scene>
  );
};
