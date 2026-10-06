import type { Metadata } from 'next';
import { Cairo, Inter } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic', 'latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Morocco Administrative Directory | دليل التقسيم الإداري للمملكة المغربية',
  description: 'Official Morocco Administrative Directory based on HCP RGPH 2024 census. 12 Regions, 75 Provinces & Prefectures, 1,503 Communes.',
  keywords: ['Morocco', 'Regions', 'Provinces', 'Communes', 'HCP', 'RGPH 2024', 'Open Data', 'المغرب', 'الجهات', 'الجماعات'],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <body className={`${inter.variable} ${cairo.variable} font-sans antialiased bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 min-h-screen`}>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
