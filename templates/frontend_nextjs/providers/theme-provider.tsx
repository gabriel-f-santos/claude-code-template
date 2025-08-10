/**
 * 🎨 Theme Provider for Next.js Vibecoding
 * 
 * Dark/Light theme provider using next-themes.
 * Perfect for rapid development and user experience.
 */

'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}