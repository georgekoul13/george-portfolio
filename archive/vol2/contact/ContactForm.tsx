'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Divider from '../Divider';
import BackLink from '../BackLink';
import Image from 'next/image';

/**
 * The contact page — Figma 147:11421, redrawn 2026-08-27.
 *
 * It used to be a mad-libs sentence with inline blanks. That layout could not
 * survive a phone — the line was `whitespace-nowrap` around fixed 612px
 * inputs, so at 375 it ran to x=1008 and the inputs sat off-screen entirely.
 * The new design is a display headline over a plain two-column form, which
 * reflows properly and is the one the audit was waiting on.
 *
 * The headline reads "LET'S GET IN / [ ] TOUCH", where the block on the
 * second line is a video of George working. It is an image for now.
 */

/**
 * Every text node in this frame is set to `text-box-trim: trim-both` with
 * `text-box-edge: cap alphabetic` — Figma trims the box down to the cap band,
 * which is why a 205.288px line reports as 144 tall and the video beside it is
 * 144 too. Without the trim nothing in the frame lines up: the video sits
 * against the top of a 205px em box while the letters start 33px lower.
 *
 * `text-box-trim` itself is still missing from Firefox, so the trim is done
 * with margins. Measured in the browser rather than assumed: Montserrat
 * reports fontBoundingBox 0.968 / 0.251 em and a 0.700 em cap at every weight
 * used here. At `line-height: 1` the box is 1em and the baseline lands
 * (1 − 1.219)/2 + 0.968 = 0.8585em down, so the cap band runs from 0.1585em
 * to 0.8585em — trim those two remainders away and the box IS the cap.
 */
const CAP_TRIM = {
  lineHeight: 1,
  marginTop: '-0.1585em',
  marginBottom: '-0.1415em',
} as const;

/* ── The form ────────────────────────────────────────────────────────────
   Figma 147:13520: DETAILS beside a two-column grid, each field a label over
   a rule. The design has six fields; George cut Phone and folded Name +
   Surname into one Full name (2026-08-27), which leaves four short fields on
   two tidy rows. The asterisk is the only thing marking a required field in
   the design, so the required set is read straight off it. */
/* `autoComplete` / `inputMode` / `autoCapitalize` are the difference between
   a form a phone can fill in one tap and one that has to be typed out. Every
   key is spelled out on every field, including the boring answers, so the
   objects stay one shape — a union where only some members carry `inputMode`
   can't be read off a `.map`. */
const FIELDS = [
  { name: 'fullName', label: 'Full name', required: true,  type: 'text',
    autoComplete: 'name',         inputMode: 'text',  autoCapitalize: 'words', spell: true  },
  { name: 'email',    label: 'Email',     required: true,  type: 'email',
    autoComplete: 'email',        inputMode: 'email', autoCapitalize: 'none',  spell: false },
  { name: 'company',  label: 'Company',   required: true,  type: 'text',
    autoComplete: 'organization', inputMode: 'text',  autoCapitalize: 'words', spell: true  },
  // Figma has "Webisite". `inputMode` rather than `type="url"`: the keyboard
  // is the point, and the type would also start demanding a scheme.
  { name: 'website',  label: 'Website',   required: false, type: 'text',
    autoComplete: 'url',          inputMode: 'url',   autoCapitalize: 'none',  spell: false },
] as const;

/**
 * The free-form message, added 2026-08-27 from the reference George sent — a
 * prompt in plain sight with room to write under it, rather than another
 * one-word placeholder on a rule.
 *
 * It is NOT in `FIELDS`: it is never required and never validated, so keeping
 * it out means the gate and the error pass don't need a special case for it.
 */
const MESSAGE = {
  name: 'message',
  label: 'Free form',
  prompt: 'Got something in mind? Tell me about it!',
  /* Figma 203:5693 counts up to 240 and the counter is part of the
     component, so the cap is the design's, not a guess */
  max: 240,
} as const;

type FieldName = (typeof FIELDS)[number]['name'] | typeof MESSAGE['name'];
type Values = Record<FieldName, string>;

