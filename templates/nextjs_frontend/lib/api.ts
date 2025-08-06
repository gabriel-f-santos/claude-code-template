/**
 * 🌐 API Client for Next.js Vibecoding
 * 
 * Centralized API client with TypeScript support.
 * Perfect for rapid development and integration with backend APIs.
 */

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Generic API response type
export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

// Pagination response type
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// User types
export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateRequest {
  username: string;
  email: string;
  name: string;
  password: string;
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: string;
}

// Product types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string | null;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  inStock?: boolean;
}

// Generic fetch wrapper with error handling
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get auth token from localStorage (if available)
  let authToken: string | null = null;
  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('auth_token');
  }

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    
    let data;
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new APIError(
        data?.message || data?.error || 'API request failed',
        response.status,
        response.statusText
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network or other errors
    throw new APIError(
      'Network error or server unavailable',
      0,
      'Network Error'
    );
  }
}

// API Methods
export const api = {
  // Authentication
  auth: {
    login: (credentials: LoginRequest): Promise<LoginResponse> =>
      apiRequest('/users/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    register: (userData: UserCreateRequest): Promise<User> =>
      apiRequest('/users/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    getCurrentUser: (): Promise<User> =>
      apiRequest('/users/me'),

    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    },
  },

  // Users
  users: {
    getAll: (params?: {
      page?: number;
      limit?: number;
      search?: string;
    }): Promise<PaginatedResponse<User>> => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.search) searchParams.set('search', params.search);
      
      const query = searchParams.toString();
      return apiRequest(`/users${query ? `?${query}` : ''}`);
    },

    getById: (id: number): Promise<User> =>
      apiRequest(`/users/${id}`),

    update: (id: number, userData: UserUpdateRequest): Promise<User> =>
      apiRequest(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      }),

    delete: (id: number): Promise<void> =>
      apiRequest(`/users/${id}`, { method: 'DELETE' }),

    checkEmail: (email: string): Promise<{ exists: boolean }> =>
      apiRequest('/users/check-email', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),

    checkUsername: (username: string): Promise<{ exists: boolean }> =>
      apiRequest('/users/check-username', {
        method: 'POST',
        body: JSON.stringify({ username }),
      }),
  },

  // Products
  products: {
    getAll: (params?: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
    }): Promise<PaginatedResponse<Product>> => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.search) searchParams.set('search', params.search);
      if (params?.category) searchParams.set('category', params.category);
      if (params?.minPrice) searchParams.set('minPrice', params.minPrice.toString());
      if (params?.maxPrice) searchParams.set('maxPrice', params.maxPrice.toString());
      if (params?.inStock !== undefined) searchParams.set('inStock', params.inStock.toString());
      
      const query = searchParams.toString();
      return apiRequest(`/products${query ? `?${query}` : ''}`);
    },

    getById: (id: number): Promise<Product> =>
      apiRequest(`/products/${id}`),

    create: (productData: ProductCreateRequest): Promise<Product> =>
      apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      }),

    update: (id: number, productData: Partial<ProductCreateRequest>): Promise<Product> =>
      apiRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      }),

    delete: (id: number): Promise<void> =>
      apiRequest(`/products/${id}`, { method: 'DELETE' }),

    getCategories: (): Promise<{ categories: Array<{ name: string; count: number }> }> =>
      apiRequest('/products/categories'),

    updateStock: (id: number, inStock: boolean): Promise<Product> =>
      apiRequest(`/products/${id}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ inStock }),
      }),
  },

  // Generic helpers
  health: (): Promise<{ status: string; timestamp: string }> =>
    apiRequest('/health'),
};

// Auth token helpers
export const authStorage = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  isAuthenticated: (): boolean => {
    return !!authStorage.getToken();
  },
};

export default api;