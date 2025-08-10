/**
 * 🎨 Root Layout - Next.js Vibecoding
 * 
 * Main app layout with providers and global configuration.
 * Perfect for rapid development and live coding sessions.
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { ToastProvider } from '@/providers/toast-provider';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: 'Next.js Vibecoding App',
    template: '%s | Vibecoding',
  },
  description: '🚀 Next.js Vibecoding Template - Perfect for rapid frontend development with Claude Code',
  keywords: [
    'Next.js',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Radix UI',
    'Vibecoding',
    'Claude Code',
  ],
  authors: [
    {
      name: 'Vibecoding Team',
      url: 'https://github.com/vibecoding',
    },
  ],
  creator: 'Vibecoding Team',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nextjs-vibecoding.vercel.app',
    title: 'Next.js Vibecoding App',
    description: '🚀 Perfect for rapid frontend development with Claude Code',
    siteName: 'Next.js Vibecoding',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js Vibecoding App',
    description: '🚀 Perfect for rapid frontend development with Claude Code',
    creator: '@vibecoding',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider>
              <main className="relative flex min-h-screen flex-col">
                {children}
              </main>
            </ToastProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}