
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
      message: 'Error: Please check the form fields.',
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
      // You can handle different server error responses here
      const errorData = await response.json();
      return {
        message: `An error occurred: ${errorData.message || 'Please try again.'}`,
        errors: {},
      };
    }

    // Assuming the backend returns a success message
    const result = await response.json();
    return {
      message: result.message || "Thank you for your inquiry! Our team will call you back shortly.",
      errors: {},
      reset: true,
    };

  } catch (error) {
    console.error("Failed to submit inquiry:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
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

// This function provides manually curated review data.
// It's used as a fallback when the Google API credentials are not configured,
// or if you prefer to manage reviews manually.
async function fetchManualReviews(): Promise<GoogleReview[]> {
    console.log("Fetching manually curated reviews from src/lib/reviews.ts.");
    return manualReviews;
}

/**
 * Fetches reviews from the Google Places API or falls back to manual reviews.
 * 
 * HOW TO ENABLE GOOGLE REVIEWS:
 * 1. Follow the instructions in the `.env` file to get your GOOGLE_API_KEY and GOOGLE_PLACE_ID.
 * 2. Paste your credentials into the `.env` file.
 * 3. Restart your development server.
 * 
 * If credentials are not provided, it will use the reviews from `src/lib/reviews.ts`.
 * You can edit that file to manage the testimonials displayed on your site.
 */
export async function getGoogleReviews(): Promise<GoogleReview[]> {
  const apiKey = process.env.GOOGLE_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  // Check if the API key and Place ID are configured. If not, use manual data.
  if (!apiKey || apiKey === "YOUR_GOOGLE_API_KEY" || !placeId || placeId === "YOUR_GOOGLE_PLACE_ID") {
    console.warn("Google API credentials are not configured. Falling back to manual reviews.");
    return fetchManualReviews();
  }

  const url = `https://places.googleapis.com/v1/places/${placeId}`;

  try {
    const response = await fetch(url, {
        headers: {
            'X-Goog-Api-Key': apiKey,
            'X-Goog-Field-Mask': 'reviews.authorAttribution,reviews.text',
        }
    });

    if (!response.ok) {
      console.error("Failed to fetch Google reviews:", response.statusText, await response.text());
      return fetchManualReviews(); // Fallback to manual data on API error
    }

    const data = await response.json();
    
    if (!data.reviews) {
        console.error("Google Places API returned no reviews or an error:", data);
        return fetchManualReviews(); // Fallback to manual data if API returns no reviews
    }

    // Format the response to match our GoogleReview type
    const formattedReviews: GoogleReview[] = data.reviews.map((review: any) => ({
      name: review.authorAttribution.displayName,
      avatarUrl: review.authorAttribution.photoUri,
      review: review.text.text,
    }));

    return formattedReviews;
  } catch (error) {
    console.error("An error occurred while fetching Google reviews:", error);
    return fetchManualReviews(); // Fallback to manual data on any other error
  }
}
