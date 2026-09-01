"""Word-level transcript for a module VO.

Usage:  py work/transcribe.py work/module3/audio.wav work/module3/transcript.json [model]

faster-whisper on CPU int8 — no torch, and openai-whisper does not install
cleanly on Python 3.13.
"""
import json
import sys

from faster_whisper import WhisperModel

audio = sys.argv[1]
out = sys.argv[2]
model_name = sys.argv[3] if len(sys.argv) > 3 else "medium"

model = WhisperModel(model_name, device="cpu", compute_type="int8")
seg_iter, info = model.transcribe(audio, word_timestamps=True, language="en")

segments = []
for s in seg_iter:
    segments.append(
        {
            "id": s.id,
            "start": s.start,
            "end": s.end,
            "text": s.text,
            "words": [
                {"word": w.word, "start": w.start, "end": w.end, "probability": w.probability}
                for w in (s.words or [])
            ],
        }
    )

result = {
    "language": info.language,
    "duration": info.duration,
    "model": model_name,
    "segments": segments,
}

with open(out, "w", encoding="utf-8") as f:
    json.dump(result, f, indent=2, ensure_ascii=False)


def ts(t):
    m, s = divmod(float(t), 60)
    return f"{int(m):02d}:{s:06.3f}"


print("=" * 70)
print(f"SEGMENTS  (model={model_name}, duration={info.duration:.2f}s)")
print("=" * 70)
for seg in segments:
    print(f"[{ts(seg['start'])} -> {ts(seg['end'])}]  {seg['text'].strip()}")

print()
print("=" * 70)
print("WORD-LEVEL TIMESTAMPS")
print("=" * 70)
line = ""
for seg in segments:
    for w in seg["words"]:
        line += f"{w['start']:.1f} {w['word'].strip()}  "
        if len(line) > 92:
            print(line)
            line = ""
if line:
    print(line)