const EMPTY: Values = { fullName: '', email: '', company: '', website: '', message: '' };

/* ── The field component — Figma 203:5577 / 203:5668 ────────────────────
   Redrawn 2026-08-27. The label used to be the placeholder, centred over the
   rule; it now sits above it at 12px and the value is left-aligned at 20px
   underneath, so the field name and the asterisk survive being filled in.

   Everything is cap-trimmed the way the rest of the frame is (see CAP_TRIM),
   which is what makes the 4 / 8 / 8 spacing add up: flex `gap` measures from
   the margin box, so trimming first means the 8 is 8 of daylight rather than
   8 plus two slabs of phantom leading. */
const LABEL = {
  ...CAP_TRIM,
  fontSize: 12,
  fontWeight: 300,
  letterSpacing: '0.05em',
  color: 'var(--text-secondary)',
} as const;

const VALUE = {
  fontSize: 'var(--contact-value-size)',
  fontWeight: 400,
  lineHeight: 'var(--contact-value-lh)',
  letterSpacing: '0.05em',
  color: 'var(--text-primary)',
  /* 30 at desktop = Figma's py-8 either side of a 20px line trimmed to its
     14px cap. An input centres its own line box, so a height and no padding
     puts the cap 8.17 from the top of the row — the design says 8. */
  height: 'var(--contact-value-h)',
  padding: 0,
} as const;

const COUNTER = {
  ...CAP_TRIM,
  fontSize: 8,
  fontWeight: 300,
  letterSpacing: '0.05em',
  color: 'var(--text-secondary)',
} as const;

/* Figma's `py-[8px]` input row. It is NOT a wrapper here — `VALUE.height`
   already spends it, and putting it on a wrapper as well is how the field
   first came out 75.4 tall against the design's 59.4. */
const ROW_PAD = 16;

/* The textarea gets the cap trim too, so its first and last lines sit where
   a single-line field's value does. It cannot use CAP_TRIM's em form — the
   leading and the size differ — so it is the multi-line formula, kept in
   tokens because both halves move with the breakpoint. */
const TA_TRIM = {
  marginTop: 'calc(0px - var(--contact-ta-trim-t))',
  marginBottom: 'calc(0px - var(--contact-ta-trim-b))',
} as const;

/** how far Figma's focus variant opens the writing area (203:5705) */
const OPEN_H = 158;

const fieldShell = (border: string) =>
  ({
    paddingTop: 4,
    paddingBottom: 8,
    borderBottom: `1px solid ${border}`,
    transition: 'border-color 200ms',
  }) as const;

/** Where a completed form goes. */
const TO = 'georgekoul13@gmail.com';

/**
 * Deliberately loose. A stricter pattern rejects real addresses — new TLDs,
 * plus-addressing, quoted locals — and the only thing that can actually prove
 * an address works is sending to it. This catches the typo class that matters
 * (no @, no dot, a trailing space) and nothing else.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** The message under a field, or null when the value is acceptable. */
function checkField(field: (typeof FIELDS)[number], raw: string) {
  const v = raw.trim();
  if (!v) return field.required ? 'Required' : null;
  if (field.name === 'email' && !EMAIL.test(v)) return 'Enter a valid email';
  return null;
}

/* Figma's copy, with three typos corrected: "bellow" → "below", "you'll
   here" → "you'll hear", and the field's "Webisite" above. */
const INTRO =
  'Ready for a new project? Because I am! Just fill the form below and you’ll hear from me very soon!';

/**
 * Placeholder for the video. George asked for "an image now just to have
 * something" — the portrait from the ID card is the only picture of him in
 * the repo. Swap the whole `<img>` for a muted, looping, playsinline
 * `<video>` when the real footage exists.
 */
const PLACEHOLDER = '/images/vol2/id/george-portrait.png';

