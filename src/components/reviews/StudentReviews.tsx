
"use client";

import { useState } from "react";
import type { GoogleReview } from "@/app/actions";
import { Button } from "../ui/button";
import { ArrowRight, MessageSquare, LoaderPinwheel } from "lucide-react";
import Link from "next/link";

interface StudentReviewsProps {
    reviews: GoogleReview[];
}

const REVIEWS_PER_PAGE = 8;
const GOOGLE_REVIEWS_URL = "https://www.google.com/search?sxsrf=AE3TifOE2S1lohg0ib2pUTem3Wo-6KwK5A:1758894893110&si=AMgyJEuzsz2NflaaWzrzdpjxXXRaJ2hfdMsbe_mSWso6src8s3qCVXoKI9Qvr6SbQmI8wkcs1fo2MBxBPZF6zkxjPiS4P5VQX0Ex-VuzTrgkZ6XX31_0qv-rPDeN6vsQzLPSlQjb-9exIX4EsBJCFXQIEuOffkeKNL9-ZwZFarNnHuxxwGQWwjnKwtDb13WRI3mPyjIM9TOM&q=Spruce+Lifeskills+%28Clinical+Research+and+Medical+Coding%29+Reviews";


export function StudentReviews({ reviews }: StudentReviewsProps) {
    const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);
    const [isLoading, setIsLoading] = useState(false);

    const handleLoadMore = () => {
        setIsLoading(true);
        setTimeout(() => {
            setVisibleCount(prevCount => prevCount + REVIEWS_PER_PAGE);
            setIsLoading(false);
        }, 500);
    };
    
    const openGoogleReviewsPopup = () => {
        const width = 800;
        const height = 600;
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);
        window.open(GOOGLE_REVIEWS_URL, 'google-reviews', `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`);
    };

    const visibleReviews = reviews.slice(0, visibleCount);
    const allReviewsLoaded = visibleCount >= reviews.length;

    const numColumns = 3;
    const columns: (typeof reviews)[] = Array.from({ length: numColumns }, () => []);
    
    visibleReviews.forEach((review, i) => {
        columns[i % numColumns].push(review);
    });

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {columns.map((col, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-6">
                        {col.map((review, reviewIndex) => (
                             <div key={reviewIndex} className="break-inside-avoid border border-border/50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                                <div className="p-8">
                                    <p className="text-h4 font-serif text-primary mb-4">{review.name}</p>
                                    <blockquote className="text-body-lead text-foreground/80 leading-relaxed">
                                        “{review.review}”
                                    </blockquote>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="text-center mt-16">
                {allReviewsLoaded ? (
                     <Button onClick={openGoogleReviewsPopup} variant="outline" size="xl">
                       Check all reviews on Google
                       <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button onClick={handleLoadMore} disabled={isLoading} size="xl">
                        {isLoading ? (
                            <>
                                <LoaderPinwheel className="mr-2 h-5 w-5 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Load More Reviews"
                        )}
                    </Button>
                )}
            </div>
        </>
    );
}
