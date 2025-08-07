# 📋 Next.js + shadcn/ui PRP Template

## Meta Information
- **Feature Name**: `{FEATURE_NAME}`
- **Priority**: `{PRIORITY}`
- **Estimated Time**: `{DURATION}`
- **Architecture**: Next.js 14 + TypeScript + shadcn/ui + Zustand + TanStack Query

## Purpose
{FEATURE_DESCRIPTION}

## Core Principles
1. **Next.js 14 App Router**: Server/Client components, streaming, caching
2. **Type Safety**: Full TypeScript coverage with strict mode
3. **shadcn/ui Design**: Consistent, accessible, customizable components
4. **Performance First**: <3s loading, optimized images, code splitting
5. **Responsive Design**: Mobile-first approach, all screen sizes

---

## Goal
{DETAILED_GOAL}

## Why
{BUSINESS_JUSTIFICATION}

## What
{SPECIFIC_DELIVERABLES}

### Success Criteria
- [ ] All UI components responsive on all screen sizes
- [ ] Type safety with TypeScript (0 type errors)
- [ ] Loading times <3s on all pages
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] >90% test coverage with Jest + Testing Library
- [ ] Perfect Lighthouse scores (90+ in all categories)

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- file: CLAUDE.md
  why: Next.js + shadcn/ui architecture patterns and conventions
  
- file: MULTI_AGENT_PLAN.md  
  why: Current development plan and coordination
```

### Visual References
```yaml
# DESIGN REFERENCES - Visual mockups and UI specifications
- directory: PRPs/{FEATURE_NAME}/images/
  contents:
    # Desktop Designs
    - desktop/{feature}-page.png       # Main feature page layout
    - desktop/{feature}-components.png # Component variations
    - desktop/{feature}-forms.png      # Form layouts and validation
    
    # Mobile Responsive Designs  
    - mobile/{feature}-mobile.png      # Mobile-optimized layout
    - mobile/{feature}-nav.png         # Mobile navigation
    - mobile/{feature}-responsive.png  # Responsive breakpoints
    
    # Component Specifications
    - components/buttons.png           # Button states and variations
    - components/forms.png             # Form field styles
    - components/cards.png             # Card component designs
    - components/loading-states.png    # Loading skeletons and spinners
    - components/error-states.png      # Error messages and alerts
    
    # User Flow Diagrams
    - flows/{feature}-user-journey.png # Complete user interaction flow
    - flows/{feature}-states.png       # Component state transitions
    
  why: Visual guidance for implementing pixel-perfect, responsive UI
  note: |
    FrontendEngineer MUST read these images to understand:
    - Exact component layouts and styling
    - Responsive behavior across breakpoints  
    - Loading and error state designs
    - User interaction patterns and flows
```

### Current Project Structure
```bash
# Next.js + shadcn/ui project structure
frontend/
├── app/                           # Next.js App Router
│   ├── globals.css               # Global styles and Tailwind
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── loading.tsx               # Global loading UI
│   ├── error.tsx                 # Global error UI  
│   └── {feature}/                # Feature-specific pages
│       ├── page.tsx              # Feature main page
│       ├── loading.tsx           # Feature loading UI
│       └── components/           # Page-specific components
├── components/                   # Shared components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   └── input.tsx
│   ├── {feature}/                # Feature components
│   │   ├── {feature}-list.tsx
│   │   ├── {feature}-card.tsx
│   │   └── {feature}-form.tsx
│   └── shared/                   # Shared UI components
│       ├── header.tsx
│       ├── navigation.tsx
│       └── footer.tsx
├── hooks/                        # Custom React hooks
│   ├── use-{feature}.ts
│   └── use-{feature}-mutations.ts
├── store/                        # Zustand stores
│   ├── {feature}-store.ts
│   └── auth-store.ts
├── lib/                          # Utilities and configurations
│   ├── utils.ts                  # Utility functions
│   ├── api.ts                    # API client configuration
│   └── validations.ts            # Zod schemas
├── types/                        # TypeScript type definitions
│   ├── {feature}.ts
│   └── api.ts
└── __tests__/                    # Test files
    ├── components/
    ├── hooks/
    └── store/
```

### Technology Stack Context
```yaml
# Next.js Stack Specifics
Frontend Framework: Next.js 14+ (App Router)
Language: TypeScript 5.0+
UI Library: shadcn/ui + Radix UI primitives
Styling: Tailwind CSS 3.3+
State Management: Zustand 4.4+
Data Fetching: TanStack Query 5.0+
Forms: React Hook Form + Zod validation
Testing: Jest + React Testing Library
Icons: Lucide React
Animation: Framer Motion (if needed)
Build Tool: Next.js built-in (Turbopack)
Deployment: Vercel optimized
```

## Implementation Blueprint

### Page Component (App Router)
```typescript
// app/{feature}/page.tsx
import { Suspense } from 'react'
import { Metadata } from 'next'
import { {Entity}List } from '@/components/{feature}/{entity}-list'
import { {Entity}Header } from '@/components/{feature}/{entity}-header'
import { {Entity}Loading } from '@/components/{feature}/{entity}-loading'

