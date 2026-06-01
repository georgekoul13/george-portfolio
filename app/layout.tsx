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
} from 'next/font/google';
import './globals.css';
import ClientProviders from '@/components/ClientProviders';

const montserrat     = Montserrat({      subsets: ['latin'], weight: ['300','400','500','800','900'], variable: '--font-montserrat',  display: 'swap' });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], weight: ['400'],                  variable: '--font-playfair',    display: 'swap' });
const righteous      = Righteous({        subsets: ['latin'], weight: ['400'],                  variable: '--font-righteous',   display: 'swap' });
const boogaloo       = Boogaloo({         subsets: ['latin'], weight: ['400'],                  variable: '--font-boogaloo',    display: 'swap' });
const abrilFatface   = Abril_Fatface({    subsets: ['latin'], weight: ['400'],                  variable: '--font-abril',       display: 'swap' });
const pacifico       = Pacifico({         subsets: ['latin'], weight: ['400'],                  variable: '--font-pacifico',    display: 'swap' });
const blackOpsOne    = Black_Ops_One({    subsets: ['latin'], weight: ['400'],                  variable: '--font-black-ops',   display: 'swap' });
const satisfy        = Satisfy({          subsets: ['latin'], weight: ['400'],                  variable: '--font-satisfy',     display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  ),
  title:       'George Koulouris Portfolio',
  description: 'Product design, UX, UI, Creative Direction, Illustrations - Based in Greece',
  openGraph: {
    title:       'George Koulouris Portfolio',
    description: 'Product design, UX, UI, Creative Direction, Illustrations - Based in Greece',
    url:         'https://georgekoulouris.com',
    siteName:    'George Koulouris',
    images: [
      {
        url:    '/og-image.jpg',
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
    images:      ['/og-image.jpg'],
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
    ].join(' ')}>
      <body className="font-sans antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
