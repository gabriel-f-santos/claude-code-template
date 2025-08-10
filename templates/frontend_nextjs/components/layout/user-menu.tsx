/**
 * 👤 User Menu Component for Next.js Vibecoding
 * 
 * Dropdown menu with user info, profile actions, and logout.
 * Built with shadcn/ui components for consistency.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  Bell,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { useLogout } from '@/hooks/use-api';
import { useAuth } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import type { UserMenuProps } from '@/types/auth';

export function UserMenu({ 
  user, 
  onLogout,
  className 
}: UserMenuProps & { user: any }) {
  const router = useRouter();
  const logoutMutation = useLogout();
  const { isAuthenticated } = useAuth();

  // Don't render if not authenticated or no user
  if (!isAuthenticated || !user) {
    return null;
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      if (onLogout) {
        onLogout();
      } else {
        await logoutMutation.mutateAsync();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name?: string, email?: string): string => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    
    if (email) {
      return email[0].toUpperCase();
    }
    
    return 'U';
  };

  // Get user display name
  const getDisplayName = (): string => {
    return user.full_name || (user.email?.split('@')[0]) || 'Usuário';
  };

  // Format user email for display
  const formatEmail = (email: string): string => {
    if (email.length > 20) {
      return email.slice(0, 17) + '...';
    }
    return email;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "relative h-10 w-auto px-3 rounded-full hover:bg-accent",
            className
          )}
        >
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={user.avatar_url || ''} 
                alt={user.full_name || user.email || 'Avatar'} 
              />
              <AvatarFallback className="text-xs">
                {getUserInitials(user.full_name, user.email)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col items-start text-left max-w-[120px]">
              <span className="text-sm font-medium truncate">
                {getDisplayName()}
              </span>
              {user.email && (
                <span className="text-xs text-muted-foreground truncate">
                  {formatEmail(user.email)}
                </span>
              )}
            </div>
            
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-64" 
        align="end" 
        side="bottom"
        sideOffset={5}
      >
        {/* User info header */}
        <DropdownMenuLabel className="p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={user.avatar_url || ''} 
                alt={user.full_name || user.email || 'Avatar'} 
              />
              <AvatarFallback>
                {getUserInitials(user.full_name, user.email)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col">
              <p className="text-sm font-medium">{getDisplayName()}</p>
              <p className="text-xs text-muted-foreground">
                {user.email}
              </p>
              
              {/* User status badge */}
              <div className="flex items-center space-x-1 mt-1">
                <Badge 
                  variant={user.is_active ? "default" : "secondary"}
                  className="text-xs"
                >
                  {user.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
                
                {user.role === 'admin' && (
                  <Badge variant="destructive" className="text-xs">
                    Admin
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* Profile actions */}
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Meu Perfil
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/notifications" className="cursor-pointer">
            <Bell className="mr-2 h-4 w-4" />
            Notificações
          </Link>
        </DropdownMenuItem>
        
        {/* Admin section */}
        {user.role === 'admin' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin" className="cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                Administração
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        {/* Help and support */}
        <DropdownMenuItem asChild>
          <Link href="/help" className="cursor-pointer">
            <HelpCircle className="mr-2 h-4 w-4" />
            Ajuda e Suporte
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Logout */}
        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {logoutMutation.isPending ? 'Saindo...' : 'Sair'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Simplified UserMenu for mobile/compact layouts
 */
export function CompactUserMenu({ user, onLogout, className }: UserMenuProps & { user: any }) {
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      if (onLogout) {
        onLogout();
      } else {
        await logoutMutation.mutateAsync();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserInitials = (name?: string, email?: string): string => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    
    if (email) {
      return email[0].toUpperCase();
    }
    
    return 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={cn("h-8 w-8 rounded-full", className)}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url || ''} alt={user.full_name || user.email || 'Avatar'} />
            <AvatarFallback className="text-xs">
              {getUserInitials(user.full_name, user.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>
          {user.full_name || user.email?.split('@')[0] || 'Usuário'}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            Perfil
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {logoutMutation.isPending ? 'Saindo...' : 'Sair'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;