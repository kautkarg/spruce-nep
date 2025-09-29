
"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils";
import type { GoogleReview } from "@/app/actions";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";

interface TestimonialsProps {
  reviews: GoogleReview[];
}

export function Testimonials({ reviews }: TestimonialsProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const onDotButtonClick = React.useCallback((index: number) => {
    api?.scrollTo(index)
  }, [api])


  return (
    <section id="testimonials" className="bg-muted/30 border-y">
      <div className="container py-20 md:py-28">
        <div className="mb-16 max-w-4xl mx-auto text-center">
          <h2 className="font-serif">
            Proof from Students Who Got Ahead
          </h2>
          <p className="mt-6 text-body-lead text-muted-foreground leading-relaxed">
            Hear from students who transformed their career prospects with our university-approved programs.
          </p>
        </div>
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          className="w-full max-w-6xl mx-auto"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {reviews.map((review, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                 <div className="p-2 h-full">
                    <div className="relative p-8 break-inside-avoid border-2 border-primary/10 bg-background/50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col group">
                        <Quote className="absolute top-6 right-6 h-16 w-16 text-primary/5 transition-transform duration-300 group-hover:scale-110" />
                        <h3 className="text-h3 font-serif text-primary mb-4 relative z-10">{review.name}</h3>
                        <blockquote className="text-body-lead text-foreground/80 leading-relaxed flex-grow relative z-10">
                            “{review.review}”
                        </blockquote>
                    </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
         <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: Math.min(count, 3) }).map((_, index) => (
              <button
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={cn(
                  "h-3 w-3 rounded-full transition-all",
                  current === index ? "w-6 bg-primary" : "bg-primary/30"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

           <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/reviews">
                Read All Reviews
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
      </div>
    </section>
  );
}
