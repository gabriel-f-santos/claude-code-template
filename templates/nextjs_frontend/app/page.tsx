/**
 * 🏠 Home Page - Next.js Vibecoding
 * 
 * Landing page with modern design and feature showcase.
 * Perfect for demonstrations and rapid development.
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, Code, Rocket, Palette, Database, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container relative flex min-h-screen flex-col items-center justify-center py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center space-y-8 text-center">
          <Badge variant="secondary" className="mb-4">
            <Zap className="mr-2 h-3 w-3" />
            Next.js Vibecoding Template
          </Badge>
          
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Build Apps{' '}
            <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Lightning Fast
            </span>
          </h1>
          
          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Modern Next.js template optimized for rapid development with Claude Code subagents. 
            From idea to deployment in minutes, not hours.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs">
                View Documentation
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Everything you need for rapid development
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built with modern technologies and best practices for maximum productivity.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2">
              <CardHeader>
                <Code className="h-8 w-8 text-blue-600" />
                <CardTitle>TypeScript First</CardTitle>
                <CardDescription>
                  Full type safety with excellent developer experience and IntelliSense support.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <Palette className="h-8 w-8 text-purple-600" />
                <CardTitle>Beautiful UI</CardTitle>
                <CardDescription>
                  shadcn/ui components with Radix UI primitives and Tailwind CSS styling.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <Database className="h-8 w-8 text-green-600" />
                <CardTitle>Smart Data Fetching</CardTitle>
                <CardDescription>
                  TanStack Query for server state management with caching and background updates.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <Rocket className="h-8 w-8 text-red-600" />
                <CardTitle>Performance First</CardTitle>
                <CardDescription>
                  Next.js App Router with server components and optimized bundle size.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <Shield className="h-8 w-8 text-yellow-600" />
                <CardTitle>Production Ready</CardTitle>
                <CardDescription>
                  Authentication, error handling, and deployment configuration included.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <Zap className="h-8 w-8 text-indigo-600" />
                <CardTitle>Claude Code Optimized</CardTitle>
                <CardDescription>
                  Perfect architecture for rapid development with AI code assistants.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="container py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Modern Tech Stack
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Carefully selected technologies for optimal developer experience.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Frontend</CardTitle>
                <CardDescription>Modern React with Next.js</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge>Next.js 14</Badge>
                  <Badge>React 18</Badge>
                  <Badge>TypeScript</Badge>
                  <Badge>Tailwind CSS</Badge>
                  <Badge>Radix UI</Badge>
                  <Badge>shadcn/ui</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>State & Data</CardTitle>
                <CardDescription>Efficient state management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge>TanStack Query</Badge>
                  <Badge>Zustand</Badge>
                  <Badge>React Hook Form</Badge>
                  <Badge>Zod</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Developer Tools</CardTitle>
                <CardDescription>Enhanced development experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge>ESLint</Badge>
                  <Badge>Prettier</Badge>
                  <Badge>Vitest</Badge>
                  <Badge>Testing Library</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deployment</CardTitle>
                <CardDescription>Ready for production</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge>Vercel</Badge>
                  <Badge>Docker</Badge>
                  <Badge>GitHub Actions</Badge>
                  <Badge>Sentry</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Ready to start building?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get up and running in minutes with our comprehensive template.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Start Building
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-col items-center gap-2 md:items-start">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built with ❤️ for the vibecoding community.
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/docs">Docs</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/examples">Examples</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="https://github.com/vibecoding/nextjs-template">
                  GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}