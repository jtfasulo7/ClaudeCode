"""Generate ASS captions (word-highlight chunks) + reason header cards for the reel.

Canvas: 1080x1920. Safe zones: nothing above y=220 or below y=1600,
all text within middle ~80% of width.
Brand: teal #2D6679, cream #FBFBF9, accent amber #F2A33C.
"""
import json

# ---- config ----------------------------------------------------------------
TRANSCRIPT = "work/transcript_rough.json"
OUT = "work/captions.ass"

CAP_FONT = "Montserrat ExtraBold"
CAP_SIZE = 62
CAP_MARGIN_V = 380          # bottom margin -> caption sits ~y1400-1540, above 320px UI zone
CAP_OUTLINE = 7
CAP_SHADOW = 3

WHITE = "&H00FFFFFF"
CREAM = "&H00F9FBFB"        # #FBFBF9 -> BGR
AMBER = "&H003CA3F2"        # #F2A33C -> BGR (active word)
BLACK = "&H00000000"
TEAL_BOX = "&H002D66790"    # placeholder, real value set below

TEAL = "79662D"             # #2D6679 as BGR hex
HDR_FONT = "Montserrat ExtraBold"
HDR_SIZE = 52
HDR_CY = 330                # header card center y (top safe zone ends at 220)
HDR_DUR = 3.0

HEADERS = [
    (8.98,  "#1 — ALREADY SCROLLING"),
    (23.16, "#2 — PREDICTABLE FLOW"),
    (35.10, "#3 — $1 IN, $2 OUT"),
    (52.58, "#4 — AI AD TESTING"),
]

CHUNK_MAX = 4
GAP_BREAK = 0.6             # start new chunk if silence gap exceeds this
HOLD_AFTER = 0.35           # how long a chunk lingers after its last word


def ts(t):
    t = max(0.0, t)
    h = int(t // 3600)
    m = int(t % 3600 // 60)
    s = t % 60
    return f"{h}:{m:02d}:{s:05.2f}"


def chunk_words(words):
    """Group words into 2-4 word chunks, breaking on punctuation and gaps."""
    chunks, cur = [], []
    for i, w in enumerate(words):
        cur.append(w)
        text = w["word"].strip()
        nxt = words[i + 1] if i + 1 < len(words) else None
        end_punct = text.endswith((".", ",", "?", "!"))
        gap = (nxt["start"] - w["end"]) if nxt else 99
        if len(cur) >= CHUNK_MAX or end_punct or gap > GAP_BREAK or nxt is None:
            chunks.append(cur)
            cur = []
    # merge orphan 1-word chunks into the previous chunk when it has room
    merged = []
    for c in chunks:
        if merged and len(c) == 1 and len(merged[-1]) < CHUNK_MAX and \
           c[0]["start"] - merged[-1][-1]["end"] < GAP_BREAK:
            merged[-1].extend(c)
        else:
            merged.append(c)
    return merged


def rounded_rect(w, h, r):
    """ASS drawing path for a rounded rect with top-left at origin (all coords >= 0)."""
    k = r * 0.5523
    return (f"m {r:.0f} 0 "
            f"l {w-r:.0f} 0 b {w-r+k:.0f} 0 {w:.0f} {r-k:.0f} {w:.0f} {r:.0f} "
            f"l {w:.0f} {h-r:.0f} b {w:.0f} {h-r+k:.0f} {w-r+k:.0f} {h:.0f} {w-r:.0f} {h:.0f} "
            f"l {r:.0f} {h:.0f} b {r-k:.0f} {h:.0f} 0 {h-r+k:.0f} 0 {h-r:.0f} "
            f"l 0 {r:.0f} b 0 {r-k:.0f} {r-k:.0f} 0 {r:.0f} 0")


def text_width(title, size):
    """Measure title width as libass will render it (font metrics + Spacing 1)."""
    from PIL import ImageFont
    font = ImageFont.truetype("work/fonts/Montserrat-ExtraBold.ttf", size)
    w = font.getbbox(title)[2]
    return w + len(title)  # Style Spacing:1 adds ~1px per char


d = json.load(open(TRANSCRIPT, encoding="utf-8"))
words = d["words"]
chunks = chunk_words(words)

events = []

# ---- captions: one event per word, showing its whole chunk -----------------
for ci, chunk in enumerate(chunks):
    chunk_end = chunk[-1]["end"] + HOLD_AFTER
    if ci + 1 < len(chunks):
        chunk_end = min(chunk_end, chunks[ci + 1][0]["start"])
    for wi, w in enumerate(chunk):
        t0 = w["start"]
        t1 = chunk[wi + 1]["start"] if wi + 1 < len(chunk) else chunk_end
        if t1 <= t0:
            t1 = t0 + 0.05
        parts = []
        for wj, ww in enumerate(chunk):
            token = ww["word"].strip().upper()
            if wj == wi:
                parts.append(f"{{\\c{AMBER}}}{token}{{\\c{WHITE}}}")
            else:
                parts.append(token)
        text = " ".join(parts)
        events.append((3, t0, t1, "Caption", text))

# ---- header cards ----------------------------------------------------------
SLIDE = 22          # pop-in slide distance (px)
POP_MS = 200        # slide/fade-in duration
for start, title in HEADERS:
    end = start + HDR_DUR
    box_w = min(text_width(title, HDR_SIZE) + 96, 864)
    box_h = 108
    bx = 540 - box_w // 2
    by = HDR_CY - box_h // 2
    fade = rf"\fad(120,220)"
    box = (rf"{{\an7\move({bx},{by+SLIDE},{bx},{by},0,{POP_MS}){fade}"
           rf"\bord0\shad5\4c&H60000000&\1c&H{TEAL}&\p1}}"
           + rounded_rect(box_w, box_h, 26) + r"{\p0}")
    events.append((1, start, end, "Header", box))
    txt = (rf"{{\an5\move(540,{HDR_CY+SLIDE},540,{HDR_CY},0,{POP_MS}){fade}"
           rf"\bord0\shad0\1c{CREAM}}}" + title)
    events.append((2, start, end, "Header", txt))

# ---- write file ------------------------------------------------------------
header = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
ScaledBorderAndShadow: yes
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Caption,{CAP_FONT},{CAP_SIZE},{WHITE},{WHITE},{BLACK},&H96000000,-1,0,0,0,100,100,1,0,1,{CAP_OUTLINE},{CAP_SHADOW},2,110,110,{CAP_MARGIN_V},1
Style: Header,{HDR_FONT},{HDR_SIZE},{CREAM},{CREAM},{BLACK},&H00000000,-1,0,0,0,100,100,1,0,1,0,0,5,60,60,60,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

with open(OUT, "w", encoding="utf-8-sig") as f:
    f.write(header)
    for layer, t0, t1, style, text in sorted(events, key=lambda e: (e[1], e[0])):
        f.write(f"Dialogue: {layer},{ts(t0)},{ts(t1)},{style},,0,0,0,,{text}\n")

print(f"chunks={len(chunks)} events={len(events)}")
sizes = [len(c) for c in chunks]
print("chunk size distribution:", {n: sizes.count(n) for n in sorted(set(sizes))})
