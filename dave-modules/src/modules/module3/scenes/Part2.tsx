import React from "react";
import { AbsoluteFill } from "remotion";
import { Scene, useIn, useRamp } from "../../../shared/components/Scene";
import { Eyebrow, KeyWords, Statement } from "../../../shared/components/Type";
import { NodeNetwork, ResultRow, SearchBar, ThreadPost } from "../../../shared/components/Diagrams";
import { C, SANS } from "../../../shared/theme";

const Center: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 28 }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap }}>
    {children}
  </AbsoluteFill>
);

/* 11 — 35.60-37.85  "Next, use the search feature." */
export const UseSearch: React.FC<{ dur: number }> = ({ dur }) => {
  const bar = useIn(6, 18);
  return (
    <Scene dur={dur} enter="rise">
      <Center gap={40}>
        <Eyebrow delay={2}>Next</Eyebrow>
        <div style={{ opacity: bar }}>
          <SearchBar query="" typed={0} />
        </div>
        <KeyWords words={["Use", "the", "search"]} accent={[2]} size={62} delay={20} />
      </Center>
    </Scene>
  );
};

/* 12 — 37.85-41.00  "Before asking a question, search the community." */
export const SearchBeforeAsk: React.FC<{ dur: number }> = ({ dur }) => {
  const typed = useRamp(46, 79);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={38}>
        <Eyebrow delay={2}>Before you ask</Eyebrow>
        <SearchBar query="how do I read a COA" typed={typed} />
        <KeyWords words={["Search", "first"]} accent={[0]} size={62} delay={56} />
      </Center>
    </Scene>
  );
};

/* 13 — 41.00-44.35  "somebody has already asked something similar" */
export const AlreadyAsked: React.FC<{ dur: number }> = ({ dur }) => {
  const rows = [useRamp(42, 62), useRamp(54, 74), useRamp(66, 86)];
  return (
    <Scene dur={dur} enter="rise">
      <Center gap={30}>
        <SearchBar query="how do I read a COA" typed={1} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: 860 }}>
          <ResultRow title="Reading a COA — what actually matters" meta="14 comments" p={rows[0]} hot />
          <ResultRow title="Is this COA legit?" meta="9 comments" p={rows[1]} />
          <ResultRow title="COA basics for new members" meta="22 comments" p={rows[2]} />
        </div>
      </Center>
    </Scene>
  );
};

/* 14 — 44.35-50.90  "the comments often contain more useful information than the post" */
export const CommentsGold: React.FC<{ dur: number }> = ({ dur }) => {
  const c1 = useIn(32, 18);
  const c2 = useIn(52, 18);
  const c3 = useIn(72, 18);
  const hot = useRamp(91, 118);
  const cap = useIn(120, 20);

  return (
    <Scene dur={dur} enter="fade">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34 }}>
        <ThreadPost
          post="Is this COA legit?"
          highlight={hot}
          comments={[
            { who: "Member", text: "Check the lab is independent of the seller.", p: c1 },
            { who: "Member", text: "Batch number has to match what you were sold.", p: c2 },
            { who: "Member", text: "Ask for the raw chromatogram, not just the summary.", p: c3 },
          ]}
        />
        <div style={{ opacity: cap }}>
          <KeyWords words={["The", "comments", "are", "the", "value"]} accent={[1]} size={46} />
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* 15 — 50.90-53.85  "I also strongly recommend participating." */
export const Participate: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="scale">
    <Center gap={26}>
      <Eyebrow color={C.textFaint}>And then</Eyebrow>
      <KeyWords words={["Participate"]} accent={[0]} size={158} delay={4} />
    </Center>
  </Scene>
);

/* 16 — 53.85-55.65  "You don't have to be an expert." */
export const NotExpert: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="rise">
    <Center>
      <KeyWords words={["No", "expertise", "required"]} accent={[1]} size={92} delay={2} />
    </Center>
  </Scene>
);

/* 17 — 55.65-57.55  "If you're new, ask questions." */
export const AskQuestions: React.FC<{ dur: number }> = ({ dur }) => {
  const mark = useIn(2, 18);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={30}>
        <div
          style={{
            opacity: mark,
            fontFamily: SANS,
            fontSize: 130,
            fontWeight: 800,
            color: C.gold,
            lineHeight: 1,
          }}
        >
          ?
        </div>
        <KeyWords words={["New?", "Ask", "questions"]} accent={[0]} size={72} delay={10} />
      </Center>
    </Scene>
  );
};

/* 18 — 57.55-62.15  "If you've been researching for years, share what you've learned." */
export const ShareLearned: React.FC<{ dur: number }> = ({ dur }) => {
  const a = useIn(32, 20);
  const b = useIn(92, 20);
  return (
    <Scene dur={dur} enter="rise">
      <Center gap={40}>
        <div style={{ opacity: a }}>
          <Eyebrow delay={32}>Been at this for years?</Eyebrow>
        </div>
        <div style={{ opacity: b }}>
          <KeyWords words={["Share", "what", "you've", "learned"]} accent={[0]} size={86} delay={92} />
        </div>
      </Center>
    </Scene>
  );
};

/* 19 — 62.15-67.55  "share it objectively, good or bad" */
export const ShareSupplier: React.FC<{ dur: number }> = ({ dur }) => {
  const head = useIn(26, 20);
  const obj = useIn(86, 20);
  const good = useIn(113, 18);
  const bad = useIn(122, 18);

  return (
    <Scene dur={dur} enter="fade">
      <Center gap={42}>
        <div style={{ opacity: head }}>
          <Eyebrow delay={26}>Experience with a supplier?</Eyebrow>
        </div>
        <div style={{ opacity: obj }}>
          <KeyWords words={["Share", "it", "objectively"]} accent={[2]} size={80} delay={86} />
        </div>
        <div style={{ display: "flex", gap: 26 }}>
          <div
            style={{
              opacity: good,
              padding: "18px 42px",
              borderRadius: 999,
              border: `1.5px solid rgba(62,158,106,0.55)`,
              background: "rgba(62,158,106,0.09)",
              fontFamily: SANS,
              fontSize: 34,
              fontWeight: 700,
              color: C.green,
            }}
          >
            Good
          </div>
          <div
            style={{
              opacity: bad,
              padding: "18px 42px",
              borderRadius: 999,
              border: `1.5px solid rgba(180,72,60,0.55)`,
              background: "rgba(180,72,60,0.09)",
              fontFamily: SANS,
              fontSize: 34,
              fontWeight: 700,
              color: C.red,
            }}
          >
            Bad
          </div>
        </div>
      </Center>
    </Scene>
  );
};

/* 20 — 67.55-69.85  "That's how the community becomes useful." */
export const CommunityUseful: React.FC<{ dur: number }> = ({ dur }) => (
  <Scene dur={dur} enter="scale">
    <Center>
      <Statement size={68} delay={4}>
        That is how the community becomes <span style={{ color: C.goldBright }}>useful</span>.
      </Statement>
    </Center>
  </Scene>
);

/* 21 — 69.85-72.35  "We want members helping members." */
export const MembersHelping: React.FC<{ dur: number }> = ({ dur }) => {
  const net = useRamp(4, 56);
  return (
    <Scene dur={dur} enter="fade">
      <Center gap={30}>
        <NodeNetwork p={net} size={430} />
        <KeyWords words={["Members", "helping", "members"]} accent={[1]} size={62} delay={30} />
      </Center>
    </Scene>
  );
};
