# 🚀 Next.js Vibecoding Template

## Modern React Vibecoding Architecture - Perfect for Rapid Development!

This template follows the **vibecoding** philosophy with modern Next.js: simple, modular, demonstrable code perfect for rapid frontend development (15-minute features) and live coding sessions with Claude Code subagents.

## 🏗️ Modern Next.js Vibecoding Structure
```
├── src/
│   ├── app/                     # App Router (Next.js 13+)
│   │   ├── (auth)/             # Route groups
│   │   │   ├── login/          # Auth pages
│   │   │   └── register/       # Protected by auth
│   │   ├── dashboard/          # Main app pages
│   │   ├── globals.css         # Global styles + Tailwind
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── forms/              # Form components
│   │   ├── layout/             # Layout components
│   │   └── features/           # Feature-specific components
│   ├── lib/                    # Utilities and configurations
│   │   ├── utils.ts            # Utility functions (cn, etc.)
│   │   ├── validations.ts      # Zod schemas
│   │   ├── api.ts              # API client setup
│   │   └── auth.ts             # Auth configuration
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-auth.ts         # Authentication hooks
│   │   ├── use-api.ts          # API data fetching hooks
│   │   └── use-local-storage.ts # Client storage hooks
│   ├── store/                  # Zustand global state
│   │   ├── auth-store.ts       # Authentication state
│   │   ├── ui-store.ts         # UI state (modals, etc.)
│   │   └── data-store.ts       # App data state
│   └── types/                  # TypeScript type definitions
│       ├── auth.ts             # Auth-related types
│       ├── api.ts              # API response types
│       └── global.ts           # Global type definitions
├── public/                     # Static assets
├── tailwind.config.js          # Tailwind CSS configuration
├── next.config.js              # Next.js configuration
└── package.json                # Modern React dependencies
```

## ⚡ Quick Start Commands
```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint

# Run type checking
npm run type-check

# Access the application
# http://localhost:3000

# Test a complete feature in < 15 minutes!
# Open browser and start building with shadcn/ui components
```

## 🔥 Modern React Vibecoding Patterns

### Server Component Pattern
Leverage Next.js App Router server components for optimal performance:
```typescript
// app/dashboard/page.tsx (Server Component)
import { getUserData } from '@/lib/api';
import { UserDashboard } from '@/components/features/dashboard';

export default async function DashboardPage() {
  const userData = await getUserData(); // Server-side data fetching
  
  return <UserDashboard initialData={userData} />;
}
```

### Client Component with State
Interactive components with Zustand state management:
```typescript
'use client';

import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';

export function LoginForm() {
  const { login, isLoading } = useAuthStore();
  
  return (
    <form onSubmit={handleSubmit}>
      <Button disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
```

### Data Fetching with TanStack Query
Modern data fetching with automatic caching and background updates:
```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api';

export function ProductsList() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  if (isLoading) return <ProductsSkeleton />;
  if (error) return <ProductsError />;

  return (
    <div className="grid gap-4">
      {products?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### shadcn/ui + Radix UI Integration
Beautiful, accessible components with automatic theming:
```typescript
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function CreateUserDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <UserForm />
      </DialogContent>
    </Dialog>
  );
}
```

## 🧪 Testing Philosophy

### Component Testing with React Testing Library
Test components in isolation with proper user interactions:
```typescript
import { render, screen, userEvent } from '@testing-library/react';
import { LoginForm } from '@/components/forms/login-form';

test('should submit login form with valid data', async () => {
  render(<LoginForm />);
  
  await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'password123');
  await userEvent.click(screen.getByRole('button', { name: /login/i }));
  
  expect(screen.getByText(/logging in/i)).toBeInTheDocument();
});
```

## 🤖 Claude Code Subagent Prompts

### Next.js Vibecoding Feature Developer
**Perfect for rapid 15-minute React feature development!**

```
You are a Next.js Vibecoding Expert specializing in rapid React development.

