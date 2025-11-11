
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
  // This server action is no longer in active use since the form was updated to redirect to WhatsApp.
  // The original logic is removed to prevent potential server-side errors from being triggered.
  // The function now returns a stable, predictable response to ensure it doesn't crash if called.
  return {
    message: "This action is no longer in use. Please submit the form via WhatsApp.",
    errors: {},
    reset: true,
  };
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
    return manualReviews;
}
