import AuthGuard from '@/lib/auth/AuthGuard';
import { Suspense } from 'react';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<LoadingSpinnerComponent className="h-lvh" />}>
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  );
}
