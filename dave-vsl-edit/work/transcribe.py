import json, sys
from faster_whisper import WhisperModel

model_name = sys.argv[1] if len(sys.argv) > 1 else "small"
audio = "work/audio.wav"

# CPU int8 — no torch/CUDA needed, plenty fast for a ~70s VSL
model = WhisperModel(model_name, device="cpu", compute_type="int8")
seg_iter, info = model.transcribe(audio, word_timestamps=True, language="en")

segments = []
for s in seg_iter:
    segments.append({
        "id": s.id,
        "start": s.start,
        "end": s.end,
        "text": s.text,
        "words": [{"word": w.word, "start": w.start, "end": w.end, "probability": w.probability}
                  for w in (s.words or [])],
    })

result = {"language": info.language, "duration": info.duration,
          "model": model_name, "segments": segments}

with open("work/transcript.json", "w", encoding="utf-8") as f:
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
for seg in segments:
    for w in seg["words"]:
        print(f"{w['start']:7.2f}  {w['end']:7.2f}   {w['word'].strip()}")
