
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Header } from '@/components/common/Header';
import { AppFooter } from '@/components/common/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If auth state is not loading and there is no user, redirect to login
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // Display a loading state while checking for user authentication
  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Once authenticated, display the dashboard content
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-12 md:py-20">
        <div className="container">
          <div className="mb-12">
            <h1 className="text-h1 font-serif">
              Welcome, {user.displayName || 'Student'}!
            </h1>
            <p className="mt-4 text-body-lead text-muted-foreground max-w-3xl leading-relaxed">
              This is your personal dashboard. Here you can find your enrolled courses, track your progress, and access your certificates.
            </p>
          </div>

          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>
                  Courses you are currently enrolled in.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                    <p>You are not enrolled in any courses yet.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
