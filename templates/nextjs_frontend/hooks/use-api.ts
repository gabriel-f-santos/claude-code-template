/**
 * 🎣 API Hooks for Next.js Vibecoding
 * 
 * TanStack Query hooks for data fetching and state management.
 * Perfect for rapid development and live coding sessions.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type User, type Product, type LoginRequest, type UserCreateRequest, type ProductCreateRequest } from '@/lib/api';
import { authStorage } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // We'll add this package

// Query Keys - Centralized for consistency
export const queryKeys = {
  users: ['users'] as const,
  usersList: (params?: any) => [...queryKeys.users, 'list', params] as const,
  user: (id: number) => [...queryKeys.users, id] as const,
  currentUser: () => [...queryKeys.users, 'me'] as const,
  
  products: ['products'] as const,
  productsList: (params?: any) => [...queryKeys.products, 'list', params] as const,
  product: (id: number) => [...queryKeys.products, id] as const,
  productCategories: () => [...queryKeys.products, 'categories'] as const,
};

// Auth Hooks
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => api.auth.login(credentials),
    onSuccess: (data) => {
      // Store token
      authStorage.setToken(data.token);
      
      // Update cache with user data
      queryClient.setQueryData(queryKeys.currentUser(), data.user);
      
      // Show success message
      toast.success('Login successful!');
      
      // Redirect to dashboard
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed');
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (userData: UserCreateRequest) => api.auth.register(userData),
    onSuccess: () => {
      toast.success('Registration successful! Please login.');
      router.push('/login');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Registration failed');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => Promise.resolve(api.auth.logout()),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      
      toast.success('Logged out successfully');
      router.push('/login');
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

export function useUser(id: number) {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => api.users.getById(id),
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: any }) => 
      api.users.update(id, userData),
    onSuccess: (updatedUser) => {
      // Update user in cache
      queryClient.setQueryData(queryKeys.user(updatedUser.id), updatedUser);
      
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user');
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.users.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: queryKeys.user(deletedId) });
      
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete user');
    },
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
    mutationFn: ({ id, productData }: { id: number; productData: any }) => 
      api.products.update(id, productData),
    onSuccess: (updatedProduct) => {
      // Update product in cache
      queryClient.setQueryData(queryKeys.product(updatedProduct.id), updatedProduct);
      
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      
      toast.success('Product updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update product');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.products.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove product from cache
      queryClient.removeQueries({ queryKey: queryKeys.product(deletedId) });
      
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete product');
    },
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
    onSuccess: (updatedProduct) => {
      // Update product in cache
      queryClient.setQueryData(queryKeys.product(updatedProduct.id), updatedProduct);
      
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      
      toast.success(`Product ${updatedProduct.inStock ? 'marked as in stock' : 'marked as out of stock'}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update product stock');
    },
  });
}

// Email/Username validation hooks
export function useCheckEmail() {
  return useMutation({
    mutationFn: (email: string) => api.users.checkEmail(email),
  });
}

export function useCheckUsername() {
  return useMutation({
    mutationFn: (username: string) => api.users.checkUsername(username),
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