import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
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
