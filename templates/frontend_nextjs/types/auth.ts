/**
 * 🔐 Authentication Types for Next.js Vibecoding
 * 
 * TypeScript interfaces and types for authentication system.
 * Following API contract specifications for perfect integration.
 */

import type { AuthResponse, User, UserRegister, UserLogin, RefreshTokenResponse, UserUpdate, PasswordChange, MessageResponse } from '@/lib/api';
import type React from 'react';

// Re-export types from API client for consistency
export type { 
  User, 
  UserLogin, 
  UserRegister, 
  AuthResponse, 
  RefreshTokenResponse,
  UserUpdate,
  PasswordChange,
  MessageResponse
} from '@/lib/api';

// Extended authentication state types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

// Authentication error types
export interface AuthError {
  message: string;
  field?: string;
  code?: string;
  status?: number;
}

// Form submission states
export interface AuthFormState {
  isLoading: boolean;
  error: AuthError | null;
  success: boolean;
}

// Login form state
export interface LoginFormState extends AuthFormState {
  data: {
    email: string;
    password: string;
  };
}

// Register form state
export interface RegisterFormState extends AuthFormState {
  data: {
    email: string;
    password: string;
    confirm_password: string;
  };
}

// User profile form state
export interface ProfileFormState extends AuthFormState {
  data: {
    email?: string;
  };
}

// Password change form state
export interface PasswordChangeFormState extends AuthFormState {
  data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  };
}

// Auth guard props
export interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
}

// User menu props
export interface UserMenuProps {
  user: User;
  onLogout?: () => void;
  className?: string;
}

// Authentication context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserRegister) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: UserUpdate) => Promise<void>;
  changePassword: (passwordData: PasswordChange) => Promise<void>;
  clearError: () => void;
}

// Token payload type (for JWT decoding)
export interface TokenPayload {
  user_public_id: string; // UUID v4 do usuário
  email: string;
  exp: number;
  iat: number;
}

// Auth storage interface
export interface AuthStorage {
  setToken: (token: string) => void;
  getToken: () => string | null;
  removeToken: () => void;
  setUser: (user: User) => void;
  getUser: () => User | null;
  removeUser: () => void;
  clear: () => void;
}

// Protected route configuration
export interface ProtectedRouteConfig {
  path: string;
  requireAuth: boolean;
  redirectTo?: string;
  roles?: string[];
}

// Auth API response types
export interface LoginApiResponse {
  success: boolean;
  data?: AuthResponse;
  error?: AuthError;
}

export interface RegisterApiResponse {
  success: boolean;
  data?: User;
  error?: AuthError;
}

export interface ProfileApiResponse {
  success: boolean;
  data?: User;
  error?: AuthError;
}

// Form validation error type
export interface FormFieldError {
  field: string;
  message: string;
}

// Auth hook return types
export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: UserLogin) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export interface UseLoginReturn {
  mutate: (credentials: UserLogin) => void;
  mutateAsync: (credentials: UserLogin) => Promise<AuthResponse>;
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
  data: AuthResponse | undefined;
}

export interface UseRegisterReturn {
  mutate: (userData: UserRegister) => void;
  mutateAsync: (userData: UserRegister) => Promise<User>;
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
  data: User | undefined;
}

// Session management types
export interface UserSession {
  user: User;
  token: string;
  expiresAt: Date;
  refreshToken?: string;
}

// Auth provider props
export interface AuthProviderProps {
  children: React.ReactNode;
}

// Route protection levels
export enum AuthLevel {
  PUBLIC = 'public',
  AUTHENTICATED = 'authenticated',
  ADMIN = 'admin',
}

// User roles (if needed for future)
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

// Auth events for analytics/tracking
export interface AuthEvent {
  type: 'login' | 'logout' | 'register' | 'profile_update' | 'password_change';
  userId?: string; // UUID v4
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Password strength indicator
export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isValid: boolean;
}

// Two-factor authentication (future)
export interface TwoFactorAuth {
  enabled: boolean;
  method: 'sms' | 'email' | 'app';
  verified: boolean;
}

// Social login providers (future)
export interface SocialProvider {
  name: 'google' | 'facebook' | 'github';
  clientId: string;
  redirectUri: string;
}

// Account verification
export interface AccountVerification {
  email_verified: boolean;
  phone_verified: boolean;
  identity_verified: boolean;
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}