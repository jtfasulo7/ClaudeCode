"""Render animated B-roll graphic segments for the reel (1080x1920 @ 30fps).

Each segment is a pure function frame(t_local) -> PIL.Image, piped to ffmpeg.
Brand: teal #2D6679, cream #FBFBF9, amber #F2A33C, ink #16282F, Montserrat.
All on-screen numbers/claims come verbatim from the transcript.
"""
import math
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
FPS = 30

TEAL = (45, 102, 121)
TEAL_DARK = (33, 78, 93)
CREAM = (251, 251, 249)
CREAM_DIM = (235, 235, 230)
AMBER = (242, 163, 60)
INK = (22, 40, 47)
GREY = (176, 186, 190)

EB = "work/fonts/Montserrat-ExtraBold.ttf"
BD = "work/fonts/Montserrat-Bold.ttf"

_fonts = {}
def F(path, size):
    key = (path, size)
    if key not in _fonts:
        _fonts[key] = ImageFont.truetype(path, size)
    return _fonts[key]

# ---- easing ----------------------------------------------------------------
def clamp01(x):
    return max(0.0, min(1.0, x))

def ease_out(x):
    x = clamp01(x)
    return 1 - (1 - x) ** 3

def ease_io(x):
    x = clamp01(x)
    return 3 * x * x - 2 * x * x * x

def ease_back(x):
    x = clamp01(x)
    c1, c3 = 1.70158, 2.70158
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2

def prog(t, t0, dur):
    return clamp01((t - t0) / dur)

# ---- drawing helpers -------------------------------------------------------
def rrect(dr, box, r, fill=None, outline=None, width=1):
    dr.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)

def text_size(font, s):
    b = font.getbbox(s)
    return b[2] - b[0], b[3] - b[1], b[1]

def draw_text(img, xy, s, font, fill, anchor="mm", alpha=255, scale=1.0):
    """Draw text with optional scale-pop and alpha onto RGBA image."""
    if alpha <= 0 or scale <= 0.01:
        return
    tw, th, _ = text_size(font, s)
    pad = 40
    lay = Image.new("RGBA", (tw + pad * 2, th + pad * 2 + 30), (0, 0, 0, 0))
    ld = ImageDraw.Draw(lay)
    ld.text((pad, pad), s, font=font, fill=fill + (int(alpha),))
    if scale != 1.0:
        nw = max(1, int(lay.width * scale))
        nh = max(1, int(lay.height * scale))
        lay = lay.resize((nw, nh), Image.LANCZOS)
    cx, cy = xy
    if anchor == "mm":
        img.alpha_composite(lay, (int(cx - lay.width / 2), int(cy - lay.height / 2)))
    elif anchor == "lm":
        img.alpha_composite(lay, (int(cx), int(cy - lay.height / 2)))

def person(dr, cx, cy, s, color, alpha=255):
    """Simple person icon: head circle + shoulder arc. s = head radius."""
    c = color + (alpha,)
    dr.ellipse([cx - s, cy - 2.6 * s, cx + s, cy - 0.6 * s], fill=c)
    dr.pieslice([cx - 1.9 * s, cy - 0.5 * s, cx + 1.9 * s, cy + 2.4 * s], 180, 360, fill=c)

def arrow(dr, x0, y0, x1, y1, color, width, p=1.0, alpha=255):
    """Straight arrow drawn with progress p."""
    if p <= 0:
        return
    c = color + (alpha,)
    xe = x0 + (x1 - x0) * p
    ye = y0 + (y1 - y0) * p
    dr.line([x0, y0, xe, ye], fill=c, width=width)
    if p > 0.85:
        ang = math.atan2(y1 - y0, x1 - x0)
        ah = width * 2.6
        for da in (2.6, -2.6):
            dr.line([xe, ye, xe - ah * math.cos(ang + da), ye - ah * math.sin(ang + da)],
                    fill=c, width=width)

def bg(color):
    img = Image.new("RGBA", (W, H), color + (255,))
    return img, ImageDraw.Draw(img)

def dot_texture(dr, color, alpha=26):
    for yy in range(260, H - 340, 120):
        for xx in range(90, W - 60, 120):
            dr.ellipse([xx, yy, xx + 7, yy + 7], fill=color + (alpha,))