CONTEXT: This project uses modern Next.js vibecoding architecture:
- Next.js 13+ App Router with Server/Client Components
- shadcn/ui + Radix UI for beautiful, accessible components
- TanStack Query for data fetching and caching
- Zustand for global state management
- TypeScript for type safety
- Tailwind CSS for styling
- Zod for validation
- Focus on rapid development (5-15 minutes for complete features)

VIBECODING PRINCIPLES:
- Keep it simple and performant
- Server Components by default, Client Components when needed
- shadcn/ui components for consistent design
- TanStack Query for all data fetching
- Zustand for global state only
- Local state with useState for component-specific data
- Perfect for demos and live coding

EXAMPLE TASK:
"Create a complete 'products' feature with listing, detail view, create/edit forms, and state management. Include proper TypeScript types, loading states, error handling, and responsive design. Make it ready to demo in 15 minutes."

WHAT TO INCLUDE:
1. Page components (app/products/page.tsx, app/products/[id]/page.tsx)
2. Feature components (components/features/products/)
3. UI components using shadcn/ui (forms, cards, modals)
4. API functions (lib/api/products.ts)
5. Type definitions (types/products.ts)
6. Zustand store if global state needed (store/products-store.ts)
7. Validation schemas (lib/validations/products.ts)
```

### React State Management Expert
**For complex state interactions and data flow!**

```
You are a React State Management Expert specializing in modern patterns.

SPECIALIZES IN:
- Zustand global state management
- TanStack Query data synchronization
- React Server/Client Component patterns
- Local vs global state decisions
- Optimistic updates
- Cache invalidation strategies

COMMON STATE PATTERNS TO IMPLEMENT:
- Authentication state with Zustand
- Data caching with TanStack Query
- Form state with React Hook Form + Zod
- UI state (modals, drawers) with Zustand
- Real-time updates with optimistic UI
- Complex data relationships

VIBECODING STATE APPROACH:
- Server Components for initial data
- Client Components for interactivity
- TanStack Query for server state
- Zustand for client-side global state
- Local state for component-specific data
- Zod validation for data integrity
```

### shadcn/ui + Design System Expert
**For beautiful, accessible UI development!**

```
You are a shadcn/ui Design System Expert.

CONTEXT: This project uses shadcn/ui + Radix UI for component library.

FOCUS ON:
- shadcn/ui component composition
- Custom component variants
- Responsive design patterns
- Accessibility best practices
- Theme customization
- Animation and interactions

SHADCN/UI PATTERNS:
- Use existing shadcn/ui components first
- Compose complex UIs from simple components
- Create custom variants when needed
- Maintain consistent spacing and typography
- Follow accessibility guidelines
- Implement proper loading and error states

EXAMPLE TASK:
"Create a comprehensive data table with sorting, filtering, pagination, and row actions using shadcn/ui components. Include proper TypeScript types, responsive design, and accessibility features."
```

## ⚡ Modern React Benefits

### 🚀 **Lightning Fast Development**
- Complete features in 15 minutes
- Hot reload with Next.js
- Component-driven development
- Perfect for live demonstrations
- Claude Code subagent optimized

### 🎯 **Modern Architecture**
- Server/Client Component separation
- Automatic code splitting
- Optimized bundle sizes
- SEO-friendly by default
- Progressive enhancement

### 🔧 **Production Ready**
- TypeScript for type safety
- Zod for runtime validation
- Error boundaries
- Loading states
- Responsive design
- Accessibility built-in

### 📚 **Excellent Developer Experience**
- shadcn/ui component library
- Auto-completion with TypeScript
- ESLint and Prettier setup
- Modern tooling integration
- Hot reload development

## 🔧 Environment Setup

Copy `.env.local.example` to `.env.local` and customize:

```bash
# 🚀 Next.js Vibecoding Environment Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Authentication (if using NextAuth.js)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Database (if using)
DATABASE_URL=your-database-connection-string
```

## 📈 What You Get Out of the Box

✅ **Modern Next.js Setup** - App Router, TypeScript, Tailwind  
✅ **Component Library** - shadcn/ui + Radix UI components  
✅ **State Management** - Zustand + TanStack Query  
✅ **Type Safety** - Full TypeScript integration  
✅ **Validation** - Zod schemas for data validation  
✅ **Styling** - Tailwind CSS with custom design system  
✅ **Development Tools** - ESLint, Prettier, hot reload  
✅ **Production Ready** - Optimized builds, SEO, accessibility  
✅ **Responsive Design** - Mobile-first approach  
✅ **Modern Patterns** - Server/Client Components, hooks  

## 🎯 Perfect for Live Coding Sessions!

This template is specifically designed for:
- **Claude Code subagent development** with modern React
- **Live coding demonstrations** with instant feedback
- **Rapid prototyping** with beautiful components
- **Teaching modern React** patterns and best practices
- **Building MVPs quickly** with production-ready code
- **Technical interviews** showcasing modern skills

Start coding with modern React patterns and see beautiful results in seconds! 🚀

## 🎯 Feature Development Guide

### 📋 **Step-by-Step Process for Adding New Features**

Siga este processo rigorosamente para manter a consistência arquitetural vibecoding Next.js:

#### **1. 📁 Create Feature Structure**
```bash
# Exemplo: Adicionando feature "Products"
mkdir -p src/app/products
mkdir -p src/components/features/products
mkdir -p src/lib/api
mkdir -p src/types
mkdir -p src/store

