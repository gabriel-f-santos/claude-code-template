/**
 * 🔐 Login Page for Next.js Vibecoding
 * 
 * User authentication page with form validation and error handling.
 * Implements the login workflow following API contracts.
 */

import React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';

import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Faça login na sua conta Template para acessar todos os recursos da plataforma.',
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Loading fallback for the login form
 */
function LoginFormSkeleton() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Carregando formulário de login...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Login Page Component
 */
export default function LoginPage() {
  return (
    <div className="w-full">
      {/* SEO and Social Meta Tags */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Login - Template",
            "description": "Página de login do Template",
            "url": `${process.env.NEXT_PUBLIC_APP_URL}/login`,
            "isPartOf": {
              "@type": "WebSite",
              "name": "Template",
              "url": process.env.NEXT_PUBLIC_APP_URL
            }
          })
        }}
      />

      {/* Login Form with Suspense */}
      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm 
          showRegisterLink={true}
          redirectTo="/dashboard"
        />
      </Suspense>

      {/* Additional login options (future features) */}
      <div className="mt-8 text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Outras opções
            </span>
          </div>
        </div>

        {/* Social login buttons (future implementation) */}
        <div className="mt-6 grid grid-cols-1 gap-3">
          {/* Google login placeholder */}
          <button
            disabled
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-200 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 opacity-50 cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar com Google (Em breve)
          </button>

          {/* GitHub login placeholder */}
          <button
            disabled
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-200 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 opacity-50 cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continuar com GitHub (Em breve)
          </button>
        </div>

        {/* Help text */}
        <p className="mt-6 text-xs text-muted-foreground">
          Problemas para fazer login?{' '}
          <a 
            href="mailto:suporte@Template.com" 
            className="text-primary hover:underline"
          >
            Entre em contato conosco
          </a>
        </p>
      </div>
    </div>
  );
}

/**
 * Generate static params for potential static generation
 * (currently not needed but good for future optimization)
 */
export function generateStaticParams() {
  return [];
}