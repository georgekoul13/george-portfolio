'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

import './scrollDefaults';
import { scrubToHold, scrubToPosition } from './scrubToPosition';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * A run of one or more words that arrives as a beat of its own — its motion
 * and the green pass — instead of taking the plain wipe.
 */
interface Marked {
  /** the underline to draw on, when the beat has one */
  bar: HTMLElement | null;
  chars: Element[];
  /** every word in the run, in reading order */
  words: HTMLElement[];
  /** how it arrives — its own move, in place of the plain wipe */
  kind: 'elastic' | 'flip';
}

export interface RevealTextProps {
  children: string;
  /**
   * Words that get an underline and reveal an image on hover.
   * Key is the word as it appears in the text (punctuation ignored).
   * Omit to get the scroll reveal only — which is what every other big
   * left-aligned text block on the site uses.
   */
  reveals?: Record<string, string>;
  /**
   * Words that get the underline and the arrival beat, but nothing on hover —
   * the design's permanent underlines that aren't also doors to an image.
   */
  underlined?: string[];
  /**
   * Phrases that get the same arrival beat — the motion and the colour wave —
   * but no underline and no hover image. Written as they appear in the text;
   * punctuation is ignored when matching, so "say hi!" and "say hi" both find
   * the same pair of words.
   */
  beats?: string[];
  /**
   * How many opening words are already written when the reveal starts. Their
   * wipe is skipped entirely, so the sentence appears to continue rather than
   * to begin — the category pages open on "DESIGNING" already standing there.
   */
  lead?: number;
  /**
   * `scroll` (the default) scrubs the reveal against the page. `load` plays
   * it once on mount, compressed into `LOAD_SECONDS` — for a block that sits
   * in the first viewport, where there is no scroll to spend on it yet.
   *
   * `pinned` scrubs the reveal against the block's own position on screen,
   * for a block inside a PINNED panel. `scroll` cannot be used there — the
   * panel does not move through the document, so a ScrollTrigger keyed to the
   * paragraph never advances — but the behaviour is the same one: word by
   * word as you scroll, and un-written again as you scroll back up. See
   * `scrubToPosition`.
   *
   * It briefly played once instead, on a cue. George: *"let's make the
   * revealing of this text happen word by word with scroll — like we had in
   * the previous version of the Vol2, not automatically after one scroll."*
   */
  play?: 'scroll' | 'load' | 'pinned';
  /**
   * The `font` shorthand for the copy. Defaults to the display size; the
   * intro sentence takes the step below it. A prop rather than a class
   * because the size has to be on the `<p>` the split reads, and a shorthand
   * set there beats anything inherited from the wrapper.
   */
  font?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** punctuation-insensitive form of a word, for matching */
const clean = (s: string) => s.replace(/[^0-9A-Za-z]/g, '');

/**
 * Beats were tuned on single words of six or seven letters. A phrase has
 * three or four times as many characters, and at a fixed per-character
 * stagger it would run for six seconds and stall the sentence behind it. So
 * the stagger is expressed as a total spread instead, and divided out.
 */
const spread = (chars: Element[], total: number, cap: number) =>
  Math.min(cap, total / Math.max(1, chars.length - 1));

/**
 * How long the whole reveal takes in `load` mode. The timeline is written in
 * units that suit a scroll budget — a plain word costs 0.7 and a beat nearly
 * four — which adds up to fifteen seconds or so on a long line. Scrolling
 * spends that at whatever rate you like; a page load cannot, so the finished
 * timeline is scaled to fit this instead.
 *
 * 2.5, not 5. George: *"let's make the revealing text animation of the hero
 * in the inner pages quicker."* This is the first thing on a category page
 * and there is nothing else to look at while it runs, so the reader is
 * waiting on it rather than watching it — five seconds of waiting reads as
 * the page being slow, not as the line being written.
 */
const LOAD_SECONDS = 2.5;

/**
 * Big left-aligned display text with a word-by-word scroll reveal.
 *
 * SplitText into words+lines, then wipe each word in from its left edge on a
 * scrubbed ScrollTrigger. `autoSplit` re-splits on resize, and
 * `document.fonts.ready` gates the first split so lines aren't measured
 * against the fallback font.
 *
 * The underlined words don't take the wipe. Each is a beat of its own inside
 * the same sequence — its motion, a colour wave through its characters, and
 * its line drawing on — borrowed from gsap.com's intro section, where the
 * same three moves run as a separate one-shot after the copy. Here they do
 * the revealing instead, so they read as events in the sentence rather than
 * decoration applied to it afterwards.
 *
 * Hover-to-reveal images are a separate, opt-in behaviour — currently only
 * the intro paragraph uses them.
 */
export default function RevealText({
  children,
  reveals,
  underlined,
  beats,
  lead = 0,
  play = 'scroll',
  font = 'var(--type-72-80-r)',
  className,
  style,
}: RevealTextProps) {
  const root = useRef<HTMLDivElement>(null);
  const figure = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      const container = root.current!;
      const text = container.querySelector<HTMLElement>('[data-split]')!;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let split: SplitText | undefined;
      /* `onSplit` can run many times — `autoSplit` re-runs it on every
         reflow — and each run arms a new observer, so they are collected
         rather than tracked singly. */
      const cleanups: (() => void)[] = [];

      /* Held invisible until the split has parked every word. Splitting waits
         on `document.fonts.ready`, and until it resolves this is just a
         paragraph of fully readable copy — which is precisely what must not
         be on screen before the reveal. Restored below, on both paths. */
      gsap.set(text, { autoAlpha: 0 });

      document.fonts.ready.then(() => {
        split = SplitText.create(text, {
          type: 'words,lines',
          // no mask — nothing translates any more, so there is nothing to
          // hide behind a box
          linesClass: 'line',
          autoSplit: true,
          onSplit: (self) => {
            const words = self.words as HTMLElement[];
            const marked = [...wireUnderlined(words), ...wireBeats(words)];

            /* Reading order, then alternate. Ordering matters because the
               beats come from three separate props and are collected in prop
               order, not sentence order — and alternating over the sentence
               is what keeps "Product" turning over between "George" and
               "Visual" rising, whatever else gets marked around them. */
            marked.sort((a, b) => words.indexOf(a.words[0]) - words.indexOf(b.words[0]));
            marked.forEach((m, i) => { m.kind = i % 2 === 1 ? 'flip' : 'elastic'; });

            if (reduce) {
              gsap.set(text, { autoAlpha: 1 });
              return undefined;
            }

            /* Word reveal — a left-to-right wipe, word by word. Nothing
               moves: each word is uncovered in place by its own clip, which
               is why it reads as the sentence being written rather than
               assembled. It also rhymes with the underlines, which are drawn
               on by the same left-to-right gesture.

               The inset is negative top and bottom so ascenders and
               descenders are never touched — only the horizontal edge does
               any work. Flat `none` ease and an even stagger keep the wipe
               travelling at a constant rate across the paragraph, and
               `scrub: 0.8` lets it chase the scroll rather than being welded
               to it, so a flick of the wheel still resolves smoothly. */
            const tl = gsap.timeline(
              play === 'pinned'
                ? { paused: true }
                : play === 'load'
                ? { delay: 0.15 }
                : {
                    scrollTrigger: {
                      trigger: container,
                      scrub: 0.8,
                      /* Long enough that 24 words taken one at a time still
                         get enough scroll each to register as separate, and
                         that the underlined beats get enough to actually be
                         watched. `top 8%` is about as far as this can stretch
                         before the section leaves the viewport mid-sentence. */
                      start: 'clamp(top 90%)',
                      end: 'clamp(top 8%)',
                    },
                  },
            );

            /* One word at a time, in order, laid out on a running cursor
               rather than a stagger — because the three underlined words take
               longer than the plain ones and everything after them has to
               wait. Nothing overlaps and nothing gaps.

               Plain words wipe in from their left edge on a flat `none` ease,
               so the edge travels at a constant rate and the sentence reads
               as being typed out.

               The underlined words are revealed by their own animation
               instead of the wipe: George and Visual rise elastically, and
               Product wipes in like a plain word and then immediately flips
               before the sentence moves on. */
            /* A beat can span several words, so it is keyed on its first and
               the rest are struck off — otherwise "collaborations" would be
               wiped in as a plain word on top of the beat that already owns
               it. */
            const byWord = new Map(marked.map((m) => [m.words[0], m]));
            const owned = new Set(marked.flatMap((m) => m.words.slice(1)));
            /* A plain word costs less than a beat does, which is what tilts
               the window's scroll budget towards the three that matter. */
            const WIPE_D = 0.7;
            const WIPE_FROM = { clipPath: 'inset(-30% 100% -30% 0%)' };
            const WIPE_TO = { clipPath: 'inset(-30% 0% -30% 0%)', duration: WIPE_D, ease: 'none' };

            // GSAP's colour parser can't read a custom property, so resolve it
            const accent =
              getComputedStyle(document.documentElement)
                .getPropertyValue('--green-500')
                .trim() || '#0fe347';

            /* The colour runs *through* the word as a wave rather than
               flashing it all at once — `repeat: 1` with `yoyo` on the
               stagger is what brings each character back to cream on its own,
               so nothing has to be reset afterwards. Paced to last about as
               long as the motion it accompanies. */
            const wave = (chars: Element[]) =>
              gsap.to(chars, {
                color: accent,
                ease: 'power3.inOut',
                duration: 1.1,
                stagger: { each: spread(chars, 1.4, 0.12), repeat: 1, yoyo: true },
              });

            /* ── Park every start state, before a single tween exists ──
               `fromTo`/`from` are supposed to write their start values the
               moment they are created. They do NOT when the parent timeline
               is already paused — and a scrubbed ScrollTrigger pauses this
               timeline the instant it is handed one. The result was that
               nothing was ever hidden: the whole paragraph rendered at rest
               and the wipes, the rises and the colour waves all ran on top
               of copy that had been readable since first paint.

               Setting the start states outright does not care what is paused,
               so nothing can be seen before its own tween reveals it. Each
               word is parked the way its own beat will move it — a clip for
               anything that wipes, char transforms for anything that rises —
               because parking a word one way and animating it another would
               leave it stuck in the pose nothing ever undoes. */
            words.forEach((word, wi) => {
              if (wi < lead) return;
              if (owned.has(word)) return;
              const m = byWord.get(word);
              if (!m) { gsap.set(word, WIPE_FROM); return; }
              if (m.kind === 'elastic') gsap.set(m.chars, { opacity: 0, y: 100, scale: 0.6 });
              else gsap.set(m.words, WIPE_FROM);
              if (m.bar) gsap.set(m.bar, { scaleX: 0 });
            });
            // everything is parked now, so the paragraph can be shown
            gsap.set(text, { autoAlpha: 1 });

            let at = 0;
            words.forEach((word, wi) => {
              // the opening words are already written — see `lead`
              if (wi < lead) return;
              if (owned.has(word)) return;
              const m = byWord.get(word);

              // plain word — a wipe, and on to the next
              if (!m) {
                tl.to(word, WIPE_TO, at);
                at += WIPE_D;
                return;
              }

              /* An underlined word is a beat of its own: its motion, the
                 colour wave and its line drawing on, all together and all
                 slow enough to be read as an event. Advancing the cursor by
                 the beat's own duration is what holds the rest of the
                 sentence back until it has finished. */
              const beat = gsap.timeline();
              const line = (at: number) =>
                m.bar &&
                beat.to(m.bar, { scaleX: 1, duration: 1.6, ease: 'power4.inOut' }, at);

              if (m.kind === 'elastic') {
                beat.to(
                  m.chars,
                  {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 2.2,
                    stagger: spread(m.chars, 1.6, 0.18),
                    ease: 'elastic.out(1, 0.4)',
                  },
                  0,
                );
                beat.add(wave(m.chars), 0);
                line(0);
              } else {
                /* Wipes in like a plain word first, then turns over. A phrase
                   wipes word by word, the whole run still costing one plain
                   word's worth of scroll. */
                beat.to(
                  m.words,
                  {
                    ...WIPE_TO,
                    duration: WIPE_D / m.words.length,
                    stagger: WIPE_D / m.words.length,
                  },
                  0,
                );
                beat.to(
                  m.chars,
                  {
                    rotateX: 360,
                    duration: 2.4,
                    stagger: spread(m.chars, 1.0, 0.14),
                    ease: 'power3.inOut',
                  },
                  WIPE_D,
                );
                beat.add(wave(m.chars), WIPE_D);
                // the line is inside the clip, so it can't draw until the
                // wipe has uncovered it
                line(WIPE_D);
              }

              tl.add(beat, at);
              at += beat.duration();
            });

            /* `load` plays in real time and needs compressing; `pinned` is
               driven by `progress()`, which is normalised, so a timeScale
               would change nothing. */
            if (play === 'load' && tl.duration() > 0) {
              tl.timeScale(tl.duration() / LOAD_SECONDS);
            }

            /* Plays once, on whichever comes first: the panel's cue, or the
               block simply arriving on screen.

               The cue alone is too fragile for content this important. It
               fires when the panel takes the screen, and if it does not fire
               at all — a trigger built against a layout that then changed, a
               panel the sentence is not actually inside — the words stay
               parked and the paragraph is invisible with nothing to say why.

               An OBSERVER, not a scroll listener. Everything in here is built
               inside `onSplit`, which waits on `document.fonts.ready`, so the
               gate is armed at an unpredictable moment — and a scroll handler
               armed after the reader has already scrolled past this point
               never hears anything again, because no further scroll event is
               coming. That left the paragraph permanently blank whenever the
               font resolved late. An observer reports the CURRENT
               intersection the moment it starts, so arming it late is
               harmless. It is also immune to the thing the rect check was for:
               it works pinned, carried by an overscroll, or in plain flow,
               since it compares against the viewport either way. */
            /* Inside a `[data-hold]` the panel parks the block mid-screen
               and spends a screen of scroll on it going nowhere, so the
               reveal is driven by that hold rather than by a position which
               is, for its whole duration, not changing. Without a hold it
               falls back to scrubbing against its own travel: reading starts
               as the paragraph comes up past three-quarters of the window
               and the last word lands by 12%. */
            if (play === 'pinned') {
              const held = container.closest('[data-hold]');
              cleanups.push(
                held
                  ? scrubToHold(held, tl)
                  : scrubToPosition(container, tl, { from: 0.8, to: 0.12 }),
              );
            }

            return tl;
          },
        });
      });

      /**
       * Underline the configured words and give each an arrival beat. A word
       * that also has an image in `reveals` becomes hoverable on top of that;
       * one listed only in `underlined` gets the rule and the motion and
       * stays inert.
       */
      function wireUnderlined(words: HTMLElement[]) {
        const marked: Marked[] = [];
        const fig = figure.current!;
        const im = img.current!;
        const keys = [...Object.keys(reveals ?? {}), ...(underlined ?? [])];
        if (!keys.length) return marked;

        words.forEach((word) => {
          const raw = word.textContent || '';
          // strip punctuation so "George," still matches the key "George"
          const key = keys.find((k) => k === clean(raw));
          if (!key) return;
          const image = reveals?.[key];

          /* Underline the word only, never the punctuation clinging to it —
             Figma's "George" is underlined but the comma after it isn't, and
             SplitText hands us the two as one token. So split the token into
             lead / core / trail and hang the rule off the core alone.

             The punctuation still gets its own element rather than being left
             as a bare text node, because it has to *animate* with the word
             even though it isn't underlined by it. As a text node the comma
             after "George" sat outside the split entirely, which meant it was
             already at full opacity while the name was still rising in. */
          const lead = raw.match(/^[^0-9A-Za-z]*/)![0];
          const trail = raw.match(/[^0-9A-Za-z]*$/)![0];
          const punct = (text: string) => {
            const s = document.createElement('span');
            s.textContent = text;
            return s;
          };
          const leadEl = lead ? punct(lead) : null;
          const trailEl = trail ? punct(trail) : null;

          const w = document.createElement('span');
          // the glyphs live in their own child so they can be split into
          // characters without the underline bar being swallowed by the split
          const glyphs = document.createElement('span');
          glyphs.textContent = raw.slice(lead.length, raw.length - trail.length);
          w.appendChild(glyphs);
          word.textContent = '';
          if (leadEl) word.appendChild(leadEl);
          word.appendChild(w);
          if (trailEl) word.appendChild(trailEl);

          /* The underline is a drawn bar rather than `text-decoration`,
             because a text-decoration can't be swept on from one end. Sized
             in `em` so it tracks the type: at 72px that's a ~4px rule sitting
             just under the baseline, which is where Montserrat's own
             from-font underline lands. */
          w.style.display = 'inline-block';
          w.style.position = 'relative';
          const bar = document.createElement('span');
          bar.setAttribute('aria-hidden', 'true');
          bar.style.cssText =
            'position:absolute;left:0;right:0;bottom:0.06em;height:0.055em;' +
            'background:currentColor;transform-origin:0% 50%;pointer-events:none;';
          w.appendChild(bar);
          /* Reading order, so the stagger runs through the punctuation in its
             proper place rather than tacking it on at the end. */
          const split = (el: HTMLElement | null) =>
            el ? (SplitText.create(el, { type: 'chars' }).chars as Element[]) : [];

          marked.push({
            bar,
            chars: [...split(leadEl), ...split(glyphs), ...split(trailEl)],
            words: [word],
            // set once the whole sentence's reading order is known
            kind: 'elastic',
          });

          // …and that is everything an `underlined` word gets.
          if (!image) return;

          w.style.cursor = 'pointer';
          w.setAttribute('tabindex', '0');
          w.setAttribute('role', 'button');
          w.setAttribute('aria-label', `Show an example of ${key}`);

          const open = () => {
            im.src = image;
            const r = w.getBoundingClientRect();
            const c = container.getBoundingClientRect();
            fig.style.left = `${r.left - c.left + r.width / 2}px`;
            fig.style.top = `${r.top - c.top}px`;
            fig.style.opacity = '1';
            fig.style.transform = 'translate(-50%, -100%) scale(1)';
          };
          const close = () => {
            fig.style.opacity = '0';
            fig.style.transform = 'translate(-50%, -92%) scale(0.96)';
          };

          w.addEventListener('pointerenter', open);
          w.addEventListener('pointerleave', close);
          w.addEventListener('focus', open);
          w.addEventListener('blur', close);
          // touch has no hover — tap toggles instead
          w.addEventListener('click', (e) => {
            e.preventDefault();
            if (fig.style.opacity === '1') close();
            else open();
          });
        });

        return marked;
      }

      /**
       * The same arrival beats, keyed on phrases rather than single words and
       * carrying none of the underline/hover apparatus — used by the footer,
       * where the highlights are "freelance collaborations" and "say hi!" and
       * neither is a link to anything.
       *
       * Matching walks the word list looking for the phrase's tokens in a
       * row, which is what lets a phrase straddle a line break: SplitText
       * hands back words in reading order regardless of how they wrapped.
       */
      function wireBeats(words: HTMLElement[]) {
        const marked: Marked[] = [];
        if (!beats) return marked;

        const tokens = words.map((w) => clean(w.textContent || ''));

        beats.forEach((phrase) => {
          const want = phrase.split(/\s+/).map(clean).filter(Boolean);
          const at = tokens.findIndex((_, i) =>
            want.every((t, j) => tokens[i + j] === t),
          );
          if (at < 0) return;

          const run = words.slice(at, at + want.length);
          marked.push({
            bar: null,
            chars: run.flatMap((w) => SplitText.create(w, { type: 'chars' }).chars),
            words: run,
            kind: 'elastic',
          });
        });

        return marked;
      }

      return () => {
        cleanups.forEach((fn) => fn());
        split?.revert();
      };
    },
    { scope: root, dependencies: [children] },
  );

  return (
    <div ref={root} className={`relative ${className ?? ''}`} style={style}>
      <p data-split style={{ font, color: 'var(--text-primary)' }}>
        {children}
      </p>

      {reveals && (
        <div
          ref={figure}
          aria-hidden="true"
          className="pointer-events-none absolute z-20"
          style={{
            opacity: 0,
            transform: 'translate(-50%, -92%) scale(0.96)',
            transition: 'opacity .25s ease, transform .45s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <img
            ref={img}
            alt=""
            className="block h-[220px] w-auto max-w-none rounded-xl object-cover"
            style={{ background: 'var(--bg-raised)' }}
          />
        </div>
      )}
    </div>
  );
}
