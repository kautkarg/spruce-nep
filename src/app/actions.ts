
"use server";

import { z } from "zod";
import { reviews as manualReviews } from "@/lib/reviews";

const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().min(10, "Please enter a valid 10-digit phone number."),
  course: z.array(z.string()).refine((value) => value.length > 0, { message: "Please select at least one course." }),
  message: z.string().min(10, "Message must be at least 10 characters.").optional().or(z.literal("")),
});

export async function submitInquiry(prevState: any, formData: FormData) {
    const courses = formData.getAll('course');
    
    const validatedFields = inquirySchema.safeParse({
        name: formData.get('name'),
        phone: formData.get('phone'),
        course: courses,
        message: formData.get('message'),
    });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Looks like some fields need a little polish. Please review the form!',
    };
  }

  const submissionData = {
    ...validatedFields.data,
    course: validatedFields.data.course.join(', '), // Convert array to comma-separated string for backend
  };
  
  try {
    // This is where you would send the data to your external backend.
    // Your developer should replace this URL with your actual backend API endpoint.
    const response = await fetch("https://your-backend-api.com/inquiries", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        message: `Oops! We hit a snag. ${errorData.message || 'Please try submitting again.'}`,
        errors: {},
      };
    }

    const result = await response.json();
    return {
      message: result.message || "All set! We'll be in touch soon to chat.",
      errors: {},
      reset: true,
    };

  } catch (error) {
    console.error("Failed to submit inquiry:", error);
    return {
      message: "Oh no! A network glitch happened. Please check your connection and try again.",
      errors: {},
    };
  }
}

// --- Google Reviews ---

export type GoogleReview = {
    name: string;
    avatarUrl: string;
    review: string;
};

/**
 * Fetches manually curated reviews from `src/lib/reviews.ts`.
 * 
 * This function provides a reliable, local source of testimonials for the website,
 * removing the need for external API calls to Google Places and ensuring stable performance.
 * You can edit the `src/lib/reviews.ts` file to manage the testimonials displayed on your site.
 */
export async function getGoogleReviews(): Promise<GoogleReview[]> {
    console.log("Fetching manually curated reviews from src/lib/reviews.ts.");
    return manualReviews;
}
