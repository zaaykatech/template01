import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
import PWARegister from '../components/PWARegister';

export const metadata: Metadata = {
  title: 'Menu Magic',
  description: 'Cafe 9:50',
  manifest: '/manifest.json',
  icons: {
    apple: '/logo.png',
  },
  appleWebApp: {
    capable: true,
    title: 'Cafe 950',
    statusBarStyle: 'default',
  },
};

export const viewport = {
  themeColor: '#3B82F6',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@200;300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className={`${inter.variable} ${playfair.variable} font-sans text-foreground antialiased selection:bg-primary selection:text-primary-foreground pb-32`}>
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
