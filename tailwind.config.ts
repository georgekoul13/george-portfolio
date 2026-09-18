import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    /* ─── Breakpoints ────────────────────────────────────────────
       NOT `extend` — a full replacement, so Tailwind's defaults
       (640/768/1024/1280) are gone rather than sitting alongside these.

       These are the same four widths `app/tokens.css` switches on. They
       used to be two unrelated ladders: the tokens moved at 480/600/900/
       1200 while `sm:`/`md:`/`lg:`/`xl:` still meant Tailwind's defaults,
       and the two only ever agreed at 640. That produced a burger menu
       beside a two-column desktop form between 900 and 1024, and a stacked
       ProjectMeta under a desktop nav between 1024 and 1280.

       Nothing outside `components/vol2` uses a responsive prefix, so this
       cannot move the v1 site. */
    screens: {
      sm: '481px',   // small phone → phone
      md: '600px',   // phone → large phone (gutter 20 → 32)
      lg: '900px',   // the main one: mobile → desktop (gutter → 44)
      xl: '1200px',  // desktop → wide (gutter → 60)
    },
    extend: {
      /* ─── Colors ─────────────────────────────────────────────── */
      colors: {
        dark:           '#1A1A1A',
        'surface-dark': '#1F1F1F',
        surface:        '#272727',
        'grey-dark':    '#444240',
        'grey-md':      '#5C5957',
        grey:           '#B5A496',
        'grey-light':   '#EEE2D9',
        light:          '#F2EAE3',
        yellow:         '#FFC567',
        pink:           '#FC7DA8',
        blue:           '#048CD6',
      },

      /* ─── Typography ─────────────────────────────────────────── */
      fontFamily: {
        sans: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
      },

      fontSize: {
        'body-r':       ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-compact': ['16px', { lineHeight: '16px', fontWeight: '400' }],
        subtitle:       ['24px', { lineHeight: '24px', fontWeight: '300' }],
        title:          ['32px', { lineHeight: '32px', fontWeight: '500' }],
        display:        ['56px', { lineHeight: '64px', fontWeight: '800' }],
        hero:           ['100px', { lineHeight: '100px', fontWeight: '500' }],
        loading:        ['340px', { lineHeight: '340px', fontWeight: '800' }],
      },

      /* ─── Letter spacing ─────────────────────────────────────── */
      letterSpacing: {
        display: '0.05em',
      },
    },
  },
  plugins: [],
};

export default config;
