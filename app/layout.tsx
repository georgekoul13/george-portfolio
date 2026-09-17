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
import { OG, SITE } from '@/lib/seo';

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

export const metadata: Metadata = {
  /* THE CANONICAL HOST, always. Every relative image in this file and in
     `lib/seo.ts` is resolved against it, so when it fell back to
     `localhost:3000` the share card in a preview build pointed at a machine
     nobody else can reach — the one thing about a share card that has to be
     right. `SITE` is the same constant the canonicals and the sitemap use,
     so they cannot drift apart; an env var can still override it for a
     staging host that genuinely needs its own. */
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? SITE),
  title:       'George Koulouris Portfolio',
  description: 'Product design, UX, UI, Creative Direction, Illustrations - Based in Greece',
  openGraph: {
    title:       'George Koulouris Portfolio',
    description: 'Product design, UX, UI, Creative Direction, Illustrations - Based in Greece',
    url:         'https://georgekoulouris.com',
    siteName:    'George Koulouris',
    images: [
      {
        url:    OG,
        width:  1200,
        height: 630,
        alt:    'George Koulouris Portfolio',
      },
    ],
    locale: 'en_US',
    type:   'website',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'George Koulouris Portfolio',
    description: 'Product design, UX, UI, Creative Direction, Illustrations - Based in Greece',
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
      </body>
    </html>
  );
}
