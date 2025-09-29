
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Batch, Course } from '@/lib/batches';
import { X, UploadCloud, CreditCard, Landmark, ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';
import Script from 'next/script';
import useRazorpay from 'react-razorpay';


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const admissionSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid 10-digit phone number.' }),
  college: z.string().min(3, { message: 'Please enter your college name.' }),
  bonafide: z
    .any()
    .refine((files) => files?.length === 1, 'Bonafide/Admission Receipt is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .pdf files are accepted.'
    ),
  aadhaar: z
    .any()
    .refine((files) => files?.length === 1, 'Aadhaar Card is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .pdf files are accepted.'
    ),
});

type AdmissionFormValues = z.infer<typeof admissionSchema>;

interface EnrollmentDialogProps {
  batch: Batch;
  course: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnrollmentDialog({ batch, course, open, onOpenChange }: EnrollmentDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState<string | null>(null);
  const [Razorpay] = useRazorpay();

  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      college: '',
    },
  });

  const onSubmit = async (data: AdmissionFormValues) => {
    form.clearErrors();
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'bonafide' && key !== 'aadhaar' && value) {
        formData.append(key, value);
      }
    });

    if (data.bonafide && data.bonafide.length > 0) {
      formData.append('bonafide', data.bonafide[0]);
    }
    if (data.aadhaar && data.aadhaar.length > 0) {
      formData.append('aadhaar', data.aadhaar[0]);
    }

    try {
      const response = await fetch("https://your-backend-api.com/admissions.php", {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: 'Submission Failed',
          description: errorData.message || 'Please check your details and try again.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Form Submitted!',
        description: 'Your details have been saved. Please proceed to payment.',
      });

      setStep(2);
    } catch (error) {
      console.error("Failed to submit admission form:", error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handlePayment = async (method: string) => {
    setIsProcessingPayment(method);

    try {
        const orderResponse = await fetch("https://your-backend-api.com/create-razorpay-order.php", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: course.fees * 100, // Amount in paise
                currency: 'INR',
                receipt: `receipt_for_${form.getValues('email')}_${batch.id}`,
            }),
        });

        if (!orderResponse.ok) {
            throw new Error("Failed to create Razorpay order.");
        }

        const orderData = await orderResponse.json();

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Spruce Lifeskills",
            description: `Payment for ${course.title}`,
            image: "/images/sprucelogo.webp",
            order_id: orderData.id,
            handler: function (response: any) {
                console.log("Payment successful:", response);
                toast({
                    title: "Payment Successful!",
                    description: "Your enrollment is complete. We will be in touch shortly.",
                });
                onOpenChange(false);
            },
            prefill: {
                name: form.getValues('name'),
                email: form.getValues('email'),
                contact: form.getValues('phone'),
            },
            notes: {
                course_id: course.id,
                batch_id: batch.id,
            },
            theme: {
                color: "#0A8876",
            },
        };

        const rzp = new Razorpay(options);

        rzp.on('payment.failed', function (response: any) {
            console.error("Payment failed:", response.error);
            toast({
                title: "Payment Failed",
                description: response.error.description || "Please try again or contact support.",
                variant: "destructive",
            });
        });

        rzp.open();

    } catch (error) {
        console.error("Payment initiation failed:", error);
        toast({
            title: "Payment Error",
            description: "Could not initiate payment. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsProcessingPayment(null);
    }
};

  const FileUploadField = ({ field, label }: { field: any, label: string }) => (
    <FormItem>
      <FormLabel className="font-semibold">{label}</FormLabel>
      <FormControl>
        <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center hover:border-primary transition-colors">
          <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-meta text-muted-foreground">
            {field.value?.[0]?.name || 'Click or drag file to upload'}
          </p>
          <Input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => field.onChange(e.target.files)}
          />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );


  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
            form.reset();
            setStep(1);
        }
        onOpenChange(isOpen);
    }}>
       <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <DialogContent className="sm:max-w-3xl p-0">
        <DialogHeader className="p-6 pb-4">
            <DialogClose asChild>
                <Button variant="ghost" size="icon" className="absolute right-4 top-4 h-8 w-8">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </Button>
            </DialogClose>
          <div className='flex items-start gap-4'>
            <div className="w-14 h-14 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <course.Icon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <DialogTitle asChild>
                <h2 className="text-primary mb-1">
                    Enroll in: {course.title}
                </h2>
              </DialogTitle>
              <DialogDescription className="text-body text-muted-foreground">
                Complete your admission for the batch starting on {batch.startDate}.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='px-6 pb-2'>
            <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{width: step === 1 ? '50%' : '100%', transition: 'width 0.5s ease-in-out'}}></div>
            </div>
             <ol className="flex justify-between mt-2 text-meta font-medium text-muted-foreground">
                <li className={step >= 1 ? "text-primary" : ""}>Admission Details</li>
                <li className={step >= 2 ? "text-primary" : ""}>Payment</li>
            </ol>
        </div>

        {step === 1 && (
          <ScrollArea className='h-[60vh]'>
            <div className='p-6'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold text-body">Full Name</FormLabel>
                            <FormControl><Input placeholder="Your Full Name" {...field} autoComplete="name" /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                         <FormItem>
                            <FormLabel className="font-semibold text-body">Phone Number</FormLabel>
                            <FormControl><Input type="tel" placeholder="Your 10-digit Phone Number" {...field} autoComplete="tel" /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                         <FormItem>
                            <FormLabel className="font-semibold text-body">Email Address</FormLabel>
                            <FormControl><Input type="email" placeholder="your.email@university.com" {...field} autoComplete="email" /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="college" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold text-body">College Name</FormLabel>
                            <FormControl><Input placeholder="Your College Name" {...field} autoComplete="organization" /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                     <FormField control={form.control} name="bonafide" render={({ field }) => (
                        <FileUploadField field={field} label="Bonafide/Admission Receipt" />
                     )} />
                     <FormField control={form.control} name="aadhaar" render={({ field }) => (
                          <FileUploadField field={field} label="Aadhaar Card" />
                     )} />
                  </div>
                  
                  <div className="pt-6 text-center">
                    <Button type="submit" size="xl" className="w-full md:w-1/2" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      {form.formState.isSubmitting ? "Submitting..." : "Proceed to Payment"}
                      {!form.formState.isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </ScrollArea>
        )}

        {step === 2 && (
          <div className='p-6'>
            <div className="space-y-6 max-w-md mx-auto">
                <div className='text-center mb-8 p-6 bg-muted/50 rounded-lg'>
                    <p className='text-muted-foreground text-body-lead leading-relaxed'>Total Amount Payable</p>
                    <p className='text-h2 font-bold text-primary'>₹{course.fees.toLocaleString()}</p>
                </div>
                <Button onClick={() => handlePayment('UPI')} size="xl" variant="outline" className="w-full justify-start h-16 text-body-lead leading-relaxed" disabled={!!isProcessingPayment}>
                    {isProcessingPayment === 'UPI' ? <Loader2 className="mr-4 h-6 w-6 animate-spin" /> : <CreditCard className="mr-4 h-6 w-6" />}
                    <span className="font-semibold">{isProcessingPayment === 'UPI' ? "Processing..." : "Pay with UPI"}</span>
                </Button>
                <Button onClick={() => handlePayment('Net Banking')} size="xl" variant="outline" className="w-full justify-start h-16 text-body-lead leading-relaxed" disabled={!!isProcessingPayment}>
                    {isProcessingPayment === 'Net Banking' ? <Loader2 className="mr-4 h-6 w-6 animate-spin" /> : <Landmark className="mr-4 h-6 w-6" />}
                    <span className="font-semibold">{isProcessingPayment === 'Net Banking' ? "Processing..." : "Net Banking"}</span>
                </Button>
                <Button onClick={() => handlePayment('Razorpay')} size="xl" variant="outline" className="w-full justify-start h-16 text-body-lead leading-relaxed" disabled={!!isProcessingPayment}>
                    {isProcessingPayment === 'Razorpay' ? <Loader2 className="mr-4 h-6 w-6 animate-spin" /> : <Image src="https://razorpay.com/favicon.ico" alt="Razorpay logo" width={28} height={28} className="mr-4" />}
                    <span className="font-semibold">{isProcessingPayment === 'Razorpay' ? "Processing..." : "Pay with Razorpay"}</span>
                </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
