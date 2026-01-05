import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TradeMind - Trading Discipline & Performance Tracker',
  description: 'A web application to help intraday traders maintain discipline, track performance, manage risk, and improve consistency.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="trademind-theme">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
