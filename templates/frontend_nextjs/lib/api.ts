/**
 * 🌐 API Client for Next.js Vibecoding
 * 
 * Centralized API client with TypeScript support.
 * Perfect for rapid development and integration with backend APIs.
 */

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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

// Authentication types
export interface User {
  public_id: string; // UUID exposto pelo backend
  email: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
}

export interface UserRegister {
  email: string;
  password: string;
  confirm_password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
}

export interface PasswordChange {
  current_password: string;
  new_password: string;
  confirm_password: string;
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
    login: (credentials: UserLogin): Promise<AuthResponse> =>
      apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    register: (userData: UserRegister): Promise<User> =>
      apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    refreshToken: (): Promise<RefreshTokenResponse> =>
      apiRequest('/auth/refresh', {
        method: 'POST',
      }),

    getCurrentUser: (): Promise<User> =>
      apiRequest('/auth/me'),

    updateProfile: (userData: UserUpdate): Promise<User> =>
      apiRequest('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(userData),
      }),

    changePassword: (passwordData: PasswordChange): Promise<MessageResponse> =>
      apiRequest('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwordData),
      }),

    logout: (): Promise<MessageResponse> =>
      apiRequest('/auth/logout', {
        method: 'POST',
      }),
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

    getById: (public_id: string): Promise<User> =>
      apiRequest(`/users/${public_id}`),

    update: (public_id: string, userData: UserUpdate): Promise<User> =>
      apiRequest(`/users/${public_id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      }),

    delete: (public_id: string): Promise<void> =>
      apiRequest(`/users/${public_id}`, { method: 'DELETE' }),
  },


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