# Os arquivos específicos da feature
touch src/app/products/page.tsx
touch src/app/products/[id]/page.tsx
touch src/components/features/products/products-list.tsx
touch src/components/features/products/product-card.tsx
touch src/components/features/products/product-form.tsx
touch src/lib/api/products.ts
touch src/types/products.ts
touch src/store/products-store.ts
touch src/lib/validations/products.ts
```

#### **2. 📊 Type Definitions (TypeScript)**
```bash
# 1. Define all TypeScript interfaces
# src/types/products.ts

# 2. Create Zod validation schemas
# src/lib/validations/products.ts
```

#### **3. 💾 API Layer (Data Fetching)**
```bash
# Implement API functions with proper error handling
# src/lib/api/products.ts
```

#### **4. 🎨 UI Components (React + shadcn/ui)**
```bash
# 1. Create feature components
# 2. Use shadcn/ui for consistent design
# 3. Implement Server/Client Component patterns
# 4. Add loading and error states
```

#### **5. 📱 Pages (Next.js App Router)**
```bash
# Create route pages
# src/app/products/page.tsx (listing)
# src/app/products/[id]/page.tsx (detail)
# src/app/products/create/page.tsx (create form)
```

#### **6. 🧪 State Management**
```bash
# Add Zustand store if global state needed
# src/store/products-store.ts

# Use TanStack Query for data fetching
# In components with useQuery/useMutation
```

### 🤖 **Claude Code Prompt Templates**

#### **📝 Complete React Feature Prompt**
```
Você é um especialista em Next.js Vibecoding com React moderno.

TAREFA: Criar a feature "Products" completa seguindo nossa arquitetura vibecoding.

ARQUITETURA OBRIGATÓRIA:
src/
├── app/products/
│   ├── page.tsx (Server Component - lista de produtos)
│   ├── [id]/page.tsx (Server Component - detalhe do produto)
│   └── create/page.tsx (Client Component - formulário)
├── components/features/products/
│   ├── products-list.tsx (Client Component com TanStack Query)
│   ├── product-card.tsx (reutilizável)
│   ├── product-form.tsx (React Hook Form + Zod)
│   └── products-table.tsx (shadcn/ui Data Table)
├── lib/api/products.ts (funções de API)
├── types/products.ts (TypeScript interfaces)
├── store/products-store.ts (Zustand - se necessário)
└── lib/validations/products.ts (Zod schemas)

REQUISITOS TÉCNICOS:
✅ Next.js App Router com Server/Client Components
✅ shadcn/ui components (Button, Form, Table, Dialog, etc.)
✅ TanStack Query para data fetching
✅ TypeScript com interfaces completas
✅ Zod para validação de formulários
✅ Tailwind CSS para styling
✅ Responsive design (mobile-first)
✅ Loading states e error handling
✅ Zustand apenas se estado global necessário

