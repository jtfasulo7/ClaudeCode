"""Transcribe a video with word-level timestamps using faster-whisper."""
import json
import sys

from faster_whisper import WhisperModel

src = sys.argv[1]
out = sys.argv[2]

model = WhisperModel("small.en", device="cpu", compute_type="int8")
segments, info = model.transcribe(src, word_timestamps=True, vad_filter=False)

words = []
seg_list = []
for seg in segments:
    seg_list.append({"start": round(seg.start, 3), "end": round(seg.end, 3), "text": seg.text.strip()})
    for w in seg.words or []:
        words.append({"start": round(w.start, 3), "end": round(w.end, 3), "word": w.word})

with open(out, "w", encoding="utf-8") as f:
    json.dump({"duration": info.duration, "segments": seg_list, "words": words}, f, indent=1)

print(f"duration={info.duration:.2f}s segments={len(seg_list)} words={len(words)}")
