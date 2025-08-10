/**
 * 🔐 Login Form Component for Next.js Vibecoding
 * 
 * Modern login form with validation, error handling, and responsive design.
 * Built with shadcn/ui components and Zod validation.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { useLogin } from '@/hooks/use-api';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import type { AuthError } from '@/types/auth';

interface LoginFormProps {
  className?: string;
  redirectTo?: string;
  showRegisterLink?: boolean;
}

export function LoginForm({ 
  className,
  redirectTo = '/dashboard',
  showRegisterLink = true
}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  
  // Check for success messages from registration
  const registrationSuccess = searchParams?.get('message') === 'registration-success';
  
  // React Hook Form setup
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // TanStack Query mutation
  const loginMutation = useLogin();

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      // Redirect is handled by the useLogin hook
    } catch (error) {
      // Error handling is managed by the mutation
      console.error('Login error:', error);
    }
  };

  // Get error message from mutation
  const getErrorMessage = (error: any): string => {
    if (!error) return '';
    
    if (error.status === 401) {
      return 'Email ou senha incorretos. Verifique suas credenciais.';
    }
    
    if (error.status === 429) {
      return 'Muitas tentativas de login. Tente novamente em alguns minutos.';
    }
    
    if (error.status >= 500) {
      return 'Erro no servidor. Tente novamente mais tarde.';
    }
    
    return error.message || 'Erro inesperado. Tente novamente.';
  };

  return (
    <div className={className}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Fazer Login
          </CardTitle>
          <CardDescription className="text-center">
            Entre com seu email e senha para acessar sua conta
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Success message for registration */}
          {registrationSuccess && (
            <Alert variant="success">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Conta criada com sucesso! Faça login para continuar.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Error alert */}
          {loginMutation.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {getErrorMessage(loginMutation.error)}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="seu@email.com"
                        autoComplete="email"
                        disabled={loginMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Digite sua senha"
                          autoComplete="current-password"
                          disabled={loginMutation.isPending}
                          className="pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loginMutation.isPending}
                          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        {/* Footer with register link */}
        {showRegisterLink && (
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center">
              Não tem uma conta?{' '}
              <Link 
                href="/register" 
                className="text-primary hover:underline font-medium"
              >
                Cadastre-se
              </Link>
            </div>
            
            {/* Forgot password link (future feature) */}
            <div className="text-sm text-muted-foreground text-center">
              <Link 
                href="/forgot-password" 
                className="text-primary hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default LoginForm;