/**
 * The block set into the headline. It carries no height of its own on
 * desktop: `items-stretch` on its row makes it as tall as the word beside
 * it, which is that word's trimmed cap band — so it matches the letters at
 * every width instead of tracking a viewport figure that only agrees at
 * 1440. Figma's 484 / 502 / 737 are all just what the line leaves over.
 *
 * The `<img>` must be `absolute inset-0`: in flow, `h-full` against an
 * `auto` parent falls back to the picture's natural aspect at full width,
 * the block grows to fit it — 626 tall instead of 144 — and drags the row
 * with it. Out of flow it contributes nothing.
 */
function VideoSlot() {
  return (
    <div
      data-arrive
      className="relative min-w-0 overflow-hidden"
      style={{
        flex: 'var(--contact-rect-flex)',
        height: 'var(--contact-rect-h)',
        background: 'var(--bg-raised)',
      }}
    >
      <Image
        src={PLACEHOLDER}
        alt=""
        aria-hidden="true"
        fill
        sizes="(min-width: 900px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}

export default function ContactForm() {
  const root = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [sent, setSent] = useState(false);
  /* A field only shows its error once the visitor has left it, or once they
     have tried to submit — flagging "Required" at the first keystroke of an
     empty field would be scolding them for not having finished typing. */
  const [touched, setTouched] = useState<Partial<Record<FieldName, true>>>({});
  const [focused, setFocused] = useState<FieldName | null>(null);
  const [hovered, setHovered] = useState<FieldName | null>(null);

  const errors = FIELDS.reduce<Partial<Record<FieldName, string>>>((acc, f) => {
    const msg = checkField(f, values[f.name]);
    if (msg) acc[f.name] = msg;
    return acc;
  }, {});

  /* George's rule: the button is dead until every asterisked field has
     something in it. Note this asks only that they are FILLED — a malformed
     email still lets the button light up, and submitting then points at it.
     Gating on validity too would leave a visitor with a typo staring at a
     dead button and nothing telling them why. */
  const ready = FIELDS.every((f) => !f.required || values[f.name].trim());

  const set = (field: FieldName, v: string) =>
    setValues((prev) => ({
      ...prev,
      /* `maxLength` only constrains what a person types or pastes; it does
         nothing about a value set from script, and the counter would then
         read 400/240. Clamped here so the two can't disagree. */
      [field]: field === MESSAGE.name ? v.slice(0, MESSAGE.max) : v,
    }));

  /* Figma 203:5577 draws five states; four of them are just this rule.
     Order matters — a field being hovered while it is wrong should still
     read as wrong. */
  const rule = (field: FieldName, error?: string) =>
    error
      ? 'var(--feedback-error)'
      : focused === field
        ? 'var(--border-focus)'
        : hovered === field
          ? 'var(--border-strong)'
          : 'var(--border-subtle)';

  /** the free form is only open once it is in use — Figma's Default is shut */
  const open = focused === MESSAGE.name || values.message.length > 0;

  /* The free form's height has to be measured, so it is written to the DOM
     rather than rendered — but it must be written on every change of either
     input, not just on typing. Doing it inside `onChange` left the box stuck
     at 184 after the text was deleted: React re-renders with the same
     `height` in the style prop, sees no change, and so never overwrites the
     imperative value that the last keystroke put there. */
  useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    /* Measured off the element rather than held as constants: the leading
       and the trim both change at the breakpoint, and a hard-coded 40/184
       would be a desktop number wearing a phone's clothes. */
    const cs = getComputedStyle(el);
    const trim = -(parseFloat(cs.marginTop) + parseFloat(cs.marginBottom));
    const shut = parseFloat(cs.lineHeight) + ROW_PAD;
    const floor = open ? OPEN_H + ROW_PAD + trim : shut;
    // 'auto' first, or scrollHeight can only ever report the taller of the two
    el.style.height = 'auto';
    el.style.height = `${Math.max(el.scrollHeight, floor)}px`;
  }, [values.message, open, sent]);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      /* Both states arrive the same way, so switching between them reads as
         one page changing its mind rather than two pages.

         Parked with `set` before the tween, never left to `fromTo`'s own
         start values: the whole site has to do this — see the note in
         RevealText — because a `from`/`fromTo` writes its start state only
         when its parent renders, and anything built under a paused parent
         simply never gets one. */
      const arrive = gsap.utils.toArray<HTMLElement>('[data-arrive]');
      gsap.set(arrive, { clipPath: 'inset(-30% 100% -30% 0%)' });
      gsap.to(arrive, {
        clipPath: 'inset(-30% 0% -30% 0%)',
        duration: 0.6,
        stagger: 0.1,
        ease: 'none',
        delay: 0.1,
      });
    },
    { scope: root, dependencies: [sent] },
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(errors).length) {
      // reveal every message at once, not just the fields they visited
      setTouched(Object.fromEntries(FIELDS.map((f) => [f.name, true])));
      return;
    }

    /* There is no backend behind this yet, and a form that silently swallows
       a message would be worse than none. Handing it to the visitor's mail
       client at least makes it real; swap this for a POST when an endpoint
       exists. */
    const lines = FIELDS.filter((f) => values[f.name].trim()).map(
      (f) => `${f.label}: ${values[f.name].trim()}`,
    );
    // the message goes last and on its own, not as another `Label: value`
    if (values.message.trim()) lines.push('', values.message.trim());
    window.location.href =
      `mailto:${TO}?subject=${encodeURIComponent(`Hello from ${values.fullName}`)}` +
      `&body=${encodeURIComponent(lines.join('\n'))}`;

    setSent(true);
  };

  /* DETAILS only — a single line, so the em cap trim applies. The intro
     paragraph below keeps its leading and uses the multi-line trim tokens. */
  const heading = {
    ...CAP_TRIM,
    fontSize: 'var(--contact-details-size)',
    fontWeight: 500,
    letterSpacing: '0.05em',
    color: 'var(--text-primary)',
  } as const;

  /* Both display lines. `100cqw` — not `vw` — is the band's own content box,
     already inside the gutter and blind to the scrollbar; at 15vw the line
     came out 376 wide inside a 350 container on a phone and bled off the
     left edge. */
  const display = {
    ...CAP_TRIM,
    fontSize: 'var(--contact-display)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  } as const;

  return (
    <div ref={root} className="w-full">
      {/* ── Title band — Figma 147:13474 ──────────────────────────────── */}
      <div
        className="flex w-full flex-col items-stretch px-[var(--gutter)]"
        style={{
          paddingTop: 'var(--contact-top)',
          paddingBottom: 'var(--contact-bottom)',
          /* makes 100cqw above mean "this band's content width" */
          containerType: 'inline-size',
        }}
      >
        <BackLink />

        {sent ? (
          /* Figma 198:5543. The same display headline as the form state,
             mirrored down the two lines: THANK with the video to its right,
             then the video with YOU! to its right. Each block is the
             REMAINDER its line leaves, exactly as in the form state, so
             Figma's 502.3 and 737.3 at 1440 are never hard-coded — they are
             what is left of 1320 after the word and the 65.692 gap. */
          <div
            className="flex w-full flex-col items-start"
            style={{ gap: 'var(--contact-lead)', marginTop: 'var(--contact-back-gap)' }}
          >
            <div
              className="flex w-full items-stretch"
              style={{ gap: 'var(--contact-lead)', flexDirection: 'var(--contact-head-row)' as 'row' }}
            >
              <p data-arrive className="shrink-0 whitespace-nowrap uppercase" style={display}>
                Thank
              </p>
              <VideoSlot />
            </div>

            <div
              className="flex w-full items-stretch"
              style={{ gap: 'var(--contact-lead)', flexDirection: 'var(--contact-head-row)' as 'row' }}
            >
              <VideoSlot />
              <p data-arrive className="shrink-0 whitespace-nowrap uppercase" style={display}>
                You!
              </p>
            </div>
          </div>
        ) : (
          /* `items-end` is Figma's: both lines are flush RIGHT, which is what
             lets the video block sit in the gap the shorter line leaves. */
          <div
            className="flex w-full flex-col items-end"
            style={{ gap: 'var(--contact-lead)', marginTop: 'var(--contact-back-gap)' }}
          >
            <p data-arrive className="whitespace-nowrap uppercase" style={display}>
              Let’s get in
            </p>

            {/* `items-stretch`, and the video carries no height of its own on
                desktop: the row is as tall as TOUCH's trimmed cap band, so
                the video matches the letters exactly at every width instead
                of tracking a viewport figure that only agrees at 1440. */}
            <div
              className="flex w-full items-stretch"
              style={{ gap: 'var(--contact-lead)', flexDirection: 'var(--contact-head-row)' as 'row' }}
            >
              <VideoSlot />
              <p
                data-arrive
                className="shrink-0 whitespace-nowrap uppercase"
                style={display}
              >
                Touch
              </p>
            </div>
          </div>
        )}

        {/* No counterpart in the thank-you frame (198:5539 holds the back
            link and the headline and nothing else), so it goes with the
            form rather than being reworded. */}
        {!sent && (
          <p
            data-arrive
            className="uppercase"
            style={{
              ...heading,
              /* NOT `heading`'s size: DETAILS and the intro are both 48 at
                 desktop but 32 and 24 on a phone, which is why they are two
                 tokens. Spreading `heading` alone put the intro at 32 and
                 ran it to eight lines. */
              fontSize: 'var(--contact-heading)',
              /* a paragraph, so it keeps its leading and the em trim above
                 no longer applies — the multi-line trim is a token */
              lineHeight: 'var(--contact-heading-lh)',
              marginTop: 'calc(var(--contact-intro-gap) - var(--contact-heading-trim-t))',
              marginBottom: 'calc(0px - var(--contact-heading-trim-b))',
            }}
          >
            {INTRO}
          </p>
        )}
      </div>

      {!sent && (
        <>
          <Divider />

          {/* ── The form — Figma 147:12901 ────────────────────────────── */}
          <form
            onSubmit={submit}
            noValidate
            className="flex w-full flex-col items-stretch px-[var(--gutter)]"
            style={{
              paddingTop: 'var(--contact-form-top)',
              paddingBottom: 'var(--contact-form-bottom)',
            }}
          >
            <div
              className="flex w-full items-start"
              style={{
                flexDirection: 'var(--contact-form-row)' as 'row',
                gap: 'var(--contact-details-gap)',
              }}
            >
              <p data-arrive className="shrink-0 uppercase" style={heading}>
                Details
              </p>

              <div
                className="grid w-full min-w-0 flex-1"
                style={{
                  gridTemplateColumns: 'var(--contact-cols)',
                  paddingLeft: 'var(--contact-fields-indent)',
                  columnGap: 56,
                  rowGap: 'var(--contact-fields-gap)',
                }}
              >
                {FIELDS.map((f) => {
                  const error = touched[f.name] ? errors[f.name] : undefined;

                  return (
                    <label
                      key={f.name}
                      data-arrive
                      className="flex min-w-0 flex-col items-start gap-2"
                      style={fieldShell(rule(f.name, error))}
                      onMouseEnter={() => setHovered(f.name)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {/* The label lives on the rule now — it is not a
                          placeholder any more, so it stays put once there is
                          a value and the asterisk stays readable. The error
                          shares the row rather than hanging below it: an
                          absolutely-positioned message under a 425px field
                          has nowhere to go, and one in flow would push this
                          column's rule out of line with its neighbour's. */}
                      <span className="flex w-full items-start justify-between gap-4">
                        <span className="uppercase" style={LABEL}>
                          {f.label}
                          {f.required ? '*' : ''}
                        </span>
                        {error && (
                          <span
                            id={`${f.name}-error`}
                            className="shrink-0 uppercase"
                            style={{ ...LABEL, color: 'var(--feedback-error)' }}
                          >
                            {error}
                          </span>
                        )}
                      </span>

                      <input
                        type={f.type}
                        name={f.name}
                        value={values[f.name]}
                        onChange={(e) => set(f.name, e.target.value)}
                        onFocus={() => setFocused(f.name)}
                        onBlur={() => {
                          setFocused(null);
                          setTouched((prev) => ({ ...prev, [f.name]: true }));
                        }}
                        autoComplete={f.autoComplete}
                        inputMode={f.inputMode}
                        autoCapitalize={f.autoCapitalize}
                        autoCorrect={f.spell ? 'on' : 'off'}
                        spellCheck={f.spell}
                        enterKeyHint="next"
                        className="w-full bg-transparent outline-none"
                        style={VALUE}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={error ? `${f.name}-error` : undefined}
                      />
                    </label>
                  );
                })}

                {/* ── Free form — Figma 203:5668 ───────────────────────
                    The same shell as a field, plus a character counter, and
                    it spans both columns. Figma's Default variant carries an
                    asterisk that none of its other three variants have —
                    read as a leftover from duplicating the Email component,
                    since this field is the one thing on the page nobody has
                    to fill in. Dropped. */}
                <label
                  data-arrive
                  className="flex min-w-0 flex-col items-start gap-2"
                  style={{ ...fieldShell(rule(MESSAGE.name)), gridColumn: '1 / -1' }}
                  onMouseEnter={() => setHovered(MESSAGE.name)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span className="flex w-full flex-col items-start gap-2">
                    <span className="uppercase" style={LABEL}>
                      {MESSAGE.prompt}
                    </span>
                    <textarea
                      name={MESSAGE.name}
                      value={values.message}
                      rows={1}
                      maxLength={MESSAGE.max}
                      ref={area}
                      onChange={(e) => set('message', e.target.value)}
                      onFocus={() => setFocused(MESSAGE.name)}
                      onBlur={() => setFocused(null)}
                      className="w-full resize-none bg-transparent outline-none"
                      style={{
                        ...VALUE,
                        ...TA_TRIM,
                        // height is owned by the layout effect above
                        height: 'auto',
                        padding: '8px 0',
                      }}
                    />
                  </span>
                  {/* 8px, right-aligned — Figma 203:5693. Hidden from the
                      accessible name: the prompt above is this field's label,
                      and everything else inside the <label> gets read out
                      with it, so an un-hidden counter renames the field to
                      "…tell me about it! 0/240" on every keystroke. */}
                  <span
                    aria-hidden="true"
                    className="w-full text-right uppercase"
                    style={COUNTER}
                  >
                    {values.message.length}/{MESSAGE.max}
                  </span>
                </label>

              </div>
            </div>

            {/* Figma right-aligns it to the container, 80 under the fields.
                206 × 54: the width is the label plus its padding, and the
                height is set by the 18px arrow rather than the type. */}
            <button
              type="submit"
              data-arrive
              disabled={!ready}
              aria-disabled={!ready}
              className="group inline-flex h-[54px] items-center justify-center gap-2 self-end rounded-[100px] uppercase transition-opacity duration-300 disabled:cursor-not-allowed"
              style={{
                marginTop: 'var(--contact-cta-gap)',
                border: '2px solid var(--border-focus)',
                padding: '0 48px',
                font: 'var(--type-20-20-r)',
                color: 'var(--text-primary)',
                /* Figma ships the button at 50% — that frame IS the disabled
                   state (147:13547), since the form lands empty. */
                opacity: ready ? 1 : 0.5,
              }}
            >
              Submit
              {/* 18px, the size Figma draws it and the size the asset is
                  authored at, so the stroke lands on a whole pixel */}
              <span
                aria-hidden="true"
                /* stacking `group-enabled:` under `group-hover:` would compile
                   to two nested groups, which don't exist — so the hover is
                   simply not attached while the button is dead */
                className={`block shrink-0 transition-transform duration-300 ${
                  ready ? 'group-hover:translate-x-1 group-hover:-translate-y-1' : ''
                }`}
                style={{
                  width: 18,
                  height: 18,
                  background: 'currentColor',
                  maskImage: 'url(/images/vol2/ui/icon/arrow-up-right.svg)',
                  WebkitMaskImage: 'url(/images/vol2/ui/icon/arrow-up-right.svg)',
                  maskSize: '100% 100%',
                  WebkitMaskSize: '100% 100%',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                }}
              />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