FUNCIONALIDADES:
- GET /products (lista com paginação, busca, filtros)
- GET /products/:id (detalhe do produto)
- POST /products (criar produto)
- PUT /products/:id (editar produto)  
- DELETE /products/:id (deletar produto)

TYPESCRIPT INTERFACES NECESSÁRIAS:
```typescript
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}
```

PADRÕES NEXT.JS VIBECODING:
- Server Components para páginas e dados iniciais
- Client Components apenas quando necessário ('use client')
- TanStack Query para cache e sincronização
- shadcn/ui para todos os componentes UI
- React Hook Form + Zod para formulários
- Proper error boundaries e loading states
- SEO-friendly com metadata

ENTREGUE: Código TypeScript completo com componentização moderna do React.
```

#### **📱 UI-Only Feature Prompt**
```
TAREFA: Criar apenas a interface da feature "Settings" (sem backend).

ARQUITETURA:
src/
├── app/settings/page.tsx (Server Component)
├── components/features/settings/
│   ├── settings-form.tsx (React Hook Form)
│   ├── theme-selector.tsx (com shadcn/ui)
│   └── notification-preferences.tsx
└── store/settings-store.ts (Zustand para preferências locais)

REQUISITOS:
✅ Configurações locais (localStorage)
✅ Theme switching (dark/light mode)
✅ Language selection
✅ Notification preferences
✅ shadcn/ui components (Form, Switch, Select)
✅ Zustand para estado local
✅ Persistência automática

NÃO PRECISA: API calls ou validação complexa
```

#### **🔄 Extend Existing Feature Prompt**
```
TAREFA: Adicionar funcionalidade "Comments" à feature Products existente.

MODIFICAÇÕES NECESSÁRIAS:

1. src/types/products.ts
   - Adicionar Comment interface
   - Estender Product com comments array

2. src/lib/api/products.ts
   - Adicionar getProductComments(productId)
   - Adicionar addComment(productId, comment)
   - Adicionar deleteComment(commentId)

3. src/components/features/products/product-detail.tsx
   - Adicionar CommentsSection component
   - Integrar com TanStack Query

4. src/components/features/products/comments/
   - comment-form.tsx (React Hook Form)
   - comments-list.tsx (TanStack Query)
   - comment-item.tsx (individual comment)

5. src/lib/validations/products.ts
   - Adicionar commentSchema (Zod)

6. src/app/products/[id]/page.tsx
   - Update para incluir comments na UI

