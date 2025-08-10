/**
 * 🎨 Authentication Layout for Next.js Vibecoding
 * 
 * Shared layout for login and registration pages.
 * Clean, centered design with branding and responsive layout.
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Template - Autenticação',
    default: 'Autenticação | Template',
  },
  description: 'Faça login ou crie sua conta no Template para acessar todos os recursos da plataforma.',
  robots: {
    index: false,
    follow: false,
  },
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="flex flex-col min-h-screen">
        {/* Header with logo */}
        <header className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Link 
              href="/" 
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="relative w-10 h-10">
                <Image
                  src="/images/logo.png"
                  alt="Template Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-primary">
                  Template
                </h1>
                <p className="text-xs text-muted-foreground">
                  Gestão Inteligente
                </p>
              </div>
            </Link>
            
            {/* Back to home link */}
            <Link 
              href="/" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Voltar ao início
            </Link>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            {/* Decorative elements */}
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
              <div className="absolute -top-6 -right-8 w-16 h-16 bg-cyan-200/20 rounded-full blur-lg" />
              
              {/* Main content */}
              <div className="relative z-10">
                {children}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              {/* Links */}
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <Link 
                  href="/terms" 
                  className="hover:text-foreground transition-colors"
                >
                  Termos de Uso
                </Link>
                <Link 
                  href="/privacy" 
                  className="hover:text-foreground transition-colors"
                >
                  Política de Privacidade
                </Link>
                <Link 
                  href="/help" 
                  className="hover:text-foreground transition-colors"
                >
                  Ajuda
                </Link>
              </div>
              
              {/* Copyright */}
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Template. Todos os direitos reservados.
              </p>
              
              {/* Security notice */}
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <svg 
                  className="w-4 h-4 text-green-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                  />
                </svg>
                <span>Conexão segura e criptografada</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

/**
 * Alternative minimal layout for auth pages
 */
export function MinimalAuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <Image
                src="/images/logo.png"
                alt="Template"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-gray-900">Template</span>
          </Link>
        </div>
        
        {/* Content */}
        {children}
      </div>
    </div>
  );
}