# ============================================================================
# Segment 1a  (12.30-16.10, 3.8s): ROOF / DRIVEWAY / HVAC kinetic cards
# ============================================================================
def seg_1a(t):
    img, dr = bg(CREAM)
    dot_texture(dr, TEAL)
    cards = [
        ("NEW ROOF", 0.84, TEAL, CREAM, 700),
        ("NEW DRIVEWAY", 1.66, INK, CREAM, 960),
        ("HVAC REPLACEMENT", 2.56, AMBER, INK, 1220),
    ]
    for label, t0, cbg, ctxt, cy in cards:
        p = prog(t, t0, 0.38)
        if p <= 0:
            # empty slot hint
            a = int(70 * ease_out(prog(t, 0.1, 0.5)))
            rrect(dr, [200, cy - 70, 880, cy + 70], 26, outline=GREY + (a,), width=4)
            continue
        s = 0.6 + 0.4 * ease_back(p)
        a = int(255 * ease_out(p))
        cw, ch = 760, 150
        lay = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
        ld = ImageDraw.Draw(lay)
        rrect(ld, [0, 0, cw - 1, ch - 1], 28, fill=cbg + (255,))
        fnt = F(EB, 64 if len(label) < 14 else 52)
        tw, th, toff = text_size(fnt, label)
        ld.text(((cw - tw) / 2, (ch - th) / 2 - toff), label, font=fnt, fill=ctxt + (255,))
        nw, nh = max(1, int(cw * s)), max(1, int(ch * s))
        lay = lay.resize((nw, nh), Image.LANCZOS)
        lay.putalpha(lay.getchannel("A").point(lambda v: v * a // 255))
        img.alpha_composite(lay, (int(540 - nw / 2), int(cy - nh / 2)))
    return img

# ============================================================================
# Segment 1b  (16.40-20.90, 4.5s): phone feed scroll -> ad card snaps in
# ============================================================================
def seg_1b(t):
    img, dr = bg(TEAL)
    dot_texture(dr, CREAM, 20)
    # phone slides up 0-0.45s
    slide = (1 - ease_out(prog(t, 0.0, 0.45))) * 320
    pw, ph = 520, 1060
    px, py = 540 - pw // 2, 430 + slide
    ad_t = 2.64          # "ad" spoken
    lock = ease_io(prog(t, ad_t - 0.25, 0.35))   # feed decelerates into lock

    phone = Image.new("RGBA", (pw, ph), (0, 0, 0, 0))
    pd = ImageDraw.Draw(phone)
    rrect(pd, [0, 0, pw - 1, ph - 1], 64, fill=INK + (255,))
    sx0, sy0, sx1, sy1 = 22, 22, pw - 22, ph - 22
    rrect(pd, [sx0, sy0, sx1, sy1], 48, fill=CREAM + (255,))
    # scrolling feed cards
    screen = Image.new("RGBA", (sx1 - sx0, sy1 - sy0), (0, 0, 0, 0))
    sd = ImageDraw.Draw(screen)
    cycle = 360
    speed = 430 * (1 - 0.96 * lock)
    off = (t * speed) % cycle if lock < 1 else 0
    base_off = (ad_t * 430 * 0.5) % cycle
    for i in range(-1, 5):
        cy = i * cycle - off + 60
        rrect(sd, [30, cy, screen.width - 30, cy + 150], 20, fill=CREAM_DIM + (255,))
        sd.ellipse([50, cy + 18, 106, cy + 74], fill=GREY + (255,))
        rrect(sd, [126, cy + 26, 320, cy + 50], 8, fill=GREY + (255,))
        rrect(sd, [126, cy + 62, 260, cy + 82], 8, fill=GREY + (160,))
        rrect(sd, [30, cy + 170, screen.width - 30, cy + 300], 20, fill=CREAM_DIM + (180,))
    phone.alpha_composite(screen, (sx0, sy0))
    # ad card snap
    ap = prog(t, ad_t, 0.4)
    if ap > 0:
        s = 0.5 + 0.5 * ease_back(ap)
        aw, ah = 420, 480
        card = Image.new("RGBA", (aw, ah), (0, 0, 0, 0))
        cd = ImageDraw.Draw(card)
        rrect(cd, [0, 0, aw - 1, ah - 1], 30, fill=CREAM + (255,), outline=AMBER + (255,), width=10)
        rrect(cd, [40, 44, aw - 40, 250], 18, fill=TEAL + (255,))
        person(cd, aw // 2, 190, 34, CREAM)
        fnt = F(EB, 44)
        tw, th, toff = text_size(fnt, "YOUR")
        cd.text(((aw - tw) / 2, 300 - toff), "YOUR", font=fnt, fill=INK + (255,))
        tw, th, toff = text_size(fnt, "BUSINESS")
        cd.text(((aw - tw) / 2, 356 - toff), "BUSINESS", font=fnt, fill=INK + (255,))
        rrect(cd, [110, 420, aw - 110, 452], 16, fill=AMBER + (255,))
        nw, nh = max(1, int(aw * s)), max(1, int(ah * s))
        card = card.resize((nw, nh), Image.LANCZOS)
        card.putalpha(card.getchannel("A").point(lambda v: v * int(255 * ease_out(ap)) // 255))
        phone.alpha_composite(card, (int(pw / 2 - nw / 2), int(ph / 2 - nh / 2 - 30)))
    img.alpha_composite(phone, (int(px), int(py)))
    return img

# ============================================================================
# Segment 2a  (27.00-30.40, 3.4s): referral chain breaks
# ============================================================================
def seg_2a(t):
    img, dr = bg(CREAM)
    dot_texture(dr, TEAL)
    lbl = F(EB, 54)
    a = int(255 * ease_out(prog(t, 0.05, 0.3)))
    draw_text(img, (540, 560), "WORD OF MOUTH", lbl, TEAL, alpha=a)
    dr = ImageDraw.Draw(img)

    break_t = 0.9        # "rely"
    bp = ease_out(prog(t, break_t, 0.45))
    xs = [165, 415, 665, 915]
    cy = 960
    for i, x in enumerate(xs):
        ap = ease_out(prog(t, 0.1 + i * 0.14, 0.3))
        if ap <= 0:
            continue
        al = int(255 * ap)
        col = TEAL
        dy = 0
        if i >= 2 and bp > 0:            # downstream of the break: grey out + sag
            col = GREY
            al = int(al * (1 - 0.45 * bp))
            dy = int(34 * bp)
        person(dr, x, cy + dy, 34, col, al)
    # chain links (dashed)
    for i in range(3):
        x0, x1 = xs[i] + 68, xs[i + 1] - 68
        lp = ease_out(prog(t, 0.28 + i * 0.14, 0.3))
        if lp <= 0:
            continue
        if i == 1 and bp > 0:            # the middle link snaps
            gap = 34 * bp
            mid = (x0 + x1) / 2
            tilt = 18 * bp
            dr.line([x0, cy, mid - gap, cy + tilt], fill=AMBER + (255,), width=11)
            dr.line([mid + gap, cy - tilt, x1, cy], fill=AMBER + (255,), width=11)
            if 0 < bp < 0.98:            # spark flash at the snap point
                sa = int(255 * (1 - bp * 0.65))
                for ang in (-2.2, -1.57, -0.9):
                    r0, r1 = 34 + 30 * bp, 66 + 44 * bp
                    dr.line([mid + r0 * math.cos(ang), cy + r0 * math.sin(ang),
                             mid + r1 * math.cos(ang), cy + r1 * math.sin(ang)],
                            fill=AMBER + (sa,), width=9)
        else:
            seg_n = 5
            for sgi in range(seg_n):
                fx0 = x0 + (x1 - x0) * sgi / seg_n
                fx1 = x0 + (x1 - x0) * (sgi + 0.62) / seg_n
                if (sgi + 0.62) / seg_n <= lp:
                    dr.line([fx0, cy, fx1, cy], fill=TEAL + (255,), width=11)
    return img

# ============================================================================
# Segment 2b  (31.70-34.90, 3.2s): funnel with steady lead flow
# ============================================================================
def seg_2b(t):
    img, dr = bg(TEAL)
    dot_texture(dr, CREAM, 20)
    fp = ease_out(prog(t, 0.0, 0.5))
    top_y, throat_y = 620, 1150
    x_l, x_r, th_l, th_r = 200, 880, 470, 610
    # funnel walls draw in
    if fp > 0:
        for (a0, b0, a1, b1) in [(x_l, top_y, th_l, throat_y), (x_r, top_y, th_r, throat_y)]:
            xe = a0 + (a1 - a0) * fp
            ye = b0 + (b1 - b0) * fp
            dr.line([a0, b0, xe, ye], fill=CREAM + (255,), width=14)
    dr.line([x_l, top_y, x_r, top_y], fill=CREAM + (int(255 * fp),), width=14)
    # tray
    tp = ease_out(prog(t, 0.5, 0.4))
    if tp > 0:
        ta = int(255 * tp)
        rrect(dr, [330, 1300, 750, 1450], 26, outline=CREAM + (ta,), width=12)
        fnt = F(EB, 46)
        draw_text(img, (540, 1375), "CUSTOMERS", fnt, CREAM, alpha=ta)
        dr = ImageDraw.Draw(img)
    # continuous dots (deterministic)
    for i in range(16):
        ph = (i * 0.618034) % 1.0
        cyc = (t * 0.55 + ph) % 1.0
        born = t - cyc / 0.55
        if born < 0.3:
            continue
        lane = ((i * 37) % 100) / 100.0        # 0..1 across funnel
        if cyc < 0.62:                          # falling through funnel
            q = cyc / 0.62
            y = top_y + 40 + (throat_y - top_y - 60) * q
            wl = x_l + (th_l - x_l) * q + 40
            wr = x_r + (th_r - x_r) * q - 40
            x = wl + (wr - wl) * lane
            r = 16
            col = AMBER
        else:                                   # dropping into tray
            q = (cyc - 0.62) / 0.38
            y = throat_y + (1310 - throat_y) * q
            x = th_l + (th_r - th_l) * lane * 0.9 + 10
            r = 16
            col = AMBER
            if q > 0.85:
                continue
        pulse = 1 + 0.12 * math.sin(t * 6 + i)
        rr = r * pulse
        dr.ellipse([x - rr, y - rr, x + rr, y + rr], fill=col + (255,))
    return img

# ============================================================================
# Segment 3a  (40.30-45.60, 5.3s): $1->$2, $4->$8 math stack
# ============================================================================
def seg_3a(t):
    img, dr = bg(TEAL)
    dot_texture(dr, CREAM, 20)
    rows = [
        ("$1", 0.26, "$2", 1.68, 810),
        ("$4", 3.18, "$8", 4.34, 1150),
    ]
    big = F(EB, 170)
    for left, tl, right, tr, cy in rows:
        pl = prog(t, tl, 0.35)
        if pl > 0:
            draw_text(img, (300, cy), left, big, CREAM,
                      alpha=int(255 * ease_out(pl)), scale=0.6 + 0.4 * ease_back(pl))
        ap = prog(t, tl + 0.55, 0.5)
        dr = ImageDraw.Draw(img)
        arrow(dr, 440, cy, 640, cy, CREAM, 13, p=ease_io(ap), alpha=int(255 * ease_out(ap)))
        pr = prog(t, tr, 0.38)
        if pr > 0:
            draw_text(img, (800, cy), right, big, AMBER,
                      alpha=int(255 * ease_out(pr)), scale=0.55 + 0.45 * ease_back(pr))
    # "IN / OUT" labels once first row lands
    lp = ease_out(prog(t, 0.9, 0.4))
    if lp > 0:
        sm = F(BD, 40)
        draw_text(img, (300, 620), "IN", sm, CREAM, alpha=int(170 * lp))
        draw_text(img, (800, 620), "OUT", sm, CREAM, alpha=int(170 * lp))
    return img

# ============================================================================
# Segment 3b  (47.90-52.40, 4.5s): $30-50/day counter -> next-day customers
# ============================================================================
def seg_3b(t):
    img, dr = bg(CREAM)
    dot_texture(dr, TEAL)
    # counter 30 -> 50
    cp = prog(t, 0.18, 0.55)
    val = int(round(30 + 20 * ease_io(cp)))
    ap = ease_out(prog(t, 0.1, 0.3))
    big = F(EB, 150)
    draw_text(img, (410, 700), f"${val}", big, TEAL, alpha=int(255 * ap))
    sm = F(EB, 62)
    draw_text(img, (700, 720), "/ DAY", sm, INK, alpha=int(255 * ap))
    lb = F(BD, 44)
    draw_text(img, (540, 850), "TO GET STARTED", lb, INK,
              alpha=int(200 * ease_out(prog(t, 0.5, 0.35))))
    # next-day card
    np_ = prog(t, 1.9, 0.45)
    if np_ > 0:
        a = int(255 * ease_out(np_))
        dy = (1 - ease_out(np_)) * 140
        card = Image.new("RGBA", (720, 440), (0, 0, 0, 0))
        cd = ImageDraw.Draw(card)
        rrect(cd, [0, 0, 719, 439], 34, fill=TEAL + (255,))
        rrect(cd, [0, 0, 719, 110], 34, fill=TEAL_DARK + (255,))
        cd.rectangle([0, 60, 719, 110], fill=TEAL_DARK + (255,))
        fnt = F(EB, 52)
        tw, th, toff = text_size(fnt, "NEXT DAY")
        cd.text(((720 - tw) / 2, 32 - toff), "NEXT DAY", font=fnt, fill=CREAM + (255,))
        for i in range(3):
            pp = ease_back(prog(t, 2.55 + i * 0.35, 0.32))
            if pp <= 0:
                continue
            cx = 180 + i * 180
            person(cd, cx, 320, int(44 * pp), CREAM, 255)
            chk = ease_out(prog(t, 2.72 + i * 0.35, 0.25))
            if chk > 0:
                cd.ellipse([cx + 28, 350, cx + 92, 414], fill=AMBER + (int(255 * chk),))
                cd.line([cx + 44, 382, cx + 58, 396], fill=INK + (int(255 * chk),), width=9)
                cd.line([cx + 58, 396, cx + 80, 366], fill=INK + (int(255 * chk),), width=9)
        card.putalpha(card.getchannel("A").point(lambda v: v * a // 255))
        img.alpha_composite(card, (int(540 - 360), int(1000 + dy)))
    return img

# ============================================================================
# Segment 4a  (53.90-56.60, 2.7s): sparse grid, only two ads  (top clear: header)
# ============================================================================
GRID_SLOTS = [(x, y) for y in (760, 1090) for x in (240, 540, 840)]

def ad_card(size, fill, outline=None, width=0, amber_bar=False):
    wd, ht = size
    c = Image.new("RGBA", (wd, ht), (0, 0, 0, 0))
    cd = ImageDraw.Draw(c)
    if fill:
        rrect(cd, [0, 0, wd - 1, ht - 1], 22, fill=fill + (255,))
    if outline:
        rrect(cd, [0, 0, wd - 1, ht - 1], 22, outline=outline + (255,), width=width)
    if fill:
        rrect(cd, [26, 28, wd - 26, ht // 2], 12, fill=CREAM + (70,))
        rrect(cd, [26, ht // 2 + 20, wd - 60, ht // 2 + 44], 8, fill=CREAM + (130,))
        if amber_bar:
            rrect(cd, [26, ht - 52, wd - 26, ht - 24], 10, fill=AMBER + (255,))
    return c

def seg_4a(t):
    img, dr = bg(CREAM)
    dot_texture(dr, TEAL)
    for i, (x, y) in enumerate(GRID_SLOTS):
        a = int(90 * ease_out(prog(t, 0.1 + i * 0.06, 0.4)))
        dr.rounded_rectangle([x - 120, y - 145, x + 120, y + 145], radius=22,
                             outline=GREY + (a,), width=4)
    fills = [(0, 0.55), (4, 1.75)]          # slot idx, appear time ("couple ads")
    for slot, t0 in fills:
        p = prog(t, t0, 0.6)                # slow, muted fade-in
        if p <= 0:
            continue
        x, y = GRID_SLOTS[slot]
        card = ad_card((240, 290), TEAL)
        card.putalpha(card.getchannel("A").point(lambda v: v * int(255 * ease_io(p)) // 255))
        img.alpha_composite(card, (x - 120, y - 145))
    return img

# ============================================================================
# Segment 4b  (58.40-63.60, 5.2s): grid explodes, counter 10->50, winners
# ============================================================================
SLOTS_4B = [(x, y) for y in (830, 1090, 1350) for x in (165, 415, 665, 915)]
WINNERS = (1, 6, 9)

def seg_4b(t):
    img, dr = bg(CREAM)
    dot_texture(dr, TEAL)
    # counter synced to speech: 10@0.26 20@0.74 30@1.14 50@1.56
    beats = [(0.26, "10"), (0.74, "20"), (1.14, "30"), (1.56, "50")]
    cur, beat_t = None, 0
    for bt, v in beats:
        if t >= bt:
            cur, beat_t = v, bt
    if cur:
        pp = prog(t, beat_t, 0.3)
        big = F(EB, 210)
        draw_text(img, (540, 450), cur, big, TEAL,
                  alpha=255, scale=0.8 + 0.2 * ease_back(pp))
        lb = F(BD, 46)
        draw_text(img, (540, 640), "DIFFERENT AD TYPES", lb, INK,
                  alpha=int(220 * ease_out(prog(t, 0.4, 0.3))))
    # cards multiply
    for i, (x, y) in enumerate(SLOTS_4B):
        t0 = 0.35 + i * 0.16
        p = prog(t, t0, 0.3)
        if p <= 0:
            continue
        s = 0.5 + 0.5 * ease_back(p)
        win_p = ease_out(prog(t, 3.55 + (WINNERS.index(i) * 0.25 if i in WINNERS else 0), 0.35)) \
            if i in WINNERS else 0
        base = ad_card((210, 240), TEAL, amber_bar=False)
        if win_p > 0:
            hi = ad_card((210, 240), TEAL_DARK, outline=AMBER, width=10, amber_bar=True)
            hi.putalpha(hi.getchannel("A").point(lambda v: v * int(255 * win_p) // 255))
            base.alpha_composite(hi)
        nw, nh = max(1, int(210 * s)), max(1, int(240 * s))
        base = base.resize((nw, nh), Image.LANCZOS)
        base.putalpha(base.getchannel("A").point(lambda v: v * int(255 * ease_out(p)) // 255))
        img.alpha_composite(base, (int(x - nw / 2), int(y - nh / 2)))
        # winner check badge
        if i in WINNERS and win_p > 0.6:
            bx, by = x + 80, y - 105
            dr = ImageDraw.Draw(img)
            dr.ellipse([bx - 34, by - 34, bx + 34, by + 34], fill=AMBER + (255,))
            dr.line([bx - 15, by + 2, bx - 4, by + 14], fill=INK + (255,), width=9)
            dr.line([bx - 4, by + 14, bx + 17, by - 12], fill=INK + (255,), width=9)
    return img

# ============================================================================
SEGMENTS = {
    "1a": (seg_1a, 12.30, 16.10),
    "1b": (seg_1b, 16.40, 20.90),
    "2a": (seg_2a, 27.00, 30.40),
    "2b": (seg_2b, 31.70, 34.90),
    "3a": (seg_3a, 40.30, 45.60),
    "3b": (seg_3b, 47.90, 52.40),
    "4a": (seg_4a, 53.90, 56.60),
    "4b": (seg_4b, 58.40, 63.60),
}

def render(name, preview_frame=None):
    fn, t0, t1 = SEGMENTS[name]
    dur = t1 - t0
    if preview_frame is not None:
        img = fn(preview_frame).convert("RGB")
        img.save(f"work/gfx_{name}_preview.png")
        print(f"{name}: preview @ t={preview_frame}")
        return
    n = int(round(dur * FPS))
    cmd = ["ffmpeg", "-y", "-nostats", "-loglevel", "error",
           "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
           "-i", "-", "-c:v", "libx264", "-preset", "fast", "-crf", "17",
           "-pix_fmt", "yuv420p", f"work/gfx_{name}.mp4"]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for f in range(n):
        img = fn(f / FPS).convert("RGB")
        p.stdin.write(img.tobytes())
    p.stdin.close()
    p.wait()
    print(f"{name}: {n} frames -> work/gfx_{name}.mp4 (rc={p.returncode})")

if __name__ == "__main__":
    args = sys.argv[1:]
    if args and args[0] == "preview":
        mids = {"1a": 3.0, "1b": 3.2, "2a": 1.6, "2b": 2.2, "3a": 4.7, "3b": 3.4, "4a": 2.2, "4b": 4.2}
        for nm, tt in mids.items():
            render(nm, preview_frame=tt)
    else:
        for nm in (args if args else SEGMENTS):
            render(nm)
