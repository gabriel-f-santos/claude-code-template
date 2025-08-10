/**
 * 📝 Register Page for Next.js Vibecoding
 * 
 * User registration page with form validation and error handling.
 * Implements the registration workflow following API contracts.
 */

import React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';

import { RegisterForm } from '@/components/auth/register-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Criar Conta',
  description: 'Crie sua conta Template gratuitamente.',
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Loading fallback for the register form
 */
function RegisterFormSkeleton() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Carregando formulário de cadastro...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Register Page Component
 */
export default function RegisterPage() {
  return (
    <div className="w-full space-y-8">
      {/* SEO and Social Meta Tags */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Criar Conta - Template",
            "description": "Página de cadastro do Template",
            "url": `${process.env.NEXT_PUBLIC_APP_URL}/register`,
            "isPartOf": {
              "@type": "WebSite",
              "name": "Template",
              "url": process.env.NEXT_PUBLIC_APP_URL
            }
          })
        }}
      />

      {/* Benefits section */}
      <Card className="w-full max-w-md mx-auto bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-center text-primary flex items-center justify-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Junte-se ao Template</span>
          </CardTitle>
          <CardDescription className="text-center">
            Comece gratuitamente e tenha acesso a todos os benefícios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Template</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Template</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Template</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Template</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Register Form with Suspense */}
      <Suspense fallback={<RegisterFormSkeleton />}>
        <RegisterForm 
          showLoginLink={true}
        />
      </Suspense>

      {/* Security and privacy information */}
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Privacy notice */}
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Seus dados estão seguros. Utilizamos criptografia avançada e 
                não compartilhamos informações pessoais com terceiros.
              </AlertDescription>
            </Alert>

            {/* Terms and Privacy */}
            <div className="text-xs text-muted-foreground text-center space-y-2">
              <p>
                Ao criar uma conta, você concorda com nossos{' '}
                <Link 
                  href="/terms" 
                  className="text-primary hover:underline"
                >
                  Termos de Serviço
                </Link>{' '}
                e{' '}
                <Link 
                  href="/privacy" 
                  className="text-primary hover:underline"
                >
                  Política de Privacidade
                </Link>.
              </p>
              
              <p>
                Protegemos sua privacidade e respeitamos a LGPD.
              </p>
            </div>

            {/* Contact support */}
            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Precisa de ajuda?{' '}
                <a 
                  href="mailto:suporte@template.com" 
                  className="text-primary hover:underline"
                >
                  Entre em contato
                </a>{' '}
                ou acesse nossa{' '}
                <Link 
                  href="/help" 
                  className="text-primary hover:underline"
                >
                  central de ajuda
                </Link>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional registration options (future features) */}
      <div className="text-center">
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

        {/* Social registration buttons (future implementation) */}
        <div className="mt-6 grid grid-cols-1 gap-3 max-w-md mx-auto">
          {/* Google registration placeholder */}
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
            Cadastrar com Google (Em breve)
          </button>

          {/* Microsoft registration placeholder */}
          <button
            disabled
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-200 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 opacity-50 cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M0 0h11.377v11.372H0zm12.623 0H24v11.372H12.623zM0 12.623h11.377V24H0zm12.623 0H24V24H12.623"/>
            </svg>
            Cadastrar com Microsoft (Em breve)
          </button>
        </div>

        {/* Enterprise signup */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg max-w-md mx-auto">
          <h3 className="font-medium text-sm mb-2">Para empresas</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Precisa de recursos avançados, múltiplos usuários ou suporte dedicado?
          </p>
          <Link 
            href="/enterprise"
            className="inline-flex items-center justify-center text-xs bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
          >
            Conhecer planos empresariais
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Generate static params for potential static generation
 */
export function generateStaticParams() {
  return [];
}