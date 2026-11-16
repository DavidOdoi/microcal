import './globals.css';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MicroFinancePost',
  description: 'Free calculators for mortgages, debt, budgeting, taxes, retirement and savings.',
  icons: {
    icon: [
      { url: '/favicon.ico?v=money-1', type: 'image/x-icon', sizes: '16x16 32x32 48x48 64x64 128x128 256x256' },
      { url: '/favicon.png?v=money-1', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico?v=money-1',
    apple: [{ url: '/apple-touch-icon.png?v=money-1', type: 'image/png', sizes: '180x180' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
