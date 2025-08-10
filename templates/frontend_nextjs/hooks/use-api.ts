/**
 * 🎣 API Hooks for Next.js Vibecoding
 * 
 * TanStack Query hooks for data fetching and state management.
 * Perfect for rapid development and live coding sessions.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type User, type UserLogin, type UserRegister, type AuthResponse, type UserUpdate, type PasswordChange } from '@/lib/api';
import { authStorage } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth-store';

// Simple toast implementation (can be replaced with a proper toast library)
const toast = {
  success: (message: string) => console.log('✅ Success:', message),
  error: (message: string) => console.error('❌ Error:', message),
};

// Query Keys - Centralized for consistency
export const queryKeys = {
  // Authentication
  auth: ['auth'] as const,
  currentUser: () => [...queryKeys.auth, 'me'] as const,
  
  // Users
  users: ['users'] as const,
  usersList: (params?: any) => [...queryKeys.users, 'list', params] as const,
  user: (public_id: string) => [...queryKeys.users, public_id] as const,
};

// Auth Hooks
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (credentials: UserLogin) => api.auth.login(credentials),
    onSuccess: (data: AuthResponse) => {
      // Update Zustand store
      login(data.user, data.access_token);
      
      // Update cache with user data
      queryClient.setQueryData(queryKeys.currentUser(), data.user);
      
      // Redirect to dashboard
      router.push('/dashboard');
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (userData: UserRegister) => api.auth.register(userData),
    onSuccess: () => {
      // Redirect to login page
      router.push('/login?message=registration-success');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: () => api.auth.logout(),
    onSuccess: () => {
      // Update Zustand store
      logout();
      
      // Clear all cached data
      queryClient.clear();
      
      // Redirect to home
      router.push('/');
    },
    onError: () => {
      // Even if API call fails, logout locally
      logout();
      queryClient.clear();
      router.push('/');
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.currentUser(),
    queryFn: () => api.auth.getCurrentUser(),
    enabled: authStorage.isAuthenticated(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: (userData: UserUpdate) => api.auth.updateProfile(userData),
    onSuccess: (updatedUser) => {
      // Update Zustand store
      updateUser(updatedUser);
      
      // Update cache
      queryClient.setQueryData(queryKeys.currentUser(), updatedUser);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (passwordData: PasswordChange) => api.auth.changePassword(passwordData),
  });
}

export function useRefreshToken() {
  const { updateUser } = useAuth();
  
  return useMutation({
    mutationFn: () => api.auth.refreshToken(),
    onSuccess: (data) => {
      // Update token in storage
      authStorage.setToken(data.access_token);
    },
  });
}

// User Hooks
export function useUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: queryKeys.usersList(params),
    queryFn: () => api.users.getAll(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => api.users.getById(id),
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ public_id, userData }: { public_id: string; userData: Partial<User> }) => 
      api.users.update(public_id, userData as any),
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(queryKeys.user(updatedUser.public_id), updatedUser);
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user');
    }
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (public_id: string) => api.users.delete(public_id),
    onSuccess: (_: void, deletedId: string) => {
      queryClient.removeQueries({ queryKey: queryKeys.user(deletedId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete user');
    }
  });
}

// Product Hooks
export function useProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}) {
  return useQuery({
    queryKey: queryKeys.productsList(params),
    queryFn: () => api.products.getAll(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => api.products.getById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: ProductCreateRequest) => api.products.create(productData),
    onSuccess: () => {
      // Invalidate products list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      
      toast.success('Product created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create product');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, productData }: { id: number; productData: Partial<ProductCreateRequest> }) => 
      api.products.update(id, productData),
    onSuccess: (updatedProduct: Product) => {
      queryClient.setQueryData(queryKeys.product(updatedProduct.id), updatedProduct);
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      
      toast.success('Product updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update product');
    }
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.products.delete(id),
    onSuccess: (_: void, deletedId: number) => {
      queryClient.removeQueries({ queryKey: queryKeys.product(deletedId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      
      toast.success('Product deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete product');
    }
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: queryKeys.productCategories(),
    queryFn: () => api.products.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes (categories don't change often)
  });
}

export function useUpdateProductStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, inStock }: { id: number; inStock: boolean }) => 
      api.products.updateStock(id, inStock),
    onSuccess: (updatedProduct: Product) => {
      queryClient.setQueryData(queryKeys.product(updatedProduct.id), updatedProduct);
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      
      toast.success(`Product ${updatedProduct.inStock ? 'marked as in stock' : 'marked as out of stock'}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update product stock');
    }
  });
}

// Email validation hook
export function useCheckEmail() {
  return useMutation({
    mutationFn: async (email: string) => ({ exists: false }), // Placeholder - implement if needed
  });
}

// Generic refresh hook for manually refetching data
export function useRefreshData() {
  const queryClient = useQueryClient();

  return {
    refreshUsers: () => queryClient.invalidateQueries({ queryKey: queryKeys.users }),
    refreshProducts: () => queryClient.invalidateQueries({ queryKey: queryKeys.products }),
    refreshAll: () => queryClient.invalidateQueries(),
  };
}