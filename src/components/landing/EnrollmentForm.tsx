
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { submitInquiry as submitInquiryAction } from "@/app/actions";
import { Lock, Loader2, ChevronsUpDown, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { courses } from "@/lib/courses";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useUser } from "@/firebase";

const inquirySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }),
  course: z.array(z.string()).refine(value => value.length > 0, { message: "Please select at least one course." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).optional().or(z.literal("")),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

export function EnrollmentForm() {
  const { toast } = useToast();
  const { user } = useUser();

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      course: [],
      message: "",
    },
  });

  React.useEffect(() => {
    if (user?.displayName) {
      form.setValue('name', user.displayName);
    }
  }, [user, form]);

  const onSubmit = async (data: InquiryFormValues) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('phone', data.phone);
    data.course.forEach(course => formData.append('course', course));
    if (data.message) {
      formData.append('message', data.message);
    } else {
      formData.append('message', `Interested in the course(s): ${data.course.join(', ')}. Please provide more information.`);
    }

    const result = await submitInquiryAction(null, formData);

    if (result.errors && Object.keys(result.errors).length > 0) {
      toast({
        title: "Just a little touch-up!",
        description: "Looks like some fields need a little polish. Please review the form.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Got it!",
        description: "Thanks for reaching out. We'll give you a call shortly to chat!",
      });
      if (result.reset) {
        form.reset();
        if (user?.displayName) {
          form.setValue('name', user.displayName);
        }
      }
    }
  };

  return (
    <section id="enroll" className="py-20 md:py-28 bg-muted/30 border-t">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div className="md:pr-8">
            <span className="text-caption font-semibold uppercase text-primary tracking-widest">TAKE THE NEXT STEP</span>
            <h2 className="mt-4 font-serif">
              Align Your Career with NEP 2020
            </h2>
            <p className="mt-6 text-body-lead text-muted-foreground leading-relaxed">
             Submit your details to receive the official course prospectus and speak with a counselor about securing your NEP-aligned credits.
            </p>
          </div>
          <Card>
            <CardContent className="p-8 md:p-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-body">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Full Name" {...field} autoComplete="name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-body">Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Your 10-digit Phone Number" {...field} autoComplete="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="course"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-semibold text-body">Course of Interest</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full h-auto min-h-14 justify-between text-body text-left font-normal",
                                  !field.value?.length && "text-muted-foreground"
                                )}
                              >
                                <div className="flex gap-1 flex-wrap">
                                  {field.value?.length > 0 ? (
                                    field.value.map(courseTitle => (
                                      <Badge key={courseTitle} variant="secondary" className="mr-1 mb-1">
                                        {courseTitle}
                                      </Badge>
                                    ))
                                  ) : (
                                    "Choose course of interest"
                                  )}
                                </div>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                              <CommandInput placeholder="Search courses..." />
                              <CommandEmpty>No course found.</CommandEmpty>
                              <CommandList>
                                <CommandGroup>
                                  {courses.map((course) => (
                                    <CommandItem
                                      value={course.title}
                                      key={course.id}
                                      onSelect={() => {
                                        const selectedCourses = field.value || [];
                                        const isSelected = selectedCourses.includes(course.title);
                                        const newSelection = isSelected
                                          ? selectedCourses.filter((c) => c !== course.title)
                                          : [...selectedCourses, course.title];
                                        field.onChange(newSelection);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value?.includes(course.title)
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {course.title}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-body">Your Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell us anything else you'd like to know..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="text-center pt-4">
                      <Button type="submit" size="xl" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {form.formState.isSubmitting ? "Submitting..." : "Request a Callback"}
                      </Button>
                      <p className='text-caption text-muted-foreground mt-4 flex items-center justify-center gap-2'>
                        <Lock className="h-3 w-3" />
                        Your information is kept confidential and secure.
                      </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
