
"use client";

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { badgeVariants } from '@/components/ui/badge';
import { batches, getCourseById, Course, Batch, courses } from '@/lib/batches';
import { BookOpen, Check, CheckCircle, Info, Calendar, Clock, Radio, Search, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { EnrollmentDialog } from './EnrollmentDialog';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableRow } from '../ui/table';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import Link from 'next/link';

const categories = ['All', ...new Set(courses.map(c => c.category))];
const certifications = ['All', 'RTMNU Certified', 'AAPC Certified'];

export function BatchList() {
    
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCertification, setSelectedCertification] = useState('All');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const router = useRouter();

  const coursesWithBatches = useMemo(() => {
    const courseMap = new Map<string, { course: Course; batches: typeof batches }>();

    batches.forEach(batch => {
      const course = getCourseById(batch.courseId);
      if (course) {
        if (!courseMap.has(course.id)) {
          courseMap.set(course.id, { course, batches: [] });
        }
        const courseBatches = courseMap.get(course.id)!.batches;
        courseBatches.push(batch);
        courseBatches.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      }
    });

    let filtered = Array.from(courseMap.values());

    if (searchQuery) {
        filtered = filtered.filter(({ course }) =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    if (selectedCategory !== 'All') {
        filtered = filtered.filter(({ course }) => course.category === selectedCategory);
    }
    
    if (selectedCertification !== 'All') {
        filtered = filtered.filter(({ course }) => course.certification === selectedCertification);
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedCertification]);

  const handleEnrollClick = (courseId: string) => {
    setIsEnrolling(true);
    setTimeout(() => {
      setSelectedCourse(null);
      const courseElement = document.getElementById(courseId);
      if (courseElement) {
          courseElement.scrollIntoView({ behavior: 'smooth' });
      }
      setIsEnrolling(false);
    }, 1000);
  }

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedCertification('All');
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
        <div className="mb-12 p-6 bg-muted/50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative w-full col-span-1 md:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search for a course..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 text-body bg-background"
                    />
                </div>
                 <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-12 text-body bg-background">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(category => (
                            <SelectItem key={category} value={category}>{category === 'All' ? 'All Categories' : category}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Select value={selectedCertification} onValueChange={setSelectedCertification}>
                    <SelectTrigger className="h-12 text-body bg-background">
                        <SelectValue placeholder="Filter by certification" />
                    </SelectTrigger>
                    <SelectContent>
                        {certifications.map(cert => (
                             <SelectItem key={cert} value={cert}>{cert === 'All' ? 'All Certifications' : cert}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {(searchQuery || selectedCategory !== 'All' || selectedCertification !== 'All') && (
                <div className="flex justify-start pt-2">
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="mr-2 h-4 w-4" />
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>

        {coursesWithBatches.length > 0 ? (
            <div className="space-y-16">
                {coursesWithBatches.map(({ course, batches }) => (
                     <Card key={course.id} id={course.id} className="p-8 scroll-mt-24">
                        {/* Course Header */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <course.Icon className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-primary font-serif">{course.title}</h4>
                                    <p className="flex items-center pt-1 text-meta text-muted-foreground gap-2">
                                        <BookOpen className="h-4 w-4"/>
                                        <span>{course.category}</span>
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setSelectedCourse(course)} className="w-full md:w-auto mt-4 md:mt-0">
                                <Info className="mr-2 h-4 w-4" />
                                View Details
                            </Button>
                        </div>

                        {/* Batches Timeline */}
                        <div className="flow-root">
                          <div className="-mb-8">
                            {batches.map((batch, index) => (
                                <div key={batch.id} className="relative pb-8">
                                     {index !== batches.length - 1 && (
                                        <span className="absolute left-4 top-5 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
                                    )}
                                    <div className="relative flex items-start space-x-6">
                                        {/* Timeline Dot */}
                                        <div className="relative">
                                            <div className="w-8 h-8 rounded-full bg-primary ring-8 ring-background flex items-center justify-center">
                                                {batch.status === 'Live' ? (
                                                    <Radio className="w-5 h-5 text-primary-foreground" />
                                                ) : (
                                                    <Calendar className="w-5 h-5 text-primary-foreground" />
                                                )}
                                            </div>
                                        </div>
                                        {/* Content */}
                                        <div className="min-w-0 flex-1">
                                             <div className="flex items-center gap-4 mb-3">
                                                <p className='text-body-lead font-semibold text-foreground'>{format(new Date(batch.startDate), 'MMMM yyyy')}</p>
                                                <Badge
                                                  variant={batch.status === 'Live' ? 'destructive' : 'default'}
                                                  className={cn(
                                                    'text-caption px-3 py-1',
                                                    batch.status === 'Upcoming' && 'bg-primary text-primary-foreground'
                                                  )}
                                                >
                                                  {batch.status}
                                                </Badge>
                                            </div>
                                            <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                    <div className='space-y-3'>
                                                        <div className='flex items-center gap-3 text-meta text-muted-foreground'>
                                                            <Calendar className='h-5 w-5' />
                                                            <span className='font-semibold text-foreground'>Starts {format(new Date(batch.startDate), 'MMMM dd')}</span>
                                                        </div>
                                                         <div className='flex items-center gap-3 text-meta text-muted-foreground'>
                                                            <Clock className='h-5 w-5' />
                                                            <span>{batch.time.split(' - ')[0]}</span>
                                                        </div>

                                                    </div>
                                                     <Button size="sm" onClick={() => setSelectedBatch(batch)} className='w-full md:w-auto mt-4 md:mt-0' disabled={isEnrolling}>
                                                        {isEnrolling && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                                        <CheckCircle className="mr-2 h-5 w-5" />
                                                        Enroll Now
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                      </div>
                    </Card>
                ))}
            </div>
        ) : (
             <div className="text-center py-16">
                <h3>No Batches Found</h3>
                <p className="text-muted-foreground mt-2 text-body-lead leading-relaxed">Try adjusting your search or filters.</p>
            </div>
        )}

        <Dialog open={!!selectedCourse} onOpenChange={(isOpen) => !isOpen && setSelectedCourse(null)}>
            <DialogContent className="sm:max-w-lg p-0">
            {selectedCourse && (
                <>
                <DialogHeader className="p-6 pb-4">
                    <DialogClose asChild>
                        <Button variant="ghost" size="icon" className="absolute right-4 top-4 h-8 w-8">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </DialogClose>
                    <div className='flex items-start gap-4 mb-4'>
                        <div className="w-14 h-14 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <selectedCourse.Icon className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <DialogTitle asChild>
                                <h4 className="text-primary mb-2 font-serif">
                                    {selectedCourse.title}
                                </h4>
                            </DialogTitle>
                            <div className='flex flex-wrap gap-2'>
                                <Badge variant="outline" className="text-meta">
                                    {selectedCourse.certification}
                                </Badge>
                                <Badge variant="outline" className="text-meta">
                                    NEP 2020 Aligned
                                </Badge>
                            </div>
                        </div>
                    </div>
                </DialogHeader>
                <DialogDescription asChild>
                    <ScrollArea className='h-[60vh] px-6'>
                       <div className="text-body text-left text-foreground/90 space-y-8 pb-6">
                            <Table>
                                <TableBody>
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell className="font-semibold text-foreground">Credits</TableCell>
                                        <TableCell>{selectedCourse.details.credits}</TableCell>
                                    </TableRow>
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell className="font-semibold text-foreground">Duration</TableCell>
                                        <TableCell>{selectedCourse.details.duration}</TableCell>
                                    </TableRow>
                                    <TableRow className="hoverbg-transparent">
                                        <TableCell className="font-semibold text-foreground">Eligibility</TableCell>
                                        <TableCell>{selectedCourse.details.eligibility}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <div>
                                <h4 className='mb-3'>Course Objectives</h4>
                                <ul className='space-y-2'>
                                    {selectedCourse.details.objectives.map((obj, i) => (
                                        <li key={i} className='flex items-start gap-3'>
                                            <Check className='h-5 w-5 mt-1 text-primary flex-shrink-0' />
                                            <span>{obj}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className='mb-3'>Learning Outcomes</h4>
                                <ul className='space-y-2'>
                                    {selectedCourse.details.outcomes.map((out, i) => (
                                        <li key={i} className='flex items-start gap-3'>
                                            <Check className='h-5 w-5 mt-1 text-primary flex-shrink-0' />
                                            <span>{out}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className='mb-3'>Add-Ons</h4>
                                <ul className='space-y-2'>
                                    {selectedCourse.details.addOns.map((add, i) => (
                                        <li key={i} className='flex items-start gap-3'>
                                            <Check className='h-5 w-5 mt-1 text-primary flex-shrink-0' />
                                            <span>{add}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className='mb-3'>Trainer Profile</h4>
                                <p className='text-foreground/80 leading-relaxed'>{selectedCourse.trainerInfo}</p>
                            </div>
                        </div>
                    </ScrollArea>
                </DialogDescription>
                </>
            )}
            </DialogContent>
        </Dialog>
        {selectedBatch && (
            <EnrollmentDialog 
                batch={selectedBatch} 
                course={getCourseById(selectedBatch.courseId)!}
                open={!!selectedBatch} 
                onOpenChange={(isOpen) => !isOpen && setSelectedBatch(null)}
            />
        )}
    </div>
  );
}

    