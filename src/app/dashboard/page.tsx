
'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Header } from '@/components/common/Header';
import { AppFooter } from '@/components/common/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { courses, Course } from '@/lib/courses';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookOpen, Leaf } from 'lucide-react';

const courseMap = new Map(courses.map(course => [course.id, course]));

export default function DashboardPage() {
  const { user, isUserLoading, firestore } = useFirebase();
  const router = useRouter();

  const enrollmentsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'enrollments'), where('userId', '==', user.uid));
  }, [firestore, user?.uid]);

  const { data: enrollments, isLoading: isLoadingEnrollments } = useCollection(enrollmentsQuery);

  const enrolledCourses = useMemo(() => {
    if (!enrollments) return [];
    const uniqueCourseIds = new Set<string>();
    const uniqueCourses: Course[] = [];
    
    enrollments.forEach(enrollment => {
      if (!uniqueCourseIds.has(enrollment.courseId)) {
        const course = courseMap.get(enrollment.courseId);
        if (course) {
          uniqueCourseIds.add(enrollment.courseId);
          uniqueCourses.push(course);
        }
      }
    });

    return uniqueCourses;
  }, [enrollments]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const renderLoadingSkeleton = () => (
    <div className="flex items-center justify-center h-screen bg-background">
      <Leaf className="h-32 w-32 animate-pulse text-primary" />
    </div>
  );

  const EnrolledCoursesList = () => {
    if (isLoadingEnrollments) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (enrolledCourses.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No Courses Yet</h3>
            <p className="mt-2 text-body">
              You are not enrolled in any courses.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => router.push('/courses')}>
              Explore Courses
            </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {enrolledCourses.map((course, index) => (
          <Card key={`${course.id}-${index}`} className="flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
             <CardHeader className="flex-grow">
              <div className="mb-4">
                  <course.Icon className="w-10 h-10 text-primary" />
              </div>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.certification}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                Start Learning
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (isUserLoading || !user) {
    return renderLoadingSkeleton();
  }

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
              This is your personal dashboard. Here you can find your enrolled courses and track your progress.
            </p>
          </div>
           <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>
                  Courses you have successfully enrolled in.
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
    
