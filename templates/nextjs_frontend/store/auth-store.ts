/**
 * 🔐 Auth Store for Next.js Vibecoding
 * 
 * Zustand store for authentication state management.
 * Simple, reactive, and perfect for rapid development.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authStorage, type User } from '@/lib/api';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  
  // Getters
  getUserId: () => number | null;
  getUserName: () => string | null;
  getToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: (user: User, token: string) => {
        // Store token in localStorage
        authStorage.setToken(token);
        
        // Update store state
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        // Remove token from localStorage
        authStorage.removeToken();
        
        // Clear store state
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (updatedFields: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updatedFields },
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Getters
      getUserId: () => get().user?.id || null,
      
      getUserName: () => get().user?.name || null,
      
      getToken: () => authStorage.getToken(),
    }),
    {
      name: 'auth-store', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist user data and auth status, not loading state
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Rehydrate auth state on app load
      onRehydrateStorage: () => (state) => {
        // Check if token still exists in localStorage
        const token = authStorage.getToken();
        if (!token && state) {
          // Token was removed externally, clear auth state
          state.user = null;
          state.isAuthenticated = false;
        }
      },
    }
  )
);

// Helper hooks for common auth operations
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login: store.login,
    logout: store.logout,
    updateUser: store.updateUser,
    setLoading: store.setLoading,
  };
};

// Selector hooks for better performance
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);