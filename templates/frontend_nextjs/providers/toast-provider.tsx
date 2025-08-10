/**
 * 🔔 Toast Provider for Next.js Vibecoding
 * 
 * Simple toast notification provider.
 * Can be enhanced with libraries like sonner or react-hot-toast.
 */

'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X } from 'lucide-react';

interface Toast {
  id: string;
  title?: string;
  description: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2);
    const newToast: Toast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((description: string, title?: string) => {
    addToast({ title, description, variant: 'success' });
  }, [addToast]);

  const error = useCallback((description: string, title?: string) => {
    addToast({ title, description, variant: 'error' });
  }, [addToast]);

  const warning = useCallback((description: string, title?: string) => {
    addToast({ title, description, variant: 'warning' });
  }, [addToast]);

  const info = useCallback((description: string, title?: string) => {
    addToast({ title, description, variant: 'default' });
  }, [addToast]);

  const getToastStyles = (variant: Toast['variant']) => {
    switch (variant) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-white border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200';
    }
  };

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      success,
      error,
      warning,
      info,
    }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              max-w-sm w-full p-4 rounded-lg border shadow-lg transition-all duration-300
              animate-in slide-in-from-top-2 fade-in-0
              ${getToastStyles(toast.variant)}
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {toast.title && (
                  <h4 className="font-medium text-sm mb-1">
                    {toast.title}
                  </h4>
                )}
                <p className="text-sm">
                  {toast.description}
                </p>
              </div>
              
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-2 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}