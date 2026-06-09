"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Button } from "@/components/ui/button";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-slate-950 dark:text-white"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

const LETTER_GRADIENT =
  "inline-block text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-700/80 dark:from-white dark:to-white/80";

function ScrollLetter({
  char,
  scrollYProgress,
  start,
  end,
}: {
  char: string;
  scrollYProgress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const y = useTransform(scrollYProgress, [start, end], [100, 0], {
    clamp: true,
  });
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1], {
    clamp: true,
  });
  return (
    <motion.span style={{ y, opacity }} className={LETTER_GRADIENT}>
      {char}
    </motion.span>
  );
}

export function GlobalBackgroundPaths() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-white dark:bg-neutral-950"
    >
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}

export function BackgroundPaths({
  title = "Background Paths",
}: {
  title?: string;
}) {
  const words = title.split(" ");

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.1 + letterIndex * 0.03,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                    className={LETTER_GRADIENT}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <div
            className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10
                        dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg
                        overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <Button
              variant="ghost"
              className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md
                            bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100
                            text-black dark:text-white transition-all duration-300
                            group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10
                            hover:shadow-md dark:hover:shadow-neutral-800/50"
            >
              <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                Discover Excellence
              </span>
              <span
                className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5
                                transition-all duration-300"
              >
                →
              </span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

type Panel = { title: string; subtitle?: string };

function ScrollPanel({
  panel,
  scrollYProgress,
  sliceStart,
  sliceEnd,
  isLast,
}: {
  panel: Panel;
  scrollYProgress: MotionValue<number>;
  sliceStart: number;
  sliceEnd: number;
  isLast: boolean;
}) {
  const sliceLength = sliceEnd - sliceStart;
  const fadeMargin = sliceLength * 0.15;
  const revealRange = sliceLength * 0.55;
  const revealEnd = sliceStart + revealRange;

  const panelOpacity = useTransform(
    scrollYProgress,
    [
      Math.max(0, sliceStart - fadeMargin),
      sliceStart,
      sliceEnd - fadeMargin,
      isLast ? 1.01 : sliceEnd,
    ],
    [0, 1, 1, isLast ? 1 : 0],
  );

  const words = panel.title.split(" ");
  const totalLetters = words.reduce((s, w) => s + w.length, 0);
  const perLetterStep = revealRange / Math.max(totalLetters, 1);
  const letterWindowSteps = 4;

  const subtitleStart = sliceStart + revealRange * 0.85;
  const subtitleEnd = sliceStart + sliceLength * 0.75;
  const subtitleY = useTransform(
    scrollYProgress,
    [subtitleStart, subtitleEnd],
    [30, 0],
    { clamp: true },
  );
  const subtitleOpacity = useTransform(
    scrollYProgress,
    [subtitleStart, subtitleEnd],
    [0, 1],
    { clamp: true },
  );

  let flat = 0;

  return (
    <motion.div
      style={{ opacity: panelOpacity }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center max-w-4xl">
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter">
          {words.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block mr-4 last:mr-0">
              {word.split("").map((char, letterIndex) => {
                const letterStart = sliceStart + flat * perLetterStep;
                const letterEnd = Math.min(
                  letterStart + perLetterStep * letterWindowSteps,
                  revealEnd,
                );
                flat += 1;
                return (
                  <ScrollLetter
                    key={`${wordIndex}-${letterIndex}`}
                    char={char}
                    scrollYProgress={scrollYProgress}
                    start={letterStart}
                    end={letterEnd}
                  />
                );
              })}
            </span>
          ))}
        </h1>
        {panel.subtitle && (
          <motion.p
            style={{ y: subtitleY, opacity: subtitleOpacity }}
            className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed"
          >
            {panel.subtitle}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

export function ScrollStory({ panels }: { panels: Panel[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const N = panels.length;

  return (
    <section
      ref={containerRef}
      style={{ height: `${N * 110}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {panels.map((panel, idx) => (
          <ScrollPanel
            key={idx}
            panel={panel}
            scrollYProgress={scrollYProgress}
            sliceStart={idx / N}
            sliceEnd={(idx + 1) / N}
            isLast={idx === N - 1}
          />
        ))}
      </div>
    </section>
  );
}
