
'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { Header } from '@/components/common/Header';
import { AppFooter } from '@/components/common/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { courses } from '@/lib/courses';
import { Button } from '@/components/ui/button';
import { Leaf, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();

  const renderLoadingSkeleton = () => (
    <div className="flex items-center justify-center h-screen bg-background">
      <Leaf className="h-32 w-32 animate-pulse text-primary" />
    </div>
  );

  const AllCoursesList = () => {
    if (courses.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No Courses Available</h3>
            <p className="mt-2 text-body">
              There are currently no courses to display.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => router.push('/')}>
              Back to Home
            </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
             <CardHeader className="flex-grow">
              <div className="mb-4">
                  <course.Icon className="w-10 h-10 text-primary" />
              </div>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.certification}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={`/courses?enroll=${course.id}`}>
                    View Details & Enroll
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (isUserLoading) {
    return renderLoadingSkeleton();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-12 md:py-20">
        <div className="container">
          <div className="mb-12">
            <h1 className="text-h1 font-serif">
              Welcome, {user?.isAnonymous ? 'Student' : (user?.displayName || 'Student')}!
            </h1>
            <p className="mt-4 text-body-lead text-muted-foreground max-w-3xl leading-relaxed">
              This is your personal dashboard. Here you can find all available courses and start your learning journey.
            </p>
          </div>
           <Card>
              <CardHeader>
                <CardTitle>All Available Courses</CardTitle>
                <CardDescription>
                  Explore our programs and enroll to get started.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AllCoursesList />
              </CardContent>
            </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
    
