
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
import { Check, X, Leaf, CreditCard, PartyPopper, BookUser, ArrowRight, Lock, Star } from "lucide-react";
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
import { useFirebase, useDoc, useMemoFirebase } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { enrollInCourse } from "@/lib/enrollments";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { doc } from "firebase/firestore";

const categories = ["Healthcare", "Finance & Banking", "Media & Tech"];

type EnrollmentStep = 'details' | 'payment' | 'success';

type UserProfile = {
  enrolledCourseIds?: string[];
  membershipStatus?: 'active' | 'inactive' | 'none';
};

export function CourseCatalog() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isMembershipCheckout, setIsMembershipCheckout] = useState(false);
  const [enrollmentStep, setEnrollmentStep] = useState<EnrollmentStep>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user, firestore } = useFirebase();

  const showBenefits = pathname === '/courses';
  const filteredCourses = courses.filter((c) => c.category === activeCategory);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: userProfile } = useDoc<UserProfile>(userDocRef);

  const isAlreadyEnrolled = useMemo(() => {
    if (!userProfile || !selectedCourse) return false;
    return userProfile.enrolledCourseIds?.includes(selectedCourse.id) ?? false;
  }, [userProfile, selectedCourse]);

  const hasActiveMembership = useMemo(() => {
    return userProfile?.membershipStatus === 'active';
  }, [userProfile]);

  // Effect to handle opening dialogs from URL parameters
  useEffect(() => {
    const courseIdToOpen = searchParams.get('enroll');
    const plan = searchParams.get('plan');
    const action = searchParams.get('action');

    if (action === 'checkout' && pathname === '/membership') {
        setIsMembershipCheckout(true);
        setEnrollmentStep('payment');
    } else if (courseIdToOpen) {
        const courseToOpen = courses.find(c => c.id === courseIdToOpen);
        if (courseToOpen) {
            openCourseDialog(courseToOpen);
            if (plan === 'membership') {
                setIsMembershipCheckout(true);
                setEnrollmentStep('payment');
            }
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, pathname]);

  const handlePayment = async () => {
    if (!user || !firestore) {
        // Redirect to login if user is not authenticated
        router.push('/login');
        return;
    }

    setIsProcessing(true);
    // DEVELOPER NOTE: Replace this with your payment gateway API.
    // The success callback should trigger the enrollment.
    setTimeout(async () => {
      try {
        if (isMembershipCheckout) {
          // TODO: Implement membership enrollment logic
          console.log("Simulating membership payment for:", user.uid);
          // This is where you would update the user's profile to 'active' membership
        } else if (selectedCourse) {
          console.log("Simulating course payment for:", user.uid, selectedCourse.id);
          await enrollInCourse(firestore, { userId: user.uid, courseId: selectedCourse.id });
        }
        
        toast({
            title: isMembershipCheckout ? "Welcome to the Club!" : "Let the learning commence!",
            description: isMembershipCheckout 
                ? "You're now a Pro Member. Enjoy unlimited access!"
                : `You're officially enrolled in "${selectedCourse?.title}".`,
        });
        setEnrollmentStep('success');

      } catch (error) {
         console.error("Enrollment failed:", error);
         toast({
          variant: "destructive",
          title: "Oh no, a wild error appeared!",
          description: "Something went wrong. Please give it another go.",
        });
        setEnrollmentStep('payment');
      } finally {
        setIsProcessing(false);
      }
    }, 2000); // Simulating 2-second payment processing.
  };


  const openCourseDialog = (course: Course) => {
    setSelectedCourse(course);
    setIsMembershipCheckout(false);
    setEnrollmentStep('details');
  }

  const closeDialog = () => {
    setSelectedCourse(null);
    setIsMembershipCheckout(false);
    setIsProcessing(false);
    setTimeout(() => setEnrollmentStep('details'), 300);
    
    // Clean up URL
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('enroll');
    newParams.delete('plan');
    newParams.delete('action');
    router.replace(`${pathname}?${newParams.toString()}`);
  }
  
  const renderDialogContent = () => {
    const isDialogOpen = !!selectedCourse || isMembershipCheckout;
    if (!isDialogOpen) return null;

    if (enrollmentStep === 'success') {
      return (
        <>
          <DialogHeader className="p-6 text-center items-center">
            <PartyPopper className="h-16 w-16 text-primary mb-4" />
            <DialogTitle asChild>
              <h4 className="text-primary mb-2 font-serif">
                {isMembershipCheckout ? "Welcome to the Club!" : "You're In! Welcome Aboard!"}
              </h4>
            </DialogTitle>
            <DialogDescription className="text-body text-foreground/90 max-w-sm mx-auto">
              {isMembershipCheckout 
                ? "You're now a Pro Member with unlimited access to all our courses."
                : `You've successfully enrolled in "${selectedCourse?.title}".`
              } Your learning adventure begins now.
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
      const title = isMembershipCheckout ? "Join Pro Membership" : `Enroll in ${selectedCourse?.title}`;
      const price = isMembershipCheckout ? 4999 : selectedCourse?.fees;
      const description = isMembershipCheckout ? "Get unlimited access to all courses and workshops." : "One-time investment for a lifetime of skills.";

      return (
         <>
          <DialogHeader className="p-6">
             <Button variant="ghost" size="icon" className="absolute right-4 top-4 h-8 w-8" onClick={closeDialog}>
                <X className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            <DialogTitle asChild>
              <h4 className="text-primary mb-2 font-serif">
                Final Step: Secure Your Spot
              </h4>
            </DialogTitle>
             <DialogDescription className="text-body text-left text-foreground/90">
             You're one step away from unlocking your potential. This is where the magic happens!
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6 space-y-6">
            <div className="border rounded-lg p-4 space-y-2 bg-muted/50">
                <div className="flex justify-between items-center text-body font-semibold">
                    <span>{title}</span>
                    <span>₹{price?.toLocaleString()}</span>
                </div>
                 <p className="text-sm text-muted-foreground">{description}</p>
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
                  <Label htmlFor="expiry-date">Expiry Date</Label>
                  <Input id="expiry-date" placeholder="MM/YY" className="mt-1" />
                </div>
                <div className="w-1/2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" className="mt-1" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 border-t bg-muted/50 flex-col">
            <Button onClick={handlePayment} disabled={isProcessing} className="w-full" size="lg">
              {isProcessing ? <Leaf className="mr-2 h-4 w-4 animate-pulse" /> : <CreditCard className="mr-2 h-4 w-4" />}
              {isProcessing ? "Processing Payment..." : `Pay ₹${price?.toLocaleString()} & Start Learning`}
            </Button>
             <p className='text-caption text-muted-foreground mt-4 flex items-center justify-center gap-2'>
              <Lock className="h-3 w-3" />
              University-certified course, job placement support, and NEP credits included.
            </p>
          </DialogFooter>
        </>
      )
    }
    
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
            {hasActiveMembership ? (
                 <Button className="w-full" size="lg" variant="outline" disabled>
                    <Star className="mr-2 h-4 w-4" />
                    Already included in your Pro Membership!
                </Button>
            ) : isAlreadyEnrolled ? (
              <Button onClick={() => router.push('/dashboard')} className="w-full" size="lg" variant="outline">
                <BookUser className="mr-2 h-4 w-4" />
                You're Already Enrolled! Go to Dashboard
              </Button>
            ) : (
             <>
                <div className="w-full space-y-2">
                    <Button onClick={() => setEnrollmentStep('payment')} className="w-full" size="lg">
                        Enroll for ₹{selectedCourse.fees.toLocaleString()}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <p className="text-caption text-center text-muted-foreground">One-time purchase for lifetime access.</p>
                </div>
                 <div className="w-full space-y-2">
                    <Button onClick={() => { setIsMembershipCheckout(true); setEnrollmentStep('payment'); }} variant="outline" className="w-full bg-primary/5 border-primary/20 hover:bg-primary/10" size="lg">
                        <Star className="mr-2 h-4 w-4" />
                        Join Pro & Get All Courses
                    </Button>
                     <p className="text-caption text-center text-muted-foreground">₹4,999/year. Includes this and all future courses.</p>
                </div>
            </>
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

        <Dialog open={!!selectedCourse || isMembershipCheckout} onOpenChange={(isOpen) => { if (!isOpen) closeDialog(); }}>
          <DialogContent className="sm:max-w-lg p-0">{renderDialogContent()}</DialogContent>
        </Dialog>
      </section>
    </>
  );
}
