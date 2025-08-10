/**
 * 📝 Register Form Component for Next.js Vibecoding
 * 
 * Modern registration form with validation, error handling, and responsive design.
 * Built with shadcn/ui components and Zod validation.
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle, Mail, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';

import { useRegister, useCheckEmail } from '@/hooks/use-api';
import { registerSchema, type RegisterFormData, getValidationMessage } from '@/lib/validations';

interface RegisterFormProps {
  className?: string;
  showLoginLink?: boolean;
}

export function RegisterForm({ 
  className,
  showLoginLink = true
}: RegisterFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  // React Hook Form setup
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirm_password: '',
    },
    mode: 'onChange', // Validate on change for better UX
  });

  // TanStack Query mutations
  const registerMutation = useRegister();
  const checkEmailMutation = useCheckEmail();

  // Watch password for strength indicator
  const watchPassword = form.watch('password');

  // Calculate password strength
  useEffect(() => {
    if (!watchPassword) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (watchPassword.length >= 8) strength += 1;
    if (/[a-z]/.test(watchPassword)) strength += 1;
    if (/[A-Z]/.test(watchPassword)) strength += 1;
    if (/\d/.test(watchPassword)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(watchPassword)) strength += 1;

    setPasswordStrength(strength);
  }, [watchPassword]);

  // Handle form submission
  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data);
      // Redirect is handled by the useRegister hook
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  // Real-time email validation
  const handleEmailBlur = async (email: string) => {
    if (email && !getValidationMessage.email(email)) {
      try {
        const result = await checkEmailMutation.mutateAsync(email) as { exists: boolean };
        if (result.exists) {
          form.setError('email', {
            type: 'manual',
            message: 'Este email já está em uso'
          });
        }
      } catch (error) {
        // Ignore validation errors for better UX
      }
    }
  };

  // Get error message from mutation
  const getErrorMessage = (error: any): string => {
    if (!error) return '';
    
    if (error.status === 409) {
      return 'Email ou nome de usuário já estão em uso.';
    }
    
    if (error.status === 429) {
      return 'Muitas tentativas de registro. Tente novamente em alguns minutos.';
    }
    
    if (error.status >= 500) {
      return 'Erro no servidor. Tente novamente mais tarde.';
    }
    
    return error.message || 'Erro inesperado. Tente novamente.';
  };

  // Password strength color
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-blue-500';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return 'Digite uma senha';
      case 1: return 'Muito fraca';
      case 2: return 'Fraca';
      case 3: return 'Regular';
      case 4: return 'Forte';
      case 5: return 'Muito forte';
      default: return '';
    }
  };

  return (
    <div className={className}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Criar Conta
          </CardTitle>
          <CardDescription className="text-center">
            Preencha os dados abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Error alert */}
          {registerMutation.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {getErrorMessage(registerMutation.error)}
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
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="email"
                          placeholder="seu@email.com"
                          autoComplete="email"
                          disabled={registerMutation.isPending}
                          className="pl-10"
                          {...field}
                          onBlur={(e) => {
                            field.onBlur();
                            handleEmailBlur(e.target.value);
                          }}
                        />
                      </div>
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
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Digite sua senha"
                          autoComplete="new-password"
                          disabled={registerMutation.isPending}
                          className="pl-10 pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={registerMutation.isPending}
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
                    
                    {/* Password strength indicator */}
                    {watchPassword && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <FormDescription>
                      Mínimo 8 caracteres com maiúscula, minúscula, número e símbolo.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password field */}
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirme sua senha"
                          autoComplete="new-password"
                          disabled={registerMutation.isPending}
                          className="pl-10 pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={registerMutation.isPending}
                          aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        >
                          {showConfirmPassword ? (
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
                disabled={registerMutation.isPending || passwordStrength < 3}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar Conta'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        {/* Footer with login link */}
        {showLoginLink && (
          <CardFooter>
            <div className="text-sm text-muted-foreground text-center w-full">
              Já tem uma conta?{' '}
              <Link 
                href="/login" 
                className="text-primary hover:underline font-medium"
              >
                Faça login
              </Link>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default RegisterForm;