export const metadata: Metadata = {
  title: '{Entity} Management',
  description: 'Manage your {entities} efficiently',
}

export default function {Entity}Page() {
  return (
    <div className="container mx-auto py-6 px-4">
      <{Entity}Header />
      <Suspense fallback={<{Entity}Loading />}>
        <{Entity}List />
      </Suspense>
    </div>
  )
}
```

### Component with shadcn/ui
```typescript
// components/{feature}/{entity}-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { {Entity} } from '@/types/{feature}'

interface {Entity}CardProps {
  {entity}: {Entity}
  onEdit: ({entity}: {Entity}) => void
  onDelete: (id: string) => void
}

export function {Entity}Card({ {entity}, onEdit, onDelete }: {Entity}CardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">
            {{entity}.name}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {{entity}.description}
          </CardDescription>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit({entity})}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete({entity}.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant={{entity}.isActive ? "default" : "secondary"}>
            {{entity}.isActive ? "Active" : "Inactive"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Updated {{entity}.updatedAt.toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Form Component with Validation
```typescript
// components/{feature}/{entity}-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { use{Entity}Mutations } from '@/hooks/use-{feature}-mutations'
import { Loader2 } from 'lucide-react'

const {entity}Schema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  isActive: z.boolean().default(true),
})

type {Entity}FormData = z.infer<typeof {entity}Schema>

interface {Entity}FormProps {
  {entity}?: {Entity}
  trigger: React.ReactNode
  onSuccess?: () => void
}

export function {Entity}Form({ {entity}, trigger, onSuccess }: {Entity}FormProps) {
  const { create{Entity}, update{Entity}, isCreating, isUpdating } = use{Entity}Mutations()
  const isEditing = Boolean({entity})
  const isLoading = isCreating || isUpdating

  const form = useForm<{Entity}FormData>({
    resolver: zodResolver({entity}Schema),
    defaultValues: {
      name: {entity}?.name ?? '',
      description: {entity}?.description ?? '',
      isActive: {entity}?.isActive ?? true,
    },
  })

  const onSubmit = async (data: {Entity}FormData) => {
    try {
      if (isEditing) {
        await update{Entity}.mutateAsync({ id: {entity}!.id, ...data })
      } else {
        await create{Entity}.mutateAsync(data)
      }
      form.reset()
      onSuccess?.()
    } catch (error) {
      // Error handling is done by react-query
      console.error('Form submission error:', error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit {Entity}' : 'Create New {Entity}'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter {entity} name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter description (optional)"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Enable or disable this {entity}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

### Zustand Store
```typescript
// store/{feature}-store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { {Entity} } from '@/types/{feature}'

interface {Entity}Store {
  // State
  {entities}: {Entity}[]
  selected{Entity}: {Entity} | null
  isLoading: boolean
  error: string | null
  
  // Filters and pagination
  filters: {
    search: string
    isActive?: boolean
    sortBy: 'name' | 'createdAt' | 'updatedAt'
    sortOrder: 'asc' | 'desc'
  }
  pagination: {
    page: number
    pageSize: number
    total: number
  }
  
  // Actions
  set{Entities}: ({entities}: {Entity}[]) => void
  add{Entity}: ({entity}: {Entity}) => void
  update{Entity}: ({entity}: {Entity}) => void
  remove{Entity}: (id: string) => void
  setSelected{Entity}: ({entity}: {Entity} | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateFilters: (filters: Partial<{Entity}Store['filters']>) => void
  updatePagination: (pagination: Partial<{Entity}Store['pagination']>) => void
  reset: () => void
}

const initialState = {
  {entities}: [],
  selected{Entity}: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    isActive: undefined,
    sortBy: 'createdAt' as const,
    sortOrder: 'desc' as const,
  },
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
}

export const use{Entity}Store = create<{Entity}Store>()(
  devtools(
    immer((set) => ({
      ...initialState,
      
      set{Entities}: ({entities}) => 
        set((state) => {
          state.{entities} = {entities}
        }),
        
      add{Entity}: ({entity}) => 
        set((state) => {
          state.{entities}.unshift({entity})
        }),
        
      update{Entity}: ({entity}) => 
        set((state) => {
          const index = state.{entities}.findIndex((item) => item.id === {entity}.id)
          if (index !== -1) {
            state.{entities}[index] = {entity}
          }
          if (state.selected{Entity}?.id === {entity}.id) {
            state.selected{Entity} = {entity}
          }
        }),
        
      remove{Entity}: (id) => 
        set((state) => {
          state.{entities} = state.{entities}.filter((item) => item.id !== id)
          if (state.selected{Entity}?.id === id) {
            state.selected{Entity} = null
          }
        }),
        
      setSelected{Entity}: ({entity}) => 
        set((state) => {
          state.selected{Entity} = {entity}
        }),
        
      setLoading: (loading) => 
        set((state) => {
          state.isLoading = loading
        }),
        
      setError: (error) => 
        set((state) => {
          state.error = error
        }),
        
      updateFilters: (newFilters) => 
        set((state) => {
          Object.assign(state.filters, newFilters)
        }),
        
      updatePagination: (newPagination) => 
        set((state) => {
          Object.assign(state.pagination, newPagination)
        }),
        
      reset: () => 
        set((state) => {
          Object.assign(state, initialState)
        }),
    })),
    { name: '{entity}-store' }
  )
)
```

### TanStack Query Hooks
```typescript
// hooks/use-{feature}.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { use{Entity}Store } from '@/store/{feature}-store'
import { api } from '@/lib/api'
import type { {Entity}, {Entity}Create, {Entity}Update } from '@/types/{feature}'

// Query keys
export const {entity}Keys = {
  all: ['{entities}'] as const,
  lists: () => [...{entity}Keys.all, 'list'] as const,
  list: (filters: string) => [...{entity}Keys.lists(), { filters }] as const,
  details: () => [...{entity}Keys.all, 'detail'] as const,
  detail: (id: string) => [...{entity}Keys.details(), id] as const,
}

// Queries
export function use{Entities}() {
  const { filters, pagination } = use{Entity}Store()
  
  return useQuery({
    queryKey: {entity}Keys.list(JSON.stringify({ filters, pagination })),
    queryFn: () => api.{entities}.list({ filters, pagination }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function use{Entity}(id: string) {
  return useQuery({
    queryKey: {entity}Keys.detail(id),
    queryFn: () => api.{entities}.get(id),
    enabled: Boolean(id),
  })
}

// Mutations
export function use{Entity}Mutations() {
  const queryClient = useQueryClient()
  const { add{Entity}, update{Entity}, remove{Entity} } = use{Entity}Store()

  const create{Entity} = useMutation({
    mutationFn: (data: {Entity}Create) => api.{entities}.create(data),
    onSuccess: ({entity}) => {
      add{Entity}({entity})
      queryClient.invalidateQueries({ queryKey: {entity}Keys.lists() })
    },
  })

  const update{Entity}Mutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & {Entity}Update) => 
      api.{entities}.update(id, data),
    onSuccess: ({entity}) => {
      update{Entity}({entity})
      queryClient.invalidateQueries({ queryKey: {entity}Keys.lists() })
      queryClient.invalidateQueries({ queryKey: {entity}Keys.detail({entity}.id) })
    },
  })

  const delete{Entity} = useMutation({
    mutationFn: (id: string) => api.{entities}.delete(id),
    onSuccess: (_, id) => {
      remove{Entity}(id)
      queryClient.invalidateQueries({ queryKey: {entity}Keys.lists() })
    },
  })

  return {
    create{Entity},
    update{Entity}: update{Entity}Mutation,
    delete{Entity},
    isCreating: create{Entity}.isPending,
    isUpdating: update{Entity}Mutation.isPending,
    isDeleting: delete{Entity}.isPending,
  }
}
```

### TypeScript Types
```typescript
// types/{feature}.ts
export interface {Entity} {
  id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface {Entity}Create {
  name: string
  description?: string
  isActive?: boolean
}

export interface {Entity}Update {
  name?: string
  description?: string
  isActive?: boolean
}

export interface {Entity}List {
  items: {Entity}[]
  total: number
  page: number
  pageSize: number
}

export interface {Entity}Filters {
  search?: string
  isActive?: boolean
  sortBy?: 'name' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}
```

## Task Breakdown

### Phase 1: Setup & Types (FrontendEngineer)
- [ ] Define TypeScript types and interfaces
- [ ] Set up Zod schemas for validation
- [ ] Configure API client with proper typing
- [ ] **Quality Gate**: TypeScript compiles with no errors

### Phase 2: Components Implementation (FrontendEngineer)
- [ ] **CRITICAL**: Read all design images first from PRPs/{FEATURE_NAME}/images/
- [ ] Study desktop layouts, mobile responsive designs, component specs
- [ ] Create base components using shadcn/ui matching designs exactly
- [ ] Implement forms with React Hook Form + Zod validation
- [ ] Add proper loading states and error handling per design specs
- [ ] **Quality Gate**: Components match designs pixel-perfect, responsive

### Phase 3: State Management (FrontendEngineer)
- [ ] Implement Zustand store with proper state management
- [ ] Set up TanStack Query for data fetching
- [ ] Create custom hooks for mutations and queries
- [ ] Add optimistic updates and error handling
- [ ] **Quality Gate**: State management working smoothly, no memory leaks

### Phase 4: Pages & Routing (FrontendEngineer)
- [ ] Create App Router pages with proper metadata
- [ ] Implement loading and error pages
- [ ] Add proper SEO optimization
- [ ] Test all navigation flows
- [ ] **Quality Gate**: All pages working, proper SEO, loading states

### Phase 5: Testing & Quality (QAEngineer)
- [ ] Write component tests with React Testing Library
- [ ] Test custom hooks with proper mocking
- [ ] Add integration tests for complete flows
- [ ] Test responsive design on all breakpoints
- [ ] Accessibility testing with screen readers
- [ ] **Quality Gate**: >90% test coverage, WCAG 2.1 compliance

### Phase 6: Performance & Polish (IntegrationExpert)
- [ ] Optimize bundle size and code splitting
- [ ] Add proper image optimization
- [ ] Test loading performance
- [ ] Run Lighthouse audits
- [ ] **Quality Gate**: Perfect Lighthouse scores, <3s loading

## Validation Commands

### Development Server
```bash
# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev

# Build for production
npm run build
npm run start
```

### Type Checking
```bash
# TypeScript type checking
npm run type-check
# or
npx tsc --noEmit

# Check for unused exports
npx ts-unused-exports tsconfig.json
```

### Testing
```bash
# Run all tests
npm run test
npm run test:watch
npm run test:coverage

# E2E testing (if configured)
npm run test:e2e
```

### Code Quality
```bash
# ESLint checking
npm run lint
npm run lint:fix

# Prettier formatting
npm run format
npm run format:check
```

### Performance Testing
```bash
# Lighthouse CI
npm run lighthouse

# Bundle analyzer
npm run analyze

# Check bundle size
npm run build-stats
```

## Quality Gates

### TypeScript Quality Gates
- [ ] All types properly defined with strict TypeScript
- [ ] No `any` types used (except for necessary third-party integrations)
- [ ] Proper type inference and generic usage
- [ ] All imports and exports properly typed

### Component Quality Gates  
- [ ] All components match design specifications exactly
- [ ] Responsive design working on all breakpoints (mobile, tablet, desktop)
- [ ] shadcn/ui components used consistently
- [ ] Proper accessibility attributes (ARIA labels, semantic HTML)
- [ ] Loading states and error boundaries implemented
- [ ] Component composition and reusability optimized

### State Management Quality Gates
- [ ] Zustand store properly structured with actions and selectors
- [ ] TanStack Query configured with proper caching strategies
- [ ] Optimistic updates working correctly
- [ ] Error handling comprehensive across all mutations
- [ ] No unnecessary re-renders or memory leaks

### Performance Quality Gates
- [ ] Lighthouse score >90 in all categories
- [ ] First Contentful Paint <1.5s
- [ ] Largest Contentful Paint <2.5s
- [ ] Total Blocking Time <300ms
- [ ] Cumulative Layout Shift <0.1
- [ ] Bundle size optimized with proper code splitting

### Testing Quality Gates
- [ ] >90% test coverage for components and hooks
- [ ] All user interactions tested
- [ ] Error scenarios covered
- [ ] Responsive behavior tested
- [ ] Accessibility testing passed

## Anti-Patterns to Avoid
- ❌ Don't use client components when server components suffice
- ❌ Don't skip TypeScript strict mode
- ❌ Don't ignore responsive design for mobile users
- ❌ Don't hardcode colors/spacing (use Tailwind theme)
- ❌ Don't skip loading states and error handling
- ❌ Don't ignore accessibility (screen readers, keyboard navigation)
- ❌ Don't skip image optimization for performance
- ❌ Don't use inline styles instead of Tailwind classes

## Final Validation Checklist
- [ ] All components implemented with pixel-perfect design match
- [ ] Responsive design working on all devices
- [ ] TypeScript compilation successful with no errors
- [ ] >90% test coverage achieved
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Performance requirements met (<3s loading)
- [ ] SEO optimization complete
- [ ] Ready for production deployment

---

## Notes
- Follow Next.js 14 App Router best practices
- Use Server Components by default, Client Components only when needed
- Implement proper error boundaries for graceful error handling
- Consider implementing skeleton loading states for better UX
- Use Tailwind CSS custom theme for consistent design tokens
- Implement proper image optimization with Next.js Image component