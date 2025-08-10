/**
 * 🔐 Auth Store for Next.js Vibecoding
 * 
 * Zustand store for authentication state management.
 * Simple, reactive, and perfect for rapid development.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authStorage, type User } from '@/lib/api';
import { StateCreator, SetState, GetState } from 'zustand';

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
  getUserPublicId: () => string | null; // substitui getUserId numérico
  getToken: () => string | null;
}

const createAuthSlice: StateCreator<AuthState> = (set: SetState<AuthState>, get: GetState<AuthState>) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,

  // Actions
  login: (user: User, token: string) => {
    authStorage.setToken(token);
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    authStorage.removeToken();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  updateUser: (updatedFields: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...updatedFields } });
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  // Getters
  getUserPublicId: () => get().user?.public_id || null,
  getToken: () => authStorage.getToken(),
});

export const useAuthStore = create<AuthState>()(
  persist(createAuthSlice, {
    name: 'auth-store',
    storage: createJSONStorage(() => localStorage),
    partialize: (state: AuthState) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
    }),
    onRehydrateStorage: () => (state: AuthState | undefined) => {
      const token = authStorage.getToken();
      if (!token && state) {
        state.user = null;
        state.isAuthenticated = false;
      }
    },
  })
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
export const useAuthUser = () => useAuthStore((state: AuthState) => state.user);
export const useIsAuthenticated = () => useAuthStore((state: AuthState) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state: AuthState) => state.isLoading);