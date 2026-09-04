"""Original score generator for the Peps by Dave films.

There is no licensed music source and Higgsfield's audio model is speech-only,
so the score is synthesised here. That turns out to be the better answer: it is
unambiguously the client's with no licensing question, and — unlike a stock
track — it can be composed against the cut sheet, so chord changes land on
narrative beats and the bell figure speaks on specific words.

DIRECTION (locked)
  72 BPM, D natural minor. Restrained documentary underscore.
  No drums, no build, no drop, no melody that competes with the voice.
  Layers: sustained drone, soft sub pulse, breathing fifths, sparse bell
  figure, faint air. Warm rather than clean.

TECHNIQUE
  Purely additive synthesis — every voice is a sum of sine partials with
  explicit amplitudes. No IIR filters, which means no scipy dependency and no
  recursive Python loops over four million samples. "Filter movement" is done
  by modulating partial amplitudes over time, which is what a filter does
  anyway.

  The music is side-chained to the actual voiceover: the VO's own RMS envelope
  ducks the bed, so it lifts in the gaps between phrases and gets out of the
  way under speech. Baked into the file so Remotion just plays it flat.

Usage:
  py work/score.py work/start-here/audio.wav public/score-start-here.wav 98.88
"""

import math
import struct
import sys
import wave

import numpy as np

SR = 44100

# ----------------------------------------------------------------- helpers

NOTES = {
    "D1": 36.71, "A1": 55.00, "D2": 73.42, "F2": 87.31, "G2": 98.00,
    "A2": 110.00, "Bb2": 116.54, "C3": 130.81, "D3": 146.83, "E3": 164.81,
    "F3": 174.61, "G3": 196.00, "A3": 220.00, "Bb3": 233.08, "C4": 261.63,
    "D4": 293.66, "E4": 329.63, "F4": 349.23, "G4": 392.00, "A4": 440.00,
    "C5": 523.25, "D5": 587.33, "F5": 698.46, "A5": 880.00,
}


def t_axis(n):
    return np.arange(n, dtype=np.float64) / SR