MANTENHA: Arquitetura existente, padrões shadcn/ui, TypeScript types.
```

### 🏗️ **Next.js Architecture Decision Tree**

```
Nova Feature?
├── Precisa de interatividade?
│   ├── SIM → Client Component ('use client')
│   └── NÃO → Server Component (default)
├── É extensão de feature existente?
│   ├── SIM → Adicionar aos componentes existentes
│   └── NÃO → Criar nova estrutura completa
├── Precisa de estado global?
│   ├── SIM → Zustand store
│   └── NÃO → Local state (useState)
├── Precisa de data fetching?
│   ├── SIM → TanStack Query + API functions
│   └── NÃO → Static data ou localStorage
├── Complexidade de UI?
│   ├── ALTA → Múltiplos componentes + shadcn/ui
│   └── BAIXA → Componente simples
```

### 📐 **Next.js Architectural Rules (NEVER BREAK)**

#### **✅ ALWAYS DO:**
1. **Server Components por padrão**: Só use 'use client' quando necessário
2. **shadcn/ui components**: Para toda interface de usuário
3. **TypeScript everywhere**: Interfaces para todos os dados
4. **TanStack Query para APIs**: Cache automático e sincronização
5. **Zod validation**: Para todos os formulários
6. **Responsive design**: Mobile-first com Tailwind
7. **Error boundaries**: Para componentes que podem falhar
8. **Loading states**: Para toda operação assíncrona

#### **❌ NEVER DO:**
1. **Client Components desnecessários**: Não adicione 'use client' sem motivo
2. **Fetch direto em Client Components**: Use TanStack Query
3. **Estado global excessivo**: Use Zustand apenas quando necessário
4. **CSS inline ou styled-components**: Use Tailwind CSS
5. **Componentes não acessíveis**: Sempre use shadcn/ui
6. **Skip loading/error states**: Usuário deve saber o que está acontecendo
7. **Hardcode valores**: Use environment variables

### 🔄 **React Development Reasoning Process**

#### **Before Adding Any Feature:**
1. **Define component structure**: Server ou Client Components?
2. **Plan data flow**: API → TanStack Query → Component
3. **Choose state management**: Local, Zustand, ou TanStack Query?
4. **Design UI components**: Quais shadcn/ui components usar?
5. **Plan validation**: Zod schemas para formulários

#### **During Development:**
1. **Start with types**: TypeScript interfaces primeiro
2. **Build API functions**: lib/api com error handling
3. **Create components**: Server Components primeiro
4. **Add interactivity**: Client Components quando necessário
5. **Style with Tailwind**: Responsive design sempre
6. **Test manually**: Verifique todos os estados

#### **After Implementation:**
1. **Check accessibility**: shadcn/ui garante, mas verifique
2. **Test responsiveness**: Mobile, tablet, desktop
3. **Verify performance**: Lighthouse scores
4. **Error handling**: Teste cenários de erro
5. **Type safety**: Verifique TypeScript errors

### 🎯 **React Feature Checklist**

Antes de considerar a feature "completa":

- [ ] **TypeScript**: Todas interfaces definidas?
- [ ] **Components**: Server/Client separation correta?
- [ ] **UI**: Usando shadcn/ui components?
- [ ] **Data fetching**: TanStack Query implementado?
- [ ] **Forms**: React Hook Form + Zod validation?
- [ ] **Styling**: Tailwind CSS responsivo?
- [ ] **Loading states**: Para todas operações async?
- [ ] **Error handling**: Todos cenários de erro?
- [ ] **Accessibility**: Keyboard navigation funcionando?
- [ ] **Performance**: Bundle size otimizado?

### 💡 **React Pro Tips for Claude Code**

1. **Start with Server Components**: Só mude para Client quando necessário
2. **Use shadcn/ui extensively**: Não reinvente components básicos
3. **TanStack Query for all APIs**: Cache automático e sincronização
4. **Zod for all validation**: Runtime safety + TypeScript
5. **Tailwind utility classes**: Responsive design built-in
6. **Think mobile-first**: Design responsivo desde o início

### 📊 **React Component Templates**

#### **Server Component Template**
```typescript
// app/products/page.tsx
import { getProducts } from '@/lib/api/products';
import { ProductsList } from '@/components/features/products';

export default async function ProductsPage() {
  const initialProducts = await getProducts();
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <ProductsList initialData={initialProducts} />
    </div>
  );
}
```

#### **Client Component Template**  
```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api/products';
import { ProductCard } from './product-card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductsListProps {
  initialData?: Product[];
}

export function ProductsList({ initialData }: ProductsListProps) {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    initialData,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Error loading products</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

#### **Form Component Template**
```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '@/lib/validations/products';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function ProductForm({ onSubmit }: ProductFormProps) {
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Creating...' : 'Create Product'}
        </Button>
      </form>
    </Form>
  );
}
```

### 🎯 **Modern React Benefits**

#### **🚀 Performance Optimization**
- Server-side rendering por padrão
- Automatic code splitting
- Optimized bundle sizes
- Image optimization built-in

#### **📚 Developer Experience**
- TypeScript intellisense completo
- Hot reload instantâneo
- Component debugging fácil
- Modern tooling integration

#### **🎨 Design System Consistency**
- shadcn/ui component library
- Tailwind CSS utility classes
- Dark/light mode built-in
- Responsive design patterns

Ready to vibecode your next React app! ⚡