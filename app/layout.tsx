import type { Metadata } from 'next';
import {
  Montserrat,
  Playfair_Display,
  Righteous,
  Boogaloo,
  Abril_Fatface,
  Pacifico,
  Black_Ops_One,
  Satisfy,
  Courier_Prime,
} from 'next/font/google';
import './globals.css';
import ClientProviders from '@/components/ClientProviders';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { AUTHOR, OG, SITE } from '@/lib/seo';

/**
 * NINE families are declared, and only TWO are on the critical path.
 *
 * Vol 2 sets everything in Montserrat, with Courier Prime for the ID card's
 * small print. The other seven belong to vol1's fun mode. `next/font` preloads
 * every family it is given, so a Vol 2 page was pulling ten font files —
 * 180KB — before it could paint, seven of them for type it never sets.
 *
 * `preload: false` keeps them declared and available: vol1 still resolves its
 * CSS variables and fetches the file when it actually uses one. It only stops
 * them being demanded up front. They can be deleted outright once Vol 2 takes
 * over the site and vol1's fun mode goes with it.
 */
const montserrat     = Montserrat({      subsets: ['latin'], weight: ['300','400','500','600','700','800','900'], variable: '--font-montserrat',  display: 'swap' });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], weight: ['400'],                  variable: '--font-playfair',    display: 'swap' , preload: false });
const righteous      = Righteous({        subsets: ['latin'], weight: ['400'],                  variable: '--font-righteous',   display: 'swap' , preload: false });
const boogaloo       = Boogaloo({         subsets: ['latin'], weight: ['400'],                  variable: '--font-boogaloo',    display: 'swap' , preload: false });
const abrilFatface   = Abril_Fatface({    subsets: ['latin'], weight: ['400'],                  variable: '--font-abril',       display: 'swap' , preload: false });
const pacifico       = Pacifico({         subsets: ['latin'], weight: ['400'],                  variable: '--font-pacifico',    display: 'swap' , preload: false });
const blackOpsOne    = Black_Ops_One({    subsets: ['latin'], weight: ['400'],                  variable: '--font-black-ops',   display: 'swap' , preload: false });
const satisfy        = Satisfy({          subsets: ['latin'], weight: ['400'],                  variable: '--font-satisfy',     display: 'swap' , preload: false });
/* The vol2 ID card sets its small print in Courier Prime — Figma 92:4429. */
const courierPrime   = Courier_Prime({    subsets: ['latin'], weight: ['400','700'],          variable: '--font-courier',     display: 'swap' });

/**
 * The SITE-WIDE fallback, for a page that states no metadata of its own.
 *
 * Every real page overrides these — `lib/seo.ts` gives the home page, the
 * three categories and all nineteen projects their own title and
 * description. The one page left reading this is the 404, which cannot
 * export metadata because `app/not-found.tsx` has to be a client component.
 *
 * So it was still saying vol1's line, in vol1's voice, months after vol1
 * stopped being the site: "George Koulouris Portfolio / Product design, UX,
 * UI, Creative Direction, Illustrations - Based in Greece". Nobody would
 * ever have caught it by looking at the site, because it is visible on
 * exactly one page nobody visits on purpose.
 */
const DEFAULT_TITLE = `${AUTHOR} — Product & Visual Designer`;
const DEFAULT_DESCRIPTION =
  'George Koulouris designs products, brands and the things around them — '
  + 'apps, insurance platforms, identities, posters and type. Based in Greece.';

export const metadata: Metadata = {
  /* THE CANONICAL HOST, always. Every relative image in this file and in
     `lib/seo.ts` is resolved against it, so when it fell back to
     `localhost:3000` the share card in a preview build pointed at a machine
     nobody else can reach — the one thing about a share card that has to be
     right. `SITE` is the same constant the canonicals and the sitemap use,
     so they cannot drift apart; an env var can still override it for a
     staging host that genuinely needs its own. */
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? SITE),
  title:       DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title:       DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    /* `SITE`, not the bare host typed out. The literal here said
       `https://georgekoulouris.com`, which 307-redirects to the `www` one
       every canonical on the site points at — so the share card and the
       canonical named two different origins. */
    url:         SITE,
    siteName:    'George Koulouris',
    images: [
      {
        url:    OG,
        width:  1200,
        height: 630,
        alt:    DEFAULT_TITLE,
      },
    ],
    locale: 'en_US',
    type:   'website',
  },
  twitter: {
    card:        'summary_large_image',
    title:       DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images:      [OG],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[
      montserrat.variable,
      playfairDisplay.variable,
      righteous.variable,
      boogaloo.variable,
      abrilFatface.variable,
      pacifico.variable,
      blackOpsOne.variable,
      satisfy.variable,
      courierPrime.variable,
    ].join(' ')}>
      <body className="font-sans antialiased">
        <ClientProviders>{children}</ClientProviders>

        {/* ── WHO CAME, AND FROM WHERE ─────────────────────────────────
            George: *"i want analytics, so we can know how many people
            visited the website, what the did, for how long."*

            Vercel's own, which is the whole reason it is these two and not
            Google: it sets NO COOKIES, so the site needs no consent banner.
            He is in Greece; GA4 would mean a modal in front of the loading
            curtain and 45KB of script against the 87KB the whole site
            currently ships, to measure a few hundred visits.

            Free on Hobby to 50,000 events a month, which this will not
            approach. What it answers: how many people, where they came
            from (LinkedIn, search, direct), which projects they opened,
            on what. What it does NOT answer, and he should not read into
            it: session duration — Hobby does not report it, and on this
            site it would lie anyway, because the curtain holds the page up
            to 3.5s before anything is readable and `PanelStack` makes
            scroll distance mean nothing about how far anyone read.

            `SpeedInsights` is the Core Web Vitals half, measured from real
            visitors rather than from a laptop on a fast connection — the
            only honest read on whether the curtain is costing him.

            Both must ALSO be switched on in the Vercel dashboard; the
            component alone collects nothing. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