def fade(sig, attack_s, release_s):
    """Raised-cosine in/out so nothing ever clicks."""
    n = len(sig)
    a = min(int(attack_s * SR), n // 2)
    r = min(int(release_s * SR), n // 2)
    env = np.ones(n)
    if a > 0:
        env[:a] = 0.5 - 0.5 * np.cos(np.linspace(0, math.pi, a))
    if r > 0:
        env[-r:] = 0.5 + 0.5 * np.cos(np.linspace(0, math.pi, r))
    return sig * env


def partials(freq, n, amps, detune=0.0):
    """Additive tone. `amps` are the relative amplitudes of harmonics 1..k."""
    t = t_axis(n)
    out = np.zeros(n)
    for k, a in enumerate(amps, start=1):
        if a <= 0:
            continue
        f = freq * k
        if f > SR / 2.2:
            break
        # A touch of per-partial detune keeps it from sounding like a synth
        # test tone; real instruments are never perfectly harmonic.
        d = 1.0 + detune * (k - 1) * 0.0006
        phase = np.random.rand() * 2 * math.pi
        out += a * np.sin(2 * math.pi * f * d * t + phase)
    return out


def place(buf, sig, at_s):
    """Mix `sig` into `buf` starting at `at_s` seconds, clipping to length."""
    i = int(at_s * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


# ------------------------------------------------------------------ voices


def drone(dur_s, root, amp=0.5):
    """Sustained bed. Two slightly detuned stacks a fifth apart."""
    n = int(dur_s * SR)
    t = t_axis(n)
    f = NOTES[root]

    # Very slow amplitude movement between the two stacks — "breathing".
    lfo_a = 0.5 + 0.5 * np.sin(2 * math.pi * 0.041 * t)
    lfo_b = 0.5 + 0.5 * np.sin(2 * math.pi * 0.033 * t + 1.9)

    low = partials(f, n, [1.0, 0.34, 0.13, 0.05, 0.02], detune=1.0)
    fifth = partials(f * 1.4983, n, [0.55, 0.18, 0.07, 0.03], detune=1.4)

    sig = low * (0.62 + 0.38 * lfo_a) + fifth * (0.30 + 0.30 * lfo_b)
    return fade(sig, 3.0, 4.0) * amp


def pad(dur_s, chord, amp=0.22):
    """Stacked chord with a slow brightness sweep (partial-amplitude LFO)."""
    n = int(dur_s * SR)
    t = t_axis(n)
    sweep = 0.5 + 0.5 * np.sin(2 * math.pi * 0.024 * t + 0.7)

    sig = np.zeros(n)
    for i, note in enumerate(chord):
        f = NOTES[note]
        base = partials(f, n, [1.0, 0.22, 0.10, 0.04], detune=0.8)
        bright = partials(f, n, [0.0, 0.16, 0.12, 0.08, 0.05], detune=0.8)
        voice_lfo = 0.5 + 0.5 * np.sin(2 * math.pi * (0.019 + i * 0.004) * t + i * 2.1)
        sig += (base + bright * sweep) * (0.55 + 0.45 * voice_lfo)

    return fade(sig / max(1, len(chord)), 2.5, 3.5) * amp


def sub_pulse(amp=0.34):
    """One soft low swell. Slow attack so there is no transient click."""
    dur = 2.6
    n = int(dur * SR)
    t = t_axis(n)
    sig = np.sin(2 * math.pi * NOTES["D1"] * t) + 0.4 * np.sin(2 * math.pi * NOTES["D2"] * t)
    env = np.exp(-t * 1.5) * (1 - np.exp(-t * 9))
    return sig * env * amp


def bell(note, amp=0.3, dur=3.4):
    """Sparse struck tone — fast attack, long inharmonic decay."""
    n = int(dur * SR)
    t = t_axis(n)
    f = NOTES[note]
    # Slightly stretched partials read as struck metal rather than a sine.
    ratios = [1.0, 2.01, 3.03, 4.07, 5.13]
    gains = [1.0, 0.42, 0.20, 0.10, 0.05]
    decays = [1.1, 1.8, 2.6, 3.4, 4.4]
    sig = np.zeros(n)
    for r, g, d in zip(ratios, gains, decays):
        if f * r > SR / 2.2:
            break
        sig += g * np.sin(2 * math.pi * f * r * t) * np.exp(-t * d)
    strike = 1 - np.exp(-t * 240)
    return sig * strike * amp


def transition_hit(amp=0.16):
    """Punctuation for a chapter-level cut.

    Deliberately NOT a stock whoosh — @remotion/sfx ships meme sounds, which
    are the wrong register for this entirely. This is an air swell rising into
    a soft sub drop, built from the same palette as the rest of the score so it
    reads as part of the music rather than as a sound effect laid over it.
    Mixed to be felt more than heard.
    """
    dur = 1.9
    n = int(dur * SR)
    t = t_axis(n)

    # Air: noise shaped in the frequency domain, swelling then cut away.
    noise = np.random.randn(n)
    spec = np.fft.rfft(noise)
    fr = np.fft.rfftfreq(n, 1 / SR)
    shape = 1.0 / (1.0 + (fr / 900.0) ** 1.1)
    shape *= 1.0 / (1.0 + (fr / 5200.0) ** 2.5)
    hiss = np.fft.irfft(spec * shape, n=n)
    swell = np.clip(t / 0.85, 0, 1) ** 2.2 * np.exp(-np.maximum(0, t - 0.85) * 7.0)

    # Sub: drops a fifth as it decays. Lands where the air stops.
    lag = 0.72
    tt = np.maximum(0, t - lag)
    f = 92.0 * np.exp(-tt * 1.5) + 34.0
    sub = np.sin(2 * math.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.6) * (t > lag)

    return (hiss * swell * 0.55 + sub * 0.8) * amp


def air(dur_s, amp=0.012):
    """Faint filtered noise. Shaped in the frequency domain, not with an IIR."""
    n = int(dur_s * SR)
    noise = np.random.randn(n)
    spec = np.fft.rfft(noise)
    freqs = np.fft.rfftfreq(n, 1 / SR)
    # Gentle tilt down from ~500 Hz plus a hard shelf up top — tape, not hiss.
    shape = 1.0 / (1.0 + (freqs / 500.0) ** 1.3)
    shape *= 1.0 / (1.0 + (freqs / 6000.0) ** 3)
    return np.fft.irfft(spec * shape, n=n) * amp


# ------------------------------------------------------------------ ducking


def duck_envelope(vo_path, n_out, floor=0.34, look_s=0.18, rel_s=0.55):
    """Gain curve from the VO's own loudness, so the bed sits under speech.

    Returns 1.0 where the voice is silent and `floor` where it is loudest,
    with a fast attack (get out of the way) and a slow release (come back
    gracefully) — the way a real broadcast ducker behaves.
    """
    with wave.open(vo_path, "rb") as w:
        sr = w.getframerate()
        raw = w.readframes(w.getnframes())
    vo = np.frombuffer(raw, dtype=np.int16).astype(np.float64) / 32768.0

    # RMS in ~20ms blocks.
    blk = max(1, int(sr * 0.02))
    usable = (len(vo) // blk) * blk
    rms = np.sqrt((vo[:usable].reshape(-1, blk) ** 2).mean(axis=1) + 1e-12)
    rms /= max(rms.max(), 1e-9)

    # Look-ahead: shift earlier so the duck opens just before a phrase starts.
    look = int(look_s / 0.02)
    if look:
        rms = np.concatenate([rms[look:], np.zeros(look)])

    # Asymmetric smoothing — instant down, slow up.
    rel_blocks = max(1, int(rel_s / 0.02))
    a_rel = 1.0 - math.exp(-1.0 / rel_blocks)
    env = np.zeros_like(rms)
    cur = 0.0
    for i, v in enumerate(rms):
        cur = v if v > cur else cur + (v - cur) * a_rel
        env[i] = cur

    gain_blocks = 1.0 - (1.0 - floor) * np.clip(env * 1.5, 0, 1)
    # Block rate -> sample rate.
    idx = np.clip((np.arange(n_out) / SR / 0.02).astype(int), 0, len(gain_blocks) - 1)
    gain = gain_blocks[idx]
    # Short smoothing so the gain curve itself has no steps.
    k = int(SR * 0.03)
    if k > 1:
        kern = np.ones(k) / k
        gain = np.convolve(gain, kern, mode="same")
    return gain


# --------------------------------------------------------------------- cue


def build(dur_s, vo_path):
    n = int(dur_s * SR)
    bed = np.zeros(n)

    # --- Harmonic sections, keyed to the narrative, not to a bar grid.
    #     (start, end, root, chord)
    sections = [
        (0.0, 4.6, "D2", ["D3", "F3", "A3"]),        # open — home
        (4.6, 17.2, "D2", ["D3", "F3", "A4"]),       # definition — open, airy
        (17.2, 25.0, "Bb2", ["Bb3", "D4", "F4"]),    # "doesn't tell you" — lift
        (25.0, 38.5, "D2", ["D3", "A3", "D4"]),      # channels — neutral fifths
        (38.5, 49.3, "A2", ["A3", "C4", "E4"]),      # careful — tension
        (49.3, 62.7, "G2", ["G3", "Bb3", "D4"]),     # the seven — weight
        (62.7, 74.0, "F2", ["F3", "A3", "C4"]),      # the goal — warmest
        (74.0, 89.8, "D2", ["D3", "F3", "A3"]),      # guidance — home
        (89.8, dur_s, "D2", ["D3", "A3", "D5"]),     # close — resolve, open
    ]

    for start, end, root, chord in sections:
        seg = max(0.5, end - start + 2.2)  # overlap so changes crossfade
        place(bed, drone(seg, root, amp=0.42), max(0.0, start - 1.0))
        place(bed, pad(seg, chord, amp=0.20), max(0.0, start - 1.0))

    # --- Sub pulse: every 2 bars at 72bpm = 6.667s. Skipped in the densest
    #     stretch so the seven-item list is left clear.
    bar2 = 240.0 / 72.0
    tt = 1.2
    while tt < dur_s - 2:
        if not (55.0 < tt < 62.0):
            place(bed, sub_pulse(amp=0.30), tt)
        tt += bar2

    # --- Bell figure. Sparse everywhere, then one note per risk word so the
    #     score hits the picture rather than just running underneath it.
    ambient_bells = [
        (5.2, "D5"), (13.0, "A4"), (26.0, "F4"), (33.0, "D5"),
        (63.4, "F4"), (69.2, "A4"), (75.0, "D5"), (90.4, "A4"), (94.0, "D5"),
    ]
    for at, note in ambient_bells:
        if at < dur_s:
            place(bed, bell(note, amp=0.20), at)

    seven = [
        (55.3, "D5"), (56.4, "F5"), (57.4, "A4"), (58.2, "C5"),
        (59.4, "D5"), (60.2, "F5"), (61.2, "A5"),
    ]
    for at, note in seven:
        place(bed, bell(note, amp=0.26, dur=2.6), at)

    # --- Chapter punctuation. Placed slightly BEFORE the cut so the swell
    #     resolves on it rather than starting there.
    for at in (17.2, 25.05, 38.55, 49.35, 62.75, 74.1, 93.1):
        if at < dur_s:
            place(bed, transition_hit(amp=0.15), max(0.0, at - 0.85))

    bed += air(dur_s, amp=0.010)

    # --- Duck under the voice, then trim the head and tail.
    bed *= duck_envelope(vo_path, n)
    bed = fade(bed, 2.0, 4.5)

    # --- Level. Target a quiet bed; the VO is the programme.
    rms = np.sqrt((bed ** 2).mean())
    bed *= (10 ** (-26.0 / 20.0)) / max(rms, 1e-9)

    # Safety limiter — soft knee, should barely engage.
    peak = np.abs(bed).max()
    if peak > 0.89:
        bed = np.tanh(bed * (0.89 / peak) * 1.15) * 0.89

    return bed


def write_wav(path, sig):
    stereo = np.stack([sig, sig], axis=1)  # mono-compatible stereo
    data = (np.clip(stereo, -1, 1) * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


if __name__ == "__main__":
    vo = sys.argv[1]
    out = sys.argv[2]
    dur = float(sys.argv[3])
    np.random.seed(7)  # deterministic — reruns produce an identical score
    sig = build(dur, vo)
    write_wav(out, sig)
    rms_db = 20 * math.log10(max(np.sqrt((sig ** 2).mean()), 1e-9))
    peak_db = 20 * math.log10(max(np.abs(sig).max(), 1e-9))
    print(f"wrote {out}  {len(sig)/SR:.2f}s  RMS {rms_db:.1f} dBFS  peak {peak_db:.1f} dBFS")
