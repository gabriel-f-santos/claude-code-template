/**
 * 🛡️ Auth Guard Component for Next.js Vibecoding
 * 
 * Protects routes and components from unauthorized access.
 * Redirects unauthenticated users to login page.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useAuth, useAuthStore } from '@/store/auth-store';
import { useCurrentUser } from '@/hooks/use-api';
import type { AuthGuardProps } from '@/types/auth';

/**
 * AuthGuard Component
 * 
 * Protects routes and components from unauthorized access.
 * Shows loading state while checking authentication.
 * Redirects to login if not authenticated.
 */
export function AuthGuard({
  children,
  redirectTo = '/login',
  requireAuth = true,
  fallback
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  
  // Query current user to validate token
  const { 
    data: currentUser, 
    isLoading: userLoading, 
    error: userError,
    refetch: refetchUser
  } = useCurrentUser();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      // If we don't require auth, allow access immediately
      if (!requireAuth) {
        setIsChecking(false);
        return;
      }

      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(pathname)}`;
        router.push(loginUrl);
        return;
      }

      // If we have a token but no user data, wait for user query
      if (isAuthenticated && !user && !userError) {
        // Still loading user data
        return;
      }

      // If user query failed with 401, token is invalid
      if (userError && (userError as any).status === 401) {
        // Token is invalid, logout and redirect
        const { logout } = useAuthStore.getState();
        logout();
        const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(pathname)}`;
        router.push(loginUrl);
        return;
      }

      // All checks passed
      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, user, userError, requireAuth, redirectTo, pathname, router]);

  // Show loading state while checking authentication
  if (authLoading || userLoading || isChecking) {
    return fallback || <AuthLoadingFallback />;
  }

  // Show error state if user query failed (but not 401)
  if (userError && (userError as any).status !== 401) {
    return (
      <AuthErrorFallback 
        error={userError}
        onRetry={() => refetchUser()}
      />
    );
  }

  // If we don't require auth, or user is authenticated, show children
  if (!requireAuth || (isAuthenticated && user)) {
    return <>{children}</>;
  }

  // Fallback - should not reach here due to redirects
  return fallback || <AuthLoadingFallback />;
}

/**
 * Loading fallback component
 */
function AuthLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-sm text-muted-foreground">
            Verificando autenticação...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Error fallback component
 */
function AuthErrorFallback({ 
  error, 
  onRetry 
}: { 
  error: any; 
  onRetry: () => void; 
}) {
  const getErrorMessage = (error: any): string => {
    if (error.status >= 500) {
      return 'Erro no servidor. Tente novamente.';
    }
    
    if (error.status === 403) {
      return 'Acesso negado. Você não tem permissão para acessar esta página.';
    }
    
    return error.message || 'Erro inesperado. Tente novamente.';
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-red-600">
            Erro de Autenticação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {getErrorMessage(error)}
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col space-y-2">
            <Button onClick={onRetry} variant="outline" className="w-full">
              Tentar Novamente
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/login'}
              className="w-full"
            >
              Ir para Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * HOC version of AuthGuard for easier usage
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<AuthGuardProps, 'children'>
) {
  const AuthGuardedComponent = (props: P) => {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };

  AuthGuardedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name})`;

  return AuthGuardedComponent;
}

/**
 * Hook for checking authentication in components
 */
export function useAuthGuard(requireAuth: boolean = true) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { error: userError } = useCurrentUser();
  
  return {
    isAuthenticated: requireAuth ? isAuthenticated && !!user : true,
    isLoading,
    hasError: !!userError,
    user,
  };
}

/**
 * Component for protecting sections within a page
 */
export function ProtectedSection({
  children,
  fallback,
  requireAuth = true,
  className
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
  className?: string;
}) {
  const { isAuthenticated } = useAuthGuard(requireAuth);
  
  if (!requireAuth || isAuthenticated) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }
  
  return (
    <div className={className}>
      {fallback || (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Você precisa estar logado para ver este conteúdo.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default AuthGuard;