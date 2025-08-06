# 🚀 Next.js Vibecoding Frontend Template

## Modern React Architecture - Perfect for Rapid Development!

This template follows the **vibecoding** philosophy with **Next.js App Router**: simple, modular, demonstrable code perfect for rapid frontend development (15-minute features) and live coding sessions with Claude Code subagents.

## 🏗️ Vibecoding Frontend Structure
```
├── app/                   # Next.js App Router
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Landing page
│   ├── dashboard/            # Dashboard pages
│   ├── login/               # Auth pages
│   └── globals.css          # Global styles
├── components/            # UI Components
│   ├── ui/                  # shadcn/ui components (Button, Card, etc.)
│   │   ├── button.tsx          # Versatile button component
│   │   ├── card.tsx           # Flexible card components
│   │   ├── input.tsx          # Form input component
│   │   └── ...                # More UI primitives
│   └── features/            # Feature-specific components
│       ├── auth/              # Auth-related components
│       ├── dashboard/         # Dashboard components
│       └── products/          # Product components
├── hooks/                 # Custom React hooks
│   ├── use-api.ts            # TanStack Query API hooks
│   ├── use-auth.ts           # Authentication hooks
│   └── use-local-storage.ts  # Utility hooks
├── lib/                   # Utility libraries
│   ├── api.ts               # API client with types
│   ├── utils.ts             # Common utilities (cn, formatters)
│   └── validations.ts       # Form validation schemas
├── providers/             # React context providers
│   ├── query-provider.tsx    # TanStack Query provider
│   ├── theme-provider.tsx    # Theme management
│   └── toast-provider.tsx    # Toast notifications
├── store/                 # Zustand stores
│   ├── auth-store.ts         # Authentication state
│   ├── ui-store.ts          # UI state (theme, sidebar, etc.)
│   └── app-store.ts         # Global app state
├── styles/               # Styling
│   └── globals.css          # Tailwind + custom CSS variables
└── types/                # TypeScript definitions
    └── index.ts             # Shared type definitions
```

## ⚡ Quick Start Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Type checking
npm run type-check

# Lint and fix
npm run lint:fix

# Visit http://localhost:3000
```

## 🎯 **Radix UI + shadcn/ui Strategy**

### **Perfect Combination:**
```
Radix UI (primitives) → shadcn/ui (styled components) → Your app
```

### **What each provides:**
- **Radix UI**: Accessibility, keyboard navigation, ARIA compliance
- **shadcn/ui**: Beautiful styling with Tailwind CSS
- **Result**: Production-ready components in minutes

### **When to use each:**
```typescript
// Use shadcn/ui for 90% of cases (pre-styled)
import { Button } from '@/components/ui/button';

// Use Radix directly for custom components
import * as Dialog from '@radix-ui/react-dialog';
```

## 🔥 Modern Frontend Patterns

### **Server Components First (App Router)**
```typescript
// Server Component (default) - Great for SEO and performance
export default async function ProductsPage() {
  const products = await getProducts(); // Server-side data fetching
  return <ProductList products={products} />;
}

// Client Component when needed
'use client';
export function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### **Type-Safe API Integration**
```typescript
// Fully typed API hooks
const { data: users, isLoading } = useUsers({
  page: 1,
  limit: 10,
  search: 'john'
});

// Type-safe mutations
const createProduct = useCreateProduct();
await createProduct.mutateAsync({
  name: 'New Product',
  price: 29.99,
  category: 'Electronics'
});
```

### **Smart State Management**
```typescript
// Global auth state with Zustand
const { user, isAuthenticated, login } = useAuth();

// UI state management
const { theme, setTheme, sidebarOpen, toggleSidebar } = useUIStore();

// Server state with TanStack Query (automatic caching)
const { data, refetch, isStale } = useProducts();
```

### **Accessible UI Components**
```typescript
// Built on Radix primitives - fully accessible
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## 🧪 Testing Philosophy

### **Component Testing with Vitest**
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
});
```

## 🤖 Claude Code Subagent Prompts

### **React Vibecoding Expert**
**Perfect for rapid 15-minute component development!**

```
You are a Next.js Vibecoding Expert specializing in modern React development.

CONTEXT: This project uses the vibecoding architecture:
- Next.js App Router with Server/Client components
- shadcn/ui components built on Radix UI primitives  
- TanStack Query for server state management
- Zustand for client state management
- TypeScript with full type safety
- Tailwind CSS for styling
- Focus on rapid development (5-15 minutes for complete features)

VIBECODING PRINCIPLES:
- Server Components first, Client Components when needed
- Use shadcn/ui components (already styled and accessible)
- Leverage Radix UI for custom interactive components
- Type-safe API integration with hooks
- Responsive design with Tailwind
- Perfect for demos and live coding

EXAMPLE TASK:
"Create a complete 'ProductCard' component with image, title, price, and actions. Include hover effects, responsive design, and integration with the products API. Make it ready to demo in 15 minutes."

WHAT TO INCLUDE:
1. Component definition (components/features/products/product-card.tsx)
2. Type definitions for props
3. Integration with API hooks (useUpdateProduct, useDeleteProduct)
4. Responsive Tailwind styling
5. Accessibility considerations
6. Loading and error states
```

