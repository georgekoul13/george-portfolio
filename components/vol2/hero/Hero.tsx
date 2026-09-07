'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  HERO_W, HERO_H, ROW_H, WORDS, O_POOL, SWAP, STAGGER, ENTRANCE_END,
  letterSrc, stickerSrc, stickerByFile, type Entrance,
} from './heroData';

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

/**
 * Which O's are allowed to turn into something else, by their letterform's
 * file name. George: *"only to the 1st and 3rd O."*
 *
 * `O 2` — the first O of KOULOURIS — sits this out. It is also the only one
 * of the three whose entrance is a card FLIP rather than a roll, and the
 * flip is by far the fiddliest of the two swaps to keep honest: the clip's
 * `overflow: hidden` flattens `transform-style`, so the two faces cannot be
 * separated by depth and have to trade places by hand at the edge-on frame.
 * Leaving it out is George's call, and it happens to retire that whole
 * mechanism — but the flip branch below is kept, because which O's swap is a
 * one-line change and it should not cost a rewrite to change it back.
 */
const SWAPPABLE = ['O 1', 'O 3'];

/** Flat index of every slot whose letterform is a swappable O. */
const O_SLOTS: { i: number; entrance: Entrance; duration: number; ease: string }[] = (() => {
  const out: { i: number; entrance: Entrance; duration: number; ease: string }[] = [];
  let i = 0;
  WORDS.forEach((w) =>
    w.slots.forEach((s) => {
      if (SWAPPABLE.includes(s.file)) {
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

    /* Uncovered at the END of this effect, after the start states below have
       been written — see the note on the element itself. Reduced motion has
       no start states to write, so it is uncovered immediately. */
    const show = () => gsap.set(root.current, { visibility: 'inherit' });
    if (reduce) show();

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

      /* Every letter is now parked outside its clip, so there is nothing
         readable to flash — safe to uncover. */
      show();
    }

    if (reduce) return;

    /* ── O swap ─────────────────────────────────────────────────────────
       ONE O at a time, from a pool of four illustrations — George: *"only
       one can be at any time."* The swap reuses that O's own entrance
       motion, so it reads as part of the same language rather than a new
       effect bolted on: the letter rolls out one edge while the illustration
       rolls in from the other.

       The two take turns rather than being picked at random. With only two
       in play, random would show the same O twice in a row about half the
       time, and twice in a row reads as the other one being broken. */
    let next = 0;
    const timers: number[] = [];

    function pickSticker(slot: number) {
      const options = O_POOL.filter((f) => f !== lastOn.current[slot]);
      const file = options[Math.floor(Math.random() * options.length)];
      lastOn.current[slot] = file;
      return stickerByFile(file);
    }

    /** Build the in-and-out for one O. Returns a timeline. */
    function swapOne(oSlot: (typeof O_SLOTS)[number]) {
      const clip = clips.current[oSlot.i]!;
      const letter = letters.current[oSlot.i]!;
      const sticker = stickers.current[oSlot.i]!;
      if (!clip || !letter || !sticker) return gsap.timeline();
      const img = sticker.firstElementChild as HTMLImageElement;
      const st = pickSticker(oSlot.i);

      img.src = stickerSrc(st.file);
      img.style.height = pct(st.h, ROW_H);
      img.style.width = 'auto';
      gsap.set(img, { rotate: st.rotate });

      const tl = gsap.timeline();

      if (oSlot.entrance.kind === 'flip') {
        /* Kept for the day an O with a flip entrance swaps again — see
           `SWAPPABLE`. The faces trade at the edge-on ANGLE rather than at
           half the duration, because these flips overshoot with
           `back.out`: at half the duration the clip is already past 180°,
           so a scheduled trade showed the letter's mirrored back for most
           of the turn. */
        gsap.set(clip, { transformPerspective: 800 });
        gsap.set(sticker, { transformPerspective: 800, rotationX: 180, opacity: 0 });

        let showing: 'letter' | 'sticker' | null = null;
        const face = () => {
          const a = gsap.utils.wrap(0, 360, gsap.getProperty(clip, 'rotationX') as number);
          const nextFace = a > 90 && a < 270 ? 'sticker' : 'letter';
          if (nextFace === showing) return;
          showing = nextFace;
          gsap.set(letter, { opacity: nextFace === 'letter' ? 1 : 0 });
          gsap.set(sticker, { opacity: nextFace === 'sticker' ? 1 : 0 });
        };

        tl.to(clip, { rotationX: 180, duration: oSlot.duration, ease: oSlot.ease, onUpdate: face }, 0)
          .to({}, { duration: SWAP.hold })
          .to(clip, { rotationX: 360, duration: oSlot.duration, ease: oSlot.ease, onUpdate: face })
          .set(clip, { rotationX: 0 })
          .set(letter, { opacity: 1 })
          .set(sticker, { opacity: 0 });

        return tl;
      }

      /* The roll: both move the same way, the letter out one edge and the
         illustration in from the other, so the clip is never empty. */
      const from = oSlot.entrance.kind === 'y' ? oSlot.entrance.from : 0;
      const axis = oSlot.entrance.kind === 'y' ? 'yPercent' : 'xPercent';

      gsap.set(sticker, { opacity: 1, [axis]: from });

      tl.to(letter, { [axis]: -from, duration: oSlot.duration, ease: oSlot.ease }, 0)
        .to(sticker, { [axis]: 0, duration: oSlot.duration, ease: oSlot.ease }, 0)
        .to({}, { duration: SWAP.hold })
        .to(sticker, { [axis]: from, duration: oSlot.duration, ease: oSlot.ease })
        .to(letter, { [axis]: 0, duration: oSlot.duration, ease: oSlot.ease }, '<')
        .set(sticker, { opacity: 0 });

      return tl;
    }

    function cycle() {
      if (!O_SLOTS.length) return;
      const oSlot = O_SLOTS[next % O_SLOTS.length];
      next += 1;
      swapOne(oSlot).eventCallback('onComplete', () => {
        timers.push(window.setTimeout(cycle, SWAP.idle * 1000));
      });
    }

    /* `setTimeout`, NOT `gsap.delayedCall`: a delayed call lives on
       `gsap.globalTimeline`, which the Loader PAUSES while its panel is up.
       The swap's own tweens are on that timeline too and SHOULD be held —
       but the clock that decides when to start one must not be. */
    timers.push(window.setTimeout(cycle, (ENTRANCE_END + SWAP.firstIdle) * 1000));

    /* ── Magnet ─────────────────────────────────────────────────────────
       The letters lean toward the pointer. Carried over from the current
       site, where it is the interaction people already associate with it —
       so this is continuity rather than one more thing added.

       It rides the SLOT, not the letter. Both inner layers are already
       spoken for: the clip owns `rotationX` for the flip entrances, and the
       glyph owns the `yPercent`/`xPercent` for its own. The slot is the one
       layer with nothing on it, so the pull composes with all of that
       instead of fighting it.

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
      /* GSAP reverts its own context; a pending `setTimeout` is not its to
         revert, and one left running re-enters `cycle` against refs that
         React has already detached. */
      timers.forEach(clearTimeout);
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
      /* Hidden in the SERVER's markup, and uncovered by the effect above
         once every letter has been parked outside its clip.

         Parking happens at hydration, which lands well after the loading
         panel starts to leave — so without this the panel slides away from a
         wordmark that is already fully drawn, holds there for several frames,
         and only then snaps out to animate in. That is exactly what George's
         recording shows. The gate used to live on a wrapper in
         `HeroSection`; it came off with that wrapper and had to come back
         here, where the thing it guards actually is. */
      style={{ aspectRatio: `${HERO_W} / ${HERO_H}`, visibility: 'hidden' }}
      aria-label="George Koulouris"
      role="img"
    >
      {WORDS.map((word) => (
        <div
          key={word.name}
          data-word={word.name}
          className="absolute"
          style={{
            /* Hard left, both of them — 255:7046. The wordmark used to be
               centred in its box, which is what 230:14543 drew when it was
               the middle of a full-width hero; it now opens a column and
               starts where the column does. `word.x` is kept in the data
               because it still carries the original indent, and because the
               kerning inside a word is measured from it. */
            left: 0,
            top: pct(word.y, HERO_H),
            width: pct(word.w, HERO_W),
            height: pct(ROW_H, HERO_H),
          }}
        >
          {word.slots.map((slot, si) => {
            flat += 1;
            const idx = flat;
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
                  {/* only a swappable O ever holds an illustration, and it
                      lives inside the clip so it shares the entrance's
                      masking */}
                  {SWAPPABLE.includes(slot.file) && (
                    /* the wrapper carries the motion, the image keeps its own
                       size and resting angle — so the two never fight over
                       `transform` */
                    <span
                      ref={(el) => { stickers.current[idx] = el; }}
                      className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
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
