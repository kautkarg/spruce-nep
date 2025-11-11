
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { courses } from "@/lib/courses";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Check, X, ArrowRight } from "lucide-react";
import type { Course } from "@/lib/courses";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseBenefits } from "./CourseBenefits";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const categories = ["Healthcare", "Finance & Banking", "Media & Tech"];

export function CourseCatalog() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const filteredCourses = courses.filter((c) => c.category === activeCategory);

  // Effect to handle opening dialogs from URL parameters
  useEffect(() => {
    const courseIdToOpen = searchParams.get('enroll');

    if (courseIdToOpen) {
        const courseToOpen = courses.find(c => c.id === courseIdToOpen);
        if (courseToOpen) {
            openCourseDialog(courseToOpen);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, pathname]);


  const openCourseDialog = (course: Course) => {
    setSelectedCourse(course);
  }

  const closeDialog = () => {
    setSelectedCourse(null);
    
    // Clean up URL
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('enroll');
    router.replace(`${pathname}?${newParams.toString()}`);
  }
  
  const renderDialogContent = () => {
    const isDialogOpen = !!selectedCourse;
    if (!isDialogOpen) return null;
    
    // Details step for a course
    if (!selectedCourse) return null;
    return (
      <>
        <DialogHeader className="p-6 pb-4">
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 h-8 w-8" onClick={closeDialog}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <selectedCourse.Icon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <DialogTitle asChild>
                <h4 className="text-primary mb-2 font-serif">{selectedCourse.title}</h4>
              </DialogTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-meta">{selectedCourse.certification}</Badge>
                <Badge variant="outline" className="text-meta">NEP 2020 Aligned</Badge>
              </div>
            </div>
          </div>
        </DialogHeader>
        <DialogDescription asChild>
          <ScrollArea className="max-h-[50vh] px-6">
            <div className="text-body text-left text-foreground/90 space-y-8 pb-6">
              <Table>
                <TableBody>
                  <TableRow className="hover:bg-transparent"><TableCell className="font-semibold text-foreground">Credits</TableCell><TableCell>{selectedCourse.details.credits}</TableCell></TableRow>
                  <TableRow className="hover:bg-transparent"><TableCell className="font-semibold text-foreground">Duration</TableCell><TableCell>{selectedCourse.details.duration}</TableCell></TableRow>
                  <TableRow className="hoverbg-transparent"><TableCell className="font-semibold text-foreground">Who Can Join</TableCell><TableCell>{selectedCourse.details.eligibility}</TableCell></TableRow>
                </TableBody>
              </Table>
              <div><h4 className="mb-3">What You'll Achieve</h4><ul className="space-y-2">{selectedCourse.details.objectives.map((obj, i) => (<li key={i} className="flex items-start gap-3"><Check className="h-5 w-5 mt-1 text-primary flex-shrink-0" /><span>{obj}</span></li>))}</ul></div>
              <div><h4 className="mb-3">Skills You'll Master</h4><ul className="space-y-2">{selectedCourse.details.outcomes.map((out, i) => (<li key={i} className="flex items-start gap-3"><Check className="h-5 w-5 mt-1 text-primary flex-shrink-0" /><span>{out}</span></li>))}</ul></div>
              <div><h4 className="mb-3">Bonus Perks</h4><ul className="space-y-2">{selectedCourse.details.addOns.map((add, i) => (<li key={i} className="flex items-start gap-3"><Check className="h-5 w-5 mt-1 text-primary flex-shrink-0" /><span>{add}</span></li>))}</ul></div>
              <div><h4 className="mb-3">Meet Your Mentor</h4><p className="text-foreground/80 leading-relaxed">{selectedCourse.trainerInfo}</p></div>
            </div>
          </ScrollArea>
        </DialogDescription>
        <DialogFooter className="p-6 border-t bg-muted/50 gap-4">
            <Button asChild className="w-full" size="lg">
              <Link href="/#enroll">
                Enroll Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
        </DialogFooter>
      </>
    )
  }

  return (
    <>
      <section id="courses" className="py-20 md:py-28 bg-muted/30 border-y">
        <div className="container">
          <div className="text-center mb-12">
              <h2 className="text-h2 font-serif">
                  Your Next Career Move Starts Here
              </h2>
              <p className="mt-6 text-body-lead text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Ready to launch your career? Explore our university-approved, credit-based programs. Each one is a launchpad designed to make you not just a graduate, but a job-ready pro.
              </p>
          </div>
          
          <div className="mt-12">
            <div className="md:hidden mb-8">
              <Select value={activeCategory} onValueChange={setActiveCategory}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Browse by Category" /></SelectTrigger>
                <SelectContent>{categories.map((category) => (<SelectItem key={category} value={category}>{category}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="hidden md:grid md:grid-cols-[240px_1fr] md:gap-12">
              <aside>
                <h3 className="text-h4 font-semibold mb-6">Course Categories</h3>
                <div className="flex flex-col items-start gap-2">
                  {categories.map((category) => (
                    <Button key={category} variant="ghost" onClick={() => setActiveCategory(category)} className={cn("w-full justify-start text-body-lead h-auto py-3 px-4 leading-relaxed", activeCategory === category && "bg-primary/10 text-primary font-semibold")}>{category}</Button>
                  ))}
                </div>
              </aside>
              <main>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCourses.map((course) => (
                    <div key={course.id} className="flex flex-col text-left overflow-hidden h-full shadow-sm hover:shadow-lg transition-shadow bg-card rounded-xl">
                      <div className="p-8 flex flex-col flex-grow">
                        <div className="mb-6 flex-shrink-0"><course.Icon className="w-10 h-10 text-primary" /></div>
                        <h3 className="font-serif mb-3 flex-grow">{course.title}</h3>
                        <p className="text-body text-muted-foreground leading-relaxed mb-6">{course.description}</p>
                        <Button variant="link" className="p-0 h-auto justify-start text-primary font-semibold" onClick={() => openCourseDialog(course)}>Dive into the Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </main>
            </div>
            <div className="grid md:hidden grid-cols-1 sm:grid-cols-2 gap-8">
              {filteredCourses.map((course) => (
                <div key={course.id} className="flex flex-col text-left overflow-hidden h-full shadow-sm hover:shadow-lg transition-shadow bg-card rounded-xl">
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="mb-6 flex-shrink-0"><course.Icon className="w-10 h-10 text-primary" /></div>
                    <h3 className="font-serif mb-3 flex-grow">{course.title}</h3>
                    <p className="text-body text-muted-foreground leading-relaxed mb-6">{course.description}</p>
                    <Button variant="link" className="p-0 h-auto justify-start text-primary font-semibold" onClick={() => openCourseDialog(course)}>Dive into the Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Dialog open={!!selectedCourse} onOpenChange={(isOpen) => { if (!isOpen) closeDialog(); }}>
          <DialogContent className="sm:max-w-lg p-0">{renderDialogContent()}</DialogContent>
        </Dialog>
      </section>
    </>
  );
}
