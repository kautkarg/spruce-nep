
"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Check, X, LoaderPinwheel, CreditCard, PartyPopper, BookUser, ArrowRight } from "lucide-react";
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
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { enrollInCourse } from "@/lib/enrollments";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { collection, query, where } from "firebase/firestore";

const categories = ["Healthcare", "Finance & Banking", "Media & Tech"];

type EnrollmentStep = 'details' | 'payment' | 'success';

export function CourseCatalog() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollmentStep, setEnrollmentStep] = useState<EnrollmentStep>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const showBenefits = pathname === '/courses';
  const filteredCourses = courses.filter((c) => c.category === activeCategory);

  const enrollmentsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'enrollments'), where('userId', '==', user.uid));
  }, [firestore, user?.uid]);

  const { data: enrollments } = useCollection(enrollmentsQuery);

  const isAlreadyEnrolled = useMemo(() => {
    if (!enrollments || !selectedCourse) return false;
    return enrollments.some(enrollment => enrollment.courseId === selectedCourse.id);
  }, [enrollments, selectedCourse]);

  const handlePayment = async () => {
    if (!user || !selectedCourse || !firestore) return;

    setIsProcessing(true);
    // DEVELOPER NOTE: Replace this setTimeout with your payment gateway's API call.
    // The payment gateway's success callback should then trigger the enrollment and next step.
    console.log("Simulating payment for:", user.uid, selectedCourse.id);
    setTimeout(async () => {
      try {
        // On successful payment, enroll the user in the course.
        await enrollInCourse(firestore, { userId: user.uid, courseId: selectedCourse.id });
        
        console.log("Enrollment successful, setting step to 'success'");
        toast({
            title: "Let the learning commence!",
            description: `You're officially enrolled in "${selectedCourse.title}". Your dashboard is now one click away.`,
        });
        setEnrollmentStep('success');

      } catch (error) {
         console.error("Enrollment failed:", error);
         toast({
          variant: "destructive",
          title: "Oh no, a wild error appeared!",
          description: "Something went wrong while saving your spot. Please give it another go.",
        });
        setEnrollmentStep('payment'); // Go back to payment step on failure
      } finally {
        setIsProcessing(false);
      }
    }, 2000); // Simulating a 2-second payment processing delay.
  };


  const openDialog = (course: Course) => {
    setSelectedCourse(course);
    setEnrollmentStep('details');
  }

  const closeDialog = () => {
    setSelectedCourse(null);
    setIsProcessing(false);
    // Reset step after a short delay to allow for closing animation
    setTimeout(() => setEnrollmentStep('details'), 300);
  }
  
  const renderDialogContent = () => {
    if (!selectedCourse) return null;

    if (enrollmentStep === 'success') {
      return (
        <>
          <DialogHeader className="p-6 text-center items-center">
            <PartyPopper className="h-16 w-16 text-primary mb-4" />
            <DialogTitle asChild>
              <h4 className="text-primary mb-2 font-serif">
                You're In! Welcome Aboard!
              </h4>
            </DialogTitle>
            <DialogDescription className="text-body text-foreground/90 max-w-sm mx-auto">
              You've successfully enrolled in "{selectedCourse.title}". Your learning adventure begins now in your dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="p-6 border-t bg-muted/50">
            <Button onClick={() => router.push('/dashboard')} className="w-full" size="lg">
              Go to My Dashboard
            </Button>
          </DialogFooter>
        </>
      )
    }

    if (enrollmentStep === 'payment') {
      return (
         <>
          <DialogHeader className="p-6">
             <Button variant="ghost" size="icon" className="absolute right-4 top-4 h-8 w-8" onClick={() => setEnrollmentStep('details')}>
                <X className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            <DialogTitle asChild>
              <h4 className="text-primary mb-2 font-serif">
                Final Step: Secure Your Spot
              </h4>
            </DialogTitle>
            <DialogDescription className="text-body text-left text-foreground/90">
             You're one step away from unlocking "{selectedCourse.title}". This is where the magic happens!
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6 space-y-6">
            <div className="border rounded-lg p-4 space-y-2 bg-muted/50">
                <div className="flex justify-between items-center text-body font-semibold">
                    <span>{selectedCourse.title}</span>
                    <span>₹{selectedCourse.fees.toLocaleString()}</span>
                </div>
                 <p className="text-sm text-muted-foreground">One-time investment for a lifetime of skills.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" placeholder="1234 5678 9101 1121" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="card-name">Name on Card</Label>
                <Input id="card-name" placeholder="Your Name" className="mt-1" />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <Label htmlFor="expiry-date">Expiry Date</Label>                  <Input id="expiry-date" placeholder="MM/YY" className="mt-1" />
                </div>
                <div className="w-1/2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" className="mt-1" />
                </div>
              </div>
            </div>
            {/* DEVELOPER NOTE: This section contains the simulated payment logic.
                To implement a real payment gateway (e.g., Stripe, Razorpay),
                replace the `handlePayment` function logic with your chosen provider's SDK.
                The `enrollInCourse` function should only be called after a successful payment confirmation from your gateway.
            */}
          </div>
          <DialogFooter className="p-6 border-t bg-muted/50">
            <Button onClick={handlePayment} disabled={isProcessing} className="w-full" size="lg">
              {isProcessing ? <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
              {isProcessing ? "Processing Payment..." : `Pay ₹${selectedCourse.fees.toLocaleString()} & Start Learning`}
            </Button>
          </DialogFooter>
        </>
      )
    }
    
    // Details step
    return (
      <>
        <DialogHeader className="p-6 pb-4">
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 h-8 w-8"
              onClick={closeDialog}
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
                      Who Can Join
                    </TableCell>
                    <TableCell>
                      {selectedCourse.details.eligibility}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div>
                <h4 className="mb-3">What You'll Achieve</h4>
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
                <h4 className="mb-3">Skills You'll Master</h4>
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
                <h4 className="mb-3">Bonus Perks</h4>
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
                <h4 className="mb-3">Meet Your Mentor</h4>
                <p className="text-foreground/80 leading-relaxed">
                  {selectedCourse.trainerInfo}
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogDescription>
        <DialogFooter className="p-6 border-t bg-muted/50">
          {user ? (
            isAlreadyEnrolled ? (
              <Button onClick={() => router.push('/dashboard')} className="w-full" size="lg" variant="outline">
                <BookUser className="mr-2 h-4 w-4" />
                You're Already Enrolled! Go to Dashboard
              </Button>
            ) : (
              <Button onClick={() => setEnrollmentStep('payment')} disabled={isProcessing} className="w-full" size="lg">
                 Enroll for ₹{selectedCourse.fees.toLocaleString()}
                 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )
          ) : (
            <Button asChild className="w-full" size="lg">
              <Link href="/login?redirect=/courses">Login to Start Your Journey</Link>
            </Button>
          )}
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
          {showBenefits && <CourseBenefits />}
          
          <div className="mt-12">
             {/* Mobile Dropdown */}
            <div className="md:hidden mb-8">
              <Select value={activeCategory} onValueChange={setActiveCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Browse by Category" />
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
                <h3 className="text-h4 font-semibold mb-6">Course Categories</h3>
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
                          onClick={() => openDialog(course)}
                        >
                          Dive into the Details
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
                      onClick={() => openDialog(course)}
                    >
                      Dive into the Details
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
            if (!isOpen) closeDialog();
          }}
        >
          <DialogContent className="sm:max-w-lg p-0">
             {renderDialogContent()}
          </DialogContent>
        </Dialog>
      </section>
    </>
  );
}
