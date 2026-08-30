'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  HERO_W, HERO_H, ROW_H, WORDS, O_POOL, SWAP, STAGGER, ENTRANCE_END,
  letterSrc, stickerSrc, stickerByFile, type Entrance,
} from './heroData';

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

/** Flat index of every slot whose letterform is an O. */
const O_SLOTS: { i: number; entrance: Entrance; duration: number; ease: string }[] = (() => {
  const out: { i: number; entrance: Entrance; duration: number; ease: string }[] = [];
  let i = 0;
  WORDS.forEach((w) =>
    w.slots.forEach((s) => {
      if (s.file.startsWith('O')) {
        out.push({ i, entrance: s.entrance, duration: s.duration, ease: s.ease });
      }
      i += 1;
    }),
  );
  return out;
})();

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  /** the outer positioning div of each slot — the only layer with no
      transform of its own, which is what the magnet gets to use */
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  const clips = useRef<(HTMLSpanElement | null)[]>([]);
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  /** the animated wrapper around each O's illustration, not the img itself */
  const stickers = useRef<(HTMLSpanElement | null)[]>([]);
  /** last illustration shown per slot, so none repeats back to back */
  const lastOn = useRef<Record<number, string>>({});

  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Entrance: every letter arrives its own way ─────────────────────
       Modelled on gsap.com, where each glyph animates a different property
       with its own duration and ease rather than one staggered tween.    */
    if (!reduce) {
      /* ── Start states are SET, not left to `from()` ──────────────────
         Every letter is parked outside its clip here, in its own pass,
         before a single tween exists.

         `gsap.from()` is supposed to write its start values the moment it
         is created, and for the tween at position 0 it does. For the
         fourteen at `STAGGER * i` it does not — the Loader pauses
         `gsap.globalTimeline` during ITS render, which runs before this
         layout effect, so this timeline is born inside an already-paused
         parent and never renders time 0. The result was one letter parked
         and fourteen sitting at rest, fully drawn, behind the loading
         panel; how much of the wordmark was already on screen when the
         panel lifted just depended on how far the intro had got, which is
         what made it look intermittent.

         Setting the start state outright does not care whether anything is
         paused, so nothing can be visible before its own tween moves it. */
      const intro = gsap.timeline();
      let i = 0;
      WORDS.forEach((word) =>
        word.slots.forEach((slot) => {
          const clip = clips.current[i];
          const letter = letters.current[i];
          const at = STAGGER * i;
          i += 1;
          if (!clip || !letter) return;

          if (slot.entrance.kind === 'flip') {
            gsap.set(clip, { transformPerspective: 800, rotationX: -180 });
            gsap.set(letter, { yPercent: 100 });
            intro.to(clip, { rotationX: 0, duration: slot.duration, ease: slot.ease }, at);
            intro.to(letter, { yPercent: 0, duration: 0.6, ease: 'power2.out' }, at);
          } else if (slot.entrance.kind === 'x') {
            gsap.set(letter, { xPercent: slot.entrance.from });
            intro.to(letter, { xPercent: 0, duration: slot.duration, ease: slot.ease }, at);
          } else {
            gsap.set(letter, { yPercent: slot.entrance.from });
            intro.to(letter, { yPercent: 0, duration: slot.duration, ease: slot.ease }, at);
          }
        }),
      );
    }

    if (reduce) return;

    /* ── O swap ─────────────────────────────────────────────────────────
       Two of the three O's at a time, from a pool of four illustrations.
       The swap reuses each O's own entrance motion so it reads as part of
       the same language: the letter rolls out one edge while the sticker
       rolls in from the other, or the whole clip flips over.             */

    function pickTwo() {
      return gsap.utils.shuffle([...O_SLOTS]).slice(0, SWAP.concurrent);
    }

    function pickSticker(slot: number) {
      const options = O_POOL.filter((f) => f !== lastOn.current[slot]);
      const file = options[Math.floor(Math.random() * options.length)];
      lastOn.current[slot] = file;
      return stickerByFile(file);
    }

    /** Build the in-and-out for one O. Returns a timeline. */
    function swapOne(o: (typeof O_SLOTS)[number]) {
      const clip = clips.current[o.i]!;
      const letter = letters.current[o.i]!;
      const sticker = stickers.current[o.i]!;
      const img = sticker.firstElementChild as HTMLImageElement;
      const st = pickSticker(o.i);

      img.src = stickerSrc(st.file);
      img.style.height = pct(st.h, ROW_H);
      img.style.width = 'auto';
      gsap.set(img, { rotate: st.rotate });

      const tl = gsap.timeline();

      if (o.entrance.kind === 'flip') {
        /* A card flip. `overflow: hidden` on the clip forces `transform-style`
           back to flat, so the two faces can't be separated by 3D depth — they
           have to trade places by hand at the edge-on moment, where the clip
           is side-on and nothing is legible. Showing the sticker any earlier
           is what put it on top of the letterform. */
        gsap.set(clip, { transformPerspective: 800 });
        // pre-flipped, so it reads upright once the clip is upside down
        gsap.set(sticker, { transformPerspective: 800, rotationX: 180, opacity: 0 });

        /* Which face is up is read off the clip's actual angle every frame,
           not scheduled at a point in time.

           The trade used to happen at half the tween's *duration*, which is
           only the edge-on moment for a linear ease. These flips run
           `back.out(1.7)`, which overshoots: it is already past 90° at 13% of
           the way through and past 180° by the midpoint — so for most of the
           turn the letter was still opaque while facing away, showing its
           mirrored back, and the sticker then appeared late and abruptly.
           That was the glitch on the O in KOULOURIS, the only O of the three
           that flips.

           Reading the angle instead puts the trade exactly on the edge, and
           it stays correct through the overshoot at either end. */
        let showing: 'letter' | 'sticker' | null = null;
        const face = () => {
          const a = gsap.utils.wrap(0, 360, gsap.getProperty(clip, 'rotationX') as number);
          // between 90° and 270° the clip's front face points away from us
          const next = a > 90 && a < 270 ? 'sticker' : 'letter';
          if (next === showing) return;
          showing = next;
          gsap.set(letter, { opacity: next === 'letter' ? 1 : 0 });
          gsap.set(sticker, { opacity: next === 'sticker' ? 1 : 0 });
        };

        tl.to(clip, { rotationX: 180, duration: o.duration, ease: o.ease, onUpdate: face }, 0)
          .to({}, { duration: SWAP.hold })
          // keep turning the same way rather than winding back
          .to(clip, { rotationX: 360, duration: o.duration, ease: o.ease, onUpdate: face })
          .set(clip, { rotationX: 0 })
          .set(letter, { opacity: 1 })
          .set(sticker, { opacity: 0 });

        return tl;
      }

      // rolling swap: both move the same direction, letter out one edge,
      // sticker in from the other
      const from = o.entrance.kind === 'y' ? o.entrance.from : 0;
      const axis = o.entrance.kind === 'y' ? 'yPercent' : 'xPercent';

      gsap.set(sticker, { opacity: 1, [axis]: from });

      tl.to(letter, { [axis]: -from, duration: o.duration, ease: o.ease }, 0)
        .to(sticker, { [axis]: 0, duration: o.duration, ease: o.ease }, 0)
        .to({}, { duration: SWAP.hold })
        // …and roll back the other way
        .to(sticker, { [axis]: from, duration: o.duration, ease: o.ease })
        .to(letter, { [axis]: 0, duration: o.duration, ease: o.ease }, '<')
        .set(sticker, { opacity: 0 });

      return tl;
    }

    function cycle() {
      const master = gsap.timeline({
        onComplete: () => gsap.delayedCall(SWAP.idle, cycle),
      });
      pickTwo().forEach((o) => master.add(swapOne(o), 0));
    }

    gsap.delayedCall(ENTRANCE_END + SWAP.firstIdle, cycle);

    /* ── Magnet ─────────────────────────────────────────────────────────
       The letters lean toward the pointer. Carried over from the current
       site, where it is the interaction people already associate with it —
       so this is continuity rather than one more thing added.

       It rides the SLOT, not the letter. Both inner layers are already
       spoken for: the clip owns `rotationX` for the flip entrances and the
       flip swap, and the glyph owns the `yPercent`/`xPercent` for its
       entrance and the rolling swap. The slot is the one layer with nothing
       on it, so the pull composes with all of that instead of fighting it —
       and because the whole slot moves, the illustration an O is holding
       comes along too.

       Each glyph is masked at its slot's edge, so the pull is bounded by
       the padding inside the em box rather than by taste: past it the
       letterform gets sliced at the boundary, narrow glyphs like the I
       first. */
    const RADIUS = 120;
    const MAX_SHIFT = 14;

    /* One layout read per letter, cached. The version on the current site
       measures all fifteen on every mouse move, which is fifteen forced
       reflows per event; the geometry only actually changes on resize. */
    let boxes: { x: number; y: number }[] = [];
    const measure = () => {
      boxes = slots.current.map((el) => {
        if (!el) return { x: -9999, y: -9999 };
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };

    // quickTo keeps one tween per property alive rather than making a new
    // one on every pointer event
    const toX = slots.current.map((el) =>
      el ? gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' }) : null,
    );
    const toY = slots.current.map((el) =>
      el ? gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' }) : null,
    );

    /* Held off until the wordmark has finished arriving — the slots are
       still settling before that, so the cached centres would be wrong and
       the pull would be arguing with the entrance. */
    let armed = false;
    const arm = gsap.delayedCall(ENTRANCE_END, () => {
      measure();
      armed = true;
    });

    const onMove = (e: PointerEvent) => {
      if (!armed) return;
      boxes.forEach((b, i) => {
        const dx = e.clientX - b.x;
        const dy = e.clientY - b.y;
        const dist = Math.hypot(dx, dy);
        const pull = dist > 0 && dist < RADIUS ? (1 - dist / RADIUS) * MAX_SHIFT : 0;
        toX[i]?.(pull ? (dx / dist) * pull : 0);
        toY[i]?.(pull ? (dy / dist) * pull : 0);
      });
    };

    const onLeave = () => {
      toX.forEach((f) => f?.(0));
      toY.forEach((f) => f?.(0));
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', measure);
    // the wordmark scrolls away, so its centres move with the page
    window.addEventListener('scroll', measure, { passive: true });

    return () => {
      arm.kill();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
    };
  }, { scope: root });

  let flat = -1;

  return (
    <div
      ref={root}
      data-wordmark
      className="relative w-full"
      style={{ aspectRatio: `${HERO_W} / ${HERO_H}` }}
      aria-label="George Koulouris"
      role="img"
    >
      {WORDS.map((word) => (
        <div
          key={word.name}
          data-word={word.name}
          className="absolute"
          style={{
            left: pct(word.x, HERO_W),
            top: pct(word.y, HERO_H),
            width: pct(word.w, HERO_W),
            height: pct(ROW_H, HERO_H),
          }}
        >
          {word.slots.map((slot, si) => {
            flat += 1;
            const idx = flat;
            const isO = slot.file.startsWith('O');
            return (
              <div
                key={si}
                ref={(el) => { slots.current[idx] = el; }}
                className="absolute top-0 h-full"
                style={{ left: pct(slot.x, word.w), width: pct(slot.w, word.w) }}
              >
                <span
                  ref={(el) => { clips.current[idx] = el; }}
                  className="absolute inset-0 block overflow-hidden"
                >
                  <span
                    ref={(el) => { letters.current[idx] = el; }}
                    className="absolute inset-0 block"
                    style={{
                      backgroundColor: 'var(--text-primary)',
                      WebkitMaskImage: `url(${letterSrc(slot.file)})`,
                      maskImage: `url(${letterSrc(slot.file)})`,
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      maskPosition: 'center',
                      WebkitMaskSize: 'contain',
                      maskSize: 'contain',
                    }}
                  />
                  {/* only the O's ever hold an illustration, and it lives
                      inside the clip so it shares the entrance's masking */}
                  {isO && (
                    // wrapper carries the motion (roll / flip); the image
                    // keeps its own size and resting angle, so the two never
                    // fight over `transform`
                    <span
                      ref={(el) => { stickers.current[idx] = el; }}
                      className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0"
                    >
                      <img alt="" aria-hidden="true" className="block max-w-none" />
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
