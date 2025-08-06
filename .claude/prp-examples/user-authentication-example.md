# 📋 Example PRP: User Authentication System

## Meta Information
- **Feature Name**: `user-authentication`
- **Priority**: `HIGH`
- **Estimated Time**: `2-3 hours`
- **Architecture**: `FastAPI + React (from CLAUDE.md)`

## Purpose
Implement a complete user authentication system with JWT tokens, email verification, and secure password handling to enable user access control across the application.

## Core Principles
1. **Security First**: Implement industry-standard security practices
2. **User Experience**: Smooth registration and login flows
3. **Architecture Compliance**: Follow FastAPI + React patterns from CLAUDE.md
4. **Quality First**: >90% test coverage mandatory
5. **Performance Optimized**: <200ms API response times

---

## Goal
Create a production-ready authentication system that handles user registration, login, logout, password reset, and email verification with proper security measures and intuitive UI.

## Why
- Enable user-specific features and data access control
- Provide secure account management capabilities
- Meet compliance requirements for user data protection
- Foundation for role-based access control (future feature)

## What
Complete authentication system including:
- User registration with email verification
- Secure login/logout functionality  
- Password reset capability
- JWT token management
- Protected route handling
- User profile management
- Responsive authentication UI

### Success Criteria
- [ ] Users can register with email verification
- [ ] Secure login/logout with JWT tokens
- [ ] Password reset via email
- [ ] >90% test coverage across all layers
- [ ] <200ms API response times
- [ ] WCAG 2.1 accessibility compliance
- [ ] Responsive design on all devices

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- file: CLAUDE.md
  why: FastAPI + React architecture patterns and security requirements
  
- file: MULTI_AGENT_PLAN.md  
  why: Current development plan and coordination
```

### Visual References
```yaml
# DESIGN REFERENCES - Visual mockups and UI specifications
- directory: PRPs/user-authentication/images/
  contents:
    # Desktop Designs
    - desktop/login-page.png        # Login form with email/password
    - desktop/register-page.png     # Registration form with validation
    - desktop/forgot-password.png   # Password reset request form
    - desktop/reset-password.png    # New password form with token
    - desktop/email-verification.png # Email verification success page
    
    # Mobile Responsive Designs  
    - mobile/login-mobile.png       # Mobile-optimized login screen
    - mobile/register-mobile.png    # Mobile registration form
    - mobile/auth-flow-mobile.png   # Mobile authentication flow
    
    # Component Specifications
    - components/auth-forms.png     # Form field styles and validation
    - components/auth-buttons.png   # Primary/secondary button styles  
    - components/loading-states.png # Loading spinners and skeletons
    - components/error-states.png   # Error messages and alerts
    
    # User Flow Diagrams
    - flows/registration-flow.png   # Complete registration process
    - flows/login-flow.png          # Login and authentication flow
    - flows/password-reset-flow.png # Password reset journey
    - flows/email-verification-flow.png # Email verification process
    
  why: Visual guidance for implementing pixel-perfect authentication UI
  note: |
    FrontendEngineer MUST read these images to understand:
    - Exact form layouts and styling
    - Button states and interactions  
    - Mobile responsive behavior
    - Loading and error state designs
    - Complete user interaction flows
```

### Current Project Structure
```bash
# FastAPI + React project structure
backend/
├── app/
│   ├── api/
│   ├── core/
│   ├── models/
│   ├── schemas/
│   └── services/
frontend/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── store/
│   └── types/
```

### Technology Stack Context
```yaml
# From CLAUDE.md
Backend: FastAPI
Database: SQLAlchemy + PostgreSQL
Frontend: Next.js + TypeScript
UI Library: shadcn/ui + Radix UI  
State Management: Zustand
API Client: TanStack Query
Testing Backend: pytest
Testing Frontend: Jest + Testing Library
Quality: >90% coverage, <200ms APIs
```

## Implementation Blueprint

### Database Models
```python
# SQLAlchemy models for authentication
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=False, nullable=False)  # Email verification
    is_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class EmailVerification(Base):
    __tablename__ = "email_verifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String(255), unique=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_used = Column(Boolean, default=False, nullable=False)

class PasswordReset(Base):
    __tablename__ = "password_resets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String(255), unique=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_used = Column(Boolean, default=False, nullable=False)
