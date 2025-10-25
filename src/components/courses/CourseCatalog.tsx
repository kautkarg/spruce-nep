
"use client";

import { useState } from "react";
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
import { Check, X, Loader2 } from "lucide-react";
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
import { usePathname, useRouter } from "next/navigation";
import { useUser, useFirestore } from "@/firebase";
import { enrollInCourse } from "@/lib/enrollments";
import { useToast } from "@/hooks/use-toast";

const categories = ["Healthcare", "Finance & Banking", "Media & Tech"];

export function CourseCatalog() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const showBenefits = pathname === '/courses';
  const filteredCourses = courses.filter((c) => c.category === activeCategory);

  const handleEnrollment = async () => {
    if (!user || !selectedCourse || !firestore) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "You need to be logged in to enroll in a course.",
      });
      router.push('/login');
      return;
    }

    setIsEnrolling(true);

    try {
      enrollInCourse(firestore, { userId: user.uid, courseId: selectedCourse.id });
      
      toast({
        title: "Enrollment Successful!",
        description: `You've been enrolled in ${selectedCourse.title}.`,
      });
      
      setSelectedCourse(null);
      // Optionally, redirect to the dashboard
      // router.push('/dashboard');
      
    } catch (error) {
      console.error("Enrollment failed:", error);
      toast({
        variant: "destructive",
        title: "Enrollment Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <>
      <section id="courses" className="py-20 md:py-28 bg-muted/30 border-y">
        <div className="container">
          <div className="text-center mb-12">
              <h2 className="text-h2 font-serif">
                  Our Course Catalog
              </h2>
              <p className="mt-6 text-body-lead text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Each course is a university-approved, credit-based program designed to make you job-ready.
              </p>
          </div>
          {showBenefits && <CourseBenefits />}
          
          <div className="mt-12">
             {/* Mobile Dropdown */}
            <div className="md:hidden mb-8">
              <Select value={activeCategory} onValueChange={setActiveCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="hidden md:grid md:grid-cols-[240px_1fr] md:gap-12">
              {/* Desktop Sidebar Filters */}
              <aside>
                <h3 className="text-h4 font-semibold mb-6">Categories</h3>
                <div className="flex flex-col items-start gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant="ghost"
                      onClick={() => setActiveCategory(category)}
                      className={cn(
                        "w-full justify-start text-body-lead h-auto py-3 px-4 leading-relaxed",
                        activeCategory === category && "bg-primary/10 text-primary font-semibold"
                      )}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </aside>

              {/* Course Grid */}
              <main>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCourses.map((course) => (
                    <div key={course.id} className="flex flex-col text-left overflow-hidden h-full shadow-sm hover:shadow-lg transition-shadow bg-card rounded-xl">
                      <div className="p-8 flex flex-col flex-grow">
                        <div className="mb-6 flex-shrink-0">
                          <course.Icon className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="font-serif mb-3 flex-grow">
                          {course.title}
                        </h3>
                        <p className="text-body text-muted-foreground leading-relaxed mb-6">
                          {course.description}
                        </p>
                        <Button
                          variant="link"
                          className="p-0 h-auto justify-start text-primary font-semibold"
                          onClick={() => setSelectedCourse(course)}
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </main>
            </div>

            {/* Mobile Course Grid */}
            <div className="grid md:hidden grid-cols-1 sm:grid-cols-2 gap-8">
              {filteredCourses.map((course) => (
                <div key={course.id} className="flex flex-col text-left overflow-hidden h-full shadow-sm hover:shadow-lg transition-shadow bg-card rounded-xl">
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="mb-6 flex-shrink-0">
                      <course.Icon className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="font-serif mb-3 flex-grow">
                      {course.title}
                    </h3>
                    <p className="text-body text-muted-foreground leading-relaxed mb-6">
                      {course.description}
                    </p>
                    <Button
                      variant="link"
                      className="p-0 h-auto justify-start text-primary font-semibold"
                      onClick={() => setSelectedCourse(course)}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Dialog
          open={!!selectedCourse}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setSelectedCourse(null);
              setIsEnrolling(false);
            }
          }}
        >
          <DialogContent className="sm:max-w-lg p-0">
            {selectedCourse && (
              <>
                <DialogHeader className="p-6 pb-4">
                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-4 h-8 w-8"
                    >
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
                        <h4 className="text-primary mb-2 font-serif">
                          {selectedCourse.title}
                        </h4>
                      </DialogTitle>
                      <div className="flex flex-wrap gap-2">
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
                  <ScrollArea className="max-h-[50vh] px-6">
                    <div className="text-body text-left text-foreground/90 space-y-8 pb-6">
                      <Table>
                        <TableBody>
                          <TableRow className="hover:bg-transparent">
                            <TableCell className="font-semibold text-foreground">
                              Credits
                            </TableCell>
                            <TableCell>{selectedCourse.details.credits}</TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-transparent">
                            <TableCell className="font-semibold text-foreground">
                              Duration
                            </TableCell>
                            <TableCell>
                              {selectedCourse.details.duration}
                            </TableCell>
                          </TableRow>
                          <TableRow className="hoverbg-transparent">
                            <TableCell className="font-semibold text-foreground">
                              Eligibility
                            </TableCell>
                            <TableCell>
                              {selectedCourse.details.eligibility}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>

                      <div>
                        <h4 className="mb-3">Course Objectives</h4>
                        <ul className="space-y-2">
                          {selectedCourse.details.objectives.map((obj, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <Check className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="mb-3">Learning Outcomes</h4>
                        <ul className="space-y-2">
                          {selectedCourse.details.outcomes.map((out, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <Check className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                              <span>{out}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="mb-3">Add-Ons</h4>
                        <ul className="space-y-2">
                          {selectedCourse.details.addOns.map((add, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <Check className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                              <span>{add}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="mb-3">Trainer Profile</h4>
                        <p className="text-foreground/80 leading-relaxed">
                          {selectedCourse.trainerInfo}
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </DialogDescription>
                <DialogFooter className="p-6 border-t bg-muted/50">
                  {user ? (
                    <Button onClick={handleEnrollment} disabled={isEnrolling} className="w-full" size="lg">
                      {isEnrolling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Enroll Now"}
                    </Button>
                  ) : (
                    <Button asChild className="w-full" size="lg">
                      <Link href="/login">Login to Enroll</Link>
                    </Button>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </section>
    </>
  );
}
