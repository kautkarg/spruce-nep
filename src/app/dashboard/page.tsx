
'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { Header } from '@/components/common/Header';
import { AppFooter } from '@/components/common/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { courses } from '@/lib/courses';
import { Button } from '@/components/ui/button';
import { Leaf, BookOpen, User, BookUser } from 'lucide-react';
import Link from 'next/link';
import { collection } from 'firebase/firestore';

export default function DashboardPage() {
  const { user, isUserLoading, firestore } = useFirebase();
  const router = useRouter();

  // New: Query for the user's enrollments sub-collection
  const enrollmentsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, `users/${user.uid}/enrollments`);
  }, [firestore, user?.uid]);

  const { data: enrollments, isLoading: isEnrollmentsLoading } = useCollection<{courseId: string}>(enrollmentsQuery);

  const enrolledCourseIds = useMemo(() => {
    return enrollments?.map(e => e.courseId) || [];
  }, [enrollments]);

  const enrolledCourses = useMemo(() => {
    return courses.filter(course => enrolledCourseIds.includes(course.id));
  }, [enrolledCourseIds]);
  
  const loading = isUserLoading || isEnrollmentsLoading;

  const renderLoadingSkeleton = () => (
    <div className="flex items-center justify-center h-screen bg-background">
      <Leaf className="h-32 w-32 animate-pulse text-primary" />
    </div>
  );

  const EnrolledCoursesList = () => {
    if (loading) {
       return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
                <Card key={i} className="flex flex-col animate-pulse">
                    <CardHeader><div className="h-10 w-10 bg-muted rounded-md"></div></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="h-6 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                        <div className="h-10 bg-muted rounded w-full mt-4"></div>
                    </CardContent>
                </Card>
            ))}
        </div>
       )
    }

    if (enrolledCourses.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No Courses Yet</h3>
            <p className="mt-2 text-body">
              You haven&apos;t enrolled in any courses. Explore our catalog to get started!
            </p>
            <Button variant="outline" className="mt-6" asChild>
              <Link href="/courses">
                Explore Courses
              </Link>
            </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {enrolledCourses.map((course) => (
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
                    View Course
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
              This is your personal dashboard. Here you can find all your enrolled courses and continue your learning journey.
            </p>
          </div>
           <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookUser className="h-6 w-6" />
                  My Enrolled Courses
                </CardTitle>
                <CardDescription>
                  Your journey to new skills starts here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnrolledCoursesList />
              </CardContent>
            </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
