import '@/styles/globals.css';

import { Poppins } from 'next/font/google';

import { JsonLd } from '@/components/atoms/seo/JsonLd';
import { metadata, siteConfig } from './metadata';
import { AppProviders } from './providers';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.locale} className={poppins.variable} suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body className="font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