### **Next.js App Router Expert**
**For modern Next.js development patterns!**

```
You are a Next.js App Router Vibecoding Expert.

SPECIALIZES IN:
- Server Components vs Client Components decision making
- App Router file conventions (layout.tsx, page.tsx, loading.tsx)
- Server Actions and form handling
- Route groups and parallel routes
- Metadata API and SEO optimization
- Streaming and Suspense patterns

COMMON NEXT.JS PATTERNS:
- Server Components for data fetching and SEO
- Client Components for interactivity
- Loading UI with loading.tsx files
- Error boundaries with error.tsx
- Metadata generation for each page

EXAMPLE TASK:
"Create a complete products dashboard with server-side data fetching, client-side filters, loading states, and error handling using App Router patterns."
```

### **UI/UX Vibecoding Expert**
**For beautiful and accessible interfaces!**

```
You are a UI/UX Vibecoding Expert specializing in shadcn/ui and Radix UI.

CONTEXT: This project uses shadcn/ui components built on Radix UI primitives.

FOCUS ON:
- shadcn/ui component composition and customization
- Radix UI primitives for complex interactions
- Tailwind CSS responsive design patterns
- Accessibility best practices (ARIA, keyboard navigation)
- Dark/light theme support
- Animation and micro-interactions

DESIGN PRINCIPLES:
- Mobile-first responsive design
- Consistent spacing and typography
- Proper contrast ratios
- Keyboard and screen reader accessibility
- Smooth animations with Tailwind and Framer Motion

EXAMPLE TASK:
"Design a user profile card with avatar, user info, action buttons, and a settings dropdown. Make it fully responsive, accessible, and support dark mode."
```

## ⚡ Vibecoding Benefits

### 🚀 **Lightning Fast Development**
- Complete pages in 15 minutes with Server Components
- Pre-built UI components ready to use
- Type-safe API integration out of the box
- Claude Code subagent optimized

### 🎯 **Modern Architecture**  
- Next.js App Router for performance
- Server Components for SEO
- Client Components for interactivity
- Streaming and Suspense for better UX

### 🎨 **Beautiful UI**
- shadcn/ui components (professionally designed)
- Full accessibility with Radix UI primitives
- Dark/light theme support
- Responsive design patterns

### 🔧 **Developer Experience**
- TypeScript for type safety
- Hot reload development
- Component testing with Vitest
- ESLint + Prettier configuration

## 📚 **Key Technologies Explained**

### **Next.js App Router**
- **Server Components**: Better SEO, faster initial loads
- **Client Components**: Rich interactivity when needed
- **Streaming**: Progressive page loading
- **File-based routing**: Intuitive project structure

### **shadcn/ui + Radix UI**
- **shadcn/ui**: Pre-styled, copy-paste components
- **Radix UI**: Accessible primitives underneath
- **Tailwind CSS**: Utility-first styling
- **Best of both worlds**: Speed + customization

### **TanStack Query**
- **Server state management**: Automatic caching and background updates
- **Optimistic updates**: Better user experience
- **Error handling**: Built-in retry and error boundaries
- **DevTools**: Excellent debugging experience

### **Zustand**
- **Client state**: Simple, lightweight store
- **TypeScript**: Full type support
- **Persistence**: Automatic localStorage sync
- **No boilerplate**: Clean, simple API

## 🔧 Environment Setup

Copy `.env.example` to `.env.local`:

```bash
# Next.js Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Development
NODE_ENV=development
```

## 📈 What You Get Out of the Box

✅ **Modern Next.js 14** - App Router with Server/Client components  
✅ **Beautiful UI Components** - shadcn/ui + Radix UI primitives  
✅ **Type-Safe API** - Full TypeScript integration  
✅ **Smart Caching** - TanStack Query with background updates  
✅ **State Management** - Zustand for client state  
✅ **Responsive Design** - Mobile-first with Tailwind CSS  
✅ **Dark/Light Theme** - Built-in theme switching  
✅ **Authentication** - Complete auth flow with JWT  
✅ **Form Handling** - React Hook Form + Zod validation  
✅ **Testing Setup** - Vitest + Testing Library  
✅ **Accessibility** - WCAG compliant with Radix UI  
✅ **SEO Optimized** - Metadata API and Server Components

## 🎯 Perfect for Vibecoding Sessions!

This template is specifically designed for:
- **Claude Code subagent development** with clear component structure
- **Live coding demonstrations** with beautiful, ready-to-use components
- **Rapid prototyping** with pre-configured state management
- **Teaching modern React** with best practices built-in
- **Building production apps** with scalable architecture

Ready to build beautiful, fast, accessible React applications! 🚀

**The perfect combination: Next.js power + shadcn/ui beauty + Radix accessibility = Vibecoding magic! ✨**