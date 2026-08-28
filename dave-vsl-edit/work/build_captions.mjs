// Caption beats are hand-broken on MEANING, then aligned back to the whisper
// word timeline so the timings stay frame-accurate. The script asserts that the
// authored text matches the transcript word-for-word, so a typo fails loudly
// instead of silently desyncing the captions.
import fs from 'node:fs';

const BEATS = `
Big Pharma charges you
thousands for peptides
when you could be
paying $15 a month
for the same stuff
and lose the same
amount of weight.
Here's what nobody
tells you.
People waste months
on bad vendors,
pay five to six times
more than they should
and end up with products
that are underdosed,
fake or flat out
unsafe.
And with no one to ask,
they guess.
Guessing gets expensive.
That's exactly why
Peps by Dave exists.
I'm not a doctor
and I'm not selling
you peptides.
I read the research,
I break it down
in plain English
and I built a place
where regular people
figure this out together
instead of alone.
Inside the community,
you get research breakdowns
without the jargon,
real conversations
about quality and testing,
connections to
verified suppliers,
what a COA
actually tells you.
Vendor insights from members
comparing notes
and straight answers
on how to stop
overpaying.
No miracle promises,
no hype.
Just honest information
and people who
take this seriously.
If you're done guessing,
hit join.
It takes 10 seconds
and I'll see you inside.
`.trim().split('\n').map((l) => l.trim()).filter(Boolean);

const t = JSON.parse(fs.readFileSync('work/transcript.json', 'utf8'));
const words = t.segments.flatMap((s) => s.words).map((w) => ({
  text: w.word.trim(), start: w.start, end: w.end,
}));

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9$]/g, '');

let i = 0;
const beats = BEATS.map((text) => {
  const n = text.split(/\s+/).length;
  const slice = words.slice(i, i + n);
  const got = norm(slice.map((w) => w.text).join(''));
  const want = norm(text);
  if (got !== want) {
    throw new Error(`beat misaligned at word ${i}\n  authored: ${want}\n  transcript: ${got}`);
  }
  i += n;
  return {text, start: slice[0].start, end: slice[slice.length - 1].end};
});

if (i !== words.length) throw new Error(`used ${i} of ${words.length} words — beats do not cover the script`);

// Hold each beat until the next begins (max 0.4s hang) so nothing strobes.
for (let k = 0; k < beats.length; k++) {
  const next = beats[k + 1];
  if (next) beats[k].end = Math.min(next.start, beats[k].end + 0.4);
  beats[k].end = Math.max(beats[k].end, beats[k].start + 0.34);
}

fs.writeFileSync('src/data/captions.json', JSON.stringify(beats, null, 2));
const d = beats.map((b) => b.end - b.start);
console.log(`${beats.length} beats  |  avg ${(d.reduce((a, c) => a + c) / d.length).toFixed(2)}s  min ${Math.min(...d).toFixed(2)}s  max ${Math.max(...d).toFixed(2)}s`);
beats.forEach((b) => console.log(`${b.start.toFixed(2).padStart(6)} ${b.end.toFixed(2).padStart(6)}  ${b.text}`));