```

### API Endpoints
```python
# FastAPI authentication endpoints
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer

router = APIRouter(prefix="/api/auth", tags=["authentication"])

@router.post("/register", response_model=UserResponse, status_code=201)
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user with email verification"""
    
@router.post("/verify-email", response_model=MessageResponse)
async def verify_email(token: str, db: Session = Depends(get_db)):
    """Verify user email with verification token"""
    
@router.post("/login", response_model=TokenResponse)
async def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token"""
    
@router.post("/logout", response_model=MessageResponse)
async def logout_user(current_user: User = Depends(get_current_user)):
    """Logout user (invalidate token on frontend)"""
    
@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(email_data: ForgotPassword, db: Session = Depends(get_db)):
    """Send password reset email"""
    
@router.post("/reset-password", response_model=MessageResponse)  
async def reset_password(reset_data: PasswordReset, db: Session = Depends(get_db)):
    """Reset password with reset token"""
    
@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current authenticated user information"""
```

### Frontend Components
```typescript
// React authentication components with shadcn/ui
// IMPORTANT: Implement based on designs in PRPs/user-authentication/images/

import { useAuthStore } from '@/store/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'

// Login Form Component - Based on desktop/login-page.png
export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, isLoading } = useAuthStore()
  
  // Layout matches desktop/login-page.png:
  // - Centered card with shadow
  // - Welcome back title
  // - Email and password fields
  // - Primary action button
  // - Secondary "Forgot password?" link
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="space-y-2 text-center pb-8">
          <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Email field - styled per components/auth-forms.png */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Enter your email"
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* Password field - styled per components/auth-forms.png */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password"
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* Primary button - styled per components/auth-buttons.png */}
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                {isLoading ? (
                  // Loading state per components/loading-states.png
                  <div className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
              
              {/* Forgot password link - styled per desktop/login-page.png */}
              <div className="text-center">
                <Link 
                  to="/auth/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Forgot your password?
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

// Registration Form Component - Based on desktop/register-page.png
export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register, isLoading } = useAuthStore()
  
  // Layout matches desktop/register-page.png:
  // - Similar card layout to login
  // - "Create Account" title
  // - Name, email, password, confirm password fields
  // - Terms checkbox
  // - Primary "Create Account" button
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="space-y-2 text-center pb-8">
          <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
          <p className="text-gray-600">Join us to get started</p>
        </CardHeader>
        <CardContent>
          {/* Form implementation based on register-page.png design */}
        </CardContent>
      </Card>
    </div>
  )
}

// Mobile responsive - Based on mobile/login-mobile.png and mobile/register-mobile.png
// Responsive breakpoints per mobile designs:
// - Reduced padding on mobile
// - Full-width cards on small screens  
// - Touch-friendly button sizes
// - Mobile-optimized form spacing

// Protected Route Component
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />
  }
  
  return children
}
```

### State Management
```typescript
// Zustand auth store
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  register: (userData: RegisterData) => Promise<void>
  login: (credentials: LoginData) => Promise<void>
  logout: () => void
  verifyEmail: (token: string) => Promise<void>
  resetPassword: (resetData: PasswordResetData) => Promise<void>
  refreshToken: () => Promise<void>
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  register: async (userData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authApi.register(userData)
      // Handle registration success (email verification needed)
      set({ isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const { user, token } = await authApi.login(credentials)
      localStorage.setItem('auth_token', token)
      set({ user, token, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  logout: () => {
    localStorage.removeItem('auth_token')
    set({ user: null, token: null, isAuthenticated: false })
  }
}))
```

## Task Breakdown

### Phase 1: Database Foundation (Sequential)
- [ ] **DatabaseArchitect**: Design authentication schema
  - Create User, EmailVerification, PasswordReset tables
  - Set up proper indexes and constraints
  - Create migration scripts
  - **Quality Gate**: Schema validated, migrations tested

### Phase 2: Backend Implementation (Sequential)
- [ ] **BackendEngineer**: Implement authentication API
  - JWT token handling and middleware
  - Password hashing with bcrypt
  - Email verification system
  - Password reset functionality  
  - User registration and login endpoints
  - **Quality Gate**: >90% test coverage, <200ms response times

### Phase 3: Frontend Implementation (Sequential)  
- [ ] **FrontendEngineer**: Create authentication UI following visual designs
  - **CRITICAL**: Read all images in PRPs/user-authentication/images/ first
  - Study desktop designs (login-page.png, register-page.png, etc.)
  - Analyze mobile responsive designs (login-mobile.png, etc.)
  - Extract styling from component specifications (auth-forms.png, auth-buttons.png)
  - Understand user flows from flow diagrams (registration-flow.png, etc.)
  - Registration and login forms with shadcn/ui matching designs exactly
  - Email verification flow per email-verification-flow.png
  - Password reset flow per password-reset-flow.png  
  - Protected route handling
  - Auth state management with Zustand
  - **Quality Gate**: Pixel-perfect match to designs, responsive design, accessibility, loading states

### Phase 4: Quality & Integration (Sequential)
- [ ] **QAEngineer**: Comprehensive testing
  - Unit tests for all auth functions
  - Integration tests for complete auth flows
  - Security testing for auth vulnerabilities
  - Edge case validation (expired tokens, etc.)
  - **Quality Gate**: >90% coverage, all security tests pass
  
- [ ] **IntegrationExpert**: End-to-end validation
  - Complete registration to login flow
  - Email verification process
  - Password reset process
  - Token refresh mechanism
  - API integration testing
  - **Quality Gate**: All user journeys working perfectly

## Validation Loop

### Level 1: Security Validation
```bash
# Security testing commands
pytest tests/auth/ -k security
python -m bandit app/auth/
npm run test:security
```

### Level 2: Authentication Flow Testing
```bash
# End-to-end auth flow testing
pytest tests/auth/test_registration_flow.py
pytest tests/auth/test_login_flow.py  
pytest tests/auth/test_password_reset.py
npm run test:auth-flows
```

### Level 3: Performance Testing
```bash
# API performance validation
locust -f tests/performance/auth_performance.py
# Target: <200ms for all auth endpoints
```

### Level 4: Accessibility Testing
```bash
# Frontend accessibility validation
npm run test:a11y
# Target: WCAG 2.1 AA compliance
```

## Quality Gates

### Database Quality Gates
- [ ] Authentication schema validated against requirements
- [ ] Migration scripts tested with rollback capability
- [ ] Indexes optimized for auth query patterns  
- [ ] Data integrity constraints verified

### Backend Quality Gates  
- [ ] >90% test coverage on all auth endpoints
- [ ] Security audit passed (no vulnerabilities)
- [ ] JWT token handling secure and tested
- [ ] Password hashing secure (bcrypt with salt)
- [ ] Email verification system working
- [ ] API performance <200ms
- [ ] Error handling comprehensive

### Frontend Quality Gates
- [ ] Auth forms responsive on all screen sizes
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Loading states for all async operations
- [ ] Error states handled gracefully
- [ ] Token management secure (no XSS vulnerabilities)
- [ ] Protected routes working correctly
- [ ] User feedback for all auth actions

### Integration Quality Gates
- [ ] Complete registration flow working
- [ ] Email verification end-to-end
- [ ] Login/logout flow seamless
- [ ] Password reset flow working
- [ ] Token refresh mechanism tested
- [ ] Protected route access control verified
- [ ] Cross-device session handling

## Anti-Patterns to Avoid
- ❌ Don't store passwords in plain text
- ❌ Don't use weak JWT secrets
- ❌ Don't skip email verification
- ❌ Don't ignore token expiration
- ❌ Don't store tokens in localStorage without security considerations
- ❌ Don't skip input validation on both client and server
- ❌ Don't ignore rate limiting for auth endpoints
- ❌ Don't skip security testing

## Final Validation Checklist
- [ ] Security audit passed (OWASP compliance)
- [ ] All authentication flows tested and working
- [ ] >90% test coverage across all auth components
- [ ] Performance requirements met (<200ms APIs)
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] Email verification system working
- [ ] Password reset system working
- [ ] Token management secure and tested
- [ ] Protected routes access control working
- [ ] User experience smooth and intuitive
- [ ] Documentation complete and accurate
- [ ] Ready for production deployment

---

## Notes
- Email service integration required (SendGrid, AWS SES, etc.)
- Consider implementing 2FA in future iterations
- Rate limiting should be implemented on auth endpoints
- Session management strategy should be documented
- Consider refresh token rotation for enhanced security