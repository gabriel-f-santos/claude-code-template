/**
 * 🎨 UI Store for Next.js Vibecoding
 * 
 * Zustand store for UI state management (theme, sidebar, modals, etc.).
 * Perfect for managing global UI state in rapid development.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Layout
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Modals and overlays
  modals: {
    userProfile: boolean;
    createProduct: boolean;
    deleteConfirm: boolean;
  };
  
  // Loading states
  globalLoading: boolean;
  
  // Search
  searchOpen: boolean;
  
  // Notifications/Toast settings
  notifications: {
    enabled: boolean;
    position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  };

  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openModal: (modalName: keyof UIState['modals']) => void;
  closeModal: (modalName: keyof UIState['modals']) => void;
  closeAllModals: () => void;
  setGlobalLoading: (loading: boolean) => void;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
  updateNotificationSettings: (settings: Partial<UIState['notifications']>) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      sidebarOpen: true,
      sidebarCollapsed: false,
      modals: {
        userProfile: false,
        createProduct: false,
        deleteConfirm: false,
      },
      globalLoading: false,
      searchOpen: false,
      notifications: {
        enabled: true,
        position: 'top-right',
      },

      // Actions
      setTheme: (theme) => {
        set({ theme });
        
        // Apply theme to document
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement;
          root.classList.remove('light', 'dark');
          
          if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
          } else {
            root.classList.add(theme);
          }
        }
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      toggleSidebarCollapsed: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },

      openModal: (modalName) => {
        set((state) => ({
          modals: {
            ...state.modals,
            [modalName]: true,
          },
        }));
      },

      closeModal: (modalName) => {
        set((state) => ({
          modals: {
            ...state.modals,
            [modalName]: false,
          },
        }));
      },

      closeAllModals: () => {
        set({
          modals: {
            userProfile: false,
            createProduct: false,
            deleteConfirm: false,
          },
        });
      },

      setGlobalLoading: (loading) => {
        set({ globalLoading: loading });
      },

      toggleSearch: () => {
        set((state) => ({ searchOpen: !state.searchOpen }));
      },

      setSearchOpen: (open) => {
        set({ searchOpen: open });
      },

      updateNotificationSettings: (settings) => {
        set((state) => ({
          notifications: {
            ...state.notifications,
            ...settings,
          },
        }));
      },
    }),
    {
      name: 'ui-store', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist certain UI preferences
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        notifications: state.notifications,
      }),
    }
  )
);

// Helper hooks for common UI operations
export const useTheme = () => {
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);
  return { theme, setTheme };
};

export const useSidebar = () => {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const toggleSidebarCollapsed = useUIStore((state) => state.toggleSidebarCollapsed);
  const setSidebarCollapsed = useUIStore((state) => state.setSidebarCollapsed);
  
  return {
    sidebarOpen,
    sidebarCollapsed,
    toggleSidebar,
    setSidebarOpen,
    toggleSidebarCollapsed,
    setSidebarCollapsed,
  };
};

export const useModals = () => {
  const modals = useUIStore((state) => state.modals);
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);
  const closeAllModals = useUIStore((state) => state.closeAllModals);
  
  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
  };
};

export const useGlobalLoading = () => {
  const globalLoading = useUIStore((state) => state.globalLoading);
  const setGlobalLoading = useUIStore((state) => state.setGlobalLoading);
  return { globalLoading, setGlobalLoading };
};

export const useSearch = () => {
  const searchOpen = useUIStore((state) => state.searchOpen);
  const toggleSearch = useUIStore((state) => state.toggleSearch);
  const setSearchOpen = useUIStore((state) => state.setSearchOpen);
  return { searchOpen, toggleSearch, setSearchOpen };
};