/**
 * 📊 Dashboard Page (Simplified)
 * Generic placeholder page.
 */
import React from 'react';
import type { Metadata } from 'next';
import { AuthGuard } from '@/components/auth/auth-guard';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Generic dashboard placeholder',
};

function DashboardContent() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <p className="text-center text-sm text-muted-foreground">
        em vindo templates/frontend_nextjs/app/dashboard/page.tsx
      </p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <DashboardContent />
    </AuthGuard>
